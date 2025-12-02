// js/db.js - camada de acesso ao IndexedDB com Dexie
(function () {
  const db = new Dexie('GymControlDB');

  db.version(1).stores({
    treinos: '++id, nome, criado_em',
    exercicios: '++id, treino_id, nome, repeticoes, carga, observacao',
    sessoes: '++id, treino_id, data',
    // inclui sessao_id e exercicio_id para facilitar consultas e evolução futura
    sessoes_exercicios: '++id, sessao_id, exercicio_id, nome, repeticoes, carga'
  });

  const API = {
    db: db,

    // ---------- TREINOS ----------
    criarTreino: async (dados) => {
      const id = await db.treinos.add({
        ...dados,
        criado_em: new Date().toISOString()
      });
      return id;
    },

    atualizarTreino: async (id, changes) =>
      db.treinos.update(id, changes),

    excluirTreino: async (id) => {
      // remove exercícios do treino
      await db.exercicios.where('treino_id').equals(id).delete();

      // remove sessões e seus exercícios
      const sessaoIds = await db.sessoes
        .where('treino_id')
        .equals(id)
        .primaryKeys();

      if (sessaoIds.length) {
        await db.sessoes_exercicios
          .where('sessao_id')
          .anyOf(sessaoIds)
          .delete();
      }

      await db.sessoes.where('treino_id').equals(id).delete();
      return db.treinos.delete(id);
    },

    listarTreinos: async () =>
      db.treinos.orderBy('criado_em').reverse().toArray(),

    obterTreino: async (id) => db.treinos.get(id),

    // ---------- EXERCÍCIOS ----------
    adicionarExercicio: async (treinoId, ex) =>
      db.exercicios.add({ ...ex, treino_id: treinoId }),

    atualizarExercicio: async (id, changes) =>
      db.exercicios.update(id, changes),

    removerExercicio: async (id) =>
      db.exercicios.delete(id),

    listarExerciciosDoTreino: async (treinoId) =>
      db.exercicios.where('treino_id').equals(treinoId).sortBy('id'),

    // ---------- SESSÕES ----------
    salvarSessao: async (sessao, exercicios) => {
      const sessaoId = await db.sessoes.add({
        treino_id: sessao.treino_id,
        data: new Date().toISOString()
      });

      const items = exercicios.map((e) => ({
        ...e,
        sessao_id: sessaoId
      }));

      await db.sessoes_exercicios.bulkAdd(items);
      return sessaoId;
    },

    listarSessoes: async () =>
      db.sessoes.orderBy('data').reverse().toArray(),

    listarExerciciosSessao: async (sessaoId) =>
      db.sessoes_exercicios.where('sessao_id').equals(sessaoId).sortBy('id')
  };

  window.DB = API;
})();

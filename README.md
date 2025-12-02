# GymControl

Aplicativo simples de controle de treinos de academia, rodando 100% no navegador usando IndexedDB (Dexie) para armazenamento local.

## Funcionalidades

- Cadastro de treinos (ex: Treino A, Treino B).
- Cadastro de exercícios por treino (nome, repetições base, carga base, observação).
- Execução de treino:
  - Usa os valores base como sugestão.
  - Permite ajustar repetições e carga da sessão.
  - Ao finalizar:
    - Salva a sessão e seus exercícios.
    - Opção para **atualizar o treino base** com os novos valores (repetições e carga).
- Histórico de sessões:
  - Lista todas as sessões realizadas.
  - Permite visualizar os exercícios executados em cada sessão.

## Estrutura de pastas

```text
gymcontrol/
├─ index.html
├─ manifest.json
├─ sw.js
├─ README.md
├─ css/
│  └─ global.css
└─ js/
   ├─ db.js
   └─ app.js
```

## Como rodar localmente

1. Coloque os arquivos em uma pasta chamada `gymcontrol`.
2. Use um servidor HTTP simples (por exemplo, com Python):

   ```bash
   cd gymcontrol
   python -m http.server 8000
   ```

3. Acesse em `http://localhost:8000`.
4. Você pode instalar como PWA (dependendo do navegador).

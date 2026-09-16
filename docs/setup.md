Setup e execução (local e CI)

Ambiente recomendado
- Node.js v14+ (v16 ou v18 preferíveis)
- npm ou yarn

Instalação local
1. Instale dependências:

```
npm install
```

Abrir Cypress UI (desenvolvimento)

```
npm run cy:open
```

Executar testes em CI / headless

```
npm test
```

Executar uma suíte ou spec específico

```
npm run test:ct027
npx cypress run --spec "cypress/e2e/CT031_Sequencia_Palete/**/*.cy.js"
```

Observações para CI
- `cypress.config.js` já define `projectId` (usado pelo Cypress Dashboard) — se for gravar testes no Dashboard, passe `--record --key <record-key>` ao rodar.
- O topo do `cypress.config.js` define `process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'` para ignorar erros TLS em ambientes com certificados inválidos. Avalie o impacto de segurança antes de usar em produção.
- Ajuste variáveis de ambiente e secrets no provedor de CI (GitHub Actions, GitLab CI, Azure Pipelines) conforme necessário.

Timeouts
- Valores padrão definidos em `cypress.config.js`: `pageLoadTimeout`, `defaultCommandTimeout`, `requestTimeout`, `responseTimeout`. Aumente quando necessário em testes que fazem operações longas.

Requisitos de rede
- `baseUrl` aponta para `https://velox2.velox-by-invent.com`. Garanta conectividade de rede ao executar testes que dependem desse host.

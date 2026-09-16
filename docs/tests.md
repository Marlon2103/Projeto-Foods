Detalhes das suítes de testes

Resumo

Mapeamento de suítes (exemplos)

Scripts npm correspondentes
  - `test:ct002`, `test:ct004`, `test:ct017`, `test:ct018`, `test:ct027`.

Como os testes geram e compartilham dados
  - `gerarDadosTORD()` — gera um objeto com campos únicos (`DOCNUM`, `TANUM`, `LENUM`, etc.) e grava em `cypress/fixtures/tordDados.json`.
  - `carregarDadosTORD()` — carrega o arquivo de fixtures e popula `Cypress.env`.

Recomendações para rodar localmente
1. Instale dependências: `npm install`.
2. Para abrir a UI do Cypress:

```
npm run cy:open
```

3. Para rodar uma suíte específica (exemplo `CT031`):

```
npx cypress run --spec "cypress/e2e/CT031_Sequencia_Palete/**/*.cy.js"
```

Observações

Detalhes das suítes de testes

Resumo
- O repositório organiza os testes por suítes dentro de `cypress/e2e/`. Cada pasta representa um fluxo de teste (CT) ou agrupamento funcional.

Mapeamento de suítes (exemplos)
- `CT002_Regressivo_1_Etapa` — regressivo 1ª etapa (ver `cypress/e2e/CT002_Regressivo_1_Etapa`).
- `CT004_OT_Pendente` — valida cenários relacionados a OT pendente.
- `CT017_Tord_Nao_Confirma` — cenários onde TORD não é confirmado.
- `CT018_Regressivo_Tord_Confirma` — regressivo de confirmação TORD.
- `CT027_Confirma_Estoque` — confirmações de estoque.
- `CT031_Sequencia_Palete` — testes de sequência de palete, que normalmente carregam fixtures com uma lista de `TANUM`/`LENUM` e validam via UI (ex.: `03_Confirma_Reab.cy.js`).

Scripts npm correspondentes
- Os scripts definidos em [package.json](package.json) mapeiam para execuções por suíte:
  - `test:ct002`, `test:ct004`, `test:ct017`, `test:ct018`, `test:ct027`.

Estrutura de uma spec (padrões observados)
- Uso de fixtures: `const items = require('../../fixtures/tordSequencia_detailed.json');`
- `before()` / `beforeEach()` para preparar contexto e capturar exceções com `cy.on('uncaught:exception', () => false)` quando necessário.
- Iteração sobre itens de fixture com `items.forEach((dados, index) => { it(... ) })` para gerar múltiplos casos dinamicamente.
- Ações típicas: `cy.visit()`, interceptação com `cy.intercept()`, uso de `cy.get()`/`cy.contains()` para validações e `cy.wait()` para sincronização quando o fluxo depende de operações assíncronas no backend.

Como os testes geram e compartilham dados
- `cypress/support/utils/gerarDados.js` contém helpers:
  - `gerarDadosTORD()` — gera um objeto com campos únicos (`DOCNUM`, `TANUM`, `LENUM`, etc.) e grava em `cypress/fixtures/tordDados.json`.
  - `carregarDadosTORD()` — lê o arquivo de fixtures e popula `Cypress.env` para uso em specs separadas.

Exemplo de uso real
- Em `cypress/e2e/CT031_Sequencia_Palete/03_Confirma_Reab.cy.js` a spec carrega `tordSequencia_detailed.json`, faz login via UI, pesquisa OT por `TANUM`, valida status e verifica `LENUM` no módulo de Saldo.

Como rodar localmente
1. Instale dependências: `npm install`.
2. Abrir o Cypress:

```
npm run cy:open
```

3. Rodar uma suíte específica (exemplo `CT031`):

```
npx cypress run --spec "cypress/e2e/CT031_Sequencia_Palete/**/*.cy.js"
```

Observações
- O `baseUrl` está apontando para `https://velox2.velox-by-invent.com` em [cypress.config.js](cypress.config.js). Garanta acesso/rede apropriada ao rodar os testes.


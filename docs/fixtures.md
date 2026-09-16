Descrição dos fixtures e utilitários

`cypress/fixtures/tordDados.json`
- Estrutura (exemplo):

```
{
  "DOCNUM": "5429426979810279",
  "TANUM": "4845325822",
  "SERIAL": "20260730232656",
  "ID_ABASTEC": "ABAST-2026-871346",
  "LENUM": "22220",
  "ZVFDAT": "20270730",
  "CHARG": "L260730",
  "CREDAT": "20260730",
  "CRETIM": "232656"
}
```

- `LENUM` é normalizado para remover zeros à esquerda quando carregado (uso em scripts e validações).

`cypress/fixtures/tordSequencia_detailed.json` e `tordSequencia.json`
- Fixtures que contêm arrays de objetos com `TANUM` e `LENUM` usados por specs que validam sequência de paletes/OTs via UI.

Utilitários em `cypress/support/utils/gerarDados.js`
- Funções principais:
  - `gerarDOCNUM()` — gera DOCNUM (16 dígitos)
  - `gerarTANUM()` — gera TANUM (10 dígitos)
  - `gerarSERIAL()` — serial baseado em timestamp
  - `gerarIDAbastec()` — gera ID_ABASTEC com formato `ABAST-ANO-NNNNNN`
  - `gerarLENUM()` — gera LENUM (palete)
  - `gerarZVFDAT()` — data de validade (AAAAMMDD)
  - `gerarCHARG()` — lote no formato `LyyMMDD`
  - `gerarDadosTORD()` — gera o objeto completo, salva em `Cypress.env('tordDados')` e no arquivo `cypress/fixtures/tordDados.json` via `cy.writeFile()`.
  - `carregarDadosTORD()` — lê o arquivo `tordDados.json` e popula `Cypress.env`.

Boas práticas
- Execute `gerarDadosTORD()` no `before()` de specs que precisam de dados únicos.
- Use `carregarDadosTORD()` em specs separadas que dependam dos mesmos dados gerados por outra spec.

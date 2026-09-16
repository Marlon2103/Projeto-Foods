
Projeto BRF — Testes E2E com Cypress

Resumo
- Suite de testes E2E para integração com o sistema Velox (BRF), implementada com Cypress e organizada em suítes por fluxo/CT.

Requisitos
- Node.js (v14+ recomendado)
- npm ou yarn

Instalação rápida
1. Clone o repositório e instale dependências:

```
npm install
```

Quick start
- Abrir a UI interativa:

```
npm run cy:open
```

- Rodar todos os testes em modo headless:

```
npm test
```

Scripts úteis (em `package.json`)
- `npm run cy:open` — abre o Cypress UI.
- `npm run cy:run` / `npm test` — roda todos os testes em modo headless.
- `npm run test:ct002` / `test:ct004` / `test:ct017` / `test:ct018` / `test:ct027` — scripts para suites específicas.

Configuração do Cypress
- `baseUrl` definido em [cypress.config.js](cypress.config.js) como `https://velox2.velox-by-invent.com`.
- O arquivo também define `projectId` e opções de browser (flags para Chromium e preferências para Firefox). Observação: o topo do `cypress.config.js` também define `process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'` (uso em ambientes com certificados autoassinados).

Estrutura do repositório (resumida)
- `cypress/e2e/` — specs organizadas por suíte (ex.: `CT002_Regressivo_1_Etapa`, `CT031_Sequencia_Palete`, etc.).
- `cypress/fixtures/` — arquivos JSON usados como dados (ex.: `tordDados.json`, `tordSequencia.json`).
- `cypress/support/` — comandos e inicialização global (`commands.js`, `e2e.js`).
- `cypress/support/utils/` — utilitários para gerar/carregar dados (`gerarDados.js`).

Como os testes estão organizados
- Cada suíte contém specs que representam cenários do fluxo de negócio. Exemplos:
	- `CT031_Sequencia_Palete` contém specs que carregam fixtures (`tordSequencia_detailed.json`) e validam sequências de OT/Palete via UI.
	- Algumas specs fazem chamadas HTTP para enviar/validar XML (ex.: `01_TORD_Pendente.cy.js`).

Geração e uso de dados únicos
- `cypress/support/utils/gerarDados.js` fornece helpers:
	- `gerarDadosTORD()` — gera `DOCNUM`, `TANUM`, `SERIAL`, `ID_ABASTEC`, `LENUM`, `ZVFDAT`, `CHARG`, `CREDAT`, `CRETIM`;
	- Salva o objeto em `Cypress.env('tordDados')` e em `cypress/fixtures/tordDados.json` via `cy.writeFile()` para compartilhamento entre specs.

Adicionar novos testes
- Criar um arquivo `.cy.js` em uma pasta dentro de `cypress/e2e/` correspondente à suite.
- Para testes que precisam de dados únicos, invoque `gerarDadosTORD()` no `before()` do spec.

Troubleshooting rápido
- Erros de certificado: `cypress.config.js` já aplica flags para ignorar erros em Chrome/Chromium e define `NODE_TLS_REJECT_UNAUTHORIZED = '0'`.
- Timeouts: ajuste `pageLoadTimeout` e `defaultCommandTimeout` em `cypress.config.js`.
- Falhas intermitentes: use `cy.on('uncaught:exception', () => false)` dentro do spec quando apropriado (já usado em várias specs).

Onde encontrar mais detalhes
- Documentação específica de testes e instruções: [docs/tests.md](docs/tests.md).
- Setup e CI: [docs/setup.md](docs/setup.md).
- Descrição dos fixtures e utilitários: [docs/fixtures.md](docs/fixtures.md).
# Projeto BRF - Cypress

Este repositório contém testes Cypress para o projeto BRF.

## Como usar

1. Instale dependências:

```bash
npm install
```

2. Execute os testes locais:

```bash
npm test
```

3. Execute o conjunto de CTs que você quer versionar:

```bash
npm run test:ct:selected
```

4. Execute apenas um CT específico:

```bash
npm run test:ct002
npm run test:ct004
npm run test:ct017
npm run test:ct018
npm run test:ct027
```

## GitHub Actions

O workflow está em `.github/workflows/cypress-schedule.yml`.

Ele roda os testes agendados e envia um e-mail com o resultado.

### Segredos necessários

No repositório GitHub, adicione os seguintes segredos:

- `SMTP_SERVER` (ex: `smtp.gmail.com`)
- `SMTP_PORT` (ex: `587`)
- `SMTP_USERNAME` (ex: `seu.email@gmail.com`)
- `SMTP_PASSWORD` (senha de app do Gmail ou senha SMTP válida)
- `EMAIL_FROM` (opcional, pode ser igual a `SMTP_USERNAME`)
- `EMAIL_RECIPIENTS`

Se usar Gmail, confirme que a conta permite SMTP e que você está usando uma senha de app se o 2FA estiver habilitado.

### Agendamento

O workflow está configurado para executar diariamente às 08:00 UTC.

### Personalizar suíte

Altere o arquivo `.github/workflows/cypress-schedule.yml` para executar outros specs ou suites.

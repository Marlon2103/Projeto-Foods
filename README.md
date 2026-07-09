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

- `SMTP_SERVER`
- `SMTP_PORT`
- `SMTP_USERNAME`
- `SMTP_PASSWORD`
- `EMAIL_FROM`
- `EMAIL_RECIPIENTS`

### Agendamento

O workflow está configurado para executar diariamente às 08:00 UTC.

### Personalizar suíte

Altere o arquivo `.github/workflows/cypress-schedule.yml` para executar outros specs ou suites.

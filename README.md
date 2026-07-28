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

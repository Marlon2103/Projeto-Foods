Stakeholder Brief — Projeto BRF (Testes E2E)

TL;DR
- Objetivo: validar fluxos críticos do sistema Velox via testes E2E automatizados com Cypress.
- Cobertura: suites organizadas por fluxo (ex.: CT002, CT004, CT017, CT018, CT027, CT031).
- Frequência recomendada: execução automática em PRs + agendamento diário para regressão completa.

Resumo executivo
- Testes automatizados verificam integração de transporte (TORD/OT), sequências de palete e confirmações de estoque.
- Resultados: artefatos gerados em cada execução (vídeos e screenshots) e possibilidade de gravação no Cypress Dashboard.

O que está neste documento
- Visão geral técnica e operacional (como rodar, onde estão os scripts).
- Principais pontos de atenção: requisitos de rede, certificados TLS e timeouts.
- Instruções para acessar relatórios e artefatos.

Como interpretar os resultados
- Pass: fluxo validado com sucesso.
- Fail: falha pode indicar regressão no backend, instabilidade de ambiente ou mudanças na UI — revisar vídeo/screenshot e logs.
- Artefatos disponíveis: vídeos (`cypress/videos/`), screenshots (`cypress/screenshots/`) e logs de CI.

Ações recomendadas em caso de falha
1. Reproduzir localmente usando o mesmo spec falho com `npx cypress open`.
2. Verificar vídeo e screenshot no CI (artifacts) para entender o ponto de falha.
3. Validar se houve alteração recente no backend (endpoints) ou nos seletores da UI.

Entrega e distribuição
- Será gerado automaticamente um PDF legível para stakeholders após cada release/merge quando o workflow `generate-doc-pdf` for executado (arquivo `docs/CONSOLIDATED_DOCUMENTATION.pdf`).

Contatos
- Time de QA: [inserir email/time slack]
- Time de Infra/Dev: [inserir email/time slack]

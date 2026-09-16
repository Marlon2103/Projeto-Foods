Testes — descrição por suíte e spec

Resumo
- Esse arquivo descreve cada suíte de testes (pasta em `cypress/e2e/`) e as specs contidas, com objetivo e comportamento esperado de alto nível. Use isso como referência rápida para stakeholders e para quem for executar/depurar os testes.

CT002_Regressivo_1_Etapa
- `01_TORD_Pendente.cy.js`: Gera dados únicos com `gerarDadosTORD()` e envia um XML TORD com status Pendente para o endpoint `mbrf-tord-v1`. Valida que a requisição foi aceita (200/201/202) e que o corpo de resposta não está vazio.
- `02_Reab_Parte1.cy.js`: (fluxo) Inicia reabastecimento parcialmente via XML/integração — prepara estado para confirmações posteriores.
- `03_TOCO_Confirma.cy.js`: Envia XML TOCO para confirmar OT criada pelo TORD; valida aceitação do TOCO.
- `04_Confirma_Reab.cy.js`: Valida pela UI/integracao finalização de reabastecimento (confirmações internas).

CT004_OT_Pendente
- `01_TORD_Pendente.cy.js`: Idêntico ao padrão de TORD - envia XML TORD Pendente, valida resposta.
- `02_Verifica_OT.cy.js`: Valida via UI/endpoint que a OT existe e está em estado esperado (pendente ou criado).
- `03_Finaliza_OT.cy.js`: Finaliza a OT via TOCO/XML e valida processamento.

CT017_Tord_Nao_Confirma
- `01_TORD_Not_Zconf.cy.js`: Envia TORD com campo `ZCONF` vazio (não confirmado) e valida aceitação do XML. Usado para testar fluxo onde não há confirmação automática.
- `02_Verifica_Pendente.cy.js`: Verifica se a OT ficou com status pendente no sistema.
- `03_Finaliza_OT.cy.js`: Executa a finalização manual/forçada da OT (fluxo de correção).

CT018_Regressivo_Tord_Confirma
- `01_TORD_Confirma.cy.js`: Envia TORD com `ZCONF` marcado para simular TORD já confirmado no envio; valida resposta do endpoint.
- `02_Confirma_Integra_Estoque.cy.js`: Garante integração que atualiza o estoque/posições a partir do TORD confirmado.

CT027_Confirma_Estoque
- `01_TORD_Pendente.cy.js`: Envia TORD Pendente — mesmo padrão de geração de dados.
- `02_Reab_Parte1.cy.js`: Cria reabastecimento parcial via integração.
- `03_TOCO_Confirma.cy.js`: Confirma via TOCO/XML a OT criada.
- `04_Confirma_Reab.cy.js`: Valida através do sistema (UI/integracao) que o reabastecimento foi confirmado e que o saldo/palete foi atualizado.

CT031_Sequencia_Palete
- `00_Sequencia_TORD_TOCO.cy.js`: Gera 3 iterações completas (TORD + TOCO); para cada iteração insere TORD, aguarda processamento e faz TOCO, armazenando resultados em `cypress/fixtures/tordSequencia_detailed.json`. Testa robustez do processamento em sequência e retry logic do TOCO.
- `03_Confirma_Reab.cy.js`: Usa a fixture gerada (`tordSequencia_detailed.json`) para, via UI, validar a existência da OT (`TANUM`), checar status `Finalizada` e confirmar que o `LENUM` (palete) aparece corretamente no módulo de Saldo.

CT032_Cancela_Remessa
- `01_Integra_Remessa.cy.js`: Integra remessa (envio inicial) para o fluxo de remessa.
- `02_Cancela_VerificaOnda.cy.js`: Cancela a remessa criada e valida efeito sobre ondas/ondas de picking.

Integracao_Tord_Toco
- `1_TORD_Pendente.cy.js`: Envia TORD Pendente (integração direta).
- `2_TOCO_Confirma.cy.js`: Em sequência, envia TOCO para confirmar TORD; usado para testes de integração ponta-a-ponta sem UI.

Login
- `Login.cy.js`: Teste básico de login que preenche credenciais e aguarda a resposta da requisição de login.
- `Reab1Etapa_Parte1.cy.js` / `Reab1Etapa_Parte2.cy.js`: Tests de fluxo que começam com login e executam ações no workspace relacionadas ao reabastecimento (parte 1 e 2).

Outros
- `1-getting-started/todo.cy.js` e `2-advanced-examples/*` — exemplos e specs de referência (vêm do scaffold do Cypress). Não são parte do suite de negócios principais.

Observações gerais sobre os testes
- Muitos specs dependem de integrações HTTP XML (`mbrf-tord-v1`, `mbrf-zwmtoco-v1`) e exigem que o ambiente `baseUrl` esteja acessível.
- Dados únicos gerados por `cypress/support/utils/gerarDados.js` são salvos em `cypress/fixtures/tordDados.json` para reuso entre specs.
- Specs de UI usam `cy.intercept()` e `cy.wait()` para sincronizar com o backend; alguns testes usam `cy.on('uncaught:exception', () => false)` para ignorar erros JS não relacionados.

Como usar este arquivo
- Incluir esse conteúdo no PDF consolidado (já gerado) garante que stakeholders e devs entendam o propósito de cada spec.
- Se quiser, adiciono exemplos de outputs esperados (trechos de logs ou exemplos de respostas XML/JSON) por spec.

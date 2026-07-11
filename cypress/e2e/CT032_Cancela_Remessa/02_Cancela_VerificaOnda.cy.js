const { carregarDadosTORD, carregarShipmentVars } = require('../../support/utils/gerarDados');

describe('[Regressivo] 02 - Cancela Remessa e Verifica Criação de Onda', () => {
  before(() => {
    // Carrega os dados do TORD e as variáveis de shipment geradas no spec anterior
    return carregarDadosTORD().then(() => carregarShipmentVars());
  });

  beforeEach(() => {
    cy.on('uncaught:exception', () => false);
    cy.visit('/login');
  });

  it('Deve realizar login e buscar a OT Pendente', () => {
    cy.intercept('POST', '**/login**').as('loginRequest');
    
    cy.get('input[type="email"], input[name="email"], input[type="text"]').first().type('velox');
    cy.get('input[type="password"]').type('xocJ20q71qUSqNatqo');
    cy.get('.group > .flex').click();

    //Verifica se o login foi bem sucedido e a página de workspace foi carregada
    cy.wait('@loginRequest', { timeout: 120000 });
    cy.visit('/workspace', {
      timeout: 180000,
      failOnStatusCode: false,
    });
    cy.url({ timeout: 180000 }).should('include', '/workspace');
    cy.get('a[title="Operação"]', { timeout: 180000 }).should('be.visible');

    const tordDados = Cypress.env('tordDados') || {};
    const shipmentVars = Cypress.env('shipment_vars') || {};
    cy.log('📦 Variaveis da Remessa:');
    cy.log(`   DELID: ${shipmentVars.DELID}`);
    cy.log(`   SHPID: ${shipmentVars.SHPID}`);
    cy.log(`📦 Variaveis do TORD:`);
    cy.log(`   TANUM: ${tordDados.TANUM}`);

    // Abrir o menu missoes e verificar se a remessa está disponível
    cy.wait(10000);
    cy.get('.group > .flex-1').should('be.visible').click();   
    cy.get('input[placeholder="O que você quer fazer?"]').should('be.visible').clear().type('MISSÕES')
    cy.contains('p', 'Missões').should('be.visible').click();    
    cy.get('.pb-2 > :nth-child(2) > .flex > .inline-flex').should('be.visible').click()
    cy.wait(1000);
    cy.get(':nth-child(4) > .inline-flex').click();
    cy.get('.space-y-3 > .w-full').should('be.visible').clear().type(`${shipmentVars.SHPID}`);
    cy.wait(1000);
    cy.get('.gap-0 > .flex-col').click()
    cy.contains('span', 'Disponível').should('be.visible').and('have.text', 'Disponível');
    cy.log(`✅ Check OK - Remessa ${shipmentVars.SHPID} disponivel`);

    // Realizar o cancelamento da remessa
    cy.wait(1000);
    cy.get('button[role="checkbox"][aria-label="Select row"]').first().click();
    cy.get('button[aria-label="Cancelar remessa(s)"]').should('be.visible').click();
    cy.get('#login').should('be.visible').type('velox');
    cy.get('#senha').should('be.visible').type('xocJ20q71qUSqNatqo');
    cy.get('#motivo').should('be.visible').type('Teste Cyress CT032 integra e cancela remessa e verifica criacao de onda');
    cy.contains('button', 'Autorizar').should('be.visible').click();
    cy.wait(1000);
    cy.contains('span', 'Cancelada').should('be.visible').and('have.text', 'Cancelada');
    
    //Verifica se os volumes da remessa foram cancelados
    cy.contains('span', 'Volumes').should('be.visible').click();
    cy.wait(1000);
    cy.get('.pb-2 > :nth-child(2) > .flex > .inline-flex').should('be.visible').click()
    cy.wait(1000);
    cy.get(':nth-child(6) > .inline-flex').click();
    cy.get('.space-y-3 > .w-full').should('be.visible').clear().type(`${shipmentVars.DELID}`);
    cy.wait(1000);
    cy.get('.gap-0 > .flex-col').click()
    cy.get('[data-slot="badge"]').filter(':contains("Cancelado")').should('have.length', 12); // Exemplo: espera 12 cancelados

    //Verifica se e possivel criar uma onda para a remessa cancelada
    cy.wait
    cy.contains('span', 'Transportes').should('be.visible').click();
    cy.wait(1000);
    cy.get('.pb-2 > :nth-child(2) > .flex > .inline-flex').should('be.visible').click()
    cy.wait(1000);
    cy.get(':nth-child(3) > .inline-flex > .truncate').click();
    cy.get('.space-y-3 > .w-full').should('be.visible').clear().type(`${shipmentVars.SHPID}`);
    cy.wait
    cy.get('.gap-0 > .flex-col').click()
    cy.get('button[role="checkbox"][aria-label="Select row"]').first().click();
    cy.wait(1000);
    cy.get('button[aria-label="Criar onda"]').then(($btn) => {
      // Destaque visual no botão durante o teste para fácil identificação
      $btn.css('background-color', 'yellow');
    }).should('be.disabled');
    cy.wait(1500);
    cy.log(`✅ Check OK - Remessa cancelada nao e possivel criar onda para a remessa ${shipmentVars.SHPID}`);






    // Deslogar do sistema
    cy.get('span[data-slot="avatar-fallback"]', { timeout: 20000 }).first().should('be.visible').click();
    cy.wait(1000);
    cy.contains('[role="menuitem"]', 'Sair').click();
    cy.url().should('include', '/login');
    cy.get('input[type="email"], input[name="email"], input[type="text"]', { timeout: 20000 }).should('be.visible');
    cy.log('✅ Check OK - Logout realizado com sucesso');
  });
});
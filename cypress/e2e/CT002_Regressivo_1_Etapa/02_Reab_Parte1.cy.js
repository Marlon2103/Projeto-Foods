const { carregarDadosTORD } = require('../../support/utils/gerarDados');

describe('[Regressivo] 02 - Reab Parte 1 (Login + Buscar OT Pendente)', () => {
  before(() => {
    // Carrega os dados do TORD gerados no spec anterior
    return carregarDadosTORD();
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

    // Utiliza as variaveis do TORD
    const dados = Cypress.env('tordDados');
    cy.log('📦 Variaveis TORD:');
    cy.log(`   TANUM (OT): ${dados.TANUM}`);

    // Abrir o menu Ordem De Transporte
    cy.wait(10000);
    cy.get('.group > .flex-1').should('be.visible').click();   
    cy.get('input[placeholder="O que você quer fazer?"]').should('be.visible').clear().type('OT')
    cy.contains('p', 'OT').click()
    cy.get('.pb-2 > :nth-child(2) > .flex > .inline-flex').should('be.visible').click()
    cy.wait(1000);
    cy.get('[style="width: 90px;"] > .inline-flex').click()
    cy.get('.space-y-3 > .w-full').should('be.visible').clear().type(`${dados.TANUM}`);
    cy.wait(1000);
    cy.get('div.min-w-0 > .px-1').click()
    cy.contains(`${dados.TANUM}`, { timeout: 30000 }).should('exist');
    cy.log(`✅ Check OK - OT ${dados.TANUM} validada com sucesso`);

    // Valida se o status "Pendente" está na mesma linha da OT
    cy.wait(1000);
    cy.contains('span', 'Pendente').should('be.visible').click()
    cy.log(`✅ Check OK - OT ${dados.TANUM} com status Pendente`);

    // Deslogar do sistema
    cy.get('span[data-slot="avatar-fallback"]', { timeout: 20000 }).first().should('be.visible').click();
    cy.wait(1000);
    cy.get('#radix-_R_11aknpflbH1_ > .text-destructive', { timeout: 20000 }).should('be.visible').click();
    cy.url().should('include', '/login');
    cy.get('input[type="email"], input[name="email"], input[type="text"]', { timeout: 20000 }).should('be.visible');
    cy.log('✅ Check OK - Logout realizado com sucesso');
  });
});
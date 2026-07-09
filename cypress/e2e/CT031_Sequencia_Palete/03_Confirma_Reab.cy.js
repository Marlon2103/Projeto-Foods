const items = require('../../fixtures/tordSequencia_detailed.json');

describe('[Regressivo] 04 - Reab Parte 2 (Login + Validar OT Finalizada)', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => false);
  });

  items.forEach((dados, index) => {
    it(`Deve validar OT ${dados.TANUM} e Saldo ${dados.LENUM} em sequência`, () => {
      cy.log(`📦 Validando integração sequencial para OT: ${dados.TANUM}`);

      // Login
      cy.visit('/login');
      cy.intercept('POST', '**/login**').as('loginRequest');
      cy.get('input[type="email"], input[name="email"], input[type="text"]').first().clear().type('velox');
      cy.get('input[type="password"]').clear().type('xocJ20q71qUSqNatqo');
      cy.get('.group > .flex').click();
      cy.wait('@loginRequest', { timeout: 120000 });
      cy.visit('/workspace', { timeout: 180000, failOnStatusCode: false });
      cy.url({ timeout: 180000 }).should('include', '/workspace');
      cy.get('a[title="Operação"]', { timeout: 180000 }).should('be.visible');

      // Pesquisa OT pelo TANUM
      cy.wait(10000);
      cy.get('.group > .flex-1').should('be.visible').click();
      cy.get('input[placeholder="O que você quer fazer?"]').should('be.visible').clear().type('OT');
      cy.contains('p', 'OT').click();
      cy.get('.pb-2 > :nth-child(2) > .flex > .inline-flex').should('be.visible').click();
      cy.wait(1000);
      cy.get('[style="width: 90px;"] > .inline-flex').click();
      cy.get('.space-y-3 > .w-full').should('be.visible').clear().type(`${dados.TANUM}`);
      cy.wait(1000);
      cy.get('div.min-w-0 > .px-1').click();
      cy.contains(`${dados.TANUM}`, { timeout: 30000 }).should('exist');
      cy.log(`✅ Check OK - OT ${dados.TANUM} validada com sucesso`);

      // Verifica status Finalizada
      cy.wait(1000);
      cy.contains('span', 'Finalizada').should('be.visible').click();
      cy.log(`✅ Check OK - OT ${dados.TANUM} com status Finalizada`);

      // Validar reabastecimento via Saldo usando LENUM
      cy.wait(40000);
      cy.contains('span', 'Buscar função, tela ou ação').should('be.visible').click();
      cy.get('input[placeholder="O que você quer fazer?"]').should('be.visible').clear().type('Saldo');
      cy.contains('p', 'Saldo').click();
      cy.wait(10000);
      cy.get('button[data-slot="button"]').contains('Filtros').click();
      cy.wait(2000);
      cy.get('.bg-muted\\/10 > :nth-child(2) > .inline-flex').click() //Clicar no filtro de pesquisa
      cy.get('.space-y-3 > .w-full').should('be.visible').clear().type(`${dados.LENUM}`);
      cy.wait(1000);
      cy.get(':nth-child(1) > .items-baseline').click();
      cy.contains('span', `${dados.LENUM}`).should('be.visible');
      cy.wait(5000);
      if (index >= 1) {
        cy.get('span').contains(`#${index + 1}`).should('exist');
      }
      cy.log(`✅ Check OK - LENUM ${dados.LENUM} validada com sucesso`);

   
    });
  });
});

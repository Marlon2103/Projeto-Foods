const { carregarDadosTORD } = require('../../support/utils/gerarDados');

describe('[Regressivo] 04 - Reab Parte 2 (Login + Validar OT Finalizada)', () => {
  before(() => {
    // Carrega os mesmos dados do TORD gerados no spec 01
    return carregarDadosTORD();
  });

   beforeEach(() => {
    cy.on('uncaught:exception', () => false);
    cy.visit('/login');
  });


  it('Deve realizar login e validar OT com status Finalizada', () => {
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
    cy.get('a[title="Operação"]', { timeout: 180000 }).should('be.visible');;
       
    // Utiliza as variaveis do TORD
    const dados = Cypress.env('tordDados');
    cy.log('📦 Variaveis TORD:');
    cy.log(`   TANUM (OT): ${dados.TANUM}`);
    
    //Abrir o menu Ordem De Transporte
    cy.wait(10000);
    cy.get('.group > .flex-1').should('be.visible').click();   
    cy.get('input[placeholder="O que você quer fazer?"]').should('be.visible').clear().type('OT')
    cy.contains('p', 'OT').click()
    cy.get('.pb-2 > :nth-child(2) > .flex > .inline-flex').should('be.visible').click() //Clicar no filtro de pesquisa
    cy.wait(1000);
    cy.get('[style="width: 90px;"] > .inline-flex').click() //Clicar no filtro de pesquisa
    cy.get('.space-y-3 > .w-full').should('be.visible').clear().type(`${dados.TANUM}`); //Inserir numero varivel para pesquisa
    cy.wait(1000);
    cy.get('div.min-w-0 > .px-1').click()
    cy.contains(`${dados.TANUM}`, { timeout: 30000 }).should('exist');
    cy.log(`✅ Check OK - OT ${dados.TANUM} validada com sucesso`);

    
    // Valida se o status "Finalizada" está na mesma linha da OT
    cy.wait(1000);
    cy.contains('span', 'Finalizada').should('be.visible').click()
    cy.log(`✅ Check OK - OT ${dados.TANUM} com status Finalizada`)

    //Validar se o reabastecimento foi concluído com sucesso
    cy.wait(10000);
    cy.contains('span', 'Buscar função, tela ou ação').should('be.visible').click()   
    cy.get('input[placeholder="O que você quer fazer?"]').should('be.visible').clear().type('Saldo')
    cy.contains('p', 'Saldo').click()
    cy.wait(10000);
    cy.get('button[data-slot="button"]').contains('Filtros').click()//Clicar no filtro de pesquisa
    cy.wait(2000);
    cy.get('.bg-muted\\/10 > :nth-child(2) > .inline-flex').click() //Clicar no filtro de pesquisa
    cy.get('.space-y-3 > .w-full').should('be.visible').clear().type(`${dados.LENUM}`); //Inserir numero varivel para pesquisa
    cy.wait(1000);
    cy.contains('span', `${dados.LENUM}`).should('be.visible');
    cy.contains('span', '4').should('be.visible');
    cy.log(`✅ Check OK - OT ${dados.LENUM} validada com sucesso`);


  
    //Deslogar do sistema
    cy.get('span[data-slot="avatar-fallback"]').first().should('be.visible').click()
    cy.wait(1000);
    cy.get('.text-destructive').should('be.visible').click()
    cy.url().should('include', '/login')
    cy.get('input[type="email"], input[name="email"], input[type="text"]').should('be.visible')
    cy.log('✅ Check OK - Logout realizado com sucesso')
  });
});
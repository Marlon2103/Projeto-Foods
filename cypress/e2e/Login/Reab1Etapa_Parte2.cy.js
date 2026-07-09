const { gerarDadosTORD } = require('../../support/utils/gerarDados');

describe('Reab1Etapa_Parte2 - Projeto BRF', () => {
  before(() => {
    // Gera dados únicos aleatórios do TORD e armazena no Cypress.env
    cy.wrap(null).then(() => {
      gerarDadosTORD();
    });
  });

  beforeEach(() => {
    // Ignora erro NEXT_REDIRECT do Next.js que ocorre ao deslogar
    cy.on('uncaught:exception', (err, runnable) => {
      return false;
    });
    cy.visit('/login');
  });

  it('Deve realizar login com sucesso', () => {
    // Intercepta a requisição de login
    cy.intercept('POST', '**/login**').as('loginRequest');
    
    // Preenche os campos - ajuste os seletores conforme necessário
    cy.get('input[type="email"], input[name="email"], input[type="text"]').first().type('velox');
    cy.get('input[type="password"]').type('xocJ20q71qUSqNatqo');
    cy.get('.group > .flex').click();
    
    
    // Aguarda a resposta do login
    cy.wait('@loginRequest', { timeout: 10000 });
       
    // Utiliza as variaveis do TORD
    const dados = Cypress.env('tordDados');
    cy.log('📦 Variaveis TORD no fluxo completo:');
    cy.log(`   DOCNUM: ${dados.DOCNUM}`);
    cy.log(`   TANUM (OT): ${dados.TANUM}`);
    cy.log(`   ID_ABASTEC: ${dados.ID_ABASTEC}`);
    cy.log(`   Palete: ${dados.LENUM}`);
    
    //Abrir o menu Ordem De Transporte
    cy.get('a[title="Operação"]').should('be.visible').click()  //Clica no menu Operação
    cy.wait(2000); // Aguarda 1 segundo para garantir que o submenu esteja visível
    cy.get('div.flex.items-center.gap-1.text-sm').contains('OT').click() //Clicar na tela para fechar o submenu
    cy.get('.pb-2 > :nth-child(2) > .flex > .inline-flex').should('be.visible').click() //Clica no menu para abrir os filtros
    cy.wait(1000); // Aguarda 1 segundo para garantir que o submenu esteja visível
    cy.get(':nth-child(3) > .inline-flex > .truncate').click() //Clica no campo para digitar o número da OT
    cy.get('.space-y-3 > .w-full').should('be.visible').type(`da`) //Preenche o campo com o número da OT salva na variavel do TORD
    cy.wait(1000);
    cy.get('div.flex.items-center.gap-1.text-sm').contains('OT').click() //Clicar na tela para fechar o submenu
    cy.get(':nth-child(5) > .inline-block > .font-mono').contains(`${dados.TANUM}`).should('be.visible') //Valida se a OT está visível na tela
    cy.log(`✅ Check OK - OT ${dados.TANUM} validada com sucesso`)
    cy.contains('span', 'Finalizada').should('be.visible') //Valida se a OT está com status Finalizada    
    cy.log(`✅ Check OK - OT ${dados.TANUM} validada com status Finalizada`)
  

    //Deslogar do sistema
    cy.get('span[data-slot="avatar-fallback"]').first().should('be.visible').click()  //Clica no menu Operação
    cy.wait(1000);
    cy.get('#radix-_R_11aknpflbH1_ > .text-destructive').should('be.visible').click() //Clica no botão para sair
    cy.url().should('include', '/login') //Aguarda o redirect para a tela de login
    cy.get('input[type="email"], input[name="email"], input[type="text"]').should('be.visible') //Valida se o campo de login está visível
    cy.log(`✅ Check OK - Logout realizado com sucesso`)
    
  });
  
  });

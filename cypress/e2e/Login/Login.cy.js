describe('Login - Projeto BRF', () => {
  beforeEach(() => {
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

    
  });

  
  });

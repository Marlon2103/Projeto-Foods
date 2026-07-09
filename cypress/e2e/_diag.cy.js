describe('DIAG - descobrir mecanismo que esconde navbar', () => {
  const logs = [];

  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      logs.push('UNCAUGHT: ' + err.message);
      return false;
    });
    cy.visit('/login', {
      onBeforeLoad(win) {
        // Tenta sobrescrever cada propriedade de deteccao de iframe; reporta o que funcionou
        const tryDef = (prop, getter) => {
          try {
            Object.defineProperty(win, prop, { get: getter, configurable: true });
            logs.push('SPOOF OK: ' + prop);
          } catch (e) {
            logs.push('SPOOF FAIL ' + prop + ': ' + e.message);
          }
        };
        tryDef('parent', () => win);
        tryDef('frameElement', () => null);
        // navigator.webdriver
        try {
          Object.defineProperty(win.navigator, 'webdriver', { get: () => false, configurable: true });
          logs.push('webdriver override OK');
        } catch (e) { logs.push('webdriver override FAIL: ' + e.message); }
      },
    });
  });

  it('Inspeciona ambiente e navbar', () => {
    cy.intercept('POST', '**/login**').as('loginRequest');
    cy.get('input[type="email"], input[name="email"], input[type="text"]').first().type('velox');
    cy.get('input[type="password"]').type('xocJ20q71qUSqNatqo');
    cy.get('.group > .flex').click();
    cy.wait('@loginRequest', { timeout: 10000 });

    cy.wait(8000);

    cy.window().then((win) => {
      cy.document().then((doc) => {
        const bodyText = doc.body.innerText || '';
        const info = {
          // sinais de automacao / ambiente
          navigatorWebdriver: win.navigator.webdriver,
          hasFocus: doc.hasFocus(),
          visibilityState: doc.visibilityState,
          selfEqTop: win.self === win.top,
          parentEqWin: win.parent === win,
          frameElement: String(win.frameElement),
          userAgent: win.navigator.userAgent,
          // estado da navbar
          totalButtons: doc.querySelectorAll('button').length,
          temHeader: !!doc.querySelector('header'),
          operacaoVisivel: bodyText.includes('Operação'),
          overviewVisivel: bodyText.includes('Overview'),
          logs: logs,
        };
        cy.writeFile('cypress/_diag_nav.json', info);
      });
    });
  });
});
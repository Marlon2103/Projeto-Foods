/**
 * Gera valores aleatórios mantendo a mesma quantidade de caracteres dos campos UNICOS.
 * Os dados podem ser compartilhados entre testes via Cypress.env()
 */

/**
 * Gera um número aleatório com quantidade EXATA de dígitos
 * @param {number} length - Quantidade de dígitos (máx 20)
 * @returns {string} Número com length dígitos, ex: "0000000000159784"
 */
function gerarNumero(length) {
  let resultado = '';
  for (let i = 0; i < length; i++) {
    resultado += Math.floor(Math.random() * 10).toString();
  }
  return resultado;
}

/**
 * Gera DOCNUM (16 dígitos)
 * @returns {string} Ex: 0000000000159784
 */
function gerarDOCNUM() {
  return gerarNumero(16);
}

/**
 * Gera TANUM - Ordem de Transporte (10 dígitos)
 * @returns {string} Ex: 0000008998
 */
function gerarTANUM() {
  return gerarNumero(10);
}

/**
 * Gera SERIAL (14 dígitos - data + hora)
 * @returns {string} Ex: 20260501120500
 */
function gerarSERIAL() {
  const now = new Date();
  const ano = now.getFullYear();
  const mes = Cypress._.padStart((now.getMonth() + 1).toString(), 2, '0');
  const dia = Cypress._.padStart(now.getDate().toString(), 2, '0');
  const hora = Cypress._.padStart(now.getHours().toString(), 2, '0');
  const min = Cypress._.padStart(now.getMinutes().toString(), 2, '0');
  const seg = Cypress._.padStart(now.getSeconds().toString(), 2, '0');
  return `${ano}${mes}${dia}${hora}${min}${seg}`;
}

/**
 * Gera ID_ABASTEC (formato: ABAST-ANO-NNNNNN)
 * @returns {string} Ex: ABAST-2024-009864
 */
function gerarIDAbastec() {
  const ano = new Date().getFullYear();
  const sequencial = gerarNumero(6);
  return `ABAST-${ano}-${sequencial}`;
}

/**
 * Gera LENUM - Palete (20 dígitos)
 * @returns {string} Ex: 00000000000000000898
 */
function gerarLENUM() {
  return gerarNumero(5);
}

/**
 * Gera ZVFDAT - Data de Validade (8 dígitos AAAAMMDD)
 * Por padrão gera data a N dias à frente (padrão: 365 dias)
 * @param {number} daysAhead
 * @returns {string} Ex: 20250601
 */
function gerarZVFDAT(daysAhead = 365) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const ano = d.getFullYear();
  const mes = Cypress._.padStart((d.getMonth() + 1).toString(), 2, '0');
  const dia = Cypress._.padStart(d.getDate().toString(), 2, '0');
  return `${ano}${mes}${dia}`;
}

/**
 * Gera CHARG - Lote no formato LyyMMDD (ex: L240101)
 * Usa o ano com dois dígitos + mês + dia
 * @returns {string} Ex: L240101
 */
function gerarCHARG() {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mes = Cypress._.padStart((d.getMonth() + 1).toString(), 2, '0');
  const dia = Cypress._.padStart(d.getDate().toString(), 2, '0');
  return `L${yy}${mes}${dia}`;
}

/**
 * Gera CREDAT (8 dígitos - data AAAAMMDD)
 * @returns {string} Ex: 20260501
 */
function gerarCREDAT() {
  const now = new Date();
  const ano = now.getFullYear();
  const mes = Cypress._.padStart((now.getMonth() + 1).toString(), 2, '0');
  const dia = Cypress._.padStart(now.getDate().toString(), 2, '0');
  return `${ano}${mes}${dia}`;
}

/**
 * Gera CRETIM (6 dígitos - hora HHMMSS)
 * @returns {string} Ex: 120500
 */
function gerarCRETIM() {
  const now = new Date();
  const hora = Cypress._.padStart(now.getHours().toString(), 2, '0');
  const min = Cypress._.padStart(now.getMinutes().toString(), 2, '0');
  const seg = Cypress._.padStart(now.getSeconds().toString(), 2, '0');
  return `${hora}${min}${seg}`;
}

/**
 * Gera todos os dados únicos e salva no Cypress.env E em arquivo para compartilhar entre specs
 * @returns {Object} Objeto com todos os dados gerados
 */
function gerarDadosTORD() {
  const dados = {
    DOCNUM: gerarDOCNUM(),
    TANUM: gerarTANUM(),
    SERIAL: gerarSERIAL(),
    ID_ABASTEC: gerarIDAbastec(),
    LENUM: gerarLENUM(),
    ZVFDAT: gerarZVFDAT(),
    CHARG: gerarCHARG(),
    CREDAT: gerarCREDAT(),
    CRETIM: gerarCRETIM(),
  };

  // Remover zeros à esquerda de LENUM para uso (ex: "04096" -> "4096")
  dados.LENUM = String(parseInt(dados.LENUM, 10));

  // Salva no Cypress.env para compartilhar com outros testes
  Cypress.env('tordDados', dados);

  // Salva em arquivo para compartilhar entre specs diferentes
  cy.writeFile('cypress/fixtures/tordDados.json', dados);

  cy.log('📦 Dados TORD gerados:');
  cy.log(`   DOCNUM (16 dígitos): ${dados.DOCNUM}`);
  cy.log(`   TANUM (10 dígitos): ${dados.TANUM}`);
  cy.log(`   SERIAL (14 dígitos): ${dados.SERIAL}`);
  cy.log(`   ID_ABASTEC: ${dados.ID_ABASTEC}`);
  cy.log(`   LENUM (20 dígitos): ${dados.LENUM}`);
  cy.log(`   CHARG (lote): ${dados.CHARG}`);
  cy.log(`   ZVFDAT (validade AAAAMMDD): ${dados.ZVFDAT}`);
  cy.log(`   CREDAT: ${dados.CREDAT}`);
  cy.log(`   CRETIM: ${dados.CRETIM}`);

  return dados;
}

/**
 * Carrega os dados do TORD salvos em arquivo (para usar em specs diferentes)
 * @returns {Cypress.Chainable<Object>} Objeto com os dados do TORD
 */
function carregarDadosTORD() {
  return cy.readFile('cypress/fixtures/tordDados.json').then((dados) => {
    // Normaliza LENUM ao carregar para remover zeros à esquerda
    dados.LENUM = String(parseInt(dados.LENUM, 10));
    Cypress.env('tordDados', dados);
    cy.log('📦 Dados TORD carregados do arquivo:');
    cy.log(`   DOCNUM: ${dados.DOCNUM}`);
    cy.log(`   TANUM: ${dados.TANUM}`);
    // Se existir, logar CHARG e ZVFDAT do arquivo
    if (dados.CHARG) cy.log(`   CHARG: ${dados.CHARG}`);
    if (dados.ZVFDAT) cy.log(`   ZVFDAT: ${dados.ZVFDAT}`);
  });
}

function gerarShipmentVars() {
  const shipmentVars = {
    DELID: String(parseInt(gerarNumero(10), 10)),
    SHPID: String(parseInt(gerarNumero(10), 10)),
  };

  Cypress.env('shipment_vars', shipmentVars);
  cy.writeFile('cypress/fixtures/shipment_vars.json', shipmentVars);
  cy.log('📦 Shipment vars gerados:');
  cy.log(`   DELID: ${shipmentVars.DELID}`);
  cy.log(`   SHPID: ${shipmentVars.SHPID}`);

  return shipmentVars;
}

function carregarShipmentVars() {
  return cy.readFile('cypress/fixtures/shipment_vars.json').then((shipmentVars) => {
    Cypress.env('shipment_vars', shipmentVars);
    cy.log('📦 Shipment vars carregados do arquivo:');
    cy.log(`   DELID: ${shipmentVars.DELID}`);
    cy.log(`   SHPID: ${shipmentVars.SHPID}`);
    return cy.wrap(shipmentVars);
  });
}

module.exports = {
  gerarDOCNUM,
  gerarTANUM,
  gerarSERIAL,
  gerarIDAbastec,
  gerarLENUM,
  gerarZVFDAT,
  gerarCHARG,
  gerarCREDAT,
  gerarCRETIM,
  gerarDadosTORD,
  carregarDadosTORD,
  gerarShipmentVars,
  carregarShipmentVars,
};

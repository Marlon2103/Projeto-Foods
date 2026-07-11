const { gerarDadosTORD, gerarShipmentVars } = require('../../support/utils/gerarDados');

describe('[Integracao] TORD - Pendente (1ª Etapa)', () => {
  before(() => {
    // Gera dados únicos aleatórios e armazena no Cypress.env para compartilhar
    gerarDadosTORD();
    gerarShipmentVars();
  });

  it('Deve enviar XML TORD zsddarem para integrar remessa', () => {
    const endpoint = 'https://velox2.velox-by-invent.com/api/gateway/v1/mbrf-zsddarem-v1';

    // Recupera os dados gerados no before()
    const dados = Cypress.env('tordDados') || {};
    const shipmentVars = Cypress.env('shipment_vars') || {};

    // Gerador local de números (apenas para DELID / SHPID)
    function gerarNumeroLocal(length) {
      let resultado = '';
      for (let i = 0; i < length; i++) {
        resultado += Math.floor(Math.random() * 10).toString();
      }
      return resultado;
    }

    const DELID = shipmentVars.DELID || gerarNumeroLocal(10);
    const SHPID = shipmentVars.SHPID || gerarNumeroLocal(10);

    // Monta campos dinâmicos a partir dos dados gerados
    const DOCNUM = dados.DOCNUM || '0000000000000000';
    const SERIAL = dados.SERIAL || '20260101000000';
    const CREDAT = dados.CREDAT || '20260101';
    const CRETIM = dados.CRETIM || '000000';

    const xmlPayload = `<?xml version="1.0" encoding="UTF-8"?>

<ZSDDAREM>
<IDOC BEGIN="1">
<EDI_DC40 SEGMENT="1">
  <TABNAM>EDI_DC40</TABNAM>
  <MANDT>110</MANDT>
  <DOCNUM>${DOCNUM}</DOCNUM>
  <DIRECT>1</DIRECT>
  <IDOCTYP>TPSDLS01</IDOCTYP>
  <CIMTYP>ZSDDAREM</CIMTYP>
  <MESTYP>TPSDLS</MESTYP>
  <SNDPOR>SAPQAS</SNDPOR>
  <SNDPRT>LS</SNDPRT>
  <SNDPRN>PRD</SNDPRN>
  <RCVPOR>TPSDLS_SDV</RCVPOR>
  <RCVPRT>LS</RCVPRT>
  <RCVPRN>WCS_CDSVD</RCVPRN>
  <CREDAT>${CREDAT}</CREDAT>
  <CRETIM>${CRETIM}</CRETIM>
  <SERIAL>${SERIAL}</SERIAL>
</EDI_DC40>
<E1TPDLH SEGMENT="1">
  <DELID>${DELID}</DELID>
  <SHPTYP>01</SHPTYP>
  <SHPPRI>11</SHPPRI>
  <DIREC>OB</DIREC>
  <ZRSDTPCNTR SEGMENT="1">
    <ZCNTRM>00002</ZCNTRM>
    <ZDOCA>02</ZDOCA>
    <ZTURNO>01</ZTURNO>
    <ZPRIO>12</ZPRIO>
    <ZTTRM>00002</ZTTRM>
    <ZPLVC>LPQ7364</ZPLVC>
    <ZTIPOVC>CAVMEC</ZTIPOVC>
    <ZLEADTIME>000</ZLEADTIME>
    <ZTIPOBAUVC>Nao</ZTIPOBAUVC>
    <ZTRANSPORTADOR>TRANSPORTES FRAMENTO LTDA</ZTRANSPORTADOR>
  </ZRSDTPCNTR>
  <E1TPACC SEGMENT="1">
    <ACTCD>C</ACTCD>
  </E1TPACC>
  <E1TPTRM SEGMENT="1">
    <SHPPNT>SVRM</SHPPNT>
    <PLANT>1642</PLANT>
    <STRLOC>88</STRLOC>
    <SHPPTY>0008334511</SHPPTY>
  </E1TPTRM>
  <E1TPDLI SEGMENT="1">
    <DELITM>000100</DELITM>
    <MATNR>000000000000220981</MATNR>
    <MATTXT>SHG420 SALSICHA HOT DOG PT 5KG PERDIGAO</MATTXT>
    <QUANT>00000000012.000</QUANT>
    <QNUNIT>CX</QNUNIT>
    <ZRSDTPITRM SEGMENT="1">
      <ZSEPAR>T100040</ZSEPAR>
      <ZCNDTMP>CONGELADO</ZCNDTMP>
      <Z_SLPRODUTO>19.00</Z_SLPRODUTO>
      <ZFX1TX>AMARELA</ZFX1TX>
      <ZSHELF_DE>20251217</ZSHELF_DE>
      <ZSHELF_ATE>20260324</ZSHELF_ATE>
    </ZRSDTPITRM>
    <E1TPDII SEGMENT="1">
      <GRSWGT>00000000000243.840</GRSWGT>
      <NETWGT>00000000000240.000</NETWGT>
      <WUNIT>KG</WUNIT>
    </E1TPDII>
  </E1TPDLI>
  <E1TPTRP SEGMENT="1">
    <SHPID>${SHPID}</SHPID>
    <ZSEQREM>5/32</ZSEQREM>
    <DATBEG>00000000</DATBEG>
    <TIMBEG>000000</TIMBEG>
    <DATEND>00000000</DATEND>
    <TIMEND>000000</TIMEND>
  </E1TPTRP>
</E1TPDLH>
</IDOC>
</ZSDDAREM>`;

    cy.request({
      method: 'POST',
      url: endpoint,
      body: xmlPayload,
      headers: {
        'Content-Type': 'application/xml',
        'Accept': 'application/xml',
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.log('🔹 Status:', response.status);
      cy.log('🔹 Response Body:', JSON.stringify(response.body));

      // Valida que a requisição foi aceita
      expect(response.status).to.be.oneOf([200, 201, 202]);
      expect(response.body).to.not.be.empty;

      // Salva DELID e SHPID em arquivo para uso por outras specs
      const shipmentVars = { DELID, SHPID };
      Cypress.env('shipment_vars', shipmentVars);
      cy.writeFile('cypress/fixtures/shipment_vars.json', shipmentVars);
      cy.log('📦 Shipment vars saved:', JSON.stringify(shipmentVars));
    });
  });
});
  
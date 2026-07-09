const { carregarDadosTORD } = require('../../support/utils/gerarDados');

describe('[Regressivo] 03 - TOCO Confirmacao (Confirmar TORD Pendente)', () => {
  before(() => {
    // Carrega os mesmos dados do TORD gerados no spec 01
    return carregarDadosTORD();
  });

  it('Deve enviar XML TOCO Para Confirmar o Tord Pendente', () => {
    const endpoint = 'https://velox2.velox-by-invent.com/api/gateway/v1/mbrf-zwmtoco-v1';

    // Recupera os dados gerados no before()
    const dados = Cypress.env('tordDados');

    cy.log('📦 Confirmando TORD...');
    cy.log(`   TANUM: ${dados.TANUM}`);
    cy.log(`   DOCNUM: ${dados.DOCNUM}`);

    const xmlPayload = `<?xml version="1.0" encoding="UTF-8"?>

    
<ZTOCO01>
    <IDOC BEGIN="1">
        <EDI_DC40 SEGMENT="1">
            <TABNAM>EDI_DC40</TABNAM>
            <DOCNUM>${dados.DOCNUM}</DOCNUM> <!--Numero do Documento UNICO-->
            <IDOCTYP>WMTOCO01</IDOCTYP>
            <CIMTYP>ZTOCO01</CIMTYP>
            <MESTYP>ZWMTOCO</MESTYP>
            <SNDPOR>SAPMBRF</SNDPOR>
            <SNDPRN>MBRF</SNDPRN>
            <RCVPOR>WCS_MBRF</RCVPOR>
            <RCVPRN>WCS</RCVPRN>
        </EDI_DC40>
        <ZTOCOH SEGMENT="1">
            <TANUM>${dados.TANUM}</TANUM><!--Ordem de Transporte UNICO-->
            <LGNUM>642</LGNUM>
        </ZTOCOH>
    </IDOC>
</ZTOCO01>`;

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
      cy.log('✅ Check OK - TOCO Confirmacao enviado com sucesso');
    });
  });
});
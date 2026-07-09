const { gerarDadosTORD } = require('../../support/utils/gerarDados');

describe('[Integracao] TORD - Pendente (1ª Etapa)', () => {
  before(() => {
    // Gera dados únicos aleatórios e armazena no Cypress.env para compartilhar
    cy.wrap(null).then(() => {
      gerarDadosTORD();
    });
  });

  it('Deve enviar XML TORD com status Pendente via POST', () => {
    const endpoint = 'https://velox2.velox-by-invent.com/api/gateway/v1/mbrf-tord-v1';

    // Recupera os dados gerados no before()
    const dados = Cypress.env('tordDados');

    const xmlPayload = `<?xml version="1.0" encoding="UTF-8"?>
<ZTORD>
    <IDOC BEGIN="1">
        <EDI_DC40 SEGMENT="1">
            <TABNAM>EDI_DC40</TABNAM>
            <MANDT>110</MANDT>
            <DOCNUM>${dados.DOCNUM}</DOCNUM> <!--Numero do Documento UNICO-->
            <DOCREL>750</DOCREL>
            <STATUS>30</STATUS>
            <DIRECT>1</DIRECT>
            <OUTMOD>2</OUTMOD>
            <IDOCTYP>WMTOID01</IDOCTYP>
            <CIMTYP>ZTORD</CIMTYP>
            <MESTYP>WMTORD</MESTYP>
            <STDMES>WMTORD</STDMES>
            <SNDPOR>SAPMBRF</SNDPOR>
            <SNDPRT>LS</SNDPRT>
            <SNDPRN>MBRF</SNDPRN>
            <RCVPOR>WCS_MBRF</RCVPOR>
            <RCVPRT>LS</RCVPRT>
            <RCVPRN>WCS</RCVPRN>
            <CREDAT>${dados.CREDAT}</CREDAT>
            <CRETIM>${dados.CRETIM}</CRETIM>
            <SERIAL>${dados.SERIAL}</SERIAL>
        </EDI_DC40>
        <E1LTORH SEGMENT="1">
            <LGNUM>642</LGNUM>
            <TANUM>${dados.TANUM}</TANUM> <!--Ordem de Transporte UNICO-->
            <BWLVS>881</BWLVS> <!--Tipo de Movimento-->
            <TBPRI>1</TBPRI>
            <TRART>X</TRART>
            <BNAME>323726</BNAME>
            <PERNR>00000000</PERNR>
            <SOLWM>0.000</SOLWM>
            <SOLEX>0.000</SOLEX>
            <ISTWM>0.000</ISTWM>
            <STDAT>00000000</STDAT>
            <ENDAT>00000000</ENDAT>
            <STUZT>000000</STUZT>
            <ENUZT>000000</ENUZT>
            <SWABW>0000</SWABW>
            <QUEUE>RESF1AB_AE</QUEUE>
            <KGVNQ>X</KGVNQ>
            <TAPRI>02</TAPRI>
            <KISTZ>2</KISTZ>
            <KZLEI>2</KZLEI>
            <E1LTORI SEGMENT="1">
                <TAPOS>0001</TAPOS>
                <MATNR>000000000000500085</MATNR> <!--Sku-->
                <WERKS>1642</WERKS>
                <CHARG>L240101</CHARG> <!--Lote-->
                <MEINS>KG</MEINS>
                <LETYP>PL</LETYP>
                <KZQUI></KZQUI>
                <WDATU>00000000</WDATU>
                <VLTYP>100</VLTYP> <!--Tipo de Deposito de Origem-->
                <VLBER>001</VLBER>
                <VLPLA>RF08000000</VLPLA> <!--Posicao de Origem-->
                <VSOLM>50.000</VSOLM>
                <!--Quantidade de Caixas-->
                <NLTYP>200</NLTYP> <!--Tipo de deposito de destino "Define as Etapas"--> 
                <NLBER>001</NLBER>
                <NLPLA>RF08006173</NLPLA> <!--Posicao de destino-->
                <NSOLM>60.000</NSOLM>
                <!--Quantidade de Caixas-->
                <MAKTX>FILE PEITO S/OP FGO CONG BDJ 1KG SADIA</MAKTX>
                <VLENR>${dados.LENUM}</VLENR> <!--Palete-->
                <NLENR>${dados.LENUM}</NLENR> <!--Palete-->
                <VFDAT>20250601</VFDAT> <!--Data de Validade-->
                <HOMVE></HOMVE> <!--Palete Completo-->
                <QPLOS>000000000000</QPLOS>
                <QPLOA>000000000000</QPLOA>
                <KOBER></KOBER>
                <LGORT>1642</LGORT>
                <SOLPO>0.000</SOLPO>
                <VOLUM>0000000500.000</VOLUM>
                <VOLEH>L</VOLEH>
                <KGVNQ></KGVNQ>
                <NWIRM>0.000</NWIRM>
                <ZSADTOR SEGMENT="1">
                    <LENUM>${dados.LENUM}</LENUM> <!--Palete-->
                    <ZPESOL>48.000</ZPESOL>
                    <MGEWI>50.000</MGEWI>
                    <ZSIGLA>FILPE</ZSIGLA>
                </ZSADTOR>
                <ZTORD SEGMENT="1">
                    <ID_ABASTEC>${dados.ID_ABASTEC}</ID_ABASTEC>
                    <!--Id Abastecimento UNICO-->
                    <COND_TEMP>CONGELADO</COND_TEMP>
                    <!--Temperatura-->
                    <HSDAT>20240115</HSDAT>
                    <!--Data Fabricacao-->
                    <CLASS_ABC>C</CLASS_ABC>
                    <NSOLA>4</NSOLA>
                    <!--Quantidade de Caixas-->
                    <ZVFDAT>20250601</ZVFDAT>
                    <!--Data de Validade-->

                </ZTORD>
            </E1LTORI>
        </E1LTORH>
    </IDOC>
</ZTORD>`;

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
    });
  });
});
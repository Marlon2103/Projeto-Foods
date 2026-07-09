const { gerarDadosTORD } = require('../../support/utils/gerarDados');

describe('[CT031] Sequencia Palete - 3x TORD + TOCO', () => {
  // Executa 3 iterações de TORD seguido de TOCO e armazena cada 'dados' em um array
  it('Executa 3 TORD + TOCO e salva resultados em fixture', () => {
    const results = [];

    function runIteration(remaining) {
      if (!remaining) {
        // grava todos os results em um arquivo fixture detalhado
        return cy.writeFile('cypress/fixtures/tordSequencia_detailed.json', results).then(() => {
          cy.log('✅ Sequência completa. Results salvos em cypress/fixtures/tordSequencia_detailed.json');
        });
      }

      // Gera novos dados TORD e aguarda o fixture gerado
      gerarDadosTORD();
      return cy.readFile('cypress/fixtures/tordDados.json').then((dados) => {
        // Monta e envia o XML TORD (reaproveita payload do spec original)
        const tordEndpoint = 'https://velox2.velox-by-invent.com/api/gateway/v1/mbrf-tord-v1';
        const xmlTord = `<?xml version="1.0" encoding="UTF-8"?>
<ZTORD>
    <IDOC BEGIN="1">
        <EDI_DC40 SEGMENT="1">
            <TABNAM>EDI_DC40</TABNAM>
            <MANDT>110</MANDT>
            <DOCNUM>${dados.DOCNUM}</DOCNUM>
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
            <TANUM>${dados.TANUM}</TANUM>
            <BWLVS>881</BWLVS>
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
                <MATNR>000000000000500085</MATNR>
                <WERKS>1642</WERKS>
                <CHARG>${dados.CHARG}</CHARG>
                <MEINS>KG</MEINS>
                <LETYP>PL</LETYP>
                <KZQUI></KZQUI>
                <WDATU>00000000</WDATU>
                <VLTYP>100</VLTYP>
                <VLBER>001</VLBER>
                <VLPLA>RA08000000</VLPLA>
                <VSOLM>50.000</VSOLM>
                <NLTYP>200</NLTYP>
                <NLBER>001</NLBER>
                <NLPLA>RA06002200</NLPLA>
                <NSOLM>60.000</NSOLM>
                <MAKTX>FILE PEITO S/OP FGO CONG BDJ 1KG SADIA</MAKTX>
                <VLENR>${dados.LENUM}</VLENR>
                <NLENR>${dados.LENUM}</NLENR>
                <VFDAT>${dados.ZVFDAT}</VFDAT>
                <HOMVE></HOMVE>
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
                    <LENUM>${dados.LENUM}</LENUM>
                    <ZPESOL>48.000</ZPESOL>
                    <MGEWI>50.000</MGEWI>
                    <ZSIGLA>FILPE</ZSIGLA>
                </ZSADTOR>
                <ZTORD SEGMENT="1">
                    <ID_ABASTEC>${dados.ID_ABASTEC}</ID_ABASTEC>
                    <COND_TEMP>CONGELADO</COND_TEMP>
                    <HSDAT>20240115</HSDAT>
                    <CLASS_ABC>C</CLASS_ABC>
                    <NSOLA>4</NSOLA>
                    <ZVFDAT>${dados.ZVFDAT}</ZVFDAT>
                </ZTORD>
            </E1LTORI>
        </E1LTORH>
    </IDOC>
</ZTORD>`;

        return cy.request({
          method: 'POST',
          url: tordEndpoint,
          body: xmlTord,
          headers: {
            'Content-Type': 'application/xml',
            'Accept': 'application/xml',
          },
          failOnStatusCode: false,
          timeout: 120000,
          }).then((resTord) => {
          cy.log('TORD status:', resTord.status);
          // Garantir que o TORD foi aceito antes de enviar TOCO
          expect(resTord.status).to.be.oneOf([200, 201, 202]);

          // Extrai valores retornados pelo TORD quando disponíveis (XML ou JSON)
          const usedDados = Object.assign({}, dados);
          try {
            const body = resTord.body && typeof resTord.body === 'string' ? resTord.body : JSON.stringify(resTord.body || '');
            const tanumMatch = body.match(/<TANUM>(.*?)<\/TANUM>/);
            const docnumMatch = body.match(/<DOCNUM>(.*?)<\/DOCNUM>/);
            if (tanumMatch) {
              usedDados.TANUM = tanumMatch[1];
              cy.log('Usando TANUM retornado pelo TORD:', usedDados.TANUM);
            }
            if (docnumMatch) {
              usedDados.DOCNUM = docnumMatch[1];
              cy.log('Usando DOCNUM retornado pelo TORD:', usedDados.DOCNUM);
            }
          } catch (e) {
            cy.log('Não foi possível extrair valores do corpo do TORD, usando dados gerados');
          }

          // Após TORD aceito, enviar TOCO para confirmar usando valores extraídos
          const tocoEndpoint = 'https://velox2.velox-by-invent.com/api/gateway/v1/mbrf-zwmtoco-v1';
          const xmlToco = `<?xml version="1.0" encoding="UTF-8"?>
<ZTOCO01>
    <IDOC BEGIN="1">
        <EDI_DC40 SEGMENT="1">
            <TABNAM>EDI_DC40</TABNAM>
            <DOCNUM>${usedDados.DOCNUM}</DOCNUM>
            <IDOCTYP>WMTOCO01</IDOCTYP>
            <CIMTYP>ZTOCO01</CIMTYP>
            <MESTYP>ZWMTOCO</MESTYP>
            <SNDPOR>SAPMBRF</SNDPOR>
            <SNDPRN>MBRF</SNDPRN>
            <RCVPOR>WCS_MBRF</RCVPOR>
            <RCVPRN>WCS</RCVPRN>
        </EDI_DC40>
        <ZTOCOH SEGMENT="1">
            <TANUM>${usedDados.TANUM}</TANUM>
            <LGNUM>642</LGNUM>
        </ZTOCOH>
    </IDOC>
</ZTOCO01>`;

          // Envia TOCO com tentativas enquanto o sistema ainda não tiver processado o TORD
          function sendTocoAttempt(attemptsLeft) {
            return cy.request({
              method: 'POST',
              url: tocoEndpoint,
              body: xmlToco,
              headers: {
                'Content-Type': 'application/xml',
                'Accept': 'application/xml',
              },
              failOnStatusCode: false,
              timeout: 120000,
            }).then((resToco) => {
              cy.log('TOCO status:', resToco.status);
              const tocoBodyStr = typeof resToco.body === 'string' ? resToco.body : JSON.stringify(resToco.body);
              const tordBodyStr = typeof resTord.body === 'string' ? resTord.body : JSON.stringify(resTord.body);

              // Se OT não encontrada, aguarda e tenta novamente (até X tentativas)
              if (attemptsLeft > 0 && /OT não encontrada|numero_ot=.*não existe/.test(tocoBodyStr)) {
                cy.log('OT não encontrada — aguardando processamento do TORD, tentativas restantes:', attemptsLeft);
                return cy.wait(2000).then(() => sendTocoAttempt(attemptsLeft - 1));
              }

              // Armazena os dados efetivamente usados nesta iteração e as respostas de TORD/TOCO
              results.push(Object.assign({}, usedDados, {
                _tordResponse: {
                  status: resTord.status,
                  body: tordBodyStr
                },
                _tocoResponse: {
                  status: resToco.status,
                  body: tocoBodyStr
                }
              }));

              // Próxima iteração
              return runIteration(remaining - 1);
            });
          }

          // aguarda 30s para o sistema processar o TORD antes de tentar o TOCO
          // começar com até 12 tentativas (~24s de espera adicional)
          return cy.wait(30000).then(() => sendTocoAttempt(12));
        });
      });
    }

    // Inicia 3 iterações e retorna a chain para Cypress
    return runIteration(3);
  });
});

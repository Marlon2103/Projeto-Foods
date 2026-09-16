const fs = require('fs');
const path = require('path');
const {
  AlignmentType, BorderStyle, Document, Footer, Header, HeadingLevel, Packer,
  Paragraph, ShadingType, Table, TableCell, TableRow, TextRun,
  WidthType,
} = require('docx');

const output = path.join(__dirname, '..', 'docs', 'UT_Processos_Projeto_Peter_II.docx');
const yellow = 'FFCC00';
const black = '111111';
const gray = 'F2F2F2';
const border = { style: BorderStyle.SINGLE, size: 4, color: 'B7B7B7' };

function cell(text, options = {}) {
  return new TableCell({
    shading: options.header ? { fill: yellow, type: ShadingType.CLEAR } : options.shading ? { fill: options.shading, type: ShadingType.CLEAR } : undefined,
    borders: { top: border, bottom: border, left: border, right: border },
    children: [new Paragraph({ spacing: { before: 50, after: 50 }, children: [new TextRun({ text: String(text || '-'), bold: Boolean(options.header), color: options.header ? black : undefined })] })],
  });
}

function table(rows) {
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: rows.map((row, rowIndex) => new TableRow({ children: row.map((value) => cell(value, { header: rowIndex === 0, shading: rowIndex % 2 === 0 && rowIndex !== 0 ? gray : undefined })) })) });
}

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ heading: level, spacing: { before: 240, after: 100 }, children: [new TextRun({ text, bold: true, color: black })] });
}

function bullet(text) { return new Paragraph({ text, bullet: { level: 0 }, spacing: { after: 60 } }); }
function labelValue(label, value) { return new Paragraph({ spacing: { after: 70 }, children: [new TextRun({ text: `${label}: `, bold: true }), new TextRun({ text: value })] }); }

const uts = [
  {
    id: 'UT-001', process: 'Configuração de Impressoras', source: 'Linha 4 da planilha de testes', responsible: 'Implantação',
    objective: 'Validar a configuração, comunicação e funcionamento das impressoras utilizadas no processo operacional.',
    preconditions: ['Impressora instalada e energizada.', 'Endereço de rede, driver e parâmetros de comunicação disponíveis.', 'Modelo de etiqueta ou documento de teste aprovado.'],
    steps: ['Confirmar modelo, identificação e localização do equipamento.', 'Validar conectividade entre o sistema e a impressora.', 'Aplicar configuração de rede, fila, formato e parâmetros de impressão.', 'Executar impressão de teste com dados controlados.', 'Comparar o resultado impresso com o modelo aprovado.', 'Registrar evidências e eventuais ajustes necessários.'],
    acceptance: ['Impressora acessível pelo sistema.', 'Impressão concluída sem erro ou perda de comunicação.', 'Conteúdo, alinhamento, legibilidade e dimensões conforme o padrão aprovado.', 'Evidência anexada e aprovação registrada.'],
  },
  {
    id: 'UT-002', process: 'Configuração dos Concentradores', source: 'Linha 6 da planilha de testes', responsible: 'Implantação',
    objective: 'Validar a parametrização dos concentradores e sua comunicação com os dispositivos e sistemas envolvidos.',
    preconditions: ['Concentradores instalados e identificados.', 'Mapa de equipamentos, endereços e parâmetros disponível.', 'Ambiente de teste liberado pelas equipes responsáveis.'],
    steps: ['Conferir a identificação física e lógica de cada concentrador.', 'Configurar rede, portas, serviços e parâmetros operacionais.', 'Validar a comunicação com dispositivos associados.', 'Executar comando ou evento de teste para confirmar o processamento.', 'Verificar registros, alarmes e retorno esperado.', 'Documentar a configuração final e os resultados.'],
    acceptance: ['Todos os concentradores previstos respondem corretamente.', 'Comunicação com os dispositivos estabelecida.', 'Eventos processados sem erro impeditivo.', 'Configuração final registrada e validada pelo responsável.'],
  },
  {
    id: 'UT-003', process: 'Conexão com PLC', source: 'Linha 11 da planilha de testes', responsible: 'Implantação',
    objective: 'Validar a conexão entre a solução e o PLC, incluindo troca de sinais, estados e retornos necessários ao processo.',
    preconditions: ['PLC disponível e em condição segura para teste.', 'Mapa de tags, sinais e endereçamento validado.', 'Permissão para executar comandos controlados no ambiente.'],
    steps: ['Confirmar IP, porta, protocolo e parâmetros de comunicação.', 'Estabelecer a conexão e verificar o estado do canal.', 'Acionar sinais de teste de forma controlada.', 'Confirmar recebimento e interpretação dos sinais pelo sistema.', 'Validar o retorno do sistema para o PLC.', 'Registrar logs, telas, horários e resultado do teste.'],
    acceptance: ['Conexão estabelecida de forma estável.', 'Sinais enviados e recebidos corretamente.', 'Estados apresentados de acordo com o comportamento do processo.', 'Nenhum alarme ou falha impeditiva permanece após o teste.'],
  },
  {
    id: 'UT-004', process: 'SORTER - Desvio de Volumes com Gestão', source: 'Linha 16 da planilha de testes', responsible: 'Implantação/cliente',
    objective: 'Validar o desvio de volumes no SORTER com gestão correta do destino, status do volume e rastreabilidade do evento.',
    preconditions: ['SORTER e dispositivos de leitura disponíveis.', 'Rotas e destinos de teste parametrizados.', 'Volumes identificados com dados válidos e cenários de desvio definidos.'],
    steps: ['Disponibilizar volume de teste com identificação válida.', 'Realizar leitura e iniciar o fluxo no SORTER.', 'Forçar ou simular o cenário de desvio previsto.', 'Confirmar atuação do equipamento e direcionamento físico do volume.', 'Verificar atualização do destino, status e registros no sistema.', 'Repetir o teste para um cenário válido e um cenário de exceção.', 'Anexar evidências e formalizar o resultado com o cliente.'],
    acceptance: ['Volume encaminhado ao destino correto conforme a regra configurada.', 'Desvio registrado no sistema com status e motivo consistentes.', 'Não ocorre perda, duplicidade ou encaminhamento indevido do volume.', 'Cenário de exceção gera tratamento esperado e fica rastreável.'],
  },
];

const children = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 900, after: 300 }, children: [new TextRun({ text: 'INVENT', bold: true, size: 34, color: yellow })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'UNIDADE DE TESTE', bold: true, size: 34, color: black })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 650 }, children: [new TextRun({ text: 'Processos de implantação e integração', size: 24, color: '555555' })] }),
  table([['Campo', 'Informação'], ['Projeto de referência', 'Projeto Peter II'], ['Documento', 'UT de Processos'], ['Fonte', 'PLANILHA_TESTES-2026.xlsm'], ['Versão', '1.0'], ['Data', '03/09/2026'], ['Status', 'Em formalização']]),
  heading('Controle de aprovação'),
  table([['Elaborado por', 'Revisado por', 'Aprovado por', 'Data'], ['________________', '________________', '________________', '____/____/______']]),
  heading('1. Objetivo'),
  new Paragraph('Este documento formaliza as Unidades de Teste (UTs) associadas aos processos destacados como em andamento na planilha de testes. O modelo deve ser reutilizado em cada projeto para registrar o que será validado, como o processo será executado, quais evidências devem ser produzidas e quais condições determinam a aprovação.'),
  heading('2. Escopo e referência'),
  new Paragraph('O escopo desta versão contempla quatro processos do Projeto Peter II identificados na planilha PLANILHA_TESTES-2026.xlsm: configuração de impressoras, configuração dos concentradores, conexão com PLC e desvio de volumes do SORTER com gestão.'),
  labelValue('Indicador da planilha', '13 de 82 testes aprovados (16%)'), labelValue('Itens em andamento', '4'), labelValue('Responsável predominante', 'Implantação, com participação do cliente quando indicado'),
  heading('3. Processo padrão de formalização por projeto'),
  table([['Etapa', 'Atividade', 'Saída obrigatória'], ['1. Planejar', 'Selecionar o processo, definir objetivo, responsáveis, ambiente e dados de teste.', 'UT identificada e escopo aprovado.'], ['2. Preparar', 'Confirmar pré-condições, acessos, equipamentos, integrações e parâmetros.', 'Checklist de pré-condições preenchido.'], ['3. Executar', 'Realizar os passos na ordem definida e registrar data, executor e ocorrências.', 'Evidências do teste e resultado observado.'], ['4. Avaliar', 'Comparar resultado observado com os critérios de aceite.', 'Resultado: Aprovado, Reprovado ou Bloqueado.'], ['5. Tratar', 'Registrar impeditivos, responsável, plano de ação e nova data de execução.', 'Pendência controlada até a solução.'], ['6. Aprovar', 'Obter validação da Invent e, quando aplicável, do cliente.', 'Assinaturas ou aprovação formal registrada.'], ['7. Encerrar', 'Atualizar a planilha, anexar evidências e versionar o documento.', 'Rastreabilidade completa do projeto.']]),
  heading('4. Regras de resultado'),
  bullet('Aprovado: todos os critérios de aceite foram atendidos e as evidências estão anexadas.'), bullet('Reprovado: um ou mais critérios não foram atendidos, sem impedimento externo para a execução.'), bullet('Bloqueado: a execução não pôde ser concluída por dependência, acesso, equipamento, dado ou decisão pendente.'), bullet('A aprovação do cliente deve ser registrada somente após a análise das evidências e do resultado observado.'),
  heading('5. Unidades de Teste'),
];

uts.forEach((ut, index) => {
  children.push(heading(`${ut.id} - ${ut.process}`, HeadingLevel.HEADING_2), labelValue('Referência', ut.source), labelValue('Responsável', ut.responsible), labelValue('Status na planilha', 'Em Andamento'), new Paragraph({ children: [new TextRun({ text: 'Objetivo', bold: true })] }), new Paragraph(ut.objective), new Paragraph({ children: [new TextRun({ text: 'Pré-condições', bold: true })] }));
  ut.preconditions.forEach((item) => children.push(bullet(item)));
  children.push(new Paragraph({ children: [new TextRun({ text: 'Procedimento', bold: true })] }));
  ut.steps.forEach((item, stepIndex) => children.push(new Paragraph({ text: `${stepIndex + 1}. ${item}`, spacing: { after: 60 } })));
  children.push(new Paragraph({ children: [new TextRun({ text: 'Critérios de aceite', bold: true })] }));
  ut.acceptance.forEach((item) => children.push(bullet(item)));
  children.push(table([['Registro de execução', 'Preenchimento'], ['Data/hora', '____/____/______  ____:____'], ['Executor', '________________________________'], ['Resultado', 'Aprovado / Reprovado / Bloqueado'], ['Impedimento / observação', '____________________________________________'], ['Evidências anexadas', 'Sim / Não  Referência: __________________'], ['Aprovação Invent', 'Nome: __________________  Data: ____/____/______'], ['Aprovação cliente', 'Nome: __________________  Data: ____/____/______']]));
  if (index < uts.length - 1) children.push(new Paragraph({ children: [new TextRun({ text: '', break: 2 })] }));
});

children.push(heading('6. Checklist de encerramento do projeto'), table([['Item', 'Concluído'], ['Todas as UTs previstas foram executadas ou justificadas.', '☐'], ['Critérios de aceite foram avaliados para cada UT.', '☐'], ['Impedimentos possuem responsável e plano de ação.', '☐'], ['Evidências estão armazenadas e vinculadas à UT correspondente.', '☐'], ['Planilha de testes foi atualizada com status e datas.', '☐'], ['Aprovação da Invent e do cliente foi formalizada quando aplicável.', '☐']]));
children.push(heading('7. Histórico de versões'), table([['Versão', 'Data', 'Descrição', 'Responsável'], ['1.0', '03/09/2026', 'Emissão inicial com base na planilha do Projeto Peter II.', '________________'], ['____', '____/____/______', '____________________________________________', '________________']]));

const document = new Document({ sections: [{ properties: { page: { margin: { top: 900, right: 900, bottom: 900, left: 900 } } }, headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Invent | Unidade de Teste | Projeto Peter II', size: 18, color: '666666' })] })] }) }, footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Documento controlado | Projeto Peter II', size: 16, color: '666666' })] })] }) }, children }] });

Packer.toBuffer(document).then((buffer) => { fs.writeFileSync(output, buffer); console.log(`Documento gerado: ${output}`); });
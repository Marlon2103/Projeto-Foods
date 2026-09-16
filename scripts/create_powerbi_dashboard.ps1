$source = 'C:\Users\User\Downloads\PLANILHA_TESTES-2026.xlsm'
$target = 'C:\Users\User\Documents\Cypress\Projeto BRF\PLANILHA_TESTES-2026_DASHBOARD.xlsm'
Copy-Item $source $target -Force

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
  $book = $excel.Workbooks.Open($target)
  $data = $book.Worksheets.Item('Plano de Testes')
  $kpi = $book.Worksheets.Item('KPIs')
  $corrections = @{
    'descriçaõ' = 'descrição'
    'PikcingCart' = 'Picking Cart'
    'TRASNFER' = 'TRANSFER'
    'Possiveis' = 'Possíveis'
    'Possiveis Erros' = 'Possíveis Erros'
    'AUTOMATICA' = 'AUTOMÁTICA'
    'CONFERENCIA' = 'CONFERÊNCIA'
    'ALOCACAO' = 'ALOCAÇÃO'
    'FINALIZACAO' = 'FINALIZAÇÃO'
    'ACENDIMENTO' = 'ACENDIMENTO'
    'SEQUENCIA' = 'SEQUÊNCIA'
    'INFORMACOES' = 'INFORMAÇÕES'
    'DIMENSOES' = 'DIMENSÕES'
    'TRANSFERENCIA' = 'TRANSFERÊNCIA'
    'TRASNFERENCIA' = 'TRANSFERÊNCIA'
  }
  foreach ($item in $corrections.GetEnumerator()) {
    $data.Range('A1:L85').Replace($item.Key, $item.Value)
  }
  $kpi.Cells.Clear()
  $kpi.Cells.UnMerge()
  while ($kpi.ChartObjects().Count -gt 0) { $kpi.ChartObjects().Item(1).Delete() }

  $black = 0
  $white = 16777215
  $yellow = 65535
  $green = 5296274
  $orange = 49407
  $blue = 15773696
  $red = 192
  $gray = 15921906
  $midGray = 8421504
  $darkGray = 5921370

  $kpi.Tab.Color = $yellow
  $kpi.Cells.Font.Name = 'Arial'
  $kpi.Cells.VerticalAlignment = -4108
  $kpi.Range('A1:L1').Merge()
  $kpi.Range('A1').Value2 = 'INVENT  |  PROJETO PETER II'
  $kpi.Range('A1:L1').Interior.Color = $black
  $kpi.Range('A1:L1').Font.Color = $yellow
  $kpi.Range('A1:L1').Font.Bold = $true
  $kpi.Range('A1:L1').Font.Size = 20
  $kpi.Range('A1:L1').HorizontalAlignment = -4131
  $kpi.Range('A2:L2').Merge()
  $kpi.Range('A2').Value2 = 'PAINEL DE TESTES  |  VISÃO EXECUTIVA'
  $kpi.Range('A2:L2').Interior.Color = $black
  $kpi.Range('A2:L2').Font.Color = $white
  $kpi.Range('A2:L2').Font.Bold = $true
  $kpi.Range('A2:L2').Font.Size = 10
  $kpi.Range('A2:L2').HorizontalAlignment = -4131
  $kpi.Range('A3:L3').Merge()
  $kpi.Range('A3').Value2 = 'Visão consolidada | Atualização automática pela aba Plano de Testes'
  $kpi.Range('A3:L3').Font.Color = $midGray
  $kpi.Range('A3:L3').Font.Italic = $true

  $kpi.Range('A4:C4').Merge(); $kpi.Range('A4').Value2 = 'PLANO DE TESTES'; $kpi.Range('A4:C4').Interior.Color = $yellow; $kpi.Range('A4:C4').Font.Bold = $true; $kpi.Range('A4:C4').HorizontalAlignment = -4108
  $kpi.Range('D4:F4').Merge(); $kpi.Range('D4').Value2 = 'ANÁLISE EXECUTIVA'; $kpi.Range('D4:F4').Interior.Color = $black; $kpi.Range('D4:F4').Font.Color = $yellow; $kpi.Range('D4:F4').Font.Bold = $true; $kpi.Range('D4:F4').HorizontalAlignment = -4108
  $kpi.Range('G4:I4').Merge(); $kpi.Range('G4').Value2 = 'RELATÓRIO MENSAL'; $kpi.Range('G4:I4').Interior.Color = $black; $kpi.Range('G4:I4').Font.Color = $yellow; $kpi.Range('G4:I4').Font.Bold = $true; $kpi.Range('G4:I4').HorizontalAlignment = -4108
  $kpi.Range('J4:L4').Merge(); $kpi.Range('J4').Value2 = 'INSTRUÇÕES'; $kpi.Range('J4:L4').Interior.Color = $black; $kpi.Range('J4:L4').Font.Color = $yellow; $kpi.Range('J4:L4').Font.Bold = $true; $kpi.Range('J4:L4').HorizontalAlignment = -4108

  $cards = @(
    @('A6:C6','A6:C8','TOTAL DE TESTES','=COUNTA(''Plano de Testes''!$A$4:$A$85)',$yellow),
    @('D6:F6','D6:F8','CONCLUÍDOS','=COUNTIF(''Plano de Testes''!$F$4:$F$85,"*Conclu*")',$green),
    @('G6:I6','G6:I8','EM ANDAMENTO','=COUNTIF(''Plano de Testes''!$F$4:$F$85,"Em Andamento")',$orange),
    @('J6:L6','J6:L8','PENDENTES','=COUNTIF(''Plano de Testes''!$F$4:$F$85,"Pendente")',$blue),
    @('A10:C10','A10:C12','APROVAÇÃO CLIENTE','=COUNTIF(''Plano de Testes''!$K$4:$K$85,"Aprovado")',$green),
    @('D10:F10','D10:F12','AGUARDANDO CLIENTE','=COUNTIF(''Plano de Testes''!$K$4:$K$85,"Aguardando")',$orange),
    @('G10:I10','G10:I12','% CONCLUSÃO','=IFERROR(D7/A7,0)',$yellow),
    @('J10:L10','J10:L12','% APROVAÇÃO','=IFERROR(A11/A7,0)',$yellow)
  )
  foreach ($card in $cards) {
    $label = $kpi.Range($card[0]); $label.Merge(); $label.Value2 = $card[2]
    $label.Interior.Color = $black; $label.Font.Color = $yellow; $label.Font.Bold = $true; $label.Font.Size = 9; $label.HorizontalAlignment = -4108
    $value = $kpi.Range($card[1]).Offset(1,0).Resize(2, $label.Columns.Count); $value.Merge(); $value.Formula = $card[3]
    $value.Interior.Color = $card[4]; $value.Font.Color = $black; $value.Font.Bold = $true; $value.Font.Size = 24; $value.HorizontalAlignment = -4108; $value.VerticalAlignment = -4108
    if ($card[2] -like '%*%') { $value.NumberFormat = '0%' }
    $label.Borders.LineStyle = 1; $value.Borders.LineStyle = 1
  }

  $kpi.Range('A15:D15').Merge(); $kpi.Range('A15').Value2 = 'EXECUÇÃO DO PLANO'; $kpi.Range('A15:D15').Interior.Color = $black; $kpi.Range('A15:D15').Font.Color = $yellow; $kpi.Range('A15:D15').Font.Bold = $true
  $kpi.Range('A16:D16').Value2 = @('Status','Qtd.','%','Interpretação'); $kpi.Range('A16:D16').Interior.Color = $yellow; $kpi.Range('A16:D16').Font.Bold = $true
  $kpi.Range('A17:A19').Value2 = @('Concluído','Em Andamento','Pendente')
  $kpi.Range('B17').Formula = '=COUNTIF(''Plano de Testes''!$F$4:$F$85,"*Conclu*")'; $kpi.Range('B18').Formula = '=COUNTIF(''Plano de Testes''!$F$4:$F$85,"Em Andamento")'; $kpi.Range('B19').Formula = '=COUNTIF(''Plano de Testes''!$F$4:$F$85,"Pendente")'
  $kpi.Range('C17').Formula = '=IFERROR(B17/$A$7,0)'; $kpi.Range('C18').Formula = '=IFERROR(B18/$A$7,0)'; $kpi.Range('C19').Formula = '=IFERROR(B19/$A$7,0)'; $kpi.Range('C17:C19').NumberFormat = '0%'
  $kpi.Range('D17:D19').Value2 = @('Finalizados','Em execução','Aguardando execução'); $kpi.Range('A16:D19').Borders.LineStyle = 1
  $kpi.Range('A16:A18').FormatConditions.Add(1, 3, '="Concluído"').Interior.Color = $green

  $kpi.Range('F15:I15').Merge(); $kpi.Range('F15').Value2 = 'APROVAÇÃO DO CLIENTE'; $kpi.Range('F15:I15').Interior.Color = $black; $kpi.Range('F15:I15').Font.Color = $yellow; $kpi.Range('F15:I15').Font.Bold = $true
  $kpi.Range('F16:I16').Value2 = @('Situação','Qtd.','%','Leitura'); $kpi.Range('F16:I16').Interior.Color = $yellow; $kpi.Range('F16:I16').Font.Bold = $true
  $kpi.Range('F17:F18').Value2 = @('Aprovado','Aguardando'); $kpi.Range('G17').Formula = '=COUNTIF(''Plano de Testes''!$K$4:$K$85,"Aprovado")'; $kpi.Range('G18').Formula = '=COUNTIF(''Plano de Testes''!$K$4:$K$85,"Aguardando")'; $kpi.Range('H17').Formula = '=IFERROR(G17/$A$7,0)'; $kpi.Range('H18').Formula = '=IFERROR(G18/$A$7,0)'; $kpi.Range('H17:H18').NumberFormat = '0%'; $kpi.Range('I17:I18').Value2 = @('Aceite registrado','Dependência externa'); $kpi.Range('F16:I18').Borders.LineStyle = 1

  $kpi.Range('J15:L15').Merge(); $kpi.Range('J15').Value2 = 'FOCO DE ATENÇÃO'; $kpi.Range('J15:L15').Interior.Color = $black; $kpi.Range('J15:L15').Font.Color = $yellow; $kpi.Range('J15:L15').Font.Bold = $true
  $kpi.Range('J16:L16').Merge(); $kpi.Range('J16').Formula = '=G7&" itens em andamento"'; $kpi.Range('J17:L17').Merge(); $kpi.Range('J17').Formula = '=D11&" aprovações aguardando cliente"'; $kpi.Range('J18:L18').Merge(); $kpi.Range('J18').Formula = '=TEXT(G11,"0.0%")&" de conclusão do plano"'; $kpi.Range('J19:L19').Merge(); $kpi.Range('J19').Value2 = 'Priorizar desbloqueios e execução'; $kpi.Range('J16:L19').Interior.Color = $gray; $kpi.Range('J16:L19').Borders.LineStyle = 1

  $kpi.Range('A22:L22').Merge(); $kpi.Range('A22').Value2 = 'VISÃO POR INDICADOR'; $kpi.Range('A22:L22').Interior.Color = $black; $kpi.Range('A22:L22').Font.Color = $yellow; $kpi.Range('A22:L22').Font.Bold = $true
  $kpi.Range('A23:D23').Merge(); $kpi.Range('A23').Value2 = 'STATUS DOS TESTES'; $kpi.Range('A23:D23').Interior.Color = $yellow; $kpi.Range('A23:D23').Font.Bold = $true; $kpi.Range('A23:D23').HorizontalAlignment = -4108
  $kpi.Range('E23:H23').Merge(); $kpi.Range('E23').Value2 = 'ACEITE DO CLIENTE'; $kpi.Range('E23:H23').Interior.Color = $yellow; $kpi.Range('E23:H23').Font.Bold = $true; $kpi.Range('E23:H23').HorizontalAlignment = -4108
  $kpi.Range('I23:L23').Merge(); $kpi.Range('I23').Value2 = 'RESPONSÁVEIS'; $kpi.Range('I23:L23').Interior.Color = $yellow; $kpi.Range('I23:L23').Font.Bold = $true; $kpi.Range('I23:L23').HorizontalAlignment = -4108

  $kpi.Range('N2:O2').Value2 = @('Status','Quantidade'); $kpi.Range('N3:N5').Value2 = @('Concluído','Em Andamento','Pendente'); $kpi.Range('O3').Formula = '=B17'; $kpi.Range('O4').Formula = '=B18'; $kpi.Range('O5').Formula = '=B19'
  $kpi.Range('Q2:R2').Value2 = @('Cliente','Quantidade'); $kpi.Range('Q3:Q4').Value2 = @('Aprovado','Aguardando'); $kpi.Range('R3').Formula = '=G17'; $kpi.Range('R4').Formula = '=G18'
  $kpi.Range('T2:U2').Value2 = @('Responsável','Quantidade'); $kpi.Range('T3:T4').Value2 = @('Implantação','Implantação/cliente'); $kpi.Range('U3').Formula = '=COUNTIF(''Plano de Testes''!$G$4:$G$85,"Implantação")'; $kpi.Range('U4').Formula = '=COUNTIF(''Plano de Testes''!$G$4:$G$85,"Implantação/cliente")'

  $statusChartObject = $kpi.ChartObjects().Add(18, 625, 300, 190); $statusChart = $statusChartObject.Chart; $statusChart.SetSourceData($kpi.Range('N2:O5')); $statusChart.ChartType = -4120; $statusChart.HasTitle = $true; $statusChart.ChartTitle.Text = 'Distribuição dos testes'; $statusChart.HasLegend = $true; $statusChart.Legend.Position = -4107
  $approvalChartObject = $kpi.ChartObjects().Add(325, 625, 300, 190); $approvalChart = $approvalChartObject.Chart; $approvalChart.SetSourceData($kpi.Range('Q2:R4')); $approvalChart.ChartType = -4120; $approvalChart.HasTitle = $true; $approvalChart.ChartTitle.Text = 'Aprovação do cliente'; $approvalChart.HasLegend = $true; $approvalChart.Legend.Position = -4107
  $ownerChartObject = $kpi.ChartObjects().Add(632, 625, 300, 190); $ownerChart = $ownerChartObject.Chart; $ownerChart.SetSourceData($kpi.Range('T2:U4')); $ownerChart.ChartType = 51; $ownerChart.HasTitle = $true; $ownerChart.ChartTitle.Text = 'Distribuição por responsável'; $ownerChart.HasLegend = $false
  while ($kpi.ChartObjects().Count -gt 3) { $kpi.ChartObjects().Item($kpi.ChartObjects().Count).Delete() }
  $kpi.Columns('N:U').Hidden = $true
  $kpi.Range('A25:L25').Merge(); $kpi.Range('A25').Value2 = 'Fonte: aba Plano de Testes | Indicadores atualizados automaticamente | Última atualização: 03/09/2026'; $kpi.Range('A25:L25').Font.Color = $midGray; $kpi.Range('A25:L25').Font.Italic = $true

  $statusChartObject = $kpi.ChartObjects().Add(20, 560, 360, 220)
  $statusChart = $statusChartObject.Chart
  $statusChart.SetSourceData($kpi.Range('A15:B18'))
  $statusChart.ChartType = -4120
  $statusChart.HasTitle = $true
  $statusChart.ChartTitle.Text = 'Distribuição dos testes'
  $statusChart.Legend.Position = -4107
  $statusChart.SeriesCollection(1).Format.Fill.ForeColor.RGB = $yellow

  $approvalChartObject = $kpi.ChartObjects().Add(405, 560, 360, 220)
  $approvalChart = $approvalChartObject.Chart
  $approvalChart.SetSourceData($kpi.Range('F15:G17'))
  $approvalChart.ChartType = 51
  $approvalChart.HasTitle = $true
  $approvalChart.ChartTitle.Text = 'Aprovação do cliente'
  $approvalChart.HasLegend = $false
  $approvalChart.SeriesCollection(1).Format.Fill.ForeColor.RGB = $green

  $kpi.Columns('A:L').ColumnWidth = 12
  $kpi.Columns('D').ColumnWidth = 16; $kpi.Columns('I').ColumnWidth = 18; $kpi.Columns('L').ColumnWidth = 16
  $kpi.Rows('1:25').RowHeight = 22; $kpi.Rows('1:2').RowHeight = 28; $kpi.Rows('6:12').RowHeight = 26; $kpi.Rows('15:19').RowHeight = 23; $kpi.Rows('22:25').RowHeight = 25
  $kpi.Range('A1:L25').WrapText = $true
  $kpi.Activate(); $excel.ActiveWindow.DisplayGridlines = $false

  $data.Activate(); $data.Range('A4:L85').AutoFilter(); $data.Range('A4').Select(); $excel.ActiveWindow.FreezePanes = $true
  $data.Rows('3:3').Font.Bold = $true; $data.Rows('3:3').Interior.Color = $yellow; $data.Rows('3:3').Font.Color = $black
  $data.Columns('A').ColumnWidth = 7; $data.Columns('B').ColumnWidth = 36; $data.Columns('C:E').ColumnWidth = 14; $data.Columns('F').ColumnWidth = 17; $data.Columns('G').ColumnWidth = 20; $data.Columns('H').ColumnWidth = 48; $data.Columns('I').ColumnWidth = 30; $data.Columns('J:K').ColumnWidth = 15; $data.Columns('L').ColumnWidth = 18
  $data.Range('H4:I85').WrapText = $true; $data.Range('A1:L85').Font.Name = 'Arial'; $data.Range('A1:L1').Interior.Color = $black; $data.Range('A1:L1').Font.Color = $yellow; $data.Range('A3:L85').Borders.LineStyle = 1; $data.Range('A3:L85').Borders.Color = 12632256
  $book.Save(); $book.Close($true); Write-Output "Criada: $target"
}
finally { $excel.Quit(); [System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null }
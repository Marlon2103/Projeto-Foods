$source = 'C:\Users\User\Downloads\PLANILHA_TESTES-2026.xlsm'
$target = 'C:\Users\User\Documents\Cypress\Projeto BRF\PLANILHA_TESTES-2026_MELHORADA.xlsm'
Copy-Item $source $target -Force

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
  $book = $excel.Workbooks.Open($target)
  $sheet = $book.Worksheets.Item('Plano de Testes')
  $kpi = $book.Worksheets.Item('KPIs')
  $black = 0
  $yellow = 65535
  $gray = 15921906
  $green = 5296274
  $orange = 49407
  $blue = 15773696

  $kpi.Cells.Clear()
  $kpi.Cells.UnMerge()
  $kpi.Range('A1:H1').Merge()
  $kpi.Range('A1').Value2 = 'INVENT | PAINEL DE ACOMPANHAMENTO DE TESTES'
  $kpi.Range('A1:H1').Interior.Color = $black
  $kpi.Range('A1:H1').Font.Color = $yellow
  $kpi.Range('A1:H1').Font.Bold = $true
  $kpi.Range('A1:H1').Font.Size = 16
  $kpi.Range('A1:H1').HorizontalAlignment = -4108
  $kpi.Range('A2:H2').Merge()
  $kpi.Range('A2').Value2 = 'Projeto Peter II | Indicadores calculados automaticamente'
  $kpi.Range('A2:H2').Font.Color = 8421504
  $kpi.Range('A2:H2').Font.Italic = $true
  $kpi.Range('A2:H2').HorizontalAlignment = -4108

  $cards = @(
    @('A4:B4','Total de testes','=COUNTA(''Plano de Testes''!$A$4:$A$85)',$yellow),
    @('C4:D4','Concluídos','=COUNTIF(''Plano de Testes''!$F$4:$F$85,"*Conclu*")',$green),
    @('E4:F4','Em andamento','=COUNTIF(''Plano de Testes''!$F$4:$F$85,"Em Andamento")',$orange),
    @('G4:H4','Pendentes','=COUNTIF(''Plano de Testes''!$F$4:$F$85,"Pendente")',$blue),
    @('A7:B7','Aprovados cliente','=COUNTIF(''Plano de Testes''!$K$4:$K$85,"Aprovado")',$green),
    @('C7:D7','Aguardando cliente','=COUNTIF(''Plano de Testes''!$K$4:$K$85,"Aguardando")',$orange),
    @('E7:F7','% conclusão','=IFERROR(C5/A5,0)',$yellow),
    @('G7:H7','% aprovação','=IFERROR(A8/A5,0)',$yellow)
  )

  foreach ($card in $cards) {
    $label = $kpi.Range($card[0])
    $label.Merge()
    $label.Value2 = $card[1]
    $label.Interior.Color = $black
    $label.Font.Color = $yellow
    $label.Font.Bold = $true
    $label.HorizontalAlignment = -4108
    $label.VerticalAlignment = -4108
    $value = $label.Offset(1,0).Resize(1,$label.Columns.Count)
    $value.Merge()
    $value.Formula = $card[2]
    $value.Interior.Color = $card[3]
    $value.Font.Color = $black
    $value.Font.Bold = $true
    $value.Font.Size = 18
    $value.HorizontalAlignment = -4108
    $value.VerticalAlignment = -4108
    if ($card[1] -like '%*%') { $value.NumberFormat = '0%' }
  }

  $kpi.Range('A11:D11').Merge()
  $kpi.Range('A11').Value2 = 'Distribuição por status'
  $kpi.Range('A11:D11').Interior.Color = $black
  $kpi.Range('A11:D11').Font.Color = $yellow
  $kpi.Range('A11:D11').Font.Bold = $true
  $kpi.Range('A12:D12').Value2 = @('Status','Quantidade','Percentual','Leitura')
  $kpi.Range('A13:A16').Value2 = @('Concluído','Em Andamento','Pendente','Outros')
  $kpi.Range('B13').Formula = '=COUNTIF(''Plano de Testes''!$F$4:$F$85,"*Conclu*")'
  $kpi.Range('B14').Formula = '=COUNTIF(''Plano de Testes''!$F$4:$F$85,"Em Andamento")'
  $kpi.Range('B15').Formula = '=COUNTIF(''Plano de Testes''!$F$4:$F$85,"Pendente")'
  $kpi.Range('B16').Formula = '=A5-SUM(B13:B15)'
  $kpi.Range('C13').Formula = '=IFERROR(B13/$A$5,0)'
  $kpi.Range('C14').Formula = '=IFERROR(B14/$A$5,0)'
  $kpi.Range('C15').Formula = '=IFERROR(B15/$A$5,0)'
  $kpi.Range('C16').Formula = '=IFERROR(B16/$A$5,0)'
  $kpi.Range('C13:C16').NumberFormat = '0%'
  $kpi.Range('D13:D16').Value2 = @('Finalizados','Execução em curso','Aguardando execução','Revisar classificação')

  $kpi.Range('F11:H11').Merge()
  $kpi.Range('F11').Value2 = 'Leitura executiva'
  $kpi.Range('F11:H11').Interior.Color = $black
  $kpi.Range('F11:H11').Font.Color = $yellow
  $kpi.Range('F11:H11').Font.Bold = $true
  foreach ($row in 12..15) { $kpi.Range("F${row}:H${row}").Merge(); $kpi.Range("F${row}:H${row}").Interior.Color = $gray }
  $kpi.Range('F12').Formula = '=A5&" testes no escopo"'
  $kpi.Range('F13').Formula = '=C5&" concluídos | "&E5&" em andamento"'
  $kpi.Range('F14').Formula = '=G5&" pendentes | "&C8&" aguardando cliente"'
  $kpi.Range('F15').Formula = '=TEXT(E8,"0%")&" de conclusão do plano"'
  $kpi.Range('A19:H19').Merge()
  $kpi.Range('A19').Value2 = 'Critério: indicadores calculados diretamente sobre as linhas 4 a 85 da aba Plano de Testes.'
  $kpi.Range('A19:H19').Font.Color = 8421504
  $kpi.Range('A19:H19').Font.Italic = $true

  $kpi.Range('A12:D12').Interior.Color = $yellow
  $kpi.Range('A12:D12').Font.Bold = $true
  $kpi.Range('A12:D16').Borders.LineStyle = 1
  $kpi.Range('F12:H15').Borders.LineStyle = 1
  $kpi.Columns('A:H').ColumnWidth = 18
  $kpi.Rows('1:19').RowHeight = 24
  $kpi.Rows('1:1').RowHeight = 32
  $kpi.Rows('4:5').RowHeight = 28
  $kpi.Rows('7:8').RowHeight = 28
  $kpi.Range('A1:H19').Font.Name = 'Arial'
  $kpi.Activate()
  $excel.ActiveWindow.DisplayGridlines = $false

  $sheet.Activate()
  $sheet.Range('A4:L85').AutoFilter()
  $sheet.Range('A4').Select()
  $excel.ActiveWindow.FreezePanes = $true
  $sheet.Rows('3:3').Font.Bold = $true
  $sheet.Rows('3:3').Interior.Color = $yellow
  $sheet.Rows('3:3').Font.Color = $black
  $sheet.Columns('A').ColumnWidth = 7
  $sheet.Columns('B').ColumnWidth = 36
  $sheet.Columns('C:E').ColumnWidth = 14
  $sheet.Columns('F').ColumnWidth = 17
  $sheet.Columns('G').ColumnWidth = 20
  $sheet.Columns('H').ColumnWidth = 48
  $sheet.Columns('I').ColumnWidth = 30
  $sheet.Columns('J:K').ColumnWidth = 15
  $sheet.Columns('L').ColumnWidth = 18
  $sheet.Range('H4:I85').WrapText = $true
  $sheet.Range('A1:L85').Font.Name = 'Arial'
  $sheet.Range('A1:L1').Font.Bold = $true
  $sheet.Range('A1:L1').Font.Size = 14
  $sheet.Range('A1:L1').Interior.Color = $black
  $sheet.Range('A1:L1').Font.Color = $yellow
  $sheet.Range('A3:L85').Borders.LineStyle = 1
  $sheet.Range('A3:L85').Borders.Color = 12632256
  $book.Save()
  $book.Close($true)
  Write-Output "Criada: $target"
}
finally {
  $excel.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
}
#20170130 - PSv5 - Tycoon Paradise: Server Update Script by Sweet T 
#List servers in array

$serverList = @("TP1", "TP2", "TP3", "NE1", "CP1")

#Kill Servers
foreach ($name in $serverList) {
    taskkill /FI "Windowtitle eq $name"
    Get-Process | where {$_.mainwindowtitle -match $name} | Wait-Process}

#Download Latest Build
$RCTDownload = Invoke-WebRequest "https://openrct2.org/downloads/develop/latest" | select -ExpandProperty Links | select href | Select-String -InputObject {$_} -Pattern "windows-x64.zip"
$RCTDownload | Set-Content E:\_temp\link.txt
(Get-Content E:\_temp\link.txt).Replace('@{href=','') | Set-Content E:\_temp\link.txt
(Get-Content E:\_temp\link.txt).Replace('}','') | Set-Content E:\_temp\link.txt
$URL = (Get-Content E:\_temp\link.txt)
Invoke-webrequest -uri $URL -OutFile E:\_temp\latest.zip

#Unzip Build
Expand-Archive E:\_temp\latest.zip -DestinationPath E:\_Portable -force

#Copy Latest Autosave and launch server
foreach ($name in $serverList) {
Start-Sleep -Seconds 10
gci E:\$name\save | sort LastWriteTime -desc | select -first 1 | cpi -dest E:\$name\$name.sv6
Start-Process E:\$name\$name.bat}
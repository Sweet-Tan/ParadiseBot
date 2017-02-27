#20170130 - PSv5 - Tycoon Paradise: Server Update Script by Sweet T 

param ([string] $server)

#Kill Servers
taskkill /FI "Windowtitle eq $server"
Get-Process | where {$_.mainwindowtitle -match $server} | Wait-Process

#Download File
$URL = (Get-Content E:\_temp\$server.txt)
Invoke-webrequest -uri $URL -OutFile E:\_temp\$server.tmp

#Extract if Zip
$ext = $URL.Substring($URL.Length -3, 3)
if ($Ext.Equals("zip"))
    {Expand-Archive E:\_temp\$server.tmp -DestinationPath E:\_temp\$server.tmp -force}

#Copy and start server
cpi E:\_temp\$server.tmp E:\$server\$server.sv6
Start-Sleep -Seconds 10
Start-Process E:\$server\$server.bat
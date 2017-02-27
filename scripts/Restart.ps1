#20170130 - PSv5 - Tycoon Paradise: Server Restart Script by Sweet T 
#Get Parameter
param ([string] $server)

taskkill /FI "Windowtitle eq $server"
Get-Process | where {$_.mainwindowtitle -match $server} | Wait-Process
gci E:\$server\save | sort LastWriteTime -desc | select -first 1 | cpi -dest E:\$server\$server.sv6
Start-Process E:\$server\$server.bat

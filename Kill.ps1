#20170130 - PSv5 - Tycoon Paradise: Server Restart Script by Sweet T 
param ([string] $server)

taskkill /FI "Windowtitle eq $server"
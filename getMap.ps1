#20170130 - PSv5 - Tycoon Paradise
param ([string] $server)

gci E:\$server\save | sort LastWriteTime -desc | select -first 1 | cpi -dest E:\_temp\$server.sv6
#20170130 - PSv5 - Tycoon Paradise
param ([string] $server)

gci E:\$server\chatlogs | sort LastWriteTime -desc | select -first 1 | cpi -dest E:\_temp\chatlog.txt
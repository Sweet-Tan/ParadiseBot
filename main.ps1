param (
[string]$command,
[string]$server
)


$path = ((Get-Content .\config.json | ConvertFrom-Json).path) -replace ".{1}$"
$tempPath = $path + "\_paradisebot\temp"

If ($command -eq "update"){
	$serverList = ((Get-Content .\config.json | ConvertFrom-Json).serverList)
	
    #Kill Servers; Needs to pull servers from json
	foreach ($server in $serverList) {
		taskkill /FI "Windowtitle eq $server"
		Get-Process | where {$_.mainwindowtitle -match $server} | Wait-Process}

	#Download Latest Build
	$RCTDownload = Invoke-WebRequest "https://openrct2.org/downloads/develop/latest" | select -ExpandProperty Links | select href | Select-String -InputObject {$_} -Pattern "windows-x64.zip"
	$RCTDownload | Set-Content $temppath\link.txt
	(Get-Content $temppath\link.txt).Replace('@{href=','') | Set-Content $temppath\link.txt
	(Get-Content $temppath\link.txt).Replace('}','') | Set-Content $temppath\link.txt
	$URL = (Get-Content $temppath\link.txt)
	Invoke-webrequest -uri $URL -OutFile $temppath\latest.zip

	#Unzip Build
	Expand-Archive $temppath\latest.zip -DestinationPath $path\_Portable -force

	#Copy Latest Autosave and launch server
	foreach ($server in $serverList) {
	Start-Sleep -Seconds 10
	gci $path\$server\save | sort LastWriteTime -desc | select -first 1 | cpi -dest $path\$server\$server.sv6
	Start-Process $path\$server\$server.bat}
}

If ($command -eq "restart"){
	taskkill /FI "Windowtitle eq $server"
	Get-Process | where {$_.mainwindowtitle -match $server} | Wait-Process
	gci $path\$server\save | sort LastWriteTime -desc | select -first 1 | cpi -dest $path\$server\$server.sv6
	Start-Process $path\$server\$server.bat
}

If ($command -eq "load"){
	taskkill /FI "Windowtitle eq $server"
	Get-Process | where {$_.mainwindowtitle -match $server} | Wait-Process

	$URL = (Get-Content $temppath\$server.txt)
	Invoke-webrequest -uri $URL -OutFile $temppath\$server.tmp

	$ext = $URL.Substring($URL.Length -3, 3)
	If ($Ext.Equals("zip")){
        Move-Item $tempPath\$server.tmp -Destination $tempPath\$server.zip
		Expand-Archive $temppath\$server.zip -DestinationPath $temppath\$server -force
        gci $temppath\$server | where {$_.Extension -eq ".sv6"} | select -first 1 | Move-Item -Destination $tempPath\$server.tmp
	}

	cpi $temppath\$server.tmp $path\$server\$server.sv6
	Start-Sleep -Seconds 10
	Start-Process $path\$server\$server.bat
}

If ($command -eq "kill"){
	taskkill /FI "Windowtitle eq $server"
}

If ($command -eq "autosave"){
	gci $path\$server\save | sort LastWriteTime -desc | select -first 1 | cpi -dest $temppath\$server.sv6
}

If ($command -eq "chatlog"){
    echo Running Chatlog
	gci $path\$server\chatlogs | sort LastWriteTime -desc | select -first 1 | cpi -dest $temppath\${server}chatlog.txt
    echo $path\$server\chatlogs
}
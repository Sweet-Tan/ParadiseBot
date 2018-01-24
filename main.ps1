param (
[string]$command,
[string]$server
)


$path = ((Get-Content .\config.json | ConvertFrom-Json).path) -replace ".{1}$"
$tempPath = $path + "\_paradisebot\temp"

If ($command -eq "update"){
	$serverList = ((Get-Content .\config.json | ConvertFrom-Json).serverList)
    If (!$server) {$server = "latest"}

    #Download Build
	$RCTDownload = Invoke-WebRequest "https://openrct2.org/downloads/develop/${server}" | select -ExpandProperty Links | select href | Select-String -InputObject {$_} -Pattern "windows-x64.zip"
	$RCTDownload | Set-Content $temppath\link.txt
	(Get-Content $temppath\link.txt).Replace('@{href=','') | Set-Content $temppath\link.txt
	(Get-Content $temppath\link.txt).Replace('}','') | Set-Content $temppath\link.txt
	$URL = (Get-Content $temppath\link.txt)
	Invoke-webrequest -uri $URL -OutFile $temppath\build.zip

	#Unzip Build
	Expand-Archive $temppath\build.zip -DestinationPath $tempPath\build
	
	#Check if file exists
    If (Test-Path "$tempPath\build\openrct2.com"){

        #Kill Servers
	    foreach ($server in $serverList) {
	    taskkill /FI "Windowtitle eq $server"
	    Get-Process | where {$_.mainwindowtitle -match $server} | Wait-Process}

	    #Copy file to production
	    Copy-Item $tempPath\build\* $path\_Portable -force

	    #Copy Latest Autosave and launch server
	    foreach ($server in $serverList) {
	    Start-Sleep -Seconds 10
	    gci $path\$server\save\autosave | sort LastWriteTime -desc | select -first 1 | cpi -dest $path\$server\$server.sv6
	    Start-Process $path\$server\$server.bat}
    }
    Remove-Item $tempPath\build -Recurse
}

If ($command -eq "restart"){
	taskkill /FI "Windowtitle eq $server"
	Get-Process | where {$_.mainwindowtitle -match $server} | Wait-Process
	gci $path\$server\save\autosave | sort LastWriteTime -desc | select -first 1 | cpi -dest $path\$server\$server.sv6
	Start-Process $path\$server\$server.bat
}

If ($command -eq "load"){
	taskkill /FI "Windowtitle eq $server"
	Get-Process | where {$_.mainwindowtitle -match $server} | Wait-Process

	$URL = (Get-Content $temppath\$server.txt)
	Invoke-webrequest -uri $URL -OutFile $temppath\$server.tmp

	$ext = $URL.Substring($URL.Length -3, 3)
	If ($Ext.Equals("zip")){
		Expand-Archive $temppath\$server.tmp -DestinationPath $temppath\$server.tmp -force
	}

	cpi $temppath\$server.tmp $path\$server\$server.sv6
	Start-Sleep -Seconds 10
	Start-Process $path\$server\$server.bat
}

If ($command -eq "kill"){
	taskkill /FI "Windowtitle eq $server"
}

If ($command -eq "autosave"){
	gci $path\$server\save\autosave | sort LastWriteTime -desc | select -first 1 | cpi -dest $temppath\$server.sv6
}

If ($command -eq "chatlog"){
	gci $path\$server\chatlogs | sort LastWriteTime -desc | select -first 1 | cpi -dest $temppath\${server}chatlog.txt
}

If ($command -eq "serverlog"){
	gci $path\$server\serverlogs -Recurse | sort LastWriteTime -desc | select -first 1 | cpi -dest $temppath\${server}serverlog.txt
}
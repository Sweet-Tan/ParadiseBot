//ParadiseBot1.3 - Server Control Bot
//For Tycoon Paradise by Sweet T
var Discord = require('discord.js');
var client = new Discord.Client();
var Auth = require('./token.json');
var exec = require('child_process').exec;
var prefix = '!';
var fs = require('fs');
var datetime = new Date();

client.on('message', msg => {
	if (msg.channel.name === 'security_shack') {
		if (msg.content === (prefix + 'ping')) {
			msg.channel.sendMessage('pong!'); 
		}
		if (msg.content === (prefix + 'ding')) {
			msg.channel.sendMessage('dong!'); 
		}
		if (msg.content === ('!help')) {
			msg.channel.sendMessage('--Paradise Bot v1.3-- \n \n Server Names: TP1, TP2, TP3, CP1, NE1 \n \n `!help` - List available commands \n `!ping` - Pings the Paradise Bot \n `!ding` - A less mature ping \n \n `!update` - Automatically kills, updates, and restarts all servers \n `!(name)autosave` - Gets the latest autosave from the specified server, stamped at time of retrieval \n `!(name)chatlog` - Gets the most recent chatlog from the specified server \n `!(name)kill` - Stops the specified server \n `!(name)load` - Starts the specified server with the attached save file, .zip or .sv6 \n `!(name)restart` - Stops and starts the specified server');
		}
		if (msg.content === ('!update')) {
			msg.channel.sendMessage('Updating servers... This takes no longer than 1 minute...');
			exec('powershell.exe E:\\_discord\\scripts\\RCTUpdate.ps1');
		}
		if ((msg.content.startsWith === (prefix)) || (msg.content.endsWith ('restart'))) {
			server = msg.content.substring(1,4);
			msg.channel.sendMessage('Sending `restart` to '+ server );
			exec('powershell.exe E:\\_discord\\scripts\\restart ' + server );
		}
		if ((msg.content.startsWith === (prefix)) || (msg.content.endsWith ('kill'))) {
			server = msg.content.substring(1,4);
			msg.channel.sendMessage('Sending `kill` to '+ server );
			exec('powershell.exe E:\\_discord\\scripts\\kill.ps1 ' + server );
		}
		if ((msg.content.startsWith === (prefix)) || (msg.content.endsWith ('chatlog'))) {
			server = msg.content.substring(1,4);
			exec('powershell.exe E:\\_discord\\scripts\\chatlog.ps1 ' + server );
			msg.channel.sendMessage('Getting '+server+ ' most recent chatlog...');
			setTimeout(function() { msg.channel.sendFile('E:\\_temp\\chatlog.txt',server+'chatlog.txt'); },5000);
		}
		if ((msg.content.startsWith === (prefix)) || (msg.content.endsWith ('load'))) {
			server = msg.content.substring(1,4);		
			if (msg.attachments.first() != null ) {
				msg.channel.sendMessage('Uploading file to ' + server + '...');
				fs.writeFile('E:\\_temp\\'+server+'.txt', msg.attachments.first().url);
				setTimeout(function() { exec('powershell.exe E:\\_discord\\scripts\\loadMap.ps1 ' + server ); },10000);
			}
			else {msg.channel.sendMessage('No attachment detected...')
			}		
		}
		if ((msg.content.startsWith === (prefix)) || (msg.content.endsWith ('autosave'))) {
			server = msg.content.substring(1,4);
			exec('powershell.exe E:\\_discord\\scripts\\getMap.ps1 ' + server );
			msg.channel.sendMessage('Getting '+server+ ' most recent autosave...');
			setTimeout(function() { msg.channel.sendFile('E:\\_temp\\' +server+'.sv6',server+'_' + datetime + '.sv6'); },10000);
		}
	}
});

client.on('ready', () => {
  console.log('I am ready!');
});

client.login(Auth);
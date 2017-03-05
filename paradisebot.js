var fs = require('fs');
var config = require('./config.json');
var paradisePath = config.path + '\\_paradisebot\\';
var tempPath = paradisePath + 'temp\\';
var serverList = config.serverList;
var prefix = config.prefix;
var Discord = require('discord.js');
var client = new Discord.Client();
var exec = require('child_process').exec;

client.on('message', msg => {
    if (msg.content === (prefix + 'ping')) {
        msg.channel.sendMessage('pong!');
    }
    else if (msg.content === (prefix + 'ding')) {
        msg.channel.sendMessage('dong!');
    }
    else if (msg.content === (prefix + 'help')) {
        msg.channel.sendMessage('--Paradise Bot v1.3-- \n \n Server Names: ' + serverList + ' \n \n `!help` - List available commands \n `!ping` - Pings the Paradise Bot \n `!ding` - A less mature ping \n \n `!update` - Automatically kills, updates, and restarts all servers \n `!(name)autosave` - Gets the latest autosave from the specified server, stamped at time of retrieval \n `!(name)chatlog` - Gets the most recent chatlog from the specified server \n `!(name)kill` - Stops the specified server \n `!(name)load` - Starts the specified server with the attached save file, .zip or .sv6 \n `!(name)restart` - Stops and starts the specified server');
    }
    //Update
    else if (msg.content === (prefix + 'update')) {
        command = 'update';
        msg.channel.sendMessage('Updating servers... This takes no longer than 1 minute...');
        exec('powershell.exe ' + paradisePath + 'main.ps1 ' + command);
    }
    //Restart
    else if ((msg.content.startsWith(prefix)) && (msg.content.endsWith('restart'))) {
        server = msg.content.substring(1, 4);
        if ((serverList.indexOf(server)) !== -1) {
            command = 'restart';
            msg.channel.sendMessage('Sending `restart` to ' + server);
            exec('powershell.exe ' + paradisePath + 'main.ps1 ' + command + ' ' + server);
        }
    }
    //Kill
    else if ((msg.content.startsWith(prefix)) && (msg.content.endsWith('kill'))) {
        server = msg.content.substring(1, 4);
        if ((serverList.indexOf(server)) !== -1) {
            command = 'kill';
            msg.channel.sendMessage('Sending `kill` to ' + server);
            exec('powershell.exe ' + paradisePath + 'main.ps1 ' + command + ' ' + server);
        }
    }
    //Chatlog
    else if ((msg.content.startsWith(prefix)) && (msg.content.endsWith('chatlog'))) {
        server = msg.content.substring(1, 4);
        if ((serverList.indexOf(server)) !== -1) {
            command = 'chatlog';
            exec('powershell.exe ' + paradisePath + 'main.ps1 ' + command + ' +' + server);
            msg.channel.sendMessage('Getting ' + server + ' most recent chatlog...');
            var datetime = new Date();
            setTimeout(function () { msg.channel.sendFile(tempPath + server + 'chatlog.txt', server + '_' + datetime + ' chatlog.txt'); }, 5000);
        }
    }
    //Load
    else if ((msg.content.startsWith(prefix)) && (msg.content.endsWith('load'))) {
        server = msg.content.substring(1, 4);
        if ((serverList.indexOf(server)) !== -1) {
            if (msg.attachments.first() != null) {
                command = 'load';
                msg.channel.sendMessage('Uploading file to ' + server + '...');
                fs.writeFile(tempPath + server + '.txt', msg.attachments.first().url);
                setTimeout(function () { exec('powershell.exe ' + paradisePath + 'main.ps1 ' + command + ' ' + server); }, 10000);
            }
            else {msg.channel.sendMessage('No attachment detected...')}
        }
    }
    //Autosave
    else if ((msg.content.startsWith(prefix)) && (msg.content.endsWith('autosave'))) {
        server = msg.content.substring(1, 4);
        if ((serverList.indexOf(server)) !== -1) {
            command = 'autosave';
            exec('powershell.exe ' + paradisePath + 'main.ps1 ' + command + ' ' + server);
            msg.channel.sendMessage('Getting ' + server + ' most recent autosave...');
            var datetime = new Date();
            setTimeout(function () { msg.channel.sendFile(tempPath + server + '.sv6', server + '_' + datetime + '.sv6'); }, 5000);
        }
    }

    else if ((msg.content.startsWith(prefix)) && (msg.content.length > 1)) {
        msg.channel.sendMessage('Invalid Command, see `!help`');
    }
});

client.on('ready', () => {
    console.log('I am ready!');
});

client.login(config.token);
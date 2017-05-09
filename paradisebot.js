var config = require('./config.json');

var prefix = config.prefix;
var paradisePath = config.path + '\\_paradisebot\\';
var tempPath = paradisePath + 'temp\\';

var server = "";
var serverList = config.serverList;

//To be cleaned up at a later date
var permTP = config.permTP;
var permNE = config.permNE;
var permCP = config.permCP;
var permPM = config.permPM;


var Discord = require('discord.js');
var client = new Discord.Client();
var exec = require('child_process').exec;
var fs = require('fs');

client.on('message', msg => {
    if (msg.content.startsWith(prefix)) {
        //Diagnostic & Help
        if (msg.content === (prefix + 'ping')) {
            msg.channel.send('pong!');
        }
        else if (msg.content === (prefix + 'ding')) {
            msg.channel.send('dong!');
        }
		else if (msg.content === (prefix + 'bing')) {
            msg.channel.send('bong!');
        }
		else if (msg.content === (prefix + 'bong')) {
			msg.channel.send('https://www.youtube.com/watch?v=rATftJiWdkw');
		}
        else if (msg.content === (prefix + 'help')) {
            msg.channel.send('--Paradise Bot v1.4-- \n \n Server Names: ' + serverList + ' \n \n `!help` - List available commands \n `!ping` - Pings the Paradise Bot \n `!ding` - A less mature ping \n \n `!update` - Automatically kills, updates, and restarts all servers \n `!(name)autosave` - Gets the latest autosave from the specified server, stamped at time of retrieval \n `!(name)chatlog` - Gets the most recent chatlog from the specified server \n `!(name)kill` - Stops the specified server \n `!(name)load` - Starts the specified server with the attached save file, .zip or .sv6 \n `!(name)restart` - Stops and starts the specified server');
        }
        
        //Update
        else if (msg.channel.name === 'security_shack') {
            if (msg.content === (prefix + 'update')) {
                command = 'update';
                msg.channel.send('Updating servers... This takes approximately 1 minute...');
                exec('powershell.exe ' + paradisePath + 'main.ps1 ' + command);
            }
        }
        //Begin server specific commands

        //Restart      
        else if ((msg.content.startsWith(prefix)) && (msg.content.endsWith('restart'))) {
            server = msg.content.substring(1, 4);
            if (permCheck(server, msg.author.id) == true) {
                command = 'restart';
                msg.channel.send('Sending `restart` to ' + server);
                exec('powershell.exe ' + paradisePath + 'main.ps1 ' + command + ' ' + server);
            }
            else msg.channel.send('Invalid server name or permissions');
        }
        //Kill
        else if ((msg.content.startsWith(prefix)) && (msg.content.endsWith('kill'))) {
            server = msg.content.substring(1, 4);
            if (permCheck(server, msg.author.id) == true) {
                command = 'kill';
                msg.channel.send('Sending `kill` to ' + server);
                exec('powershell.exe ' + paradisePath + 'main.ps1 ' + command + ' ' + server);
            }
            else msg.channel.send('Invalid server name or permissions');
        }
        //Chatlog
        else if ((msg.content.startsWith(prefix)) && (msg.content.endsWith('chatlog'))) {
            server = msg.content.substring(1, 4);
            if (permCheck(server, msg.author.id) == true) {
                command = 'chatlog';
                exec('powershell.exe ' + paradisePath + 'main.ps1 ' + command + ' ' + server);
                msg.channel.send('Getting ' + server + ' most recent chatlog...');
                var datetime = new Date();
                setTimeout(function () { msg.channel.sendFile(tempPath + server + 'chatlog.txt', server + '_' + datetime + ' chatlog.txt'); }, 5000);
            }
            else msg.channel.send('Invalid server name or permissions');
        }
        //Load
        else if ((msg.content.startsWith(prefix)) && (msg.content.endsWith('load'))) {
            server = msg.content.substring(1, 4);
            if (permCheck(server, msg.author.id) == true) {
                if (msg.attachments.first() != null) {
                    command = 'load';
                    msg.channel.send('Uploading file to ' + server + '...');
                    fs.writeFile(tempPath + server + '.txt', msg.attachments.first().url);
                    setTimeout(function () { exec('powershell.exe ' + paradisePath + 'main.ps1 ' + command + ' ' + server); }, 10000);
                }
                else { msg.channel.send('No attachment detected...') }
            }
            else msg.channel.send('Invalid server name or permissions');
        }
        //Autosave
        else if ((msg.content.startsWith(prefix)) && (msg.content.endsWith('autosave'))) {
            server = msg.content.substring(1, 4);
            if (permCheck(server, msg.author.id) == true) {
                command = 'autosave';
                exec('powershell.exe ' + paradisePath + 'main.ps1 ' + command + ' ' + server);
                msg.channel.send('Getting ' + server + ' most recent autosave...');
                var datetime = new Date();
                setTimeout(function () { msg.channel.sendFile(tempPath + server + '.sv6', server + '_' + datetime + '.sv6'); }, 5000);
            }
            else msg.channel.send('Invalid server name or permissions');
        }

        else if ((msg.content.startsWith(prefix)) && (msg.content.length > 1)) {
            msg.channel.send('Invalid Command, see `!help`');
        }
    }
});

client.on('ready', () => {
    console.log('I am ready!');
});

client.login(config.token);

//To be cleaned up at a later date
function permCheck(server, authorID) {
    if ((serverList.indexOf(server)) !== -1) {

        if (((server.substring(0, 2)) == 'TP') && ((permTP.indexOf(authorID)) !== -1)) {
            return true
        }
        else if (((server.substring(0, 2)) == 'NE') && ((permNE.indexOf(authorID)) !== -1)) {
            return true
        }
        else if (((server.substring(0, 2)) == 'CP') && ((permCP.indexOf(authorID)) !== -1)) {
            return true
        }
        else if (((server.substring(0, 2)) == 'PM') && ((permPM.indexOf(authorID)) !== -1)) {
            return true
        }
    }
};
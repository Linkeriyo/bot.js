const Discord = require('discord.js');
const client = new Discord.Client();
const data = require('./data.json');
const token = data.token;
const prefix = data.prefix;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', msg => {
    if (msg.content.startsWith(prefix)) {
        let command = msg.content.slice(prefix.length);
        let args = command.split(' ');
        
        switch (args[0]) {
            case 'report':
                let username = args[1], reason = command.slice(args[0].length + args[1].length + 2);
                let reports = require("./reports.json");
                reports.reports.push({
                    reportID: (reports.lastID + 1), username: username, reason: reason
                });

                reports.lastID = reports.reports[reports.reports.length - 1].reportID;

                let fs = require('fs');
                fs.writeFile('reports.json', JSON.stringify(reports), function (err) {
                    if (err) return console.log(err);
                    else msg.reply(`${username} reportado con ID: ${reports.lastID}`);
                });
        }
    }
});

client.login(token);
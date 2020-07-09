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
        console.log(command);
    }
});

client.login(token);
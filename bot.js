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

        switch (args[0].toLowerCase()) {
            case 'report':
                let username = args[1], reason = command.slice(args[0].length + args[1].length + 2);
                let reports = require("./reports.json");
                reports.reports.push({
                    reportID: (reports.lastID + 1),
                    pending: true,
                    username: username,
                    reason: reason
                });

                reports.lastID = reports.reports[reports.reports.length - 1].reportID;

                let fs = require('fs');
                fs.writeFile('reports.json', JSON.stringify(reports), function (err) {
                    if (err) return console.log(err);
                    else msg.reply(`${username} reportado con ID: ${reports.lastID}`);
                });
                break;

            case 'review':
                if (args[1] === 'done') {
                    let id = args[2];
                    let reports = require("./reports.json");
                    let found = false;
                    reports.reports.forEach(report => {
                        if (report.reportID == id && report.pending) {
                            found = true;
                            let fs = require('fs');
                            fs.writeFile('reports.json', JSON.stringify(reports), function (err) {
                                if (err) return console.log(err);
                                else msg.reply(`reporte con ID: ${id} marcado como revisado`);
                            });
                        }
                    });

                    if (!found) {
                        msg.reply(`no se ha encontrado ningún reporte activo con ID: ${id}`);
                    }
                } else {
                    if (msg.channel.guild != null) {
                        if (msg.member.hasPermission("ADMINISTRATOR")) {
                            msg.reply('check dm');
                            let reports = require("./reports.json");
                            let toSend = '';
                            let pendingReports = 0;

                            reports.reports.forEach(report => {
                                if (report.pending) {
                                    pendingReports += 1;
                                    toSend = toSend.concat(`ID: ${report.reportID}\nname: ${report.username}\nreason: ${report.reason}\n\n`);
                                }
                            });

                            if (pendingReports >= 0) {
                                if (pendingReports != 1) {
                                    msg.member.user.send(`hay ${pendingReports} reportes pendientes\n\n` + toSend);
                                } else {
                                    msg.member.user.send(`hay un reporte pendiente\n\n` + toSend);
                                }

                            } else {
                                msg.member.user.send('no hay reportes pendientes :D');
                            }
                        } else {
                            msg.reply('debes ser administrador del servidor para usar este comando');
                        }
                    } else {
                        msg.reply('este comando se debe usar en un servidor');
                    }
                }
                break;
            case 'playo':
                playo = msg.mentions[0];
                msg.channel.send(playo + ', eres un playo.');
                break;
        }
    }
});

client.login(token);
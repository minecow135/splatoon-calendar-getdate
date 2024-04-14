const mysql = require('mysql2');
const cron = require('node-cron');
const { Client, Events, GatewayIntentBits, AttachmentBuilder, EmbedBuilder } = require('discord.js');

const sql = require('../db.js')
const discordconfig = require('../discordconfig.js');
const token = discordconfig.botToken

function discordSend(cronEnabled, cronTime) {
    sqlconnection = mysql.createConnection(sql);

    sqlconnection.connect((err) => {
        if (err) throw err;
        console.log('MySQL connected');
    });

    eventType = "splatfest";
    var sqlGetData = 'SELECT `id`, `title`,`description`, `startDate`, `created`, `duration`, `uid`  FROM `splatCal` WHERE `event` = ?';
    sqlconnection.query(sqlGetData, [ eventType ], function (error, events) {
        if (error) throw error;
        console.log(events)

        // Create a new client instance
        const client = new Client({ intents: [GatewayIntentBits.Guilds] });
        
        client.once(Events.ClientReady, readyClient => {
            // When the client is ready, run this code (only once).
            // The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
            // It makes some properties non-nullable.
            console.log(`Ready! Logged in as ${readyClient.user.tag}`);

            const desc = events[0].description;
            const link = "https://awdawd.eu/"
            const fields = [
                { name: 'Inline field title', value: 'Some\n\n value hereaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', inline: true },
                { name: 'Inline field title', value: 'Some vaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalue here\nawd', inline: true },
                { name: 'Inline field title', value: 'Some vaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalue here\nawd', inline: true },
            ];
            // .addFields(fields)

            // inside a command, event listener, etc.
            const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Splatfest')
            .setURL(link)
            .setDescription(desc)
            .setImage('https://i.imgur.com/AfFp7pu.png')

            // inside a command, event listener, etc.
            const exampleEmbed2 = new EmbedBuilder()
            .setURL(link)
            .setImage('https://i.imgur.com/AfFp7pu.png')

            // client.channels.cache.get(discordconfig.channelId).send({ embeds: [ exampleEmbed, exampleEmbed2, exampleEmbed2, exampleEmbed2 ] });
        });
        if (cronEnabled) {
            cron.schedule(cronTime, () => {
                client.channels.cache.get(discordconfig.channelId).send('Hello here!');
            });
        }

        // Log in to Discord with your client's token
        client.login(token);
        
    });
};



module.exports = discordSend;
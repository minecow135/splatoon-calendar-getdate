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
    var sqlGetData = 'SELECT `id`, `title`, `startDate`, `duration`  FROM `splatCal` WHERE `event` = ?';
    sqlconnection.query(sqlGetData, [ eventType ], function (error, events) {
        if (error) throw error;
        if (events){
            var sqlGetCalDescData = 'SELECT descName.calId, descName.locationNum, descName.id AS nameId, descName.data AS nameData, descLocation.id AS locationId, descLocation.data AS locationData, descLink.id AS linkId, descLink.data AS linkData FROM descData AS descName LEFT JOIN descData AS descLocation ON descLocation.calId = descName.calId AND descLocation.dataTypeId = 2 AND descName.locationNum = descLocation.locationNum LEFT JOIN descData AS descLink ON descLink.calId = descName.calId AND descLink.dataTypeId = 3 AND descLink.locationNum = descLocation.locationNum WHERE descName.dataTypeId = 1 ORDER BY descName.locationNum';
            sqlconnection.query(sqlGetCalDescData, function (error, desc) {
                if (error) throw error;
                var sqlGetCalDescTeams = 'SELECT id, calId, locationNum, dataCalId, data FROM descData WHERE dataTypeId = 4;';
                sqlconnection.query(sqlGetCalDescTeams, function (error, teams) {
                    if (error) throw error;
                    let eventArr = [];
                    for (const event of events) {
                        let description = [];
                        for (const descItem of desc) {
                            if (descItem.calId === event.id) {
                                let teamsArr = []
                                for (const team of teams) {
                                    if (team.calId === event.id && team.locationNum === descItem.locationNum) {
                                        teamsArr.push(team)
                                    };
                                };
                                descItem.teams = teamsArr
                                description.push(descItem)
                            }
                        }
                        
                        let title = event.title;
                        let start = event.startDate
                        let duration = { days: event.duration };
                        
                        eventArr.push({ title, description, start, duration, });
                    }
                    console.log(eventArr[0].description[0]);

                    // Create a new client instance
                    const client = new Client({ intents: [GatewayIntentBits.Guilds] });
                    
                    client.once(Events.ClientReady, readyClient => {
                        // When the client is ready, run this code (only once).
                        // The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
                        // It makes some properties non-nullable.
                        console.log(`Ready! Logged in as ${readyClient.user.tag}`);

                        const title = "description";
                        const desc = "description";
                        const link = "https://awdawd.eu/"
                        const fields = [
                            { name: 'Inline field title', value: 'Some\n\n value hereaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', inline: true },
                            { name: 'Inline field title', value: 'Some vaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalue here\nawd', inline: true },
                            { name: 'Inline field title', value: 'Some vaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalue here\nawd', inline: true },
                        ];
                        // .addFields(fields)

                        const SplatCalEmbed = [
                            {
                                color: 0x0099ff,
                                title: title,
                                url: link,
                                description: desc,
                                fields: [
                                    {
                                        name: 'Regular field title',
                                        value: 'Some value here',
                                    },
                                    {
                                        name: '\u200b',
                                        value: '\u200b',
                                        inline: false,
                                    },
                                    {
                                        name: 'Inline field title',
                                        value: 'Some value here',
                                        inline: true,
                                    },
                                    {
                                        name: 'Inline field title',
                                        value: 'Some value here',
                                        inline: true,
                                    },
                                    {
                                        name: 'Inline field title',
                                        value: 'Some value here',
                                        inline: true,
                                    },
                                ],
                                image: {
                                    url: 'https://i.imgur.com/AfFp7pu.png',
                                },
                            },
                            {
                                url: link,
                                image: {
                                    url: 'https://i.imgur.com/AfFp7pu.png',
                                },
                            },
                            {
                                url: link,
                                image: {
                                    url: 'https://i.imgur.com/AfFp7pu.png',
                                },
                            },
                        ];

                    //    client.channels.cache.get(discordconfig.channelId).send({ embeds: SplatCalEmbed });
                    });
                    if (cronEnabled) {
                        cron.schedule(cronTime, () => {
                            client.channels.cache.get(discordconfig.channelId).send('Hello here!');
                        });
                    }

                    // Log in to Discord with your client's token
                    client.login(token);
                });
            });
        };
    });
};



module.exports = discordSend;
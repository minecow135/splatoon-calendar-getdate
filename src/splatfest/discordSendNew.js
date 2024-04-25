const mysql = require('mysql2');
const { Client, Events, GatewayIntentBits } = require('discord.js');

sql = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

const token = process.env.botToken;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
    // When the client is ready, run this code (only once).
    // The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
    // It makes some properties non-nullable.
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

sqlconnection = mysql.createConnection(sql);

sqlconnection.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected');
});

// Log in to Discord with your client's token
client.login(token);

function until(conditionFunction) {

    const poll = resolve => {
        if(conditionFunction()) resolve();
        else setTimeout(_ => poll(resolve), 500);
    }
    return new Promise(poll);
}

async function sendMsg(SplatCalEmbed, id) {
    await until(_ => client.readyTimestamp);
    for (const discordChannel of process.env.splatfestNewChannel.split(",").map(s => s.trim())) {
        if (discordChannel) {
            var sqlGetCalData = "SELECT COUNT(`id`) AS `count` FROM `discordSent` WHERE `channelId` = ? AND `calId` = ? AND `messageType` = 1";
            sqlconnection.query(sqlGetCalData, [ discordChannel, id ], function (error, DiscordSent ) {
                if (DiscordSent[0].count == 0) {
                    if (client.channels.cache.get(discordChannel).send({ embeds: SplatCalEmbed })) {
                        var sqlGetCalData = "INSERT INTO `discordSent` (`channelId`, `calId`, `messageType`) VALUES (?, ?, '1')";
                        sqlconnection.query(sqlGetCalData, [ discordChannel, id ], function (error, events) {
                            if (error) throw error;
                            console.log("Message sent!", id, "in:", discordChannel);
                        });
                    };
                };
            });
        };
    };
};

async function discordSend() {
    eventType = "splatfest";
    var sqlGetData = 'SELECT `splatCal`.`id`, `splatCal`.`title`, `splatCal`.`startDate`, `splatCal`.`endDate` FROM `splatCal` LEFT JOIN `eventTypes` ON `splatCal`.`eventId` = `eventTypes`.`id` WHERE `eventTypes`.`event` =  ?';
    sqlconnection.query(sqlGetData, [ eventType ], function (error, events) {
        if (error) throw error;
        if (events && events.length > 0) {
            var sqlGetCalDescData = 'SELECT descName.calId, descName.locationNum, descName.id AS nameId, descName.data AS nameData, descLocation.id AS locationId, descLocation.data AS locationData, descLink.id AS linkId, descLink.data AS linkData, descImg.id AS imgId, descImg.data AS imgData FROM descData AS descName LEFT JOIN descData AS descLocation ON descLocation.calId = descName.calId AND descLocation.dataTypeId = 2 AND descName.locationNum = descLocation.locationNum LEFT JOIN descData AS descLink ON descLink.calId = descName.calId AND descLink.dataTypeId = 3 AND descLink.locationNum = descLocation.locationNum LEFT JOIN descData AS descImg ON descImg.calId = descName.calId AND descImg.dataTypeId = 5 AND descImg.locationNum = descLocation.locationNum WHERE descName.dataTypeId = 1 ORDER BY descName.locationNum';
            sqlconnection.query(sqlGetCalDescData, function (error, desc) {
                if (error) throw error;
                if (desc && desc.length > 0) {
                    var sqlGetCalDescTeams = 'SELECT id, calId, locationNum, dataCalId, data FROM descData WHERE dataTypeId = 4;';
                    sqlconnection.query(sqlGetCalDescTeams, function (error, teams) {
                        if (error) throw error;
                        if (teams && teams.length > 0) {
                            let eventArr = [];
                            for (const event of events) {
                                let description = [];
                                for (const descItem of desc) {
                                    if (descItem.calId === event.id) {
                                        let teamsArr = [];
                                        for (const team of teams) {
                                            if (team.calId === event.id && team.locationNum === descItem.locationNum) {
                                                teamsArr.push(team);
                                            };
                                        };
                                        descItem.teams = teamsArr;
                                        description.push(descItem);
                                    };
                                };

                                let id = event.id;
                                let title = event.title;
                                let start = event.startDate;
                                let end = event.endDate;

                                eventArr.push({ id, title, description, start, end, });
                            };
                            for (const event of eventArr) {
                                let fields = [];
                                for (const eventRegion of event.description) {
                                    eventHead = { name: eventRegion.nameData, value: eventRegion.locationData, inline: false };
                                    fields.push(eventHead);
                                    for (const team of eventRegion.teams) {
                                        eventData = { name: team.data, value: "", inline: true };
                                        fields.push(eventData);
                                    };
                                };

                                const description = "<t:" + Math.floor(new Date(event.start).getTime() / 1000) + ":f> - <t:" + Math.floor(new Date(event.end).getTime() / 1000) + ":f>";
                                const link = "https://splatoonwiki.org/w/index.php?title=Main_Page/Splatfest";

                                let count = 0;
                                let SplatCalEmbed = []
                                for (const item of event.description) {
                                    if (count === 0) {
                                        SplatCalEmbed.push ({
                                            color: 0x0099ff,
                                            title: event.title,
                                            url: link,
                                            description: description,
                                            fields: fields,
                                            image: {
                                                url: item.imgData,
                                            },
                                        });
                                    } else {
                                        SplatCalEmbed.push ({
                                            url: link,
                                            image: {
                                                url: item.imgData,
                                            },
                                        });
                                    };

                                    count ++;
                                };

                                sendMsg(SplatCalEmbed, event.id);
                            };
                        };
                    });
                };
            });
        } else {
            console.log("no new splatfests");
        };
    });
};

module.exports = discordSend;
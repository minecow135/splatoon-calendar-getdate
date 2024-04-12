const mysql = require('mysql2');
const cron = require('node-cron');
const { Client, Events, GatewayIntentBits } = require('discord.js');

const sql = require('../db.js')
const discordconfig = require('../discordconfig.js');
const token = discordconfig.botToken

function discordSend(cronTime) {


    // Create a new client instance
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });
    
    client.once(Events.ClientReady, readyClient => {
        // When the client is ready, run this code (only once).
        // The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
        // It makes some properties non-nullable.
        console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    });

    cron.schedule(cronTime, () => {
        client.channels.cache.get(discordconfig.channelId).send('Hello here!');
    });

    // Log in to Discord with your client's token
    client.login(token);
};



module.exports = discordSend;
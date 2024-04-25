const cron = require('node-cron');
const getData = require ("./getData.js");
const createIcs = require('./createIcs.js');
const discordSend = require('./discordSendNew.js');

async function splatfest() {
    // Run once at the start
    getData();
    createIcs();
    discordSend();

    cron.schedule('0 45 11 * * *', () => {
        getData();
    });

    cron.schedule('0 0 12 * * *', () => {
        discordSend();
        createIcs();
    });
};

module.exports = splatfest;
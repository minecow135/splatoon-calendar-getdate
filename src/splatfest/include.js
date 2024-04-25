const cron = require('node-cron');
const getData = require ("./getData.js");
const createIcs = require('./createIcs.js');
const discordSendNew = require('./discordSendNew.js');

async function splatfest() {
    // Run once at the start
    getData();
    createIcs();
    discordSendNew();

    cron.schedule('0 45 11 * * *', () => {
        getData();
    });

    cron.schedule('0 0 12 * * *', () => {
        discordSendNew();
        createIcs();
    });
};

module.exports = splatfest;
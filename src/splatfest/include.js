const cron = require('node-cron');
const getData = require ("./getData.js");
const createIcs = require('./createIcs.js');
const discordSendNew = require('./discordSendNew.js');
const discordSendWin = require('./discordSendWin.js');

async function splatfest() {
    // Run once at the start
    getData();
    createIcs();
    discordSendNew();
    discordSendWin();

    cron.schedule('0 45 1 * * *', () => {
        getData();
    });

    cron.schedule('0 0 2 * * *', () => {
        discordSendNew();
        discordSendWin();
        createIcs();
    });
};

module.exports = splatfest;
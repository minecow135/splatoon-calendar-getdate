const cron = require('node-cron');
const getData = require ("./src/getData.js");
const createIcs = require('./src/createIcs.js');
const discordSend = require('./src/discordSend.js');

// Run once at the start
getData()
createIcs()
discordSend()

cron.schedule('0 45 11 * * *', () => {
    getData()
});

cron.schedule('0 0 12 * * *', () => {
    discordSend()
    createIcs()
});
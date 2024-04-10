const cron = require('node-cron');

const getData = require ("./getData.js");
const createIcs = require('./createIcs.js');

// Run once at the start
getData()
createIcs()

cron.schedule('0 45 11 * * *', () => {
    getData()
});

cron.schedule('0 0 12 * * *', () => {
    createIcs()
});

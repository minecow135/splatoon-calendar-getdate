const cron = require('node-cron');

const getData = require ("./getData.js");
const createIcs = require('./createIcs.js');

sql = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
}

// Run once at the start
getData()
createIcs()

cron.schedule('0 45 11 * * *', () => {
    getData()
});

cron.schedule('0 0 12 * * *', () => {
    createIcs()
});


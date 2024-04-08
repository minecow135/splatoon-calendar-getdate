const cron = require('node-cron');

sql = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
}

// Run once at the start
require ("./getData.js");
require ("./createIcs.js");

cron.schedule('0 45 11 * * *', () => {
    require ("./getData.js");
});

cron.schedule('0 0 12 * * *', () => {
    require ("./createIcs.js");
});

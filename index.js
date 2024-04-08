const cron = require('node-cron');

cron.schedule('0 45 11 * * *', () => {
    require ("./getData.js");
});

cron.schedule('0 0 12 * * *', () => {
    require ("./createIcs.js");
});

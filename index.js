const cron = require('node-cron');

// Run once at the start
require ("./getData.js");
require ("./createIcs.js");

cron.schedule('0 45 11 * * *', () => {
    require ("./getData.js");
});

cron.schedule('0 0 12 * * *', () => {
    require ("./createIcs.js");
});

const mysql = require('mysql2');
const ics = require('ics');
const { writeFileSync } = require('fs');

// const sql = require('./db.js');
const sql = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}

function getMonthFromString(mon){
    return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
}

sqlconnection = mysql.createConnection(sql);

sqlconnection.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected');
});

eventType = "splatfest";
var sqlGetCalData = 'SELECT `id`, `title`,`description`, `startDate`, `created`, `duration`, `uid`  FROM `splatCal` WHERE `event` = ?';
sqlconnection.query(sqlGetCalData, [ eventType ], function (error, events) {
    if (error) throw error;
    if (events){
        let eventArr = []
        for (const event of events) {
            let title = event.title
            let description = event.description
            let busyStatus = 'FREE'
            let start = [ event.startDate.getFullYear(), event.startDate.getMonth()+1, event.startDate.getDate(), event.startDate.getHours(), event.startDate.getMinutes() ]
            let duration = { days: event.duration }
            let uid = event.uid
            let created = [ event.created.getFullYear(), event.created.getMonth()+1, event.created.getDate(), event.created.getHours(), event.created.getMinutes() ]

            eventArr.push({ title, description, busyStatus, start, duration, uid, created })
        }

        const { error, value } = ics.createEvents(eventArr)
        if (error) {
            console.log(error)
            return
        }

        console.log(value)
        
        writeFileSync(`${__dirname}/ics/splatfest.ics`, value)
    } else {
        console.log("no splatfests saved")
    }
});

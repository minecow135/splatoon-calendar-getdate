const axios = require('axios');
const { JSDOM } = require('jsdom');
const { nanoid } = require('nanoid');
const mysql = require('mysql2');

// const sql = require('./db.js')
const sql = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
}

function getMonthFromString(mon){
    return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
}

sqlconnection = mysql.createConnection(sql);

sqlconnection.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected');
});

axios.get("https://splatoonwiki.org/w/index.php?title=Main_Page/Splatfest").then(function (response) {
    // handle success
    let html = (new JSDOM(response.data));
    let dateAll = html.window.document.querySelectorAll(".splatfestTimer");
    let placeAll = html.window.document.querySelectorAll(".splatfest div > div > div.bubbleboxbg-lighter");
    let teamsAll = html.window.document.querySelectorAll(".splatfest div div > div.bubbleboxbg-darker > div > span > a");
    let teamsLinkAll = html.window.document.querySelectorAll(".splatfest div div > div.bubbleboxbg-darker > div > span > a");

    let date = dateAll[0].textContent;
    let descData = [];
    let count = 0;

    for (let team of teamsAll) {
        descData.push([placeAll[count].textContent, team.textContent, teamsLinkAll[count].getAttribute('href')]);
        count ++;
    };

    let description = "";
    for (const teams2 of descData) {
        if (description != "") {
            description += "\n\n"
        }
        description += teams2[0] + "\n" + teams2[1] + "\n" + "https://splatoonwiki.org" + teams2[2];
    };
   
    let parts = date.split(" ");

    let event = "splatfest";
    let title = "Splatfest";
    let startDate = new Date(Date.UTC(new Date().getFullYear(), getMonthFromString(parts[0])-1, parseInt(parts[1])));
    let created = new Date(Date.now());
    let duration = "2";
    let uid = nanoid() + "@splatfest.awdawd.eu";

    if (startDate != "Invalid Date") {
        var sqlGetDate = 'SELECT COUNT(id) AS `count` FROM `splatCal` WHERE `startDate` = ?'
        sqlconnection.query(sqlGetDate, [ startDate ], function (error, GetCount) {
            if (error) throw error;
            if (GetCount[0].count === 0) {   
                var sqlInsert = 'INSERT INTO `splatCal` (`event`, `title`, `description`, `startDate`, `created`, `duration`, `uid`) VALUES (?, ?, ?, ?, ?, ?, ?)';
                sqlconnection.query(sqlInsert, [ event, title, description, startDate, created, duration, uid ], function (error, insertResult) {
                    if (error) throw error;
                    //console.log(insertResult);
                });
            } else {
                console.log("already inserted")
            }
        });
    } else {
        console.log("No splatfest announced")
    };
});
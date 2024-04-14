const axios = require('axios');
const { JSDOM } = require('jsdom');
const { nanoid } = require('nanoid');
const mysql = require('mysql2');

const sql = require('../db.js');

function getMonthFromString(mon){
    return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
}

function getData() {
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
            let teams = []
            let name = "Splatfest"
            teamsDirty = team.textContent.split("vs.")
            teams = teamsDirty.map(s => s.trim());
            descData.push([
                name,
                placeAll[count].textContent,
                "https://splatoonwiki.org" + teamsLinkAll[count].getAttribute('href'),
                teams,
            ]);
            count ++;
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
                    var sqlInsert = 'INSERT INTO `splatCal` (`event`, `title`, `startDate`, `created`, `duration`, `uid`) VALUES (?, ?, ?, ?, ?, ?)';
                    sqlconnection.query(sqlInsert, [ event, title, startDate, created, duration, uid ], function (error, insertResult) {
                        if (error) throw error;
                        console.log("Splatfest Inserted");
                        let locationNum = 1;
                        for (const desc of descData) {
                            let descCount = 1
                            var sqlInsertDesc = 'INSERT INTO `descData` (`CalId`, `locationNum`, `dataCalId`, `DataTypeId`, `data`) VALUES (?, ?, ?, ?, ?)';
                            
                            sqlconnection.query(sqlInsertDesc, [ insertResult.insertId, locationNum, descCount, 1, desc[0] ], function (error, insertResult) {
                                if (error) throw error;
                                console.log("Name inserted")
                            });
                            descCount ++;

                            sqlconnection.query(sqlInsertDesc, [ insertResult.insertId, locationNum, descCount, 2, desc[1] ], function (error, insertResult) {
                                if (error) throw error;
                                console.log("location inserted")
                            });
                            descCount ++;

                            sqlconnection.query(sqlInsertDesc, [ insertResult.insertId, locationNum, descCount, 3, desc[2] ], function (error, insertResult) {
                                if (error) throw error;
                                console.log("link inserted")
                            });
                            descCount ++;

                            teamNum = 1
                            for (const team of desc[3]) {
                                sqlconnection.query(sqlInsertDesc, [ insertResult.insertId, locationNum, descCount, 4, team ], function (error, insertResult) {
                                    if (error) throw error;
                                    console.log("Team inserted")
                                });
                                teamNum ++;
                                descCount ++;
                            }

                            locationNum ++;
                        }
                        
                    });
                } else {
                    console.log("already inserted")
                }
            });
        } else {
            console.log("No splatfest announced")
        };
    });
};

module.exports = getData;
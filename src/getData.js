const axios = require('axios');
const { JSDOM } = require('jsdom');
const { nanoid } = require('nanoid');
const mysql = require('mysql2');

const sql = require('../db.js');

function getMonthFromString(mon){
    return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
}

async function pullData() {
    webValue = await axios.get("https://splatoonwiki.org/w/index.php?title=Main_Page/Splatfest").then(function (response) {
        // handle success
        let html = (new JSDOM(response.data));
        let placeAll = html.window.document.querySelectorAll(".splatfest div > div > div.bubbleboxbg-lighter");
        let teamsAll = html.window.document.querySelectorAll(".splatfest div div > div.bubbleboxbg-darker > div > span > a");
        let teamsLinkAll = html.window.document.querySelectorAll(".splatfest div div > div.bubbleboxbg-darker > div > span > a");
        let imgAll = html.window.document.querySelectorAll(".splatfest div div > div.bubbleboxbg-darker > div > div img");

        return { teamsAll, teamsLinkAll, imgAll, placeAll };
    });
    return webValue;
}

async function getInfo() {
    let { teamsAll, teamsLinkAll, imgAll, placeAll } = await pullData();

    let descData = [];
    let count = 0;

    for (let team of teamsAll) {
        let { name, startDate, endDate } = await axios.get("https://splatoonwiki.org" + teamsLinkAll[count].getAttribute('href')).then(function (regionResponse) {
            let regionHtml = (new JSDOM(regionResponse.data));
            let nameAll = regionHtml.window.document.querySelectorAll("div > b > small");
            let startEndDate = regionHtml.window.document.querySelectorAll("td .mw-formatted-date");

            let name = nameAll[0].textContent;
            let startDate = startEndDate[0].textContent;
            let endDate = startEndDate[1].textContent;
            return { name, startDate, endDate };
        })

        let teams = []
        teamsDirty = team.textContent.split("vs.")
        teams = teamsDirty.map(s => s.trim());

        descData.push([
            name,
            placeAll[count].textContent,
            "https://splatoonwiki.org" + teamsLinkAll[count].getAttribute('href'),
            teams,
            "https:" + imgAll[count].getAttribute('src'),
            startDate,
            endDate,
        ]);
        count ++;
    };
    return descData;
};

async function InsertData() {
    let descData = await getInfo();

    let event = "splatfest";
    let title = "Splatfest";
    let startDate = new Date(descData[0][5]);
    let endDate = new Date(descData[0][6]);
    let created = new Date(Date.now());
    let uid = nanoid() + "@splatfest.awdawd.eu";

    if (startDate != "Invalid Date") {
        var sqlGetDate = 'SELECT COUNT(id) AS `count` FROM `splatCal` WHERE `startDate` = ?'
        sqlconnection.query(sqlGetDate, [ startDate ], function (error, GetCount) {
            if (error) throw error;
            if (GetCount[0].count === 0) {
                var sqlInsert = 'INSERT INTO `splatCal` (`event`, `title`, `startDate`, `endDate`, `created`, `uid`) VALUES (?, ?, ?, ?, ?, ?)';
                sqlconnection.query(sqlInsert, [ event, title, startDate, endDate, created, uid ], function (error, insertResult) {
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

                        sqlconnection.query(sqlInsertDesc, [ insertResult.insertId, locationNum, descCount, 5, desc[4] ], function (error, insertResult) {
                            if (error) throw error;
                            console.log("image link inserted")
                        });
                        descCount ++;

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
};

async function getData() {
    sqlconnection = mysql.createConnection(sql);

    sqlconnection.connect((err) => {
        if (err) throw err;
        console.log('MySQL connected');
    });
    InsertData()
};

module.exports = getData;
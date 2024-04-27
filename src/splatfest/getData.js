const axios = require('axios');
const { JSDOM } = require('jsdom');
const { nanoid } = require('nanoid');
const mysql = require('mysql2');

sql = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

sqlconnection = mysql.createConnection(sql);

sqlconnection.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected');
});

async function getData() {
    let data = await axios.get("https://splatoon3.ink/data/festivals.json").then(function (response) {return response.data.EU.data.festRecords.nodes[0];});
    console.log(data);
};

module.exports = getData;
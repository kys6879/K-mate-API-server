const fs = require('fs');
const mysql = require('mysql2/promise');
const path = require('path');

const readDBConfig = () => {
  return new Promise((res, rej) => {
    let filePath = path.join(__dirname, '../private/secure.json')
    fs.readFile(filePath, function (err, data) {
      if (err) {
        rej(false);
      } else {
        data = JSON.parse(data);
        data = data.db;
        res(data);
      }
    });
  });
}

async function createPool() {
  let dbConfig = await readDBConfig();

  let host = dbConfig.host;
  let user = dbConfig.user;
  let password = dbConfig.password;
  let database = dbConfig.database

  return mysql.createPool({
    host: host,
    user: user,
    password: password,
    database: database
  });
}

async function getConnection() {
  let pool = await createPool();

  return await pool.getConnection(async conn => conn);
}

module.exports = {
  getConnection: getConnection
}
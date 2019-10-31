const databaseService = require('./databaseService');
const CONSTANT = require('../enviroment');


// @ 여행 추가
async function send(sender, reciver, message) {

  const connection = await databaseService.getConnection();
  try {

    let params = [new Date().valueOf(), sender, reciver, message];
    let rows = await connection.query('INSERT INTO sm_chat (idx,sender,reciver,msg) VALUES(?,?,?,?)', params);
    connection.release();
    return rows;
  } catch (err) {
    console.log("123");
    throw new Error(err)
  } finally {
    connection.release();
  }
}



module.exports = {
  send: send
}
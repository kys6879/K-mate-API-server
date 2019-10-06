const databaseService = require('../service/databaseService');

async function getUsers() {

  const connection = await databaseService.getConnection();

  try {
    let [rows] = await connection.query('SELECT * FROM sm_user');
    console.log(rows);
    return rows;
  } catch (err) {
    throw new Error(err);
  }
}

async function getUserByEmail(email) {

  const connection = await databaseService.getConnection();

  try {
    let [rows] = await connection.query('SELECT * FROM sm_user WHERE email = ?', [email]);
    console.log(rows);
    return rows;
  } catch (err) {
    throw new Error(err);
  }
}

async function setMateByEmail(email) {

  const connection = await databaseService.getConnection();

  try {
    const [rows] = await connection.query('UPDATE sm_user SET type  = ? WHERE email = ?', ["MAT", email]);

    console.log(rows);
    return rows;
  } catch (err) {
    throw new Error(err);
  }
}

async function updateNicknameByEmail(email, name) {

  const connection = await databaseService.getConnection();

  try {
    const [rows] = await connection.query('UPDATE sm_user SET nickname  = ? WHERE email = ?', [name, email]);
    console.log(rows);
    return rows;
  } catch (err) {
    throw new Error(err);
  }
}

async function isExistUser(email) {
  try {
    const user = await getUserByEmail(email);
    return (user.length == 0) ? false : true;
  } catch (err) {
    console.log("에러!!!");
    return err;
  }
}

async function likeMate(mate_email, user_email) {

  const connection = await databaseService.getConnection();

  try {
    await connection.query('UPDATE sm_mate SET mlike = mlike + 1  WHERE mate_email = ? AND user_email = ?', [mate_email, user_email]);
  } catch (err) {
    throw new Error(err);
  }
}

async function unlikeMate(mate_email, user_email) {

  const connection = await databaseService.getConnection();

  try {
    await connection.query('UPDATE sm_mate SET mlike = mlike - 1  WHERE mate_email = ? AND user_email = ?', [mate_email, user_email]);
  } catch (err) {
    throw new Error(err);
  }
}

async function updateUserImage(image, email) {

  const connection = await databaseService.getConnection();

  try {
    await connection.query('UPDATE sm_user SET profile_image = ?  WHERE email = ?', [image, email]);
  } catch (err) {
    throw new Error(err);
  }
}

async function getMappingMate(email) {

  const connection = await databaseService.getConnection();

  try {
    return await connection.query('SELECT * FROM sm_mate WHERE user_email = ? ', [email]);
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  getUsers: getUsers,
  getUserByEmail: getUserByEmail,
  setMateByEmail: setMateByEmail,
  isExistUser: isExistUser,
  updateNicknameByEmail: updateNicknameByEmail,
  likeMate: likeMate,
  unlikeMate: unlikeMate,
  updateUserImage: updateUserImage,
  getMappingMate: getMappingMate
}
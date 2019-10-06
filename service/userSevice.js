const databaseService = require('../service/databaseService');

// @ 모든 유저 조회
async function getUsers() {

  const connection = await databaseService.getConnection();

  try {
    let [rows] = await connection.query('SELECT * FROM sm_user');
    connection.release();
    console.log(rows);
    return rows;
  } catch (err) {
    throw new Error(err);
  } finally {
    connection.release();
  }
}

// @ 이메일로 유저 조회
async function getUserByEmail(email) {

  const connection = await databaseService.getConnection();

  try {
    let [rows] = await connection.query('SELECT * FROM sm_user WHERE email = ?', [email]);
    connection.release();
    console.log(rows);
    return rows;
  } catch (err) {
    throw new Error(err);
  } finally {
    console.log("finally!");
    connection.release();
  }
}

// @ 이메일로 메이트 조회
async function setMateByEmail(email) {

  const connection = await databaseService.getConnection();

  try {
    const [rows] = await connection.query('UPDATE sm_user SET type  = ? WHERE email = ?', ["MAT", email]);
    connection.release();

    console.log(rows);
    return rows;
  } catch (err) {
    throw new Error(err);
  } finally {
    connection.release();
  }
}

// @ 이메일로 닉네임 변경
async function updateNicknameByEmail(email, name) {

  const connection = await databaseService.getConnection();

  try {
    const [rows] = await connection.query('UPDATE sm_user SET nickname  = ? WHERE email = ?', [name, email]);
    connection.release();

    console.log(rows);
    return rows;
  } catch (err) {
    throw new Error(err);
  } finally {
    connection.release();
  }
}

// @ 유저 존재 확인
async function isExistUser(email) {
  try {
    const user = await getUserByEmail(email);
    return (user.length == 0) ? false : true;
  } catch (err) {
    console.log("에러!!!");
    return err;
  }
}

// @ 메이트 좋아요 
async function likeMate(mate_email, user_email) {

  const connection = await databaseService.getConnection();

  try {
    await connection.query('UPDATE sm_mate SET mlike = mlike + 1  WHERE mate_email = ? AND user_email = ?', [mate_email, user_email]);
    connection.release();

  } catch (err) {
    throw new Error(err);
  } finally {
    connection.release();
  }
}

// @ 메이트 좋아요 취소
async function unlikeMate(mate_email, user_email) {

  const connection = await databaseService.getConnection();

  try {
    await connection.query('UPDATE sm_mate SET mlike = mlike - 1  WHERE mate_email = ? AND user_email = ?', [mate_email, user_email]);
    connection.release();

  } catch (err) {
    throw new Error(err);
  } finally {
    connection.release();
  }
}

// @ 유저 사진 변경
async function updateUserImage(image, email) {

  const connection = await databaseService.getConnection();

  try {
    await connection.query('UPDATE sm_user SET profile_image = ?  WHERE email = ?', [image, email]);
    connection.release();
  } catch (err) {
    throw new Error(err);
  } finally {
    connection.release();
  }
}

// @ 유저와 메이트 매핑
async function getMappingMate(email) {

  const connection = await databaseService.getConnection();

  try {
    let row = await connection.query('SELECT * FROM sm_mate WHERE user_email = ? ', [email]);
    connection.release();
    return row;

  } catch (err) {
    throw new Error(err);
  } finally {
    connection.release();
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
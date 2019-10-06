const databaseService = require('./databaseService');
const CONSTANT = require('../enviroment');

// @ 맛집 좋아요
async function likeEat(idx, user_email) {

  const connection = await databaseService.getConnection();

  try {
    await connection.query('UPDATE sm_eat_map SET mlike = mlike + 1  WHERE eat_idx = ? AND user_email = ?', [idx, user_email]);
    connection.release();
  } catch (err) {
    throw new Error(err);
  }
}

// @ 정보 좋아요
async function likeInfo(idx, user_email) {

  const connection = await databaseService.getConnection();

  try {
    await connection.query('UPDATE sm_info_map SET mlike = mlike + 1  WHERE info_idx = ? AND user_email = ?', [idx, user_email]);
    connection.release();
  } catch (err) {
    throw new Error(err);
  }
}

// @ 관광지 좋아요
async function likeAttr(idx, user_email) {

  const connection = await databaseService.getConnection();

  try {
    await connection.query('UPDATE sm_attr_map SET mlike = mlike + 1  WHERE attr_idx = ? AND user_email = ?', [idx, user_email]);
    connection.release();
  } catch (err) {
    throw new Error(err);
  }
}

// @ 맛집 좋아요 취소
async function unlikeEat(idx, user_email) {

  const connection = await databaseService.getConnection();

  try {
    await connection.query('UPDATE sm_eat_map SET mlike = mlike - 1  WHERE eat_idx = ? AND user_email = ?', [idx, user_email]);
    connection.release();
  } catch (err) {
    throw new Error(err);
  }
}

// @ 정보 좋아요 취소
async function unlikeInfo(idx, user_email) {

  const connection = await databaseService.getConnection();

  try {
    await connection.query('UPDATE sm_info_map SET mlike = mlike - 1  WHERE info_idx = ? AND user_email = ?', [idx, user_email]);
    connection.release();
  } catch (err) {
    throw new Error(err);
  }
}

// @ 관광지 좋아요 취소
async function unlikeAttr(idx, user_email) {

  const connection = await databaseService.getConnection();

  try {
    await connection.query('UPDATE sm_attr_map SET mlike = mlike - 1  WHERE attr_idx = ? AND user_email = ?', [idx, user_email]);
    connection.release();
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  likeEat: likeEat,
  likeInfo: likeInfo,
  likeAttr: likeAttr,
  unlikeEat: unlikeEat,
  unlikeInfo: unlikeInfo,
  unlikeAttr: unlikeAttr
}
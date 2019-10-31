const databaseService = require('./databaseService');
const CONSTANT = require('../enviroment');

// @ 모든 여행 
async function getTours() {

  const connection = await databaseService.getConnection();

  try {
    let [rows] = await connection.query('SELECT * FROM sm_tour');
    connection.release();
    return rows;
  } catch (err) {
    throw new Error(err);
  }
}

// @ 여행 추가
async function addTour(tourData) {

  let {
    idx,
    name,
    startDate,
    endDate,
    userEmail,
    personnels,
    touristName,
    tourStyle,
    tourType,
    mateEmail,
    profileImage
  } = tourData;

  let adult = tourData.personnels.adult;
  let infant = tourData.personnels.infant;
  let child = tourData.personnels.child;

  const connection = await databaseService.getConnection();
  console.log("asdf");
  try {
    let params = [idx, userEmail, name, startDate, endDate, adult, infant, child, touristName, tourStyle, tourType, mateEmail, profileImage];
    let rows = await connection.query('INSERT INTO sm_tour (idx,user_email,name,start_date,end_date,adult,infant,child,tourist_name,tour_style,tour_type,mate,image) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,? )', params);
    connection.release();
    return idx;
  } catch (err) {
    console.log("123");
    throw new Error(err)
  } finally {
    connection.release();
  }
}

// @ 유저의 여행 찾기
async function getToursByUserEmail(userEmail) {

  const connection = await databaseService.getConnection();

  try {
    let [rows] = await connection.query('SELECT * FROM sm_tour WHERE user_email = ? OR mate = ?', [userEmail, userEmail]);
    connection.release();
    return rows;
  } catch (err) {
    throw new Error(err);
  } finally {
    connection.release();
  }
}

// @ 여행 제목 변경 
async function updateTitleTourByIdx(title, idx) {

  const connection = await databaseService.getConnection();

  console.log(title, idx);

  try {
    let [rows] = await connection.query('UPDATE sm_tour SET name = ? WHERE idx = ?', [title, idx]);
    connection.release();
    return rows;
  } catch (err) {
    throw new Error(err);
  } finally {
    connection.release();
  }
}

// @ 여행 삭제
async function deleteTourByIdx(idx) {

  const connection = await databaseService.getConnection();

  try {
    let [rows] = await connection.query('DELETE FROM sm_tour WHERE idx = ?', [idx]);
    connection.release();
    return rows;
  } catch (err) {
    throw new Error(err);
  } finally {
    connection.release();
  }
}

// @ 메이트 구분
async function isMateByUserEmail(userEmail) {
  let isMate = false;

  const connection = await databaseService.getConnection();

  let [rows] = await connection.query('SELECT * FROM sm_user WHERE email = ?', [userEmail]);
  connection.release();

  if (rows.length < 1) {
    isMate = false;
  } else {
    if (rows[0].type == CONSTANT.USER_TYPE.MATE) {
      isMate = true;
    }
  }

  return isMate;
}

module.exports = {
  getTours: getTours,
  getToursByUserEmail: getToursByUserEmail,
  addTour: addTour,
  deleteTourByIdx: deleteTourByIdx,
  isMateByUserEmail: isMateByUserEmail,
  updateTitleTourByIdx: updateTitleTourByIdx
}
var express = require('express');
let jwt = require("jsonwebtoken");
let secretObj = require("../config/jwt");
const passport = require('passport');
var router = express.Router();
const mysql = require('../database/mysql.js');
const cryptoUtil = require('../util/cryptoUtil');

router.post('/register', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };

  let email = req.body.email;
  let nickname = req.body.nickname;
  let password = req.body.password;
  let age = req.body.age;
  let gender = req.body.gender;
  let type = 'USR'; // or MAT
  let profileImage = req.body.profileImage;
  let iskakao = req.body.iskakao;
  let isCustomImage = 1;
  console.log("iskakao : ", iskakao);

  let users = {
    email: email,
    nickname: nickname,
    password: cryptoUtil.createHash(password),
    age: age,
    gender: gender,
    type: type,
    profileImage: profileImage,
    iskakao: iskakao,
    isCustomImage: isCustomImage
  };

  let pool = await mysql.createPool();

  const connection = await pool.getConnection(async conn => conn);

  try {

    let params = [];
    params.push(users.email);

    // 아이디 중복체크
    let [rows] = await connection.query('SELECT email FROM sm_user WHERE email = ?', [users.email]);

    if (rows.length > 0) {
      result.status = false;
      result.message = "duplicated User Email";
      return res.status(409).json(result);
    }

    params = [];

    for (let i in users) {
      let d = users[i];
      params.push(d);
    }

    // 유저 회원가입
    await connection.query('INSERT INTO sm_user (email,nickname,password,age,gender,type,profile_image , iskakao , isCustomImage) VALUES (?,?,?,?,?,?,?,?,?)', params);
    for (let i = 0; i < 10; i++) {
      await connection.query('INSERT INTO sm_mate (mate_email,user_email,mlike) VALUES (?,?,?)', [`mate${i}@korea.com`, users.email, 0]);
    }

    [rows] = await connection.query('SELECT idx FROM sm_eat');
    console.log(rows);

    let tables = ["eat", "info", "attr"];
    for (let i = 0; i < tables.length; i++) {
      [rows] = await connection.query(`SELECT idx FROM sm_${tables[i]}`);
      if (tables[i] == "eat") {
        for (let j = 0; j < 10; j++) {
          await connection.query('INSERT INTO sm_eat_map (eat_idx,user_email,mlike) VALUES (?,?,?)', [rows[j].idx, users.email, 0]);
        }
      }
      if (tables[i] == "info") {
        for (let j = 0; j < 10; j++) {
          await connection.query('INSERT INTO sm_info_map (info_idx,user_email,mlike) VALUES (?,?,?)', [rows[j].idx, users.email, 0]);
        }

      }
      if (tables[i] == "attr") {
        for (let j = 0; j < 10; j++) {
          await connection.query('INSERT INTO sm_attr_map (attr_idx,user_email,mlike) VALUES (?,?,?)', [rows[j].idx, users.email, 0]);
        }
      }
    }
    // [rows] = await connection.query('INSERT INTO sm_user (email,nickname,password,age,gender,type) VALUES (?,?,?,?,?,?)', params);

    result.status = true;
    result.message = "success insert user";
    return res.json(result).status(200);
  } catch (err) {
    console.log(err);
    console.log("adsf");
    next(err);
  } finally {
    connection.release();
  }
});


router.post('/login', function (req, res, next) {
  passport.authenticate('local', {
    session: false
  }, (err, user, info) => {

    let result = {
      status: "",
      message: ""
    };

    console.log("[auth.js] /login !!!!", info);
    console.log("[auth.js] /login !!!!", user);

    if (err | !user || (user == undefined)) {
      console.log("[auth.js] /login  err !!!!", err);
      console.log("[auth.js] /login  user !!!!", user);

      result.status = false;
      result.message = info.message;

      return res.status(409).send(result);
    }

    req.login(user, {
      session: false
    }, (err) => {
      if (err) {
        result.status = false;
        result.message = "serverError";
        return next(result);
      }

      console.log(secretObj.secret);
      const token = jwt.sign(user, secretObj.secret);

      result.status = true;
      result.message = token;

      return res.status(200).send(result);
    });
  })(req, res);
});

module.exports = router;
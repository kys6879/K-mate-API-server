var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const image2base64 = require('image-to-base64');
const databaseService = require('../service/databaseService');
const touristService = require('../service/touristService');


async function imageToBase64(path) {
  return new Promise((res, rej) => {
    console.log(path);
    image2base64(path) // you can also to use url
      .then(
        (response) => {
          // console.log(response); //cGF0aC90by9maWxlLmpwZw==
          res(response);
        }
      )
      .catch(
        (error) => {
          console.log(error); //Exepection error....
          rej(error);
        }
      )
  })
}

function urlParse(str) {
  let newStr = "";
  for (let i = 0; i < str.length; i++) {
    if (!(str[i] == `(`)) {
      newStr += str[i]
    } else {
      break;
    }
  }
  return newStr;
}

// 모든 맛집 명소 정보
router.get('/all', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };
  let total = {
    "eat": [],
    "info": [],
    "attr": []
  };
  let conn = await databaseService.getConnection();

  try {
    let rows;
    let tables = ['eat', 'info', 'attr'];
    for (let i = 0; i < tables.length; i++) {
      [rows] = await conn.query(`SELECT idx ,name,addr,tag,image , url FROM sm_${tables[i]}`);
      total[tables[i]] = rows;
    }
    result.status = true;
    result.message = total;
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    result.status = false;
    result.message = err;
    res.status(500).json(result);
  } finally {
    conn.release();
  }
});

// @ 맛집
router.get('/eat', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };
  let total = [];
  let conn = await databaseService.getConnection();
  let rows;
  let tables = ['eat'];
  for (let i = 0; i < tables.length; i++) {
    [rows] = await conn.query(`SELECT idx ,name,addr,tag,image FROM sm_${tables[i]}`);
    total = rows;
  }
  result.status = true;
  result.message = total;
  res.status(200).json(result);
});

// @ 정보
router.get('/info', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };
  let total = [];
  let conn = await databaseService.getConnection();
  let rows;
  let tables = ['info'];
  for (let i = 0; i < tables.length; i++) {
    [rows] = await conn.query(`SELECT idx ,name,addr,tag,image FROM sm_${tables[i]}`);
    total = rows;
  }
  result.status = true;
  result.message = total;
  res.status(200).json(result);
});

// @ 관광지
router.get('/attr', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };
  let total = []
  let conn = await databaseService.getConnection();
  let rows;
  let tables = ['attr'];
  for (let i = 0; i < tables.length; i++) {
    [rows] = await conn.query(`SELECT idx ,name,addr,tag,image FROM sm_${tables[i]}`);
    total = rows;
  }
  result.status = true;
  result.message = total;
  res.status(200).json(result);
});

// @ 맛집 매핑
router.get('/map/eat', async function (req, res, next) {
  let email = req.user;

  let result = {
    status: "",
    message: ""
  };
  let conn = await databaseService.getConnection();
  let rows;
  try {
    [rows] = await conn.query(`SELECT * FROM sm_eat join sm_eat_map on sm_eat.idx = sm_eat_map.eat_idx WHERE sm_eat_map.user_email = ?;
    `, [email]);

    for (let i = 0; i < rows.length; i++) {
      rows[i].touristMap = {
        idx: rows[i].eat_idx,
        user_email: rows[i].user_email,
        mlike: rows[i].mlike
      }
    }

    result.status = true;
    result.message = rows;
    res.status(200).json(result);
  } catch (e) {
    result.status = false;
    result.message = e;
    res.status(500).json(result);
  } finally {
    conn.release();
  }
});

// @ 정보 매핑
router.get('/map/info', async function (req, res, next) {
  let email = req.user;

  let result = {
    status: "",
    message: ""
  };
  let conn = await databaseService.getConnection();
  let rows;
  try {
    [rows] = await conn.query(`SELECT * FROM sm_info join sm_info_map on sm_info.idx = sm_info_map.info_idx WHERE sm_info_map.user_email = ?`, [email]);

    for (let i = 0; i < rows.length; i++) {
      rows[i].touristMap = {
        idx: rows[i].info_idx,
        user_email: rows[i].user_email,
        mlike: rows[i].mlike
      }
    }

    result.status = true;
    result.message = rows;
    res.status(200).json(result);
  } catch (e) {
    result.status = false;
    result.message = e;
    res.status(500).json(result);
  } finally {
    conn.release();
  }
});

// @ 관광지 매핑
router.get('/map/attr', async function (req, res, next) {
  let email = req.user;
  console.log(email);

  let result = {
    status: "",
    message: ""
  };
  let conn = await databaseService.getConnection();
  let rows;
  try {
    [rows] = await conn.query(`SELECT * FROM sm_attr join sm_attr_map on sm_attr.idx = sm_attr_map.attr_idx WHERE sm_attr_map.user_email = ?`, [email]);

    for (let i = 0; i < rows.length; i++) {
      rows[i].touristMap = {
        idx: rows[i].attr_idx,
        user_email: rows[i].user_email,
        mlike: rows[i].mlike
      }
    }

    result.status = true;
    result.message = rows;
    res.status(200).json(result);
  } catch (e) {
    result.status = false;
    result.message = e;
    res.status(500).json(result);
  } finally {
    conn.release();
  }
});

// @ 추천목록 좋아요
router.put('/like/:kind/:num', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };
  let num = req.params.num;
  let kind = req.params.kind;
  let email = req.user;
  try {
    switch (kind) {
      case "1":
        await touristService.likeAttr(num, email);
        break;
      case "2":
        await touristService.likeEat(num, email);
        break;
      case "3":
        await touristService.likeInfo(num, email);
        break;
    }
    result.status = true;
    result.message = "success";
    res.status(200).json(result);
  } catch (e) {
    console.log(err);
    result.status = false;
    result.message = err;
    res.status(500).json(result);
  }
});

// @ 추천목록 좋아요 취소
router.put('/unlike/:kind/:num', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };
  let num = req.params.num;
  let kind = req.params.kind;
  let email = req.user;
  try {
    switch (kind) {
      case "1":
        await touristService.unlikeAttr(num, email);
        break;
      case "2":
        await touristService.unlikeEat(num, email);
        break;
      case "3":
        await touristService.unlikeInfo(num, email);
        break;
    }
    result.status = true;
    result.message = "success";
    res.status(200).json(result);
  } catch (e) {
    console.log(err);
    result.status = false;
    result.message = err;
    res.status(500).json(result);
  }
});

module.exports = router;
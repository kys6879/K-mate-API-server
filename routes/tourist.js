var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const image2base64 = require('image-to-base64');
const databaseService = require('../service/databaseService');

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
  let rows;
  let tables = ['eat', 'info', 'attr'];
  for (let i = 0; i < tables.length; i++) {
    [rows] = await conn.query(`SELECT idx as num ,name,addr,tag,image FROM sm_${tables[i]}`);
    total[tables[i]] = rows;
  }
  result.status = true;
  result.message = total;
  res.status(200).json(result);
});

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
    [rows] = await conn.query(`SELECT idx as num ,name,addr,tag,image FROM sm_${tables[i]}`);
    total = rows;
  }
  result.status = true;
  result.message = total;
  res.status(200).json(result);
});

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
    [rows] = await conn.query(`SELECT idx as num ,name,addr,tag,image FROM sm_${tables[i]}`);
    total = rows;
  }
  result.status = true;
  result.message = total;
  res.status(200).json(result);
});

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
    [rows] = await conn.query(`SELECT idx as num ,name,addr,tag,image FROM sm_${tables[i]}`);
    total = rows;
  }
  result.status = true;
  result.message = total;
  res.status(200).json(result);
});

router.post('/all', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };

  let filePath = path.join(__dirname, '../public/dataset/dataset.json');
  fs.readFile(filePath, async function (err, data) {
    if (err) {
      result.status = false;
      result.message = err;
      res.status(500).json(result);
    } else {

      let total = {
        "eat": [],
        "info": [],
        "attr": []
      };

      data = JSON.parse(data);

      attrResult = data["attr"];
      eatResult = data["eat"];
      infoResult = data["info"];

      let conn = await databaseService.getConnection();

      // 여기서 이미지를 불러와야함
      for (let i = 0; i < attrResult.length; i++) {
        try {
          let imagePath = path.join(__dirname, `../public/image/attr/attr_${attrResult[i].num}.jpeg`);
          let image = await imageToBase64(imagePath);
          await conn.query('INSERT INTO sm_attr (idx,name,addr,tag,image) VALUES (?,?,?,?,?)', [attrResult[i].num, attrResult[i].name, attrResult[i].addr, attrResult[i].tag, image]);
        } catch (err) {
          console.log(err);
          return res.status(500).json(err);
        }
      }

      for (let i = 0; i < infoResult.length; i++) {
        try {
          let imagePath = path.join(__dirname, `../public/image/info/info_${infoResult[i].num}.png`);
          let image = await imageToBase64(imagePath);
          await conn.query('INSERT INTO sm_info (idx,name,subtitle,tag,image) VALUES (?,?,?,?,?)', [infoResult[i].num, infoResult[i].name, infoResult[i].subtitle, infoResult[i].tag, image]);
        } catch (err) {
          return res.status(500).json(err);
        }
      }

      for (let i = 0; i < eatResult.length; i++) {
        try {
          let imagePath = path.join(__dirname, `../public/image/eat/eat_${eatResult[i].num}.jpeg`);
          let image = await imageToBase64(imagePath);
          await conn.query('INSERT INTO sm_eat (idx,name,addr,tag,image) VALUES (?,?,?,?,?)', [eatResult[i].num, eatResult[i].name, eatResult[i].addr, eatResult[i].tag, image]);
        } catch (err) {
          return res.status(500).json(err);
        }
      }

      result.status = true;
      result.message = total;
      res.status(200).json(result);
    }
  });
});

router.put('/all', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };

  let filePath = path.join(__dirname, '../public/dataset/dataset.json');
  fs.readFile(filePath, async function (err, data) {
    if (err) {
      result.status = false;
      result.message = err;
      res.status(500).json(result);
    } else {

      let total = {
        "eat": [],
        "info": [],
        "attr": []
      };

      data = JSON.parse(data);

      attrResult = data["attr"];
      eatResult = data["eat"];
      infoResult = data["info"];

      let conn = await databaseService.getConnection();


      // 여기서 이미지를 불러와야함
      for (let i = 0; i < attrResult.length; i++) {
        try {
          let imagePath = path.join(__dirname, `../public/image/attr/attr_${attrResult[i].num}.jpeg`);
          let image = await imageToBase64(imagePath);


          let attraddrArray = attrResult[i].addr.split(" ");
          let attraddr = "";
          for (let j = 0; j < attraddrArray.length - 1; j++) {
            attraddr += attraddrArray[j + 1] + " "
          }

          let attrTagArray = attrResult[i].tag.split(",");
          let attrtag = `#${attrTagArray[0]} #${attrTagArray[1]} #${attrTagArray[2]}`;

          total.attr.push({
            "classname": attrResult[i].class,
            "num": attrResult[i].num,
            "name": attrResult[i].name,
            // "addr": attrResult[i].addr.split(" ")[1],
            "addr": urlParse(attraddr),
            // "tag": attrResult[i].tag,
            "tag": attrtag,
            "image": image,
            "url": `http://korean.visitseoul.net/attractions/${attrResult[i].name}_/${attrResult[i].num}?curPage=1`
          })

          await conn.query(`UPDATE sm_attr SET addr = ? , tag = ? WHERE idx = ${attrResult[i].num}`, [urlParse(attraddr), attrtag]);

        } catch (err) {
          console.log(err);
          return res.status(500).json(err);
        }
      }

      for (let i = 0; i < infoResult.length; i++) {
        try {
          let imagePath = path.join(__dirname, `../public/image/info/info_${infoResult[i].num}.png`);
          let image = await imageToBase64(imagePath);

          let infoTagArray = infoResult[i].tag.split(",");
          console.log(infoTagArray);
          let infotag = `#${infoTagArray[0]} #${infoTagArray[1]} #${infoTagArray[2]}`;


          total.info.push({
            "classname": infoResult[i].class,
            "num": infoResult[i].num,
            "name": infoResult[i].name,
            "addr": infoResult[i].subtitle,
            "subtitle": infoResult[i].subtitle,
            // "tag": infoResult[i].tag,
            "tag": infotag,
            "image": image,
            "url": `http://korean.visitseoul.net/essential-Info-article/${infoResult[i].name}_/${infoResult[i].num}`
          })

          await conn.query(`UPDATE sm_info SET addr = ? , tag = ? WHERE idx = ${infoResult[i].num}`, [infoResult[i].subtitle, infotag]);

        } catch (err) {
          return res.status(500).json(err);
        }
      }

      for (let i = 0; i < eatResult.length; i++) {
        try {
          let imagePath = path.join(__dirname, `../public/image/eat/eat_${eatResult[i].num}.jpeg`);
          let image = await imageToBase64(imagePath);
          let eataddrArray = eatResult[i].addr.split(" ");
          let eataddr = "";
          for (let j = 0; j < eataddrArray.length - 1; j++) {
            eataddr += eataddrArray[j + 1] + " "
          }

          let eatTagArray = eatResult[i].tag.split(",");
          let eattag = `#${eatTagArray[0]} #${eatTagArray[1]} #${eatTagArray[2]}`;


          total.eat.push({
            "classname": eatResult[i].class,
            "num": eatResult[i].num,
            "name": eatResult[i].name,
            // "addr": eatResult[i].addr,
            "addr": urlParse(eataddr),
            "tag": eattag,
            // "tag": eatResult[i].tag,
            "image": image,
            "url": `http://korean.visitseoul.net/eat/${eatResult[i].name}_/${eatResult[i].num}?curPage=1`
          })

          await conn.query(`UPDATE sm_eat SET addr = ? , tag = ? WHERE idx = ${eatResult[i].num}`, [urlParse(eataddr), eattag]);

        } catch (err) {
          return res.status(500).json(err);
        }
      }

      result.status = true;
      result.message = total;
      res.status(200).json(result);
    }
  });
});

module.exports = router;
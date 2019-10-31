var express = require('express');
var router = express.Router();

const chatService = require('../service/chatService');



// @ 메시지 보내기
router.post('/send', async function (req, res, next) {

  let result = {
    code: "",
    status: "",
    message: ""
  };

  try {
    let sender = req.user;
    let reciver = req.body.reciver;
    let message = req.body.message;

    let [r] = await chatService.send(sender, reciver, message);
    result.code = 200;
    result.status = true;
    result.message = r
  } catch (err) {
    console.log(err);
    result.code = 500;
    result.status = false;
    result.message = err;
  }

  return res.json(result);
});

// @ 메시지 받기
router.post('/recv', async function (req, res, next) {

  let result = {
    code: "",
    status: "",
    message: ""
  };

  try {
    let sender = req.user;
    let reciver = req.body.reciver;
    let message = req.body.message;

    let [r] = await chatService.send(sender, reciver, message);
    result.code = 200;
    result.status = true;
    result.message = r
  } catch (err) {
    console.log(err);
    result.code = 500;
    result.status = false;
    result.message = err;
  }

  return res.json(result);

});
module.exports = router;
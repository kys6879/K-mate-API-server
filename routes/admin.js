var express = require('express');
var router = express.Router();
const mysql = require('../database/mysql.js');
const userService = require('../service/userSevice');

router.get('/:email', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };
  let email = req.params.email;
  try {

    const user = await userService.getUserByEmail(email);
    console.log(user);

    if (user.length == 0) {
      result.status = false;
      result.message = "Can't find User " + email;
      return res.status(409).json(result);
    } else {
      result.status = true;
      result.message = user[0];
      return res.status(200).json(result);
    }

  } catch (err) {
    console.log(err);
    result.status = true;
    result.message = err;
    return res.status(500).json(result);
  }
});
module.exports = router;
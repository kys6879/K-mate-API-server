var express = require('express');
var router = express.Router();
const mysql = require('../database/mysql.js');
const userService = require('../service/userSevice');

router.get('/', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };
  try {
    const users = await userService.getUsers();
    result.status = true;
    result.message = users;
    res.status(200).json(result);
  } catch (err) {
    result.status = true;
    result.message = err;
    console.log(err);
    res.status(500).json(result);
  }
});

router.get('/token', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };

  let email = req.user;
  console.log(email);
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

router.put('/nickname/:name', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };
  let name = req.params.name;

  let email = req.user;

  try {
    await userService.updateNicknameByEmail(email, name);
    result.status = true;
    result.message = "success";
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    result.status = false;
    result.message = "false";
    res.status(500).json(result);
  }

});

router.put('/mate/like/:email', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };

  let mate_email = req.params.email;

  console.log(mate_email);
  console.log(req.user);

  try {
    await userService.likeMate(mate_email, req.user);
    result.status = true;
    result.message = "success";
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    result.status = false;
    result.message = err;
    res.status(500).json(result);
  }
});

router.put('/mate/unlike/:email', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };

  let mate_email = req.params.email;

  try {
    await userService.unlikeMate(mate_email, req.user);
    result.status = true;
    result.message = "success";
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    result.status = false;
    result.message = err;
    res.status(500).json(result);
  }
});

router.put('/mate/:email', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };

  let email;
  if (req.params.email) {
    email = req.params.email
  } else {
    email = req.user;
  }

  console.log(email);

  try {
    const [user] = await userService.getUserByEmail(email);
    console.log("existUser : ", await userService.isExistUser(email));
    if (await userService.isExistUser(email) == false) {
      result.status = false;
      result.message = "Can't find User " + email;
      return res.status(409).json(result);
    } else {
      if (user.type == "MAT") {
        result.status = false;
        result.message = `${email} is Already Mate`;
        return res.status(406).json(result);
      }
    }

    await userService.setMateByEmail(email);

    result.status = true;
    result.message = email;
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    result.status = false;
    result.message = err;
    console.log(err);
    res.status(500).json(result);
  }
});

router.put('/profile/image', async function (req, res, next) {
  console.log("profile");
  let result = {
    status: "",
    message: ""
  };

  let image = req.body.profile_image;
  try {
    await userService.updateUserImage(image, req.user);
    result.status = true;
    result.message = "success";
    res.status(200).json(result);
  } catch (err) {
    console.log("오류 :  ", err);
    result.status = false;
    result.message = err;
    res.status(500).json(result);
  }
});

router.get('/map/mate', async function (req, res, next) {
  let result = {
    status: "",
    message: ""
  };

  console.log(req.user);

  try {
    let [rows] = await userService.getMappingMate(req.user);
    result.status = true;
    result.message = rows;
    res.status(200).json(result);
  } catch (err) {
    console.log("오류 :  ", err);
    result.status = false;
    result.message = err;
    res.status(500).json(result);
  }
});



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
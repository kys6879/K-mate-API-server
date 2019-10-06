var express = require('express');
var router = express.Router();

const tourService = require('../service/tourService');
const userService = require('../service/userSevice');

router.get('/', async function (req, res, next) {

  let result = {
    status: "",
    message: ""
  };

  try {
    let tours = await tourService.getTours();
    result.status = true;
    result.message = tours;
    return res.json(result).status(200);
  } catch (err) {
    console.log(err);
    result.status = false;
    result.message = err;
    return res.json(err)
  }
});

router.get('/token', async function (req, res, next) {

  let result = {
    code: "",
    status: "",
    message: ""
  };

  let email;
  email = req.user;

  try {

    if (await userService.isExistUser(email) == false) {
      result.status = false;
      result.message = "Can't find User " + email;
      return res.status(409).json(result);
    }

    let tours = await tourService.getToursByUserEmail(email);
    result.code = 200;
    result.status = true;
    result.message = tours;
  } catch (err) {
    console.log(err);
    result.code = 500;
    result.status = false;
    result.message = err;
  }

  return res.json(result);
});

router.get('/:email', async function (req, res, next) {

  let result = {
    code: "",
    status: "",
    message: ""
  };

  let email;
  if (req.params.email) {
    email = req.params.email
  }

  try {

    if (await userService.isExistUser(email) == false) {
      result.status = false;
      result.message = "Can't find User " + email;
      return res.status(409).json(result);
    }

    let tours = await tourService.getToursByUserEmail(email);
    result.code = 200;
    result.status = true;
    result.message = tours;
  } catch (err) {
    console.log(err);
    result.code = 500;
    result.status = false;
    result.message = err;
  }

  return res.json(result);
});

router.post('/', async function (req, res, next) {
  console.log(req.body.profileImage);
  let result = {
    status: "",
    message: ""
  };
  let idx = new Date().valueOf();
  let userEmail = req.user;
  let name = req.body.name || "신나는 한복 여행";
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  let adult = req.body.adult || 0;
  let infant = req.body.infant || 0;
  let child = req.body.child || 0;
  let touristName = req.body.touristName || "경복궁";
  let tourStyle = req.body.tourStyle || "GG";
  let tourType = req.body.tourType || "GG";;
  let mateEmail = req.body.mateEmail || "kys6879@naver.com";;
  let profileImage = req.body.image || "";

  let personnels = {
    adult: adult,
    infant: infant,
    child: child
  };

  let tourData = {
    idx: idx,
    userEmail: userEmail,
    name: name,
    startDate: startDate,
    endDate: endDate,
    personnels: personnels,
    touristName: touristName,
    tourStyle: tourStyle,
    tourType: tourType,
    mateEmail: mateEmail,
    profileImage: profileImage
  };

  // console.log(JSON.stringify(tourData));
  console.log(userEmail);
  // for (let i in tourData) {
  //   if (!(i == "userEmail")) {
  //     let d = tourData[i];
  //     if (!d || d == undefined || d == null) {
  //       result.status = false;
  //       result.message = "need Parameter";
  //       return res.status(400).json(result);
  //     }
  //   }
  // }

  try {
    let isMate = await tourService.isMateByUserEmail(tourData.mateEmail);
    console.log(`isMate! : ${isMate}`);
    if (!isMate) {
      result.status = false;
      result.message = "User is Not Mate.";
      return res.status(409).json(result);
    } else {
      await tourService.addTour(tourData);
      result.status = true;
      result.message = tourData.userEmail;
      return res.status(200).json(result);
    }

  } catch (err) {
    console.log("err :! ", err);
    return next(err);
    return res.status(500).json(err.message);
  }
});

router.put('/', async function (req, res, next) {

  let result = {
    code: "",
    status: "",
    message: ""
  };

  try {
    let idx = req.body.idx;
    let title = req.body.name;
    let tours = await tourService.updateTitleTourByIdx(title, idx);
    result.code = 200;
    result.status = true;
    result.message = JSON.stringify(tours);
  } catch (err) {
    console.log(err);
    result.code = 500;
    result.status = false;
    result.message = err;
  }

  return res.json(result);

});

router.delete('/', async function (req, res, next) {

  let result = {
    code: "",
    status: "",
    message: ""
  };

  try {
    let idx = req.body.idx;
    let tours = await tourService.deleteTourByIdx(idx);
    result.code = 200;
    result.status = true;
    result.message = JSON.stringify(tours);
  } catch (err) {
    console.log(err);
    result.code = 500;
    result.status = false;
    result.message = err;
  }

  return res.json(result);

});
module.exports = router;
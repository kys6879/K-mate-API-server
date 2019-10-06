const passport = require('passport');
const passportJWT = require("passport-jwt");

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;
let secretObj = require("./config/jwt");

const mysql = require('./database/mysql.js');
const cryptoUtil = require('./util/cryptoUtil');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async function (email, password, cb) {

    console.log("[passport.js] email -> ", email);
    console.log("[passport.js] password -> ", password);

    let pool = await mysql.createPool();

    const connection = await pool.getConnection(async conn => conn);
    try {
      let [rows] = await connection.query('SELECT email , password FROM sm_user WHERE email = ?', [email]);
      console.log("[passport.js] rows -> ", rows);
      console.log("[passport.js] rows length -> ", rows.length);

      connection.release();

      if (rows.length < 1) {
        return cb(null, false, {
          message: 'Incorrect email or password.'
        })
      } else if (email == rows[0].email && cryptoUtil.createHash(password) == rows[0].password) {
        return cb(null, email, {
          message: 'Logged in Successfully'
        })
      } else {
        return cb(null, false, {
          message: 'Incorrect email or password.'
        })
      }
    } catch (err) {
      console.log(err);

      return cb(err);
    }
  }
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretObj.secret
  },
  async function (jwtPayload, cb) {

    console.log("JWTStrategy!!!", jwtPayload);

    let pool = await mysql.createPool();

    const connection = await pool.getConnection(async conn => conn);
    try {
      let [rows] = await connection.query('SELECT email FROM sm_user WHERE email = ?', [jwtPayload]);
      connection.release();

      return cb(null, rows[0].email);

    } catch (err) {
      console.log(err);
      return cb(err);
    }
  }
));
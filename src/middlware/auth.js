const jwt = require("jsonwebtoken");
const helper = require("../helper/helper");

module.exports = {
  authorization: (req, res, next) => {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      jwt.verify(token, "PASSWORD", (err, data) => {
        // CONDITION IF KEY IS INAVALID
        if (
          (err && err.name === "JsonWebTokenError") ||
          (err && err.name === "TokenExpiredError")
        ) {
          return helper.response(res, 403, err.message);
        } else {
          req.token = data;
          next();
        }
      });
    } else {
      return helper.response(res, 400, "PLEASE LOGIN FIRST !");
    }
  },
};

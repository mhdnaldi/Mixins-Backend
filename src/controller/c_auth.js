const bcrypt = require("bcrypt");
const helper = require("../helper/helper");
const jwt = require("jsonwebtoken");

const { registerUser, getAllUser } = require("../model/m_auth");

module.exports = {
  getAllUser: async (req, res) => {
    try {
      const result = await getAllUser();
      return helper.response(res, 200, "SUCCES GET DATA", result);
    } catch (err) {
      return helper.response(res, 404, "BAD REQUEST", err);
    }
  },

  registerUser: async (req, res) => {
    const { user_name, user_phone, user_email, user_password } = req.body;
    const mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    try {
      const getUserEmail = await getAllUser();
      const getEmail = getUserEmail.map((value) => value.user_email);
      if (getEmail.includes(user_email)) {
        return helper.response(res, 404, "THIS EMAIL IS ALREADY REGISTERED");
      } else if (!user_email.match(mailFormat)) {
        return helper.response(res, 404, "EMAIL FORMAT IS WRONG!");
      } else if (!user_password.match(passwordFormat)) {
        return helper.response(
          res,
          404,
          "PASSWORD MUST INCLUDES AT LEAST 1 UPPERCASE, LOWERCASE, NUMERIC DIGIT AND MINIMUM 8 CHARACTERS"
        );
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user_password, salt); //encrypt password

        const setData = {
          user_name,
          user_phone,
          user_email,
          user_password: hash,
          created_at: new Date(),
        };

        const result = await registerUser(setData);
        return helper.response(res, 200, "REGISTER SUCCESS", result);
      }
    } catch (err) {
      console.log(err);
      return helper.response(res, 404, "BAD REQUEST", err);
    }
  },
};

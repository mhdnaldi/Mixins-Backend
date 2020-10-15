const bcrypt = require("bcrypt");
const helper = require("../helper/helper");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const nodemailer = require("nodemailer");

const {
  registerUser,
  getAllUser,
  getUserById,
  loginUser,
  patchUser,
  deleteUser,
  updateKeys,
  checkKey,
  updateLongitude,
  updateLatitude,
} = require("../model/m_auth");

module.exports = {
  getAllUser: async (req, res) => {
    try {
      const result = await getAllUser();
      return helper.response(res, 200, "SUCCES GET DATA", result);
    } catch (err) {
      return helper.response(res, 404, "BAD REQUEST", err);
    }
  },

  getUserById: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await getUserById(id);
      return helper.response(
        res,
        200,
        `SUCCES GET DATA WITH ID: ${id}`,
        result
      );
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
        return helper.response(res, 400, "THIS EMAIL IS ALREADY REGISTERED");
      } else if (!user_email.match(mailFormat)) {
        return helper.response(res, 400, "EMAIL FORMAT IS WRONG!");
      } else if (!user_password.match(passwordFormat)) {
        return helper.response(
          res,
          400,
          "PASSWORD MUST INCLUDES AT LEAST 1 UPPERCASE, LOWERCASE, NUMERIC DIGIT AND MINIMUM 8 CHARACTERS"
        );
      } else if (user_name === "" || user_name === undefined) {
        return helper.response(res, 400, "USERNAME CANNOT BE EMPTY");
      } else if (user_phone === "" || user_phone === undefined) {
        return helper.response(res, 400, "PHONE NUMBER CANNOT BE EMPTY");
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
  loginUser: async (req, res) => {
    const { user_email, user_password } = req.body;
    const checkDataUser = await loginUser(user_email);
    try {
      if (checkDataUser.length >= 1) {
        const checkPassword = bcrypt.compareSync(
          user_password,
          checkDataUser[0].user_password
        );
        if (checkPassword) {
          // PROSES SET JWT
          const {
            user_id,
            user_name,
            user_phone,
            user_email,
            user_image,
          } = checkDataUser[0];

          let payload = {
            user_id,
            user_email,
            user_name,
            user_phone,
            user_image,
          };
          const token = jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: "24h",
          });
          payload = { ...payload, token };
          return helper.response(res, 200, "LOGIN SUCCESS!", payload);
        } else {
          return helper.response(res, 400, "WRONG PASSWORD!");
        }
      } else {
        return helper.response(
          res,
          400,
          "EMAIL IS NOT REGISTERED, PLEASE SIGN UP FIRST"
        );
      }
    } catch (error) {
      return helper.response(res, 404, "BAD REQUEST", err);
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { user_email } = req.body;
      const checkDataUser = await loginUser(user_email);
      if (checkDataUser.length < 1) {
        const user_id = checkDataUser[0].user_id;
        let keys = Math.round(Math.random() * 10000);
        const update = await updateKeys(keys, user_id);
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "mixins.app@gmail.com",
            pass: "Soapsoap8*",
          },
        });
        await transporter.sendMail({
          from: '"MIXINS"',
          to: user_email,
          subject: "MIXINS - Forgot Password",
          html: `<b>${keys}</b>`,
        }),
          function (err) {
            if (err) {
              return helper.response(res, 400, "EMAIL NOT SENT");
            }
          };
        return helper.response(
          res,
          200,
          "EMAIL HAS BEEN SEND, PLEASE CHECK YOUR EMAIL"
        );
      } else {
        return helper.response("THIS EMAIL IS NOT REGISTERED");
      }
    } catch (err) {
      console.log(err);
      return helper.response(res, 404, "BAD REQUEST", err);
    }
  },
  changePassword: async (req, res) => {
    const { user_keys, user_password } = req.body;
    const passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;

    try {
      if (!user_password.match(passwordFormat)) {
        return helper.response(
          res,
          400,
          "PASSWORD MUST INCLUDES AT LEAST 1 UPPERCASE, LOWERCASE, NUMERIC DIGIT AND MINIMUM 8 CHARACTERS"
        );
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user_password, salt); //encrypt password
        const checkKeys = await checkKey(user_keys);
        if (checkKeys.length >= 1) {
          const id = checkKeys[0].user_id;
          const setData = {
            user_password: hash,
            user_keys: null,
          };
          const updateKey = await patchUser(setData, id);
          return helper.response(
            res,
            200,
            "SUCCESS, YOUR PASSWORD HAS BEEN CHANGED!"
          );
        } else {
          return helper.response(res, 400, "ACCESS DENIED");
        }
      }
    } catch (err) {
      console.log(err);
      return helper.response(res, 404, "BAD REQUEST", err);
    }
  },
  patchUser: async (req, res) => {
    const passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    try {
      const { user_name, user_phone, user_password } = req.body;
      const { id } = req.params;

      const getImage = await getUserById(id);
      const img = getImage[0].user_image;
      fs.unlink(`uploads/${img}`, (err) => {
        !err ? console.log("OK") : console.log(err);
      });

      if (!user_password.match(passwordFormat)) {
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
          user_password: hash,
          user_image: req.file === undefined ? "" : req.file.filename,
          updated_at: new Date(),
        };

        if (
          user_name === undefined ||
          (user_name === "" && user_phone === undefined) ||
          user_phone === ""
        ) {
          setData.user_name = getImage[0].user_name;
          setData.user_phone = getImage[0].user_phone;
        }

        const checkId = await getUserById(id);
        if (checkId.length > 0) {
          const result = await patchUser(setData, id);
          return helper.response(res, 200, "SUCCESS EDIT DATA", result);
        } else {
          return helper.response(res, 404, "DATA NOT FOUND");
        }
      }
    } catch (err) {
      console.log(err);
      return helper.response(res, 404, "Bad Request", err);
    }
  },
  deleteUser: async (req, res) => {
    const { id } = req.params;
    const getImage = await getUserById(id);
    const img = getImage[0].user_image;
    fs.unlink(`uploads/${img}`, (err) => {
      !err ? console.log("SEDEP") : console.log(err);
    });
    try {
      const result = await deleteUser(id);
      return helper.response(res, 201, "USER DELETED", result);
    } catch (err) {
      return helper.response(res, 404, "BAD REQUEST", err);
    }
  },
  updatePosition: async (req, res) => {
    console.log("a");
    const { id } = req.params;
    const { longitude, latitude } = req.body;
    try {
      const long = await updateLongitude(longitude, id);
      const lat = await updateLatitude(latitude, id);
      return helper.response(res, 200, "Position updated");
    } catch (err) {
      return helper.response(res, 400, "BAD REQUEST", err);
    }
  },
};

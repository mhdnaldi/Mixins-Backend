const connection = require("../config/mysql");
const helper = require("../helper/helper");

module.exports = {
  getAllUser: () => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM user", (err, data) => {
        !err ? resolve(data) : reject(new Error(err));
      });
    });
  },

  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM user WHERE user_id = ?`,
        id,
        (err, data) => {
          !err ? resolve(data) : reject(new Error(err));
        }
      );
    });
  },
  registerUser: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO user SET ?", setData, (err, data) => {
        if (!err) {
          const newResult = {
            user_id: data.insertId,
            ...setData,
          };
          resolve(newResult);
        } else {
          reject(new Error(err));
        }
      });
    });
  },
  loginUser: (email) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT user_id, user_email, user_password, user_name, user_keys, user_phone, user_status, user_bio FROM user WHERE user_email = ?`,
        email,
        (err, data) => {
          // console.log(email);
          !err ? resolve(data) : reject(new Error(err));
        }
      );
    });
  },
  patchUser: (setData, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE user SET ? WHERE user_id = ?`,
        [setData, id],
        (err, data) => {
          if (!err) {
            const newResult = {
              user_id: id,
              ...setData,
            };
            resolve(newResult);
          } else {
            reject(new Error(err));
          }
        }
      );
    });
  },
  patchBio: (id, user_bio) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE user SET user_bio = ? WHERE user_id = ?",
        [user_bio, id],
        (err, data) => {
          if (!err) {
            const newResult = {
              user_id: id,
              user_bio: user_bio,
            };
            resolve(newResult);
          } else {
            reject(new Error(err));
          }
        }
      );
    });
  },
  deleteUser: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM user WHERE user_id = ?",
        id,
        (err, data) => {
          !err ? resolve(data) : reject(new Error(err));
        }
      );
    });
  },
  updateKeys: (keys, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE user SET user_keys = ? WHERE user_id = ?",
        [keys, id],
        (err, data) => {
          !err ? resolve(data) : reject(new Error(err));
        }
      );
    });
  },
  updateLongitude(longitude, id) {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE user SET longitude = ? WHERE user_id = ?`,
        [longitude, id],
        (err, data) => {
          !err ? resolve(data) : reject(err);
        }
      );
    });
  },
  updateLatitude(latitude, id) {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE user SET latitude = ? WHERE user_id = ?`,
        [latitude, id],
        (err, data) => {
          !err ? resolve(data) : reject(err);
        }
      );
    });
  },
  checkKey: (keys) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM user WHERE user_keys = ?",
        keys,
        (err, result) => {
          !err ? resolve(result) : reject(new Error(err));
        }
      );
    });
  },
};

const connection = require("../config/mysql");

module.exports = {
  getChatNotification: (room_id, friends_id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT(text_message) as total FROM message WHERE room_id = ? AND friends_id = ?",
        [room_id, friends_id],
        (err, data) => {
          !err ? resolve(data) : reject(new Error(err));
        }
      );
    });
  },
  patchStatus: (id, status) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE user SET user_status = ? WHERE user_id = ?",
        [status, id],
        (err, data) => {
          if (!err) {
            const newResult = {
              user_id: id,
              user_status: status,
            };
            resolve(newResult);
          } else {
            reject(new Error(err));
          }
        }
      );
    });
  },
};

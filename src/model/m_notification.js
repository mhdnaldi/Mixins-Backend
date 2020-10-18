const connection = require("../config/mysql");

module.exports = {
  getChatNotification: (room_id, user_id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT text_message as msg FROM message WHERE room_id = ? AND user_id = ?",
        [room_id, user_id],
        (err, data) => {
          !err ? resolve(data) : reject(new Error(err));
        }
      );
    });
  },
};

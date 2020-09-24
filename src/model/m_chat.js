const connection = require("../config/mysql");

module.exports = {
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
  addFriend: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(`INSERT INTO friends SET ?`, setData, (err, data) => {
        !err ? resolve(data) : reject(new Error(err));
      });
    });
  },
  checkRoom: (user_id, friends_id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM roomchat WHERE user_id = ? AND friends_id = ?`,
        [user_id, friends_id],
        (err, data) => {
          !err ? resolve(data) : reject(new Error(err));
        }
      );
    });
  },
  checkRoomById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM roomchat WHERE room_id = ?`,
        id,
        (err, data) => {
          !err ? resolve(data) : reject(new Error(err));
        }
      );
    });
  },
  postRoom: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(`INSERT INTO roomchat set ?`, setData, (err, data) => {
        if (!err) {
          const newResult = {
            room_id: data.insertId,
            ...setData,
          };
          resolve(newResult);
        } else {
          reject(new Error(err));
        }
      });
    });
  },
  postChat: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(`INSERT INTO message set ?`, setData, (err, data) => {
        if (!err) {
          const newResult = {
            message_id: data.insertId,
            ...setData,
          };
          resolve(newResult);
        } else {
          reject(new Error(err));
        }
      });
    });
  },
  getMessageRoomByid: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM message WHERE room_id = ?`,
        id,
        (err, data) => {
          !err ? resolve(data) : reject(new Error(err));
        }
      );
    });
  },
  getRoomByUSer: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM roomchat WHERE user_id = ?",
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  getRoomByFriends: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM roomchat WHERE friends_id = ?",
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
  getMessageByRoomId: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM message WHERE room_id = ?",
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error));
        }
      );
    });
  },
};

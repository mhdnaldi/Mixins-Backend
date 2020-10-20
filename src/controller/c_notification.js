const helper = require("../helper/helper");
const { getChatNotification, patchStatus } = require("../model/m_notification");

const { getAllRoom } = require("../model/m_chat");

module.exports = {
  getChatNotification: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await getAllRoom(id);
      let arr = [];
      for (let i = 0; i < result.length; i++) {
        let totalNotification = await getChatNotification(
          result[i].room_id,
          result[i].friends_id
        );
        arr.push(totalNotification);
      }
      console.log(arr[0][0].total);
      console.log(arr[1][0].total);
      helper.response(res, 200, "DATA FOUND", arr);
    } catch (err) {
      console.log(err);
    }
  },
  onlineStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await patchStatus(id, status);
      return helper.response(res, 200, "STATUS UPDATED", result);
    } catch (err) {
      return helper.response(res, 400, "BAD REQUEST", err);
    }
  },
};

// const { id } = req.params;
// const result = await getAllRoom(id);
// // console.log(result);
// for (let i = 0; i < result.length; i++) {
//   let notifData = await getChatNotification(
//     result[i].room_id,
//     result[i].user_id
//   );
//   console.log(notifData);
//   // return helper.response(res, 200, "SUCCESS", notifData);
// }

// -----------------------------------------------
// //   let result = await getChatNotification(room_id, user_id);
//   result = result.map((value) => {
//     return value.msg;
//   });
//   const length = result.length;
//   const lastMessage = result[length - 1];
//   const newResult = {
//     notif: length,
//     msg: lastMessage,
//   };
//   return helper.response(res, 200, "DATA FOUND", newResult);

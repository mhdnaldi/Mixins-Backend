const helper = require("../helper/helper");
const { getChatNotification, patchStatus } = require("../model/m_notification");

const { getAllRoom } = require("../model/m_chat");

module.exports = {
  getChatNotification: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await getAllRoom(id);
      // console.log(result);
      for (let i = 0; i < result.length; i++) {
        let notifData = await getChatNotification(
          result[i].room_id,
          result[i].user_id
        );
        console.log(notifData);
        // return helper.response(res, 200, "SUCCESS", notifData);
      }

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

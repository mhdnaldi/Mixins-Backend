const helper = require("../helper/helper");
const { getChatNotification } = require("../model/m_notification");

const { getAllRoom } = require("../model/m_chat");

module.exports = {
  getChatNotification: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await getAllRoom(id);
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
};

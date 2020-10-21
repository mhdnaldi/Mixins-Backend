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
      return helper.response(res, 200, "DATA FOUND", arr);
    } catch (err) {
      return helper.response(res, 400, "BAD REQUEST", err);
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

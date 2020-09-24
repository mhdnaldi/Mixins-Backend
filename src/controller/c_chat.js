const helper = require("../helper/helper");
const {
  checkRoom,
  postRoom,
  postChat,
  getMessageRoomByid,
  getUserById,
  addFriend,
  checkRoomById,
  getRoomByUser,
  getRoomByFriends,
} = require("../model/m_chat");
module.exports = {
  addFriends: async (req, res) => {
    const { user_id, friends_id } = req.body;
    try {
      const getFriend = await getUserById(friends_id);
      const setData = {
        user_id,
        friends_id: getFriend[0].user_id,
      };
      const add = await addFriend(setData);
      return helper.response(res, 200, "SUCCESS ADD FRIENDS");
    } catch (err) {
      console.log(err);
      return helper.response(res, 404, "BAD REQUEST", err);
    }
  },
  postMessage: async (req, res) => {
    const { user_id, room_id, role, friends_id, text_message } = req.body;
    if (
      text_message === "" ||
      text_message === undefined ||
      text_message === null
    ) {
      return helper.response(
        res,
        400,
        "PLEASE TEXT SOMETHING BEFORE SENDING A MESSAGE"
      );
    }
    try {
      const check = await checkRoom(user_id, friends_id);
      if (check.length < 1) {
        const createRoomId = Math.round(Math.random() * 100000);
        const setData = {
          room_id: createRoomId,
          user_id,
          friends_id,
        };
        const createRoom = await postRoom(setData);

        let setMessage = {
          room_id: createRoomId,
          user_id,
          friends_id,
          role: 1,
          text_message,
        };
        const sendMessage = await postChat(setMessage);
        const result = { createRoom, sendMessage };
        return helper.response(
          res,
          200,
          "SUCCESS CREATE ROOM AND SEND MESSAGE",
          result
        );
      } else {
        const oldRoomId = check[0].room_id;
        let setMessageData = {
          room_id: oldRoomId,
          user_id,
          friends_id,
          text_message,
        };
        const sendMessage = await postChat(setMessageData);
        return helper.response(res, 200, "SUCCESS SEND MESSAGE", sendMessage);
      }
    } catch (err) {
      console.log(err);
      return helper.response(res, 404, "BAD REQUEST", err);
    }
  },
  getRoomId: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await checkRoomById(id);
      if (result.length > 0) {
        const getData = await getMessageRoomByid(id);

        for (i = 0; i < getData.length; i++) {
          if (getData[i].role == 1) {
            const getSender = await getUserById(getData[i].user_id);
            getData[i].sender_name = getSender[0].user_name;
          } else {
            const getSender = await getUserById(getData[i].user_id);
            getData[i].sender_name = getSender[0].user_name;
          }
        }
        result[0].text_message = getData;
        return helper.response(
          res,
          200,
          `Success get room chat by ID ${id}`,
          result
        );
      } else {
        return helper.response(res, 404, "Room chat is not found!");
      }
    } catch (err) {
      console.log(err);
      return helper.response(res, 404, "BAD REQUEST", err);
    }
  },
  getUserRoom: async (request, response) => {
    const { id } = request.params;

    try {
      checkFriend = await getUserById(id);

      if (checkFriend.length > 0) {
        result = await getRoomByUser(id);

        for (i = 0; i < result.length; i++) {
          const getUser = await getUserById(result[i].recruiter_id);
          result[i].room_name = getUser[0].user_name;
        }
        return helper.response(
          response,
          200,
          "Success get worker room chat",
          result
        );
      } else {
        return helper.response(response, 404, "Worker not found");
      }
    } catch (e) {
      return helper.response(response, 400, "Bad Request", e);
    }
  },
  getFriendsRoom: async (request, response) => {
    const { id } = request.params;

    try {
      checkFriends = await getUserById(id);

      if (checkFriends.length > 0) {
        result = await getRoomByFriends(id);

        for (i = 0; i < result.length; i++) {
          const getUser = await getUserById(result[i].recruiter_id);
          result[i].room_name = getUser[0].user_name;
        }
        return helper.response(
          response,
          200,
          "Success get recruiter room chat",
          result
        );
      } else {
        return helper.response(response, 404, "Recruiter not found");
      }
    } catch (e) {
      return helper.response(response, 400, "Bad Request", e);
    }
  },
};

const helper = require("../helper/helper");
const {
  checkRoom,
  postRoom,
  postChat,
  getMessageRoomByid,
  getUserById,
  addFriend,
  checkRoomById,
  getUserByEmail,
  getAllFriends,
} = require("../model/m_chat");
module.exports = {
  addFriends: async (req, res) => {
    const { user_id, friends_email } = req.body;
    try {
      const getFriend = await getUserByEmail(friends_email);
      const setData = {
        user_id,
        friends_id: getFriend[0].user_id,
      };
      const add = await addFriend(setData);
      return helper.response(res, 200, "SUCCESS ADD FRIENDS", add);
    } catch (err) {
      console.log(err);
      return helper.response(res, 404, "BAD REQUEST", err);
    }
  },
  getMyFriends: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await getAllFriends(id);
      return helper.response(res, 200, "SUCCES GET DATA", result);
    } catch (err) {
      return helper.response(res, 404, "BAD REQUEST", err);
    }
  },
  createRoom: async (req, res) => {
    const { user_id, friends_id } = req.body;
    try {
      const check = await checkRoom(user_id, friends_id);
      const createRoomId = Math.round(Math.random() * 100000);
      const setData = {
        room_id: createRoomId,
        user_id,
        friends_id,
      };
      const createRoom = await postRoom(setData);
      return helper.response(res, 200, "SUCCES CREATE ROOM CHAT", createRoom);
    } catch (error) {
      return helper.response(res, 404, "BAD REQUEST", err);
    }
  },
  sendMessage: async (req, res) => {
    const { user_id, friends_id, room_id, text_message } = req.body;
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
    } else if (user_id === friends_id) {
      return helper.response(res, 400, "YOU CAN'T SEND MESSAGE TO YOURSELF");
    }
    try {
      const getRoom = await checkRoomById(room_id);
      const setData = {
        room_id: getRoom[0].room_id,
        user_id,
        friends_id,
        text_message,
      };
      const sendMessage = await postChat(setData);
      return helper.response(res, 200, "MESSAGE SEND", sendMessage);
    } catch (err) {
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
          const getSender = await getUserById(getData[i].user_id);
          getData[i].sender_name = getSender[0].user_name;
        }

        result[0].messages = getData;
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
};

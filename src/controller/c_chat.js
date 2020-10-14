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
  searchFriends,
  getRoomByUser,
  getAllRoom,
  deleteFriend,
} = require("../model/m_chat");
module.exports = {
  getAllUserRoom: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await getAllRoom(id);
      return helper.response(res, 200, "SUCCESS GET DATA", result);
    } catch (err) {
      return helper.response(res, 404, "BAD REQUEST", err);
    }
  },
  addFriends: async (req, res) => {
    const { user_id, friends_email } = req.body;

    try {
      const getSameEmail = await getUserById(user_id);
      // let checkFriends = await getAllFriends(user_id);
      // checkFriends.map((value) => {
      //   value;
      // });
      // console.log(checkFriends);
      // ----------------------------------------
      if (getSameEmail[0].user_email === friends_email) {
        return helper.response(res, 404, "YOU CAN'T ADD YOURSELF");
        // } else if (checkFriends.match(friends_email)) {
        //   return helper.response(res, 404, "THIS FRIENDS ALREADY EXISTS");
      } else {
        const getFriend = await getUserByEmail(friends_email);
        const setData = {
          user_id,
          friends_id: getFriend[0].user_id,
        };
        const add = await addFriend(setData);
        return helper.response(res, 200, "SUCCESS ADD FRIENDS");
      }
    } catch (err) {
      return helper.response(res, 404, "BAD REQUEST", err);
    }
  },
  getMyFriends: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await getAllFriends(id);
      return helper.response(res, 200, "SUCCES GET", result);
    } catch (err) {
      return helper.response(res, 404, "BAD REQUEST", err);
    }
  },
  searchFriend: async (req, res) => {
    const { id, search } = req.query;
    try {
      const result = await searchFriends(id, search);
      return helper.response(res, 200, "SUCCESS GET DATA", result);
    } catch (err) {
      return helper.response(res, 404, "BAD REQUEST", err);
    }
  },
  createRoom: async (req, res) => {
    const { user_id, friends_id } = req.body;
    try {
      const check = await checkRoom(user_id, friends_id);
      if (check.length < 1) {
        const createRoomId = Math.round(Math.random() * 100000);
        const setData = {
          room_id: createRoomId,
          user_id,
          friends_id,
        };
        const setData2 = {
          room_id: createRoomId,
          user_id: friends_id,
          friends_id: user_id,
        };
        const createRoom = await postRoom(setData);
        const createRoom2 = await postRoom(setData2);
        return helper.response(res, 200, "SUCCES CREATE ROOM CHAT", [
          createRoom,
        ]);
      } else {
        return helper.response(res, 200, "SUCCESS GET ROOM", check);
      }
    } catch (err) {
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
        200,
        "PLEASE TEXT SOMETHING BEFORE SENDING A MESSAGE"
      );
    } else if (user_id === friends_id) {
      return helper.response(res, 200, "YOU CAN'T SEND MESSAGE TO YOURSELF");
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
          const receiver = await getUserById(getData[i].user_id);
          getData[i].sender_name = getSender[0].user_name;
          getData[i].receiver = receiver[0];
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
      return helper.response(res, 404, "BAD REQUEST", err);
    }
  },
  getUserRoom: async (req, res) => {
    const { friends_id, user_id } = req.query;
    try {
      const result = await getRoomByUser(friends_id, user_id);
      return helper.response(res, 200, "SUCCESS GET USER ROOMCHAT", result);
    } catch (err) {
      return helper.response(res, 400, "BAD REQUEST", err);
    }
  },
  deleteFriend: async (req, res) => {
    const { id } = req.params;
    const { friends_id } = req.body;
    try {
      const result = await deleteFriend(id, friends_id);
      return helper.response(res, 200, "FRIENDS DELETED");
    } catch (err) {
      return helper.response(res, 400, "BAD REQUEST", err);
    }
  },
};

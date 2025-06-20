import { joinUserOnLoggin } from "./socketControllers/authController.js";
import {
  deleteMessage,
  disconnect,
  joinChat,
  joinUser,
  pinMessage,
  readMessages,
  sendMessage,
  unpinMessage,
  updateMessage,
} from "./socketControllers/chatController.js";
import { createJob, replyJob } from "./socketControllers/jobController.js";
import {
  commentPost,
  likePost,
  sendConnectionRequest,
} from "./socketControllers/notificationController.js";

export const configureSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("user connected");

    socket.on("user_joined", (user_id) => {
      joinUser({ user_id, socket });
    });
    socket.on("user_opened_chat", (user_id, chat) =>
      joinChat({ user_id, chat, socket, io })
    );
    socket.on("read_messages", (user_id, chat) =>
      readMessages({ user_id, chat, io })
    );
    socket.on("send_message", (messageData, chat) =>
      sendMessage({ messageData, chat, io })
    );
    socket.on("delete_message", (message_id, sender_id, receiver_id) =>
      deleteMessage({ message_id, sender_id, receiver_id, io })
    );
    socket.on("update_message", (messageData, chat) =>
      updateMessage({ messageData, chat, io })
    );
    socket.on("pin_message", (message_id, chat) =>
      pinMessage({ message_id, chat, io })
    );
    socket.on("unpin_message", (message_id, chat) =>
      unpinMessage({ message_id, chat, io })
    );
    socket.on("disconnect", () => disconnect());

    socket.on("create_job", createJob);
    socket.on("reply_to_job", replyJob);

    socket.on("like_post", likePost);
    socket.on("comment_post", commentPost);
    socket.on("send_connection_request", sendConnectionRequest);
  });
};

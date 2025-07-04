import React, { useEffect } from "react";
import "./message.css";
import { useUser } from "../../../../../contexts/userContext";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getMimeType, trimText } from "../../../../../utils/utils";
import socket from "../../../../../socket";
import { useChat } from "../../../../../contexts/chatContext";

const Message = ({
  message,
  contextMenu,
  setContextMenu,
  onReply,
  setEditingMessage,
}) => {
  const { user } = useUser();
  const { chat } = useChat();
  const isSent = message.sender_id === user.id;

  const handleDelete = () => {
    socket.emit("delete_message", message.id, user.id, chat.other_user_id);
  };

  const handlePin = () => {
    console.log("pinning message", message);
    socket.emit("pin_message", message.id, chat);
  };

  if (message.is_deleted)
    return (
      <div className={`message ${isSent ? "sent-message" : ""}`}>
        <h4 className="deleted-message m0">MESSAGE DELETED</h4>
      </div>
    );

  return (
    <div
      className={`message ${isSent ? "sent-message" : ""}`}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY,
          visible: true,
          message_id: message.id,
        });
      }}
    >
      {message.file_url && getMimeType(message.file_url) === "image" && (
        <a
          href={message.file_url}
          download
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={message.file_url} alt="Image" className="message-image" />
        </a>
      )}
      {message.file_url && getMimeType(message.file_url) === "video" && (
        <video controls src={message.file_url} className="message-video" />
      )}
      {message.file_url && getMimeType(message.file_url) === "raw" && (
        <a href={message.file_url} target="_blank" rel="noopener noreferrer">
          {" "}
          View Document{" "}
        </a>
      )}
      {message.reply && (
        <div className="message-reply-tag">
          <h5 className="m0">{trimText(message.reply, 30)}</h5>
        </div>
      )}
      <h4 className="message-content m0">{message.content}</h4>
      <div className="message-details">
        <p className="message-time">
          {new Date(message.created_at).toLocaleTimeString("default", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        <div className="message-tags">
          {message.is_edited && <p className="message-edit-tag">Edited</p>}
          {isSent && message.seen && <Icon icon="lucide:check" />}
        </div>
      </div>
      {contextMenu.visible && contextMenu.message_id === message.id && (
        <div
          className="chat-context-menu"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
        >
          {message.sender_id === user.id && (
            <p className="chat-context-menu-option" onClick={handleDelete}>
              Delete
            </p>
          )}

          {message.sender_id === user.id && !message.file_url && (
            <p
              className="chat-context-menu-option"
              onClick={() => setEditingMessage(message)}
            >
              Edit
            </p>
          )}
          <p className="chat-context-menu-option" onClick={handlePin}>
            Pin
          </p>
          <p className="chat-context-menu-option" onClick={onReply}>
            Reply
          </p>
        </div>
      )}
    </div>
  );
};

export default Message;

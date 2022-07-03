import React, { useContext, useState } from "react";
import UserAvatar from "../UserAvatar/UserAvatar";
import { UserContext } from "../../App";
import "./Message.css";
import editIcon from "../../assets/editicon.svg";
import trashIcon from "../../assets/trashicon.svg";

export default function Message({
  msg,
  formatDate,
  deleteMessage,
  handleUpdateMessage,
}) {
  const { authService } = useContext(UserContext);
  const [updateMessage, setUpdateMessage] = useState(false);

  return (
    <>
      <div
        key={msg.id}
        className={
          msg.userId === authService.id ? "sender-chat" : "chat-message"
        }
      >
        <UserAvatar
          avatar={{
            avatarName: msg.userAvatar,
            avatarColor: msg.userAvatarColor,
          }}
          size="md"
        />
        <div className="chat-user">
          <strong>{msg.userName}</strong>
          <small>{formatDate(msg.timeStamp)}</small>
          {!updateMessage ? (
            <div className="message-body">{msg.messageBody}</div>
          ) : (
            <form
              onSubmit={(e) => {
                handleUpdateMessage(e, msg.id);
                setUpdateMessage(false);
              }}
              className="edit-text-form"
            >
              <input
                name="updatedMessage"
                type="text"
                defaultValue={msg.messageBody}
              />
            </form>
          )}
          {msg.userId === authService.id && (
            <>
              <button
                className="delete-msg"
                onClick={() => deleteMessage(msg.id)}
                title="Delete message"
              >
                <img src={trashIcon} alt="delete-icon" />
              </button>
              <button
                className="edit-icon"
                title="Edit message"
                onClick={() => {
                  setUpdateMessage(!updateMessage);
                }}
              >
                <img src={editIcon} alt="edit-icon" />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

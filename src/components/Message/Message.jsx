import React, { useContext, useState } from "react";
import UserAvatar from "../UserAvatar/UserAvatar";
import { UserContext } from "../../App";

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
      <div key={msg.id} className="chat-message">
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
              <button onClick={() => deleteMessage(msg.id)}>Delete</button>
              <button
                onClick={() => {
                  setUpdateMessage(!updateMessage);
                }}
              >
                Edit Msg
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

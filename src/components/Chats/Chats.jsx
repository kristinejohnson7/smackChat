import React, { useEffect, useState, useContext } from "react";
import "./Chats.css";
import { UserContext } from "../../App";
import { formatDate } from "../../helpers/dateFormat";
import Message from "../Message/Message";

const Chats = ({ chats, setChannels, channels }) => {
  const {
    authService,
    chatService,
    appSelectedChannel,
    socketService,
    appSetChannel,
  } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");
  const [typingMessage, setTypingMessage] = useState("");
  const [isTying, setIsTyping] = useState(false);

  useEffect(() => {
    setMessages(chats);
  }, [chats]);

  useEffect(() => {
    if (appSelectedChannel?.id) {
      chatService
        .findAllMessagesForChannel(appSelectedChannel.id)
        .then((res) => setMessages(res))
        .catch((error) => console.error("Finding messages", error));
    }
  }, [appSelectedChannel]);

  useEffect(() => {
    socketService.getUserTyping((users) => {
      let names = "";
      let usersTyping = 0;
      for (const [typingUser, chId] of Object.entries(users)) {
        if (typingUser !== authService.name && appSelectedChannel.id === chId) {
          names = names === "" ? typingUser : `${names}, ${typingUser}`;
          usersTyping += 1;
        }
      }
      if (usersTyping > 0) {
        const verb = usersTyping > 1 ? "are" : "is";
        setTypingMessage(`${names} ${verb} typing a message...`);
      } else {
        setTypingMessage("");
      }
    });
  }, [appSelectedChannel]);

  const onTyping = ({ target: { value } }) => {
    if (!value.length) {
      setIsTyping(false);
      socketService.stopTyping(authService.name);
    } else if (!isTying) {
      socketService.startTyping(authService.name, appSelectedChannel.id);
    } else {
      setIsTyping(true);
    }
    setMessageBody(value);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const { name, id, avatarName, avatarColor } = authService;
    const user = {
      userName: name,
      userId: id,
      userAvatar: avatarName,
      userAvatarColor: avatarColor,
    };
    socketService.addMessage(messageBody, appSelectedChannel.id, user);
    socketService.stopTyping(authService.name);
    setMessageBody("");
  };

  const deleteChannel = () => {
    chatService.deleteChannel(appSelectedChannel.id).then(() => {
      chatService.findAllChannels().then((res) => {
        setChannels(res);
        appSetChannel(res[0]);
      });
    });
    chatService.messages.filter((message) => {
      if (message.channelId === appSelectedChannel.id) {
        chatService.deleteMessage(message.id);
      }
    });
  };

  const deleteMessage = (msgId) => {
    chatService.deleteMessage(msgId).then(() => {
      chatService
        .findAllMessagesForChannel(appSelectedChannel.id)
        .then((res) => {
          setMessages(res);
        })
        .catch((error) => {
          console.error("Deleting messages", error);
        });
    });
  };

  const handleUpdateMessage = (e, msgId) => {
    e.preventDefault();
    const fData = new FormData(e.target);
    const message = {
      ...chatService.messages.find((msg) => msg.id === msgId),
      messageBody: fData.get("updatedMessage"),
    };
    chatService
      .updateMessage(msgId, message)
      .then(() => {
        let newMessages = [];
        messages.forEach((msg) => {
          if (msg.id === msgId) {
            newMessages.push(message);
          } else {
            newMessages.push(msg);
          }
        });
        setMessages(newMessages);
      })
      .catch((error) => {
        console.error("Updating message", error);
      });
  };

  return (
    <>
      {channels.length ? (
        channels
          .map((channel) => channel.id)
          .includes(appSelectedChannel?.id) && (
          <div className="chat" key={appSelectedChannel?.id}>
            <div className="chat-header-container">
              <div className="chat-header">
                <h3>#{appSelectedChannel?.name} - </h3>
                <h4>{appSelectedChannel?.description}</h4>
              </div>
              <div className="channel-delete-container">
                <button
                  onClick={deleteChannel}
                  className="delete-ch-btn"
                  title="Delete Channel"
                >
                  <i className="fa-solid fa-trash fa-lg"></i>
                </button>
              </div>
            </div>

            <div className="chat-list">
              {!!messages.length ? (
                messages.map((msg) => (
                  <Message
                    msg={msg}
                    deleteMessage={deleteMessage}
                    formatDate={formatDate}
                    handleUpdateMessage={handleUpdateMessage}
                  />
                ))
              ) : (
                <div>No Messages</div>
              )}
            </div>
            <form onSubmit={sendMessage} className="chat-bar">
              <div className="typing">{typingMessage}</div>
              <div className="chat-wrapper">
                <textarea
                  onChange={onTyping}
                  value={messageBody}
                  placeholder="type a message..."
                />
                <button className="submit-btn">
                  <i class="fa-solid fa-paper-plane"></i>
                  SEND
                </button>
              </div>
            </form>
          </div>
        )
      ) : (
        <div className="no-chat">No chat messages</div>
      )}
    </>
  );
};

export default Chats;

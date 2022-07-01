import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import "./ChatApp.css";
import UserAvatar from "../UserAvatar/UserAvatar";
import Modal from "../Modal/Modal";
import { useHistory } from "react-router-dom";
import Channels from "../Channels/Channels";
import Chats from "../Chats/Chats";

const ChatApp = () => {
  const { authService, socketService, chatService } = useContext(UserContext);
  const history = useHistory();
  const [modal, setModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [unreadChannels, setUnreadChannels] = useState([]);

  useEffect(() => {
    socketService.establishConnection();
    return () => socketService.closeConnection();
  }, []);

  useEffect(() => {
    let isCancelled = false;
    socketService.getChatMessage((newMessage, messages) => {
      if (isCancelled) return;
      if (newMessage.channelId === chatService.selectedChannel.id) {
        setChatMessages(messages);
      }
      if (chatService.unreadChannels.length) {
        setUnreadChannels(chatService.unreadChannels);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  const logoutUser = () => {
    authService.logoutUser();
    setModal(false);
    //fixed memory leak from old router not releasing socket io emitters
    window.location = "/login";
    // history.push("/login", {});
  };

  const deleteUser = () => {
    const result = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (result) {
      authService.deleteUser().then(() => logoutUser());
      // logoutUser();
    }
  };

  return (
    <div className="chat-app">
      <nav>
        <h1>Smack Chat</h1>
        <div className="user-avatar" onClick={() => setModal(true)}>
          <UserAvatar size="sm" className="nav-avatar" />
          <div>{authService.name}</div>
        </div>
      </nav>
      <div className="smack-app">
        <Channels unread={unreadChannels} />
        <Chats chats={chatMessages} />
      </div>

      <Modal title="Profile" isOpen={modal} close={() => setModal(false)}>
        <div className="profile">
          <UserAvatar />
          <h4>Username: {authService.name}</h4>
          <h4>Email: {authService.email}</h4>
        </div>
        <button onClick={logoutUser} className="submit-btn logout-btn">
          Logout
        </button>
        <button onClick={deleteUser} className="submit-btn delete-btn">
          Delete User
        </button>
      </Modal>
    </div>
  );
};

export default ChatApp;

import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import "./ChatApp.css";
import UserAvatar from "../UserAvatar/UserAvatar";
import Modal from "../Modal/Modal";
import { useHistory } from "react-router-dom";
import Channels from "../Channels/Channels";
import Chats from "../Chats/Chats";
import { AVATARS } from "../../constants";

const ChatApp = () => {
  const { authService, socketService, chatService } = useContext(UserContext);
  const CURRENT_PROFILE = {
    name: authService.name,
    email: authService.email,
    avatarName: authService.avatarName,
    avatarColor: authService.avatarColor,
  };
  // const history = useHistory();
  const [modal, setModal] = useState(false);
  const [channels, setChannels] = useState([]);
  const [avatarModal, setAvatarModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [unreadChannels, setUnreadChannels] = useState([]);
  const [updateProfile, setUpdateProfile] = useState(false);
  const [userInfo, setUserInfo] = useState(CURRENT_PROFILE);
  const [avatarTheme, setAvatarTheme] = useState("Dark");

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
    //fixed memory leak from router not releasing socket io emitters
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

  const generateBgColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    setUserInfo({ ...userInfo, avatarColor: `#${randomColor}` });
  };

  const chooseAvatar = (avatar) => {
    setUserInfo({ ...userInfo, avatarName: avatar });
    setAvatarModal(false);
  };

  const handleUpdateProfile = () => {
    setUpdateProfile(true);
  };

  const onProfileUpdate = (e) => {
    // const { id } = userInfo;
    e.preventDefault();
    const fData = new FormData(e.target);
    const userData = {
      name: fData.get("userName"),
      email: fData.get("email"),
      avatarName: fData.get("avatarName"),
      avatarColor: fData.get("avatarColor"),
    };
    setUserInfo(userData);
    authService.updateUser(userData).then(() => {
      authService.setUserData({
        _id: authService.id,
        name: userData.name,
        email: userData.email,
        avatarName: userData.avatarName,
        avatarColor: userData.avatarColor,
      });
    });
    setUpdateProfile(false);
  };

  const { userName, email, avatarName, avatarColor } = userInfo;
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
        <Channels
          unread={unreadChannels}
          channels={channels}
          setChannels={setChannels}
        />
        <Chats
          setChannels={setChannels}
          channels={channels}
          chats={chatMessages}
        />
      </div>

      <Modal title="Profile" isOpen={modal} close={() => setModal(false)}>
        {!updateProfile && (
          <>
            <div className="profile">
              <UserAvatar avatar={{ avatarName, avatarColor }} />
              <h4>Username: {userInfo.name}</h4>
              <h4>Email: {userInfo.email}</h4>
            </div>
            <button
              onClick={handleUpdateProfile}
              className="submit-btn delete-btn"
            >
              Edit Profile
            </button>
            <button onClick={logoutUser} className="submit-btn logout-btn">
              Logout
            </button>
            <button onClick={deleteUser} className="submit-btn delete-btn">
              Delete User
            </button>
          </>
        )}
        {updateProfile && (
          <div>
            <div className="avatar-container">
              <UserAvatar
                avatar={{ avatarName, avatarColor }}
                className="create-avatar"
              />
              <div onClick={() => setAvatarModal(true)} className="avatar-text">
                Choose avatar
              </div>
              <div onClick={generateBgColor} className="avatar-text">
                Generate background color
              </div>
            </div>
            <form onSubmit={onProfileUpdate}>
              <input type="hidden" value={avatarColor} name="avatarColor" />
              <input type="hidden" value={avatarName} name="avatarName" />
              <label htmlFor="userName">
                User Name:
                <input
                  id="userName"
                  type="text"
                  name="userName"
                  defaultValue={authService.name}
                />
              </label>
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  id="email"
                  defaultValue={authService.email}
                />
              </label>
              <input type="submit" value="Save Changes" />
            </form>
          </div>
        )}
      </Modal>
      <Modal
        title="Choose Avatar"
        isOpen={avatarModal}
        close={() => setAvatarModal(false)}
      >
        <button onClick={() => setAvatarTheme("Dark")}>Dark</button>
        <button onClick={() => setAvatarTheme("Light")}>Light</button>
        <div className="avatar-list">
          {AVATARS.map((img) => (
            <div
              role="presentation"
              key={img}
              className="create-avatar"
              onClick={() => chooseAvatar(img)}
            >
              <img src={img} alt="avatar" />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default ChatApp;

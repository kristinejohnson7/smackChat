import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import "./ChatApp.css";
import UserAvatar from "../UserAvatar/UserAvatar";
import Modal from "../Modal/Modal";
import ModalBody from "../Modal/ModalBody";
import Channels from "../Channels/Channels";
import Chats from "../Chats/Chats";
import Button from "../Button/Button";
import Nav from "../Nav/Nav";
import FormBody from "../FormBody/FormBody";
import AvatarContainer from "../AvatarContainer/AvatarContainer";

const ChatApp = () => {
  const { authService, socketService, chatService } = useContext(UserContext);
  const CURRENT_PROFILE = {
    name: authService.name,
    email: authService.email,
    avatarName: authService.avatarName,
    avatarColor: authService.avatarColor,
  };
  const [modal, setModal] = useState(false);
  const [channels, setChannels] = useState([]);
  const [avatarModal, setAvatarModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [unreadChannels, setUnreadChannels] = useState([]);
  const [updateProfile, setUpdateProfile] = useState(false);
  const [userInfo, setUserInfo] = useState(CURRENT_PROFILE);

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
  };

  const deleteUser = () => {
    const result = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (result) {
      authService.deleteUser().then(() => logoutUser());
    }
  };

  const generateBgColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    setUserInfo({ ...userInfo, avatarColor: `#${randomColor}` });
  };

  const handleUpdateProfile = () => {
    setUpdateProfile(true);
  };

  const onProfileUpdate = (e) => {
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

  const { avatarName, avatarColor } = userInfo;

  const editProfile = [
    {
      type: "hidden",
      value: avatarColor,
      name: "avatarColor",
      forLabel: "avatarColor",
    },
    {
      type: "hidden",
      value: avatarName,
      name: "avatarName",
      forLabel: "avatarName",
    },
    {
      type: "text",
      id: "userName",
      name: "userName",
      defaultValue: `${authService.name}`,
      forLabel: "userName",
      label: "User Name:",
    },
    {
      type: "email",
      id: "email",
      name: "email",
      defaultValue: `${authService.email}`,
      forLabel: "email",
      label: "Email: ",
    },
  ];

  const chooseAvatar = (avatar) => {
    setUserInfo({ ...userInfo, avatarName: avatar });
    setAvatarModal(false);
  };

  return (
    <div className="chat-app">
      <Nav handleClick={() => setModal(true)} />
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
            <Button
              handleOnClick={handleUpdateProfile}
              title="Edit Profile"
              cname="profileBtn"
            />
            <Button
              handleOnClick={logoutUser}
              title="Logout"
              cname="logoutBtn"
            />
            <Button
              handleOnClick={deleteUser}
              title="Delete User"
              cname="deleteBtn"
            />
          </>
        )}
        {updateProfile && (
          <div>
            <AvatarContainer
              generateBgColor={generateBgColor}
              setModal={() => setAvatarModal(true)}
              avatarColor={avatarColor}
              avatarName={avatarName}
            />
            <form onSubmit={onProfileUpdate} className="form">
              <FormBody formValues={editProfile} />
              <Button title="Save Changes" cname="submitBtn" />
            </form>
          </div>
        )}
      </Modal>
      <Modal
        title="Choose Avatar"
        isOpen={avatarModal}
        close={() => setAvatarModal(false)}
      >
        <ModalBody chooseAvatar={chooseAvatar} />
      </Modal>
    </div>
  );
};

export default ChatApp;

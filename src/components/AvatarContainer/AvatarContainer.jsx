import React from "react";
import UserAvatar from "../UserAvatar/UserAvatar";
import "./AvatarContainer.css";

export default function AvatarContainer({
  generateBgColor,
  setModal,
  avatarColor,
  avatarName,
}) {
  return (
    <div className="avatar-container">
      <UserAvatar
        avatar={{ avatarName, avatarColor }}
        className="create-avatar"
      />
      <div onClick={setModal} className="avatar-text">
        Choose avatar
      </div>
      <div onClick={generateBgColor} className="avatar-text">
        Generate background color
      </div>
    </div>
  );
}

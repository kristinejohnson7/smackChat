import React, { useState } from "react";
import { DARK_AVATARS, LIGHT_AVATARS } from "../../constants";
import Button from "../Button/Button";
import "./ModalBody.css";

export default function ModalBody({ chooseAvatar }) {
  const [avatarTheme, setAvatarTheme] = useState("Dark");

  return (
    <>
      <div className="themeBtnContainer">
        <Button
          title="Dark"
          cname="themeBtn"
          handleOnClick={() => setAvatarTheme("Dark")}
        />
        <Button
          title="Light"
          cname="themeBtn"
          handleOnClick={() => setAvatarTheme("Light")}
        />
      </div>
      <div className="avatar-list">
        {avatarTheme === "Dark" &&
          DARK_AVATARS.map((img) => (
            <div
              role="presentation"
              key={img}
              className="create-avatar"
              onClick={() => chooseAvatar(img)}
            >
              <img src={img} alt="avatar" />
            </div>
          ))}
        {avatarTheme === "Light" &&
          LIGHT_AVATARS.map((img) => (
            <div
              role="presentation"
              key={img}
              className="create-avatar"
              onClick={() => chooseAvatar(img)}
              style={{ backgroundColor: "lightgrey" }}
            >
              <img src={img} alt="avatar" />
            </div>
          ))}
      </div>
    </>
  );
}

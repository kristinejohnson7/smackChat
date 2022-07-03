import React, { useContext } from "react";
import logo from "../../assets/smacklogo.png";
import UserAvatar from "../UserAvatar/UserAvatar";
import { UserContext } from "../../App";
import "./Nav.css";

export default function Nav({ handleClick }) {
  const { authService } = useContext(UserContext);

  return (
    <nav>
      <div className="nav-logo">
        <img src={logo} alt="smackchat-logo" />
      </div>
      <div className="user-avatar" onClick={handleClick}>
        <UserAvatar size="sm" className="nav-avatar" />
        <div>{authService.name}</div>
      </div>
    </nav>
  );
}

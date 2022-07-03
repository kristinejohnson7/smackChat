import React from "react";
import "./Button.css";

export default function Button({ handleOnClick, title, cname }) {
  return (
    <button onClick={handleOnClick} className={`defaultBtn ${cname}`}>
      {title}
    </button>
  );
}

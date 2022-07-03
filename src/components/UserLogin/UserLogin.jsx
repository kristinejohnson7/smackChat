import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import Alert from "../Alert/Alert";
import logo from "../../assets/smackpurplelogo.png";
import loginPic from "../../assets/hero.png";
import "./UserLogin.css";
import Button from "../Button/Button";
import FormBody from "../FormBody/FormBody";

const UserLogin = ({ location, history }) => {
  const { authService } = useContext(UserContext);
  const [userLogins, setUserLogins] = useState({ email: "", password: "" });
  const [error, setError] = useState(false);

  const onChange = ({ target: { name, value } }) => {
    setUserLogins({ ...userLogins, [name]: value });
  };

  const onLoginUser = (e) => {
    e.preventDefault();
    const { email, password } = userLogins;
    if (!!email && !!password) {
      const { from } = location.state || { from: { pathname: "/" } };
      authService
        .loginUser(email, password)
        .then(() => history.replace(from))
        .catch(() => {
          setError(true);
          setUserLogins({ email: "", password: "" });
        });
    }
  };
  const errorMsg = "Sorry, you entered an incorrect email or password";

  const loginData = [
    {
      value: userLogins.email,
      type: "email",
      name: "email",
      placeholder: "youremail@gmail.com",
    },
    {
      value: userLogins.password,
      type: "password",
      name: "password",
      placeholder: "password",
    },
  ];

  return (
    <div className="loginContainer">
      <div className="loginLogo">
        <img src={logo} alt="smackChat-logo" />
      </div>
      <div className="center-display">
        {error ? <Alert message={errorMsg} type="alert-danger" /> : null}
        <form onSubmit={onLoginUser} className="form">
          <label>
            Enter your <strong>email address</strong> and{" "}
            <strong>password</strong>
          </label>
          <FormBody formValues={loginData} onChange={onChange} />
          <Button cname="submitBtn" title="Sign In" />
        </form>
        <div className="footer-text">
          No Account? Create one
          <Link to="/register"> HERE</Link>
        </div>
      </div>
      <div className="heroImg">
        <img src={loginPic} alt="connect-img" />
      </div>
    </div>
  );
};

export default UserLogin;

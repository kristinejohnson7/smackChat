import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Modal from "../Modal/Modal";
import "./UserCreate.css";
import { UserContext } from "../../App";
import Alert from "../Alert/Alert";
// import UserAvatar from "../UserAvatar/UserAvatar";
import ModalBody from "../Modal/ModalBody";
import Button from "../Button/Button";
import AvatarContainer from "../AvatarContainer/AvatarContainer";
import FormBody from "../FormBody/FormBody";

const UserCreate = ({ history }) => {
  const { authService } = useContext(UserContext);
  const INIT_STATE = {
    userName: "",
    email: "",
    password: "",
    avatarName: "avatarDefault.png",
    avatarColor: "none",
  };
  const [userInfo, setUserInfo] = useState(INIT_STATE);
  const [avatarModal, setAvatarModal] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onChange = ({ target: { name, value } }) => {
    setUserInfo({ ...userInfo, [name]: value });
  };

  const generateBgColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    setUserInfo({ ...userInfo, avatarColor: `#${randomColor}` });
  };

  const createUser = (e) => {
    e.preventDefault();
    const { userName, email, password, avatarName, avatarColor } = userInfo;
    if (!!userName && !!email && !!password) {
      setIsLoading(true);
      authService
        .registerUser(email, password)
        .then(() => {
          authService
            .loginUser(email, password)
            .then(() => {
              authService
                .createUser(userName, email, avatarName, avatarColor)
                .then(() => {
                  setUserInfo(INIT_STATE);
                  history.push("/");
                })
                .catch((error) => {
                  console.error("creating user", error);
                  setError(true);
                });
            })
            .catch((error) => {
              console.error("logging in user", error);
              setError(true);
            });
        })
        .catch((error) => {
          console.error("registering user", error);
          setError(true);
        });
      setIsLoading(false);
    }
  };

  const { userName, email, password, avatarName, avatarColor } = userInfo;
  const errorMsg = "Error creating account. Please try again.";

  const userCreateValues = [
    {
      value: `${userName}`,
      type: "text",
      name: "userName",
      placeholder: "Enter username",
    },
    {
      value: `${email}`,
      type: "email",
      name: "email",
      placeholder: "Enter email",
    },
    {
      value: `${password}`,
      type: "password",
      name: "password",
      placeholder: "Enter password",
    },
  ];

  return (
    <>
      <div className="center-display">
        {error ? <Alert message={errorMsg} type="alert-danger" /> : null}
        {isLoading ? <div>Loading...</div> : null}
        <h3 className="title">Create an account</h3>
        <form onSubmit={createUser} className="form">
          <FormBody onChange={onChange} formValues={userCreateValues} />
          <AvatarContainer
            generateBgColor={generateBgColor}
            setModal={() => setAvatarModal(true)}
            avatarColor={avatarColor}
            avatarName={avatarName}
          />
          <Button cname="submitBtn" title="Create Account" />
        </form>
        <div className="footer-text">
          Already have an Account? Login <Link to="/login">HERE</Link>
        </div>
      </div>

      <Modal
        title="Choose Avatar"
        isOpen={avatarModal}
        close={() => setAvatarModal(false)}
      >
        <ModalBody
          setUserInfo={setUserInfo}
          userInfo={userInfo}
          setAvatarModal={setAvatarModal}
        />
      </Modal>
    </>
  );
};

export default UserCreate;

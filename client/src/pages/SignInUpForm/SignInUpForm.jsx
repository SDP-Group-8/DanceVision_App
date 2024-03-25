import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignInUpForm.module.css";
import { Box } from "@chakra-ui/react";
import { MdOutlineEmail } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { MdLock } from "react-icons/md";
import { LiaUserSecretSolid } from "react-icons/lia";
import axios from "axios";
import useLogin from "../../hooks/useLogin";
import {setUserInfo, getUserInfo} from '../../utils/localstorage'

function SignInUpForm() {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    setIsSignUpActive(true);
  };

  const handleSignInClick = () => {
    setIsSignUpActive(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitted");
    console.log(name);
    console.log(email);
    console.log(password);
    navigate("/home");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("Submitted");
    console.log(name);
    console.log(email);
    console.log(password);

    // // Call API to submit data to backend
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/login",
        { email: email, password: password },
        { responseType: "json" }
      );

      console.log(response);

      const status = response.data.status;
      if (status === "success") {
        console.log("Login Successful");
        const userName = response.data.username
        setUserInfo(userName)
        console.log("Local storage : ",getUserInfo())
        navigate("/home");
      } else {
        console.log("Login Failed");
        alert(`Invalid Email or Password`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    console.log("Submitted");
    console.log(name);
    console.log(email);
    console.log(password);

    // // Call API to submit data to backend
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/register",
        { name: name, email: email, password: password },
        { responseType: "json" }
      );

      console.log(response);

      const status = response.data.status;
      if (status === "success") {
        console.log("Register Successful");
        alert(`SignUp Successful`);
        navigate("/home");
      } else {
        console.log("Register Failed");
        alert(`Invalid Email or Password`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box className={styles["body"]}>
      <div
        className={`${styles.container} ${
          isSignUpActive ? styles["right-panel-active"] : ""
        }`}
      >
        <div
          className={
            styles["form-container"] + " " + styles["sign-up-container"]
          }
        >
          <form onSubmit={handleRegister}>
            <h1 className={styles["h1"]}>Create Account</h1>
            <div className={styles["input-wrapper"]}>
              <FiUser className={styles["email-icon"]} size={20} />
              <input
                type="text"
                placeholder="Name"
                className={styles["input"]}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className={styles["input-wrapper"]}>
              <LiaUserSecretSolid className={styles["email-icon"]} size={20} />
              <input
                type="text"
                placeholder="User Name (Must be unique)"
                className={styles["input"]}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className={styles["input-wrapper"]}>
              <MdOutlineEmail className={styles["email-icon"]} size={20} />
              <input
                type="email"
                placeholder="Email"
                className={styles["input"]}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className={styles["input-wrapper"]}>
              <MdLock className={styles["email-icon"]} size={20} />
              <input
                type="password"
                placeholder="Password"
                className={styles["input"]}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="password"
              />
            </div>
            <button className={styles["button"]}>Sign Up</button>
          </form>
        </div>
        <div
          className={
            styles["form-container"] + " " + styles["sign-in-container"]
          }
        >
          <form onSubmit={handleLogin}>
            <h1 className={styles["h1"]}>Sign in</h1>
            {/* <span>or use your account</span> */}
            <div className={styles["input-wrapper"]}>
              <MdOutlineEmail className={styles["email-icon"]} size={20} />
              <input
                type="email"
                placeholder="Email"
                className={styles["input"]}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className={styles["input-wrapper"]}>
              <MdLock className={styles["email-icon"]} size={20} />
              <input
                type="password"
                placeholder="Password"
                className={styles["input"]}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="password"
              />
            </div>
            <a href="#">Forgot your password?</a>
            <button className={styles["button"]}>Sign In</button>
          </form>
        </div>
        <div className={styles["overlay-container"]}>
          <div className={styles.overlay}>
            <div
              className={styles["overlay-panel"] + " " + styles["overlay-left"]}
            >
              <h1>Already have an account!</h1>
              <p className={styles.p}>
                Login to continue using the the best social media platform for
                dancing
              </p>
              <button className={`${styles.ghost}`} onClick={handleSignInClick}>
                Sign In
              </button>
            </div>
            <div
              className={
                styles["overlay-panel"] + " " + styles["overlay-right"]
              }
            >
              <h1>New here?</h1>
              <p className={styles.p}>
                Unlock a world of possibilities! Create an account and start
                your journey with us today.
              </p>
              <button className={`${styles.ghost}`} onClick={handleSignUpClick}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default SignInUpForm;

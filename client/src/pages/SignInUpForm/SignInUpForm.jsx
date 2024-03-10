import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignInUpForm.module.css";
import { Box } from "@chakra-ui/react";
import { MdOutlineEmail } from "react-icons/md";

function SignInUpForm() {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [name, setName] = useState("");
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
          <form onSubmit={handleSubmit}>
            <h1 className={styles["h1"]}>Create Account</h1>
            {/* <div className={styles["input-wrapper"]}> */}
              {/* <MdOutlineEmail className={styles["email-icon"]} size={20} /> */}
              <input
                type="text"
                placeholder="Name"
                value={name}
                className={styles["input"]}
                onChange={(e) => setName(e.target.value)}
              />
            {/* </div> */}

            <input
              type="email"
              placeholder="Email"
              className={styles["input"]}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className={styles["input"]}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className={styles["button"]}>Sign Up</button>
          </form>
        </div>
        <div
          className={
            styles["form-container"] + " " + styles["sign-in-container"]
          }
        >
          <form onSubmit={handleSubmit}>
            <h1 className={styles["h1"]}>Sign in</h1>
            {/* <span>or use your account</span> */}
            <input
              type="email"
              placeholder="Email"
              className={styles["input"]}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className={styles["input"]}
              onChange={(e) => setPassword(e.target.value)}
            />
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

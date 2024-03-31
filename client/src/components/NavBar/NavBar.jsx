import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./NavBar.module.css";
import { loggedOut } from "../../utils/localstorage";
// import COLORS from '../constants/theme';

const NavBar = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        loggedOut()
        navigate("/login")

    }
  return (
    <div className={styles.container}>
      <div>
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          Logo
        </Link>
      </div>
      <div className={styles.link_container}>
        <Link to="/leaderboard" className={styles.link}>
          LeaderBoard
        </Link>
        <Link to="/profile" className={styles.link}>Profile</Link>
        <Button
            onClick={handleLogout}
        >Log Out</Button>
      </div>
    </div>
  );
};

export default NavBar;

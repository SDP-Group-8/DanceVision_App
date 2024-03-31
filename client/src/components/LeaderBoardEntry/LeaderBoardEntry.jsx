import React from "react";
import styles from "./LeaderBoardEntry.module.css";
import { getUserInfo } from "../../utils/localstorage";

const LeaderBoardEntry = ({ rank, name, username, score, refVideo }) => {
  const current_username = getUserInfo();

  const getBackgroundColor = () => {
    if (current_username === username) {
      return styles.current_user;
    } else {
      return styles.normal_user;
    }
  };

  return (
    <div className={`${styles.container} ${getBackgroundColor()}`}>
      <p className={`${styles.text}`}>{rank}</p>
      <p className={`${styles.text}`}>{name}</p>
      <p className={`${styles.text}`}>{username}</p>
      <p className={`${styles.text}`}>{score}</p>
      <p className={`${styles.text}`}>{refVideo}</p>
    </div>
  );
};

export default LeaderBoardEntry;

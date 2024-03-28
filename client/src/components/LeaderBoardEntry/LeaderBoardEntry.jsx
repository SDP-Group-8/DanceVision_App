import React from 'react'
import styles from './LeaderBoardEntry.module.css'

const LeaderBoardEntry = ({rank, name, username, score, refVideo}) => {
  return (
    <div className={styles.container}>
      <p className={`${styles.text}`}>{rank}</p>
      <p className={`${styles.text}`}>{name}</p>
      <p className={`${styles.text}`}>{username}</p>
      <p className={`${styles.text}`}>{score}</p>
      <p className={`${styles.text}`}>{refVideo}</p>
    </div>
  )
}

export default LeaderBoardEntry
import React from 'react'
import styles from './LeaderBoardCard.module.css'

const LeaderBoardCard = ({rank, name, username, score, attempt_time}) => {
  return (
    <div className={`${styles.body} ${styles.fancy}`}>
        <div className={styles.rankContainer}>
        <p className={`${styles.text} ${styles.rank}`}>Rank : {rank}</p>
        </div>
        <div className={styles.upper}>
            <div className={styles.upper}>
                <p className={`${styles.text} ${styles.name}`}>{name}</p>
                <p className={`${styles.text} ${styles.username}`}>@{username}</p>
            </div>
        </div>
        <hr className={styles.line} />
        <div className={styles.lower}>
            <div className={styles.timeContainer}>
                <p className={`${styles.text}`}>Attempt Time</p>
                <p className={`${styles.text}`}>{attempt_time}</p>
                
            </div>
            <div className={styles.scoreContainer}>
                <p className={`${styles.text}`}>Score</p>
                <p className={`${styles.text}`}>{score}%</p>
            </div>
        </div>
    </div>
  )
}

export default LeaderBoardCard
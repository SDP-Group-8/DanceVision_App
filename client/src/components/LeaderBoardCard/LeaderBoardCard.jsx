import React from 'react'
import styles from './LeaderBoardCard.module.css'

const LeaderBoardCard = () => {
  return (
    <div className={`${styles.body} ${styles.fancy}`}>
        <div className={styles.rankContainer}>
        <p className={`${styles.text} ${styles.rank}`}>Rank : 1</p>
        </div>
        <div className={styles.upper}>
            <div className={styles.upper}>
                <p className={`${styles.text} ${styles.name}`}>Abhay Maurya</p>
                <p className={`${styles.text} ${styles.username}`}>@abhay452002</p>
            </div>
        </div>
        <hr className={styles.line} />
        <div className={styles.lower}>
            <div className={styles.timeContainer}>
                <p className={`${styles.text}`}>Attempt Time</p>
                <p className={`${styles.text}`}>27/03/2024 23:22:11 </p>
                
            </div>
            <div className={styles.scoreContainer}>
                <p className={`${styles.text}`}>Score</p>
                <p className={`${styles.text}`}>95%</p>
            </div>
        </div>
    </div>
  )
}

export default LeaderBoardCard
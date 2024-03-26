
import { useEffect, useState } from 'react'
import styles from './LiveScore.module.css'

const LiveScore = ({score=0}) => {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    setIsMobile(screen.width <= 400)
  }, [])

  const getColor = (currentScore) => {
    if(currentScore >= 70) {
      return 'green'
    }
    else if(currentScore >= 40) {
      return 'yellow'
    }
    return 'red'
  }

  const getNewHeight = (currentScore) => {
    if(isMobile) {
      return {height:`100%`}
    }

    return {height:`${score}%`}
  }
  return (
  <div className={styles.liveScore}>
    <h1 className={`${styles[`score_${getColor(score)}`]}`}>{score}</h1>
    <div className={styles.bar_container}>
      <div className={`${styles.bar} ${styles[getColor(score)]}`} style={getNewHeight(score)}></div>
      <div className={`${styles.blur} ${styles[getColor(score)]}`} style={getNewHeight(score)}></div>
    </div>
   
  </div>
  )
}

export default LiveScore
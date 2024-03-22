
import styles from './LiveScore.module.css'

const LiveScore = ({score=0}) => {
  const getColor = (currentScore) => {
    if(currentScore >= 70) {
      return 'green'
    }
    else if(currentScore >= 40) {
      return 'yellow'
    }
    return 'red'
  }
  return (
  <div className={styles.liveScore}>
    <h1 className={`${styles[`score_${getColor(score)}`]}`}>{score}</h1>
    <div className={styles.bar_container}>
      <div className={`${styles.bar} ${styles[getColor(score)]}`} style={{height:`${score}%`}}></div>
      <div className={`${styles.blur} ${styles[getColor(score)]}`} style={{height:`${score}%`}}></div>
    </div>
   
  </div>
  )
}

export default LiveScore
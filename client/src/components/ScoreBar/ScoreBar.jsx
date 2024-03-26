
import useScoreChannel from '../../hooks/useScoreChannel';
import LiveScore from '../LiveScore/LiveScore';
import styles from './ScoreBar.module.css';

const ScoreBar = (props) => {
    const {latestScore} = useScoreChannel(props.scoreChannel)

    return (
        <div className={styles.rightPanel}>
            <h1>Your Score</h1>  
            <LiveScore score={100}/>    
        </div>
    )
}

export default ScoreBar

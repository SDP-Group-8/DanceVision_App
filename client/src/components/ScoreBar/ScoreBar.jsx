
import usePeerConnection from '../../hooks/usePeerConnection';
import useScoreChannel from '../../hooks/useScoreChannel';
import LiveScore from '../LiveScore/LiveScore';
import styles from './ScoreBar.module.css';

const ScoreBar = () => {
    const {scoreChannel} = usePeerConnection(import.meta.env.VITE_API_URL, false)
    const {latestScore} = useScoreChannel(scoreChannel)

    return (
        <div className={styles.rightPanel}>
            <h1>Your Score</h1>  
            <LiveScore score={100}/>    
        </div>
    )
}

export default ScoreBar

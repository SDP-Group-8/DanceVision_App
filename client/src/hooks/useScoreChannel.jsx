import { useState, useEffect} from 'react';

const useScoreChannel = (scoreChannel) => {
    const [latestScore, setLatestScore] = useState(0.0)

    useEffect(() => {
        if (scoreChannel !== undefined){
            scoreChannel.onmessage = (event) => {
                setLatestScore(event.data)
            };
        }
    }, [scoreChannel])

    return {latestScore}
}

export default useScoreChannel;

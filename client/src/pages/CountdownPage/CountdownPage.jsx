import React, { useState } from "react";
import { CountdownDonut } from "../../components/CountdownDonut";
import { Spinner } from '@chakra-ui/react'
import { useLocation } from "react-router-dom";
import useStatusChannel from "../../hooks/useStatusChannel";
import DanceScreen from "../../components/DanceScreen/DanceScreen";
import usePeerReceiver from "../../hooks/usePeerReceiver";

let initial = false

const CountdownPage = () => {
    const countdown = 5;
    const [ started, setStarted ] = useState(false)
    const { state } = useLocation();

    const { statusChannel } = usePeerReceiver(import.meta.env.VITE_API_URL, !initial, {videoName: state.videoName})
    initial = true
    
    const { isInFrame } = useStatusChannel(statusChannel)

    React.useEffect(() => {
        let timeout = undefined
        
        if(isInFrame){
            timeout = setTimeout(() => {
                setStarted(true)
            }, countdown * 1000)
        }

        return () => {
            if(timeout !== undefined){
                clearTimeout(timeout)
            }   
        }
    }, [isInFrame])

    if(started){
        return <DanceScreen/>
    }else if(isInFrame){
        return <CountdownDonut initialSeconds={countdown}/>
    }

    return <Spinner/>
}

export default CountdownPage;

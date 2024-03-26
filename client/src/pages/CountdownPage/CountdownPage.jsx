import React, { useState } from "react";
import { CountdownDonut } from "../../components/CountdownDonut";
import { Spinner } from '@chakra-ui/react'
import { useLocation } from "react-router-dom";
import useStatusChannel from "../../hooks/useStatusChannel";
import DanceScreen from "../../components/DanceScreen/DanceScreen";
import usePeerReceiver from "../../hooks/usePeerReceiver";

let initial = false

const CountdownPage = () => {
    const { state } = useLocation();

    const { statusChannel } = usePeerReceiver(import.meta.env.VITE_API_URL, !initial, {videoName: state.videoName})
    initial = true
    
    const { isInFrame } = useStatusChannel(statusChannel)

    if(isInFrame){
        return <DanceScreen/>
    }

    return <Spinner/>
}

export default CountdownPage;

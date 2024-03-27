import axios from 'axios';
import { useEffect, useState } from 'react';
import { establishConnection } from '../peerConnection';
import { getUserInfo } from '../utils/localstorage';

let reloaded = false

const usePeerConnection = (url, negotiate = false, options = {}) => {
    const [recordingDate, setRecordingDate] = useState(false)
    const [peerConnection, setPeerConnection] = useState(undefined)
    const [scoreChannel, setScoreChannel] = useState(undefined)

    const config = {
        sdpSemantics: 'unified-plan'
    };

    const info = getUserInfo()

    useEffect(() => {
        const getVideoStream = async () => {
            const pc =new RTCPeerConnection(config)
            setPeerConnection(pc)

            pc.addTransceiver('video', { direction: 'recvonly' });
            pc.addTransceiver('video', { direction: 'recvonly' });
            const scoreChannel = pc.createDataChannel("score")
            setScoreChannel(scoreChannel)

            const params = new URLSearchParams({"video_name": options.videoName, "user_id": info})

            if(!reloaded){
                await axios.delete(import.meta.env.VITE_API_URL + "/clear-connection")
                await axios.get(import.meta.env.VITE_API_URL + "/open-window")
                reloaded = true
            }
            const res = axios.get(import.meta.env.VITE_API_URL + "/start-reference?" + params)
            const response = await establishConnection(pc, url, res)
            setRecordingDate(response.data.datetime)
        };
        if(negotiate){
            getVideoStream();
        }

    }, [])

    console.log(scoreChannel)

    return {peerConnection, scoreChannel, recordingDate}
}

export default usePeerConnection;
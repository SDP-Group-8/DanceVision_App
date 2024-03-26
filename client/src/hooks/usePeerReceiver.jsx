import axios from 'axios';
import { useEffect, useState } from 'react';
import { establishConnection } from '../peerConnection';

const usePeerReceiver = (url, negotiate = false, options = {}) => {
    const config = {
        sdpSemantics: 'unified-plan'
    };

    const [peerConnection, setPeerConnection] = useState(undefined)
    const [statusChannel, setStatusChannel] = useState(undefined)

    useEffect(() => {
        const getVideoStream = async () => {
            const pc = new RTCPeerConnection(config)
            setPeerConnection(pc)

            pc.addTransceiver('video', { direction: 'recvonly' });
            setStatusChannel(pc.createDataChannel("movement"))

            axios.get(import.meta.env.VITE_API_URL + "/start-streamer")
            const res = axios.get(import.meta.env.VITE_API_URL + "/start-video")
            await establishConnection(pc, url, res)
        };
        if(negotiate){
            getVideoStream();
        }

        return async () => {
            peerConnection.close()
        }
    }, [])

    return {peerConnection, statusChannel}
}

export default usePeerReceiver;
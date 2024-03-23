import axios from 'axios';
import { useEffect, useState } from 'react';

const SERVER_IDENTIFER = "server"

let peerConnection = undefined
let scoreChannel = undefined
let statusChannel = undefined

const usePeerConnection = (url, negotiate = false, options = {}) => {
    const [recordingDate, setRecordingDate] = useState(false)
    const [statusChannel, setStatusChannel] = useState(undefined)

    const config = {
        sdpSemantics: 'unified-plan'
    };

    useEffect(() => {
        const getVideoStream = async () => {
            const pc =new RTCPeerConnection(config)
            peerConnection = pc

            pc.addTransceiver('video', { direction: 'recvonly' });
            pc.addTransceiver('video', { direction: 'recvonly' });
            scoreChannel = pc.createDataChannel("score")
            statusChannel = pc.createDataChannel("movement")

            const params = new URLSearchParams({"basename": options.basename, "video_name": options.videoName})
            const res = axios.get(import.meta.env.VITE_API_URL + "/start-video?" + params)

            const offer = await pc.createOffer()
            pc.setLocalDescription(offer);

            // wait for ICE gathering to complete
            await new Promise((resolve) => {
                if (pc.iceGatheringState === 'complete') {
                    resolve();
                } else {
                    const checkState = () => {
                        if (pc.iceGatheringState === 'complete') {
                            pc.removeEventListener('icegatheringstatechange', checkState);
                            resolve();
                        }
                    };
                    pc.addEventListener('icegatheringstatechange', checkState);
                }
            });
        
            const payload = {
                "sdp": pc.localDescription.sdp,
                "type": pc.localDescription.type,
                "host_id": SERVER_IDENTIFER
            }
    
            const getAnswer = async () => {
                let connection_answer = null;

                while (connection_answer === null) {
                    try {
                        const res = await axios.get(url + "/request-answer?" + new URLSearchParams({"host_id": SERVER_IDENTIFER}))
                        connection_answer = res.data
                    } catch {
                        await new Promise(r => setTimeout(r, 2000))
                    }
                }
                
                return connection_answer
            }

            try {
                const axios1 = axios.create({
                    baseURL: url
                });

                await axios1.post('/offer', payload);
                const connection_answer = await getAnswer()
                pc.setRemoteDescription(connection_answer);
            } catch (error) {
                console.error(error);
            }

            const response = await res;
            setRecordingDate(response.data.datetime)
        };
        if(negotiate){
            getVideoStream();
        }

        return async () => {
            peerConnection.close()
        }
    }, [])

    return {peerConnection, scoreChannel, statusChannel, recordingDate}
}

export default usePeerConnection;
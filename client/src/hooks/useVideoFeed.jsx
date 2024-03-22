import axios from 'axios';
import { useState, useEffect} from 'react';

const SERVER_IDENTIFER = "server"

const useVideoFeed = (url, basename, videoName, options = {}) => {
    const [liveVideoSource, setLiveVideoSource] = useState(new MediaStream());
    const [recordedVideoSource, setRecordedVideoSource] = useState(new MediaStream());
    const [isVideoAvailable, setVideoAvailable] = useState(false);
    const [isConnectionClosed, setConnectionClosed] = useState(false);
    const [recordingDate, setRecordingDate] = useState(false)
    const [latestScore, setLatestScore] = useState(0.0)
    const [isInFrame, setInFrame] = useState(false)

    var config = {
        sdpSemantics: 'unified-plan'
    };

    const pc = new RTCPeerConnection(config);

    pc.addEventListener("connectionstatechange", event => {
        console.log(pc.connectionState)
        switch (pc.connectionState) {
            case "disconnected":
                setConnectionClosed(true)
                break;
        }
    }, false)

    useEffect(() => {
        const getVideoStream = async () => {
            const params = new URLSearchParams({"basename": basename, "video_name": videoName})
            const res = axios.get(import.meta.env.VITE_API_URL + "/start-video?" + params)
            
            pc.addTransceiver('video', { direction: 'recvonly' });
            pc.addTransceiver('video', { direction: 'recvonly' });
            const score_channel = pc.createDataChannel("score")
            const status_channel = pc.createDataChannel("movement")

            score_channel.onmessage = (event) => {
                setLatestScore(event.data)
            };

            status_channel.onmessage = (event) => {
                const message = JSON.parse(event.data)
                if (message.ready) {
                    setInFrame(true)
                }
            }

            const offer = await pc.createOffer()
            pc.setLocalDescription(offer);
            
            pc.addEventListener('track', (evt) => {
                if (evt.track.kind == 'video') {
                    if(evt.transceiver.mid === "0"){
                        setLiveVideoSource(new MediaStream([evt.track]));
                    }else if(evt.transceiver.mid === "1"){
                        setRecordedVideoSource(new MediaStream([evt.track]));
                    }

                    setVideoAvailable(true);                    
                }
            });

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
        getVideoStream();

        return async () => {
            pc.close()
        }
    }, [])

    return {liveVideoSource, recordedVideoSource, isVideoAvailable, isConnectionClosed, recordingDate, latestScore, isInFrame}
}

export default useVideoFeed;
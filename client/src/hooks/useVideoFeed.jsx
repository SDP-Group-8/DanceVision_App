import axios from 'axios';
import { useState, useEffect} from 'react';

const useVideoFeed = (url, options = {}) => {
    const [videoSource, setVideoSource] = useState(new MediaStream());
    const [isVideoAvailable, setVideoAvailable] = useState(false);
    
    var config = {
        sdpSemantics: 'unified-plan'
    };

    const pc = new RTCPeerConnection(config);

    useEffect(() => {
        const getVideoStream = async () => {
            pc.addTransceiver('video', { direction: 'recvonly' });
            const offer = await pc.createOffer()
            pc.setLocalDescription(offer);
            
            pc.addEventListener('track', (evt) => {
                if (evt.track.kind == 'video') {
                    setVideoSource(evt.streams[0]);
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
    
            const axios1 = axios.create({
                baseURL: 'http://localhost:8000'
            });
        
            const payload = {"sdp": pc.localDescription.sdp, "type": pc.localDescription.type}
    
            try {
                const response = await axios1.post('/stream_offer', payload);
                pc.setRemoteDescription(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        getVideoStream();
    }, [])

    return {videoSource, isVideoAvailable}
}

export default useVideoFeed;
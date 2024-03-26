import axios from 'axios';
import { useState, useEffect} from 'react';

const useVideoFeed = (peerConnection, options = {}) => {
    const [liveVideoSource, setLiveVideoSource] = useState(new MediaStream());
    const [isVideoAvailable, setVideoAvailable] = useState(false);
    const [isConnectionClosed, setConnectionClosed] = useState(false);
    
    if (peerConnection !== undefined) {
        peerConnection.addEventListener("connectionstatechange", event => {
            console.log(peerConnection.connectionState)
            switch (peerConnection.connectionState) {
                case "disconnected":
                    setConnectionClosed(true)
                    break;
            }
        }, false)

        peerConnection.addEventListener('track', (evt) => {
            if (evt.track.kind == 'video') {
                if(evt.transceiver.mid === "0"){
                    setLiveVideoSource(new MediaStream([evt.track]));
                }
    
                setVideoAvailable(true);                    
            }
        });
    }

    return {liveVideoSource, isVideoAvailable, isConnectionClosed}
}

export default useVideoFeed;
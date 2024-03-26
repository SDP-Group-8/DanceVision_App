import axios from "axios";
import { useEffect, useState } from "react";

const useReferenceVideo = (peerConnection, options = {}) => {

    const [recordedVideoSource, setRecordedVideoSource] = useState(new MediaStream());

    if(peerConnection !== undefined){
        peerConnection.addEventListener('track', (evt) => {
            if (evt.track.kind == 'video') {
                if(evt.transceiver.mid === "1"){
                    setRecordedVideoSource(new MediaStream([evt.track]));
                }                
            }
        });
    }

    return {recordedVideoSource}
}

export default useReferenceVideo;

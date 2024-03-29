import { useState, useEffect} from 'react';

const useStatusChannel = (statusChannel) => {
    const [isInFrame, setInFrame] = useState(false)

    useEffect(() => {
        if (statusChannel !== undefined){
            statusChannel.onmessage = (event) => {
                const message = JSON.parse(event.data)
                if (message.ready) {
                    setInFrame(true)
                }
            }
        }
    })

    return {isInFrame}
}

export default useStatusChannel;
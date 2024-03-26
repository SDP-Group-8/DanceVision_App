import axios from "axios";

const SERVER_IDENTIFER = "server"

async function establishConnection(pc, url, promise) {
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

    return await promise;
}

export { establishConnection }
var peer = null;
let sdp = "";
const queryString=window.location.search;
const urlParams = new URLSearchParams(queryString);
const host_port = urlParams.get('url');
const url = "http://" + host_port + "/";

fetch(url + "request-offer",
{
    method: "get",
    headers: {
        'Content-Type': 'text/plain'
    }
})
.then(response=> response.json())
.then(data => {
    createPeer(data.offer)
});
function createPeer (offerSDP) {
    let config = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' }
        ]
    };
    
    peer = new RTCPeerConnection(config);
    
    captureCamera(offerSDP);
}

async function showDevices() {    
    let devices = (await navigator.mediaDevices.enumerateDevices()).filter(i=> i.kind == 'videoinput')
    console.log(devices)
}

function captureCamera (sdpOffer) {
    let constraints = {
        audio: false,
        /*
        video: {            
            deviceId: { exact: '4e9606ec398f795755efea4f4b75f206f5b5140f5a9ee8ee51e81154c220f97a' }
        }                
        */
       video: true
    }; 

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        stream.getTracks().forEach(function(track) {

            applyContraints(track);

            peer.addTrack(track, stream);            
        });
        console.log('sdpOffer', sdpOffer);
        return createAnswer(sdpOffer);
    }, function(err) {
        alert('Could not acquire media: ' + err);
    });
}


async function createAnswer (sdp) {
    let offer = new RTCSessionDescription({sdp: sdp, type: 'offer'});
    await peer.setRemoteDescription(offer);
    let answer = await peer.createAnswer();

    await peer.setLocalDescription(answer);
    console.log("answer set");
    console.log(peer.iceGatheringState);
    await new Promise(resolve => {
        if (peer.iceGatheringState === 'complete') {
            resolve();
        } else {
            const checkState = () => {
                if (peer.iceGatheringState === 'complete') {
                    peer.removeEventListener('icegatheringstatechange', checkState);
                    resolve();
                }
            };
            peer.addEventListener('icegatheringstatechange', checkState);
        }
    });
    console.log("done")
    console.log(peer.localDescription.sdp)

    
    sendAnswerToBrowser(peer.localDescription.sdp);
}

function applyContraints (videoTrack) {
    if (videoTrack) {
    
        const videoConstraints = {
            width: { min: 320, max: 1280 },
            height: { min: 240,  max: 720 },
            frameRate: {min: 15,  max: 30 }
        };
    
        // Apply video track constraints
        videoTrack.applyConstraints(videoConstraints)
            .then(() => {
                console.log("Video track constraints applied successfully");
            })
            .catch((error) => {
                console.error("Error applying video track constraints:", error);
                setTimeout(() => {
                    applyContraints();
                }, 5000);//5seg
            });
    
        // Set content hint to 'motion' or 'detail'
        videoTrack.contentHint = 'motion';
    }
}

async function waitToCompleteIceGathering(pc, logPerformance) {
    const t0 = performance.now()
  
    let p = new Promise((resolve) => {
      setTimeout(function () {
        resolve(pc.localDescription)
      }, 2500)
      pc.onicegatheringstatechange = (ev) =>
        pc.iceGatheringState === "complete" && resolve(pc.localDescription)
    })
  
    if (logPerformance === true) {
      await p
      console.debug(
        "ice gather blocked for N ms:",
        Math.ceil(performance.now() - t0),
      )
    }
    return p
  }

function sendAnswerToBrowser(answerSDP) {
    console.log('sendAnswerToBrowser')
    fetch(url + "answer", {
        method: "post",
        headers: {
            'Content-Type': 'text/plain'
        },
        body: answerSDP
    }).then(response=> response.json())
}
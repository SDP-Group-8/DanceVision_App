import { UploadButton } from "../components/UploadButton";
import { SeeVideosButton } from "../components/SeeVideosButton";

function HomePage() {
    return(
        <div>
            <h1>Welcome to DanceVision!</h1>
            <SeeVideosButton/>
            <p> Or</p>
            <UploadButton></UploadButton>
        </div>
    )
}

export default HomePage;
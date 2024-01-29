import React from "react";

import { UploadButton } from "../components/UploadButton";
import { SeeVideosButton } from "../components/SeeVideosButton";

function HomePage() {
    return(
        <div>
            <SeeVideosButton/>
            <p> Or</p>
            <UploadButton></UploadButton>
        </div>
    )
}

export default HomePage;
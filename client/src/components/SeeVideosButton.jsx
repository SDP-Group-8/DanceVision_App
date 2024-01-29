import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Link
} from "react-router-dom";

function SeeVideosButton() {

    return (
        <div>
            <Link to="/videos">
                <button>
                    Select a video
                </button>
            </Link>
        </div>
    )
}

export default SeeVideosButton;
import React, { useState, useEffect } from 'react';

const CountdownDonut = ({ initialSeconds }) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    
    useEffect(() => {
        // Exit early if countdown is finished
        if (seconds <= 0)
        {
            return;
    
        }
    
        // Set up the timer
        const timer = setInterval(() =>
        {
            setSeconds((prevSeconds) => prevSeconds - 1);
        }, 1000);
    
        // Clean up the timer
        return () => clearInterval(timer);
    }, [seconds]);
    
    
    // Format the remaining time (e.g., “00:05:10” for 5 minutes and 10 seconds)
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
        const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };
    
    return (
        <div style={{border: "5px outset black", align: "center"}}>
            <h1>{formatTime(seconds)}</h1>
        </div>
    );
    
    };
    
    export default CountdownDonut;

import React, { useState, useEffect } from 'react';

import styles from './CountdownDonut.module.css'

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
    
  
    
    return (
        <div className={styles.countdown}>
            <h1>{seconds}</h1>
            
            <div className={styles.background}></div>
        </div>
    );
    
    };
    
    export default CountdownDonut;
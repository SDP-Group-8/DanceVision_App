
import React, { useState, useEffect } from 'react';

import styles from './CountdownDonut.module.css'

const CountdownDonut = ({ initialSeconds }) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [show, setShow] = useState(true)
    
    useEffect(() => {
        // Exit early if countdown is finished
        if (seconds <= 0)
        {
            return;
    
        }
    
        // Set up the timer
        const timer = setInterval(() =>
        {
            setShow(false)
            setSeconds((prevSeconds) => prevSeconds - 1);
            setShow(true)
        }, 1000);
    
        // Clean up the timer
        return () => clearInterval(timer);
    }, [seconds]);
    
  
    
    return (
        <div className={styles.countdown}>
            {show >= 0 && <h1>{seconds}</h1>}
            
            <div className={styles.background}></div>
        </div>
    );
    
    };
    
    export default CountdownDonut;
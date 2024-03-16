import { Progress } from "@chakra-ui/react"
import { useEffect, useState } from "react";

const TimeLine = ({duration}) => {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
        if (seconds >= duration) {
          return
        }
        // Set up the timer
        const timer = setInterval(() =>
        {
            setSeconds((prevSeconds) => prevSeconds + 0.08);
            console.log(seconds, duration)
        }, 80);
    
        // Clean up the timer
        return () => clearInterval(timer);
    }, [seconds]);

  return (
    <Progress value={(seconds / duration) * 100}/>
  )
}

export default TimeLine
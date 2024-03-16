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
            setSeconds((prevSeconds) => prevSeconds + 0.01);
        }, 10);
    
        // Clean up the timer
        return () => clearInterval(timer);
    }, [seconds]);

  return (
  <div>
    <Progress value={(seconds / duration) * 100}/>
  </div>)
}

export default TimeLine
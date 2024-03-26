import React, { useState } from "react";
import { CountdownDonut } from "../../components/CountdownDonut";
import { Spinner, Progress } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import useStatusChannel from "../../hooks/useStatusChannel";
import DanceScreen from "../../components/DanceScreen/DanceScreen";
import usePeerReceiver from "../../hooks/usePeerReceiver";
import styles from "./CountdownPage.module.css";
import Typewriter from "../../components/TypeWriter";

let initial = false;

const CountdownPage = () => {
  const { state } = useLocation();

  const { statusChannel } = usePeerReceiver(
    import.meta.env.VITE_API_URL,
    !initial,
    { videoName: state.videoName }
  );
  initial = true;

  const { isInFrame } = useStatusChannel(statusChannel);

  if (isInFrame) {
    return <DanceScreen />;
  }

  return (
    <div className={styles.body}>
      
      <div className={styles.progress_wrapper}>
        <div className={styles.typewriter_wrapper}>
        <Typewriter text={"Robot is adjusting for your perfect shot!"} speed={30}/>
        </div>
        
        <Progress size="xs" isIndeterminate colorScheme="" />
      </div>
    </div>
  );
};

export default CountdownPage;

import React from "react";
import styles from "./LeaderBoard.module.css";
import LeaderBoardCard from "../../components/LeaderBoardCard/LeaderBoardCard";
import LeaderBoardEntry from "../../components/LeaderBoardEntry/LeaderBoardEntry";
import useLeaderBoardData from "../../hooks/useLeaderBoardData";

const LeaderBoard = () => {
  const { data } = useLeaderBoardData(import.meta.env.VITE_API_URL);
  console.log(data);

  const roundNumber = (number) => {
    if (number < 1) {
      return (100 * number).toFixed(2);
    }
    return number;
  };

  const timeFormat = (timeStamp) => {
    const dateObject = new Date(timeStamp);
    const formattedDateTime = `${dateObject.toLocaleDateString()} ${dateObject.getHours()}:${dateObject.getMinutes()}:${dateObject.getSeconds()}`;

    return formattedDateTime

  }

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        
            {data && data.length >0 ? (
                <div className={styles.upper}>
                <LeaderBoardCard
                rank={2}
                name={data[1].name}
                score={roundNumber(data[1].score)}
                username={data[1].username}
                attempt_time={timeFormat(data[1].timeStamp)}
              />
              <LeaderBoardCard
                rank={1}
                name={data[0].name}
                score={roundNumber(data[0].score)}
                username={data[0].username}
                attempt_time={timeFormat(data[0].timeStamp)}
              />
              <LeaderBoardCard
                rank={3}
                name={data[2].name}
                score={roundNumber(data[2].score)}
                username={data[2].username}
                attempt_time={timeFormat(data[2].timeStamp)}
              />
              </div>
            ) : (<p>Loading...</p>) }
          
        

        <div className={styles.lower}>
          <LeaderBoardEntry
            rank={"Rank"}
            name={"Name"}
            username={"UserName"}
            score={"Score"}
            refVideo={"ReferenceVideo"}
          ></LeaderBoardEntry>

          {data && data.length > 0 ? (
            Object.keys(data).map((key, index) => (
              <LeaderBoardEntry
                rank={index}
                name={data[key].name}
                username={data[key].username}
                refVideo={data[key].refVideo}
                score={roundNumber(data[key].score)}
              />
            ))
          ) : (
            <p>Loading leaderboard...</p>
          )}

         

        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;

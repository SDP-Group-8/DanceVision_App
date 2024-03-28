import React from "react";
import styles from "./LeaderBoard.module.css";
import LeaderBoardCard from "../../components/LeaderBoardCard/LeaderBoardCard";
import LeaderBoardEntry from "../../components/LeaderBoardEntry/LeaderBoardEntry";

const LeaderBoard = () => {
  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.upper}>
          <LeaderBoardCard></LeaderBoardCard>
          <LeaderBoardCard></LeaderBoardCard>
          <LeaderBoardCard></LeaderBoardCard>
        </div>

        <div className={styles.lower}>
          <LeaderBoardEntry
            rank={"Rank"}
            name={"Name"}
            username={"UserName"}
            score={"Score"}
            refVideo={"ReferenceVideo"}
          ></LeaderBoardEntry>
          <LeaderBoardEntry
            rank={1}
            name={"Abhay"}
            username={`@${"abhay452002"}`}
            score={88}
            refVideo={"YMCA"}
          ></LeaderBoardEntry>

          <LeaderBoardEntry
            rank={1}
            name={"Abhay"}
            username={`@${"abhay452002"}`}
            score={88}
            refVideo={"YMCA"}
          ></LeaderBoardEntry>

          <LeaderBoardEntry
            rank={1}
            name={"Abhay"}
            username={`@${"abhay452002"}`}
            score={88}
            refVideo={"YMCA"}
          ></LeaderBoardEntry>

          <LeaderBoardEntry
            rank={1}
            name={"Abhay"}
            username={`@${"abhay452002"}`}
            score={88}
            refVideo={"YMCA"}
          ></LeaderBoardEntry>

          <LeaderBoardEntry
            rank={1}
            name={"Abhay"}
            username={`@${"abhay452002"}`}
            score={88}
            refVideo={"YMCA"}
          ></LeaderBoardEntry>

          <LeaderBoardEntry
            rank={1}
            name={"Abhay"}
            username={`@${"abhay452002"}`}
            score={88}
            refVideo={"YMCA"}
          ></LeaderBoardEntry>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;

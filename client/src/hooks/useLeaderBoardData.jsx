import axios from "axios";
import { useState, useEffect } from "react";

const useLeaderBoardData = (url) => {
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url + "/leaderboard", {
          responseType: "json",
        });
        console.log(response);
        setData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return { data };
};

export default useLeaderBoardData;

import axios from "axios";
import { useState, useEffect } from "react";

const usePersonalInformation = (url , userName, options = {}, ) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(url + "/personal_details", {
            "username": userName,
        } ,{
          responseType: "json",
          ...options,
        });
        console.log(response.data);
        setName(response.data["name"])
        setEmail(response.data["email"])
        // setStatus(response.data);
      } catch (error) {
        console.log(error);
      } 
    };
    fetchData();
  }, []);

  return { name, userName, email };
};

export default usePersonalInformation;

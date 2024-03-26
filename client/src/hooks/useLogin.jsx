import axios from "axios";
import { useState, useEffect } from "react";

const useLogin = (url, options = {}) => {
  const [status, setStatus] = useState("");

  useEffect(() => {
    const tryLogin = async () => {
      try {
        const response = await axios.get(url + "/login", {
          responseType: "json",
          ...options,
        });
        console.log(response);
        setStatus(response.data);
      } catch (error) {
        console.log(error);
      } finally {
      }
    };
    tryLogin();
  }, []);

  return { status };
};

export default useLogin;

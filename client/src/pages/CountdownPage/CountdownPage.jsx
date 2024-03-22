import React from "react";
import { CountdownDonut } from "../../components/CountdownDonut";
import { useLocation, useNavigate } from "react-router-dom";

const CountdownPage = () => {
    const countdown = 5;
    const navigate = useNavigate()
    const { state } = useLocation();

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            navigate("/live_comparison", {state: state})
        }, countdown * 1000)
    
        return () => clearTimeout(timeout)
    })

    return <CountdownDonut initialSeconds={countdown}/>;
}

export default CountdownPage;

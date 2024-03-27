const DancePage = () => {

    React.useEffect(() => {
        let timeout = undefined
        
        if(isInFrame){
            timeout = setTimeout(() => {
                setStarted(true)
            }, countdown * 1000)
        }

        return () => {
            if(timeout !== undefined){
                clearTimeout(timeout)
            }   
        }
    }, [isInFrame])

    if(started){
        return <DanceScreen/>
    }else if(isInFrame){
        return <CountdownDonut initialSeconds={countdown}/>
    }
}

export default DancePage
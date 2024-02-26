import React from 'react';
import { CountdownDonut } from "../../components/CountdownDonut";

const DelayComponent = () => {
  const [show, setShow] = React.useState(false)

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true)
    }, 10000)

    return () => clearTimeout(timeout)

  }, [show])

  if (!show) return <div>
                    <CountdownDonut initialSeconds={10}/>
                    </div>


  return <div></div>
}

export default DelayComponent
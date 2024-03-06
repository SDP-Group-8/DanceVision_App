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

  if (!show) return <CountdownDonut initialSeconds={10}/>

  return <div></div>
}

export default DelayComponent
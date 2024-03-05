import styles from './Popup.module.css'

import success from '../../assets/success.png'
import error from '../../assets/error.png'

const Popup = ({title, message, isSuccess, children}) => {
  return (
  <div className={styles.popup}>
    <div className={styles.body}>
      {isSuccess ? <img src={success} alt='success'/> : <img src={error} alt='error'/>}
      <h3>{title}</h3>
      <div>{message}</div>
      {children}
    </div>
  </div>
  )
}

export { Popup }
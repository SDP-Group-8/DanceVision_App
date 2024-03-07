import styles from './Popup.module.css'

import success from '../../assets/success.png'
import error from '../../assets/error.png'

const Popup = ({title, message, isSuccess, displayIcon=true, children}) => {
  return (
  <div className={styles.popup}>
    <div className={styles.body}>
      {displayIcon && (isSuccess ? <img src={success} alt='success'/> : <img src={error} alt='error'/>)}
      {title && <h3>{title}</h3>}
      {message && <div>{message}</div>}
      
      {children}
    </div>
  </div>
  )
}

export { Popup }
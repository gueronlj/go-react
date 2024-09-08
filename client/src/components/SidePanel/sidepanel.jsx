/* eslint-disable react/prop-types */
import styles from './styles.module.css'

const SidePanel = ({children}) => {
    return(
        <div className={styles.sidePanel}>
            {children}
        </div>
    )
}

export default SidePanel
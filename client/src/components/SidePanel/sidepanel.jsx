/* eslint-disable react/prop-types */
import styles from './styles.module.css'

const SidePanel = ({children}) => {
    return(
        <div className={styles.sidePanel}>
            {children}
            <div>Option 2</div>
            <div>Option 3</div>
        </div>
    )
}

export default SidePanel
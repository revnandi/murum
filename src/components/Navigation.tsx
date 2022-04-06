// import { Link } from "react-router-dom";
import styles from './Navigation.module.css';

function Navigation() {

  return (
    <nav className={ styles.Navigation }>
      <ul className={ styles.List }>
          <li className={ styles.Item }>Murum</li>
          <li className={ styles.Item }>About</li>
          <li className={ styles.Item }>Research</li>
      </ul>
    </nav>
  )
};

export default Navigation;
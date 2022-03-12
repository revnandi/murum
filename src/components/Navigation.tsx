// import { Link } from "react-router-dom";
import styles from './Navigation.module.css';

function Navigation() {

  return (
    <nav className={ styles.Navigation }>
      <ul className={ styles.List }>
          <li className={ styles.Item }>
            <a className={ styles.Link } href="/">Murum</a>
          </li>
      </ul>
    </nav>
  )
};

export default Navigation;
import styles from './Links.module.css';

function Links() {

  return (
    <ul className={ styles.List }>
        <li className={ styles.Item }>
          <a className={ styles.Link } href="/#">MOME StudioB ↗</a>
        </li>
        <li className={ styles.Item }>
          <a className={ styles.Link } href="/#">Timboo ↗</a>
        </li>
        <li className={ styles.Item }>
          <a className={ styles.Link } href="/#">Palma ↗</a>
        </li>
        <li className={ styles.Item }>
          <a className={ styles.Link } href="/#">Journal ↗</a>
        </li>
    </ul>
  )
};

export default Links;
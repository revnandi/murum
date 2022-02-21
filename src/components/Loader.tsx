import styles from './Loader.module.css';

function Loader() {

  return (
    <div className={ styles.Container }>
      <div className={ styles.Circle }></div>
    </div>
  )
};

export default Loader;
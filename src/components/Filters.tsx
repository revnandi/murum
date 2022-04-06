import styles from './Filters.module.css';
import useStore from '../store';
import { Filter } from '../models/Filter'

function Filters() {
  const {
    setActiveTags
  } = useStore();

  const handleClick = (tag: string) => {
    setActiveTags([tag]);
  };

  const renderFilters = (filters: Filter[]) => {
    return filters.map(item => {
      return <li className={ styles.Item } onClick={ () => handleClick('') }>All</li>
    })
  };

  return (
    <ul className={ styles.List }>
        <li className={ styles.Item } onClick={ () => handleClick('') }>All</li>
        <li className={ styles.Item } onClick={ () => handleClick('architcture') }>Architcture</li>
        <li className={ styles.Item } onClick={ () => handleClick('installation') }>Installation</li>
        <li className={ styles.Item } onClick={ () => handleClick('practice') }>Practice</li>
        <li className={ styles.Item } onClick={ () => handleClick('theory') }>Theory</li>
        <li className={ styles.Item } onClick={ () => handleClick('bamboo') }>Bamboo</li>
    </ul>
  )
};

export default Filters;
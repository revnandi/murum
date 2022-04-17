import styles from './Filters.module.css';
import useStore from '../store';
import Filter from '../models/Filter'

const filtersData  = [
  {
    title: "All",
    slug: ''
  },
  {
    title: "Architcture",
    slug: 'architcture'
  },
  {
    title: "Installation",
    slug: 'installation'
  },
  {
    title: "Practice",
    slug: 'practice'
  },
  {
    title: "Theory",
    slug: 'theory'
  },
  {
    title: "Bamboo",
    slug: 'bamboo'
  }
];

function Filters() {
  const {
    activeTags,
    setActiveTags
  } = useStore();

  const handleClick = (tag: string) => {
    let toSet = [tag];
    if(tag === '') {
      toSet = [];
    }
    console.log(activeTags.includes(tag))
    setActiveTags(toSet);
  };

  const renderFilters = () => {
    return filtersData.map((item, index) => {
      return <li
        key={ index }
        className={ [styles.Item, activeTags.includes(item.slug) ? styles.ItemActive : ''].join(' ') }
        onClick={ () => handleClick(item.slug) }
      >
        { item.title }
      </li>
    })
  };

  return (
    <ul className={ styles.List }>
      { renderFilters() }
    </ul>
  )
};

export default Filters;
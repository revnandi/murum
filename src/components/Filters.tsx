import { useEffect, useState } from 'react';
import useStore from '../store';
import styles from './Filters.module.css';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollToPlugin);
import Filter from '../models/Filter';

interface Props {
  openedPage: string | null;
}

function Filters({ openedPage }: Props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filterItems, setFilterItems] = useState([]);

  useEffect(() => {
    fetch(`https://admin.murum.studio/api/collections/get/filters?token=b4feea70ee9842384135e890083a04`)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setFilterItems(result.entries);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, []);

  const {
    activeTags,
    setActiveTags
  } = useStore();

  const handleClick = (tag: string) => {
    let toSet = [tag];
    if(tag === 'all') {
      toSet = [];
    }
    setActiveTags(toSet);
    gsap.to(window, { duration: 0.2, scrollTo: { y: '#root' } });
  };

  const renderFilters = () => {
    return filterItems.map((item: Filter) => {
      return <li
        key={ item._id }
        className={ [styles.Item, activeTags.includes(item.label_slug) ? styles.ItemActive : ''].join(' ') }
        onClick={ () => handleClick(item.label_slug) }
      >
        { item.label }
      </li>
    })
  };

  return (
    <ul className={ [styles.List, openedPage ? styles.HiddenList: ''].join(' ') }>
      { renderFilters() }
    </ul>
  )
};

export default Filters;
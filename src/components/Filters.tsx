import { useEffect, useState } from 'react';
import useStore from '../store';
import styles from './Filters.module.scss';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useWindowSize, Size } from '../hooks/useWindowSize';
gsap.registerPlugin(ScrollToPlugin);
import Filter from '../models/Filter';

interface Props {
  openedPage: string | null;
}

function Filters({ openedPage }: Props) {
  const windowSize: Size = useWindowSize();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filterItems, setFilterItems] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    setIsMobile(true);
    if(windowSize &&  windowSize.width && windowSize.width > 767) setIsMobile(false);
  }, [windowSize])

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
      if(isMobile && item.label_slug === 'all') {
        return (
          <li
            key={ item._id }
            className={ [styles.Item, activeTags.includes(item.label_slug) ? styles.ItemActive : ''].join(' ') }
            onClick={ () => handleClick(item.label_slug) }
          >
            All
          </li>
        );
      }
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
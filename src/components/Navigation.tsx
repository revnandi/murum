import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navigation.module.css';
import useStore from '../store';
import { useWindowSize, Size } from '../hooks/useWindowSize';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollToPlugin);
import NavigationItem from '../models/NavigationItem';

function Navigation() {
  const {
    setOpenedPage,
    setOpenedProject,
    setIsLightboxOpen
  } = useStore();
  
  const windowSize: Size = useWindowSize();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [navigationItems, setNavigationItems] = useState([]);
  let navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch(`https://admin.murum.studio/api/collections/get/navigation?token=b4feea70ee9842384135e890083a04`)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setNavigationItems(result.entries);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, []);

  const handleMenuButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleWordmarkClick = () => {
    setIsLightboxOpen(false);
    setOpenedProject(null);
    setOpenedPage(null);
    navigate('/');
    setTimeout(() => {
      gsap.to(window, { duration: 0.2, scrollTo: { y: '#root' } });
    }, 100);
  };

  const handleItemClick = (url: string) => {
    if(windowSize &&  windowSize.width && windowSize.width < 768) {
      setOpenedProject(null);
    }
    setIsOpen(false);
    setOpenedPage(url);
    setTimeout(() => {
      if(windowSize &&  windowSize.width && windowSize.width < 768) {
        gsap.to(window, { duration: 0.2, scrollTo: { y: '#root' } });
      }
    }, 100);
  }

  const renderItems = () => {
    
    return navigationItems.map((item: NavigationItem) => {
      return <li className={ styles.Item } key={ item._id }>
        <span>{ item.label }</span>
          { item.children &&
            <ul className={ styles.SubList }>
              {
                item.children.map((child, index) => {
                  return <li
                    className={ styles.SubItem }
                    key={ index }
                    onClick={ () => { handleItemClick(child.value.url) } }
                  >
                    { child.value.label }
                  </li>
                })
              }
            </ul>
          }
      </li>
    });
  };

  return (
    <nav className={ styles.Navigation }>
      <div className={ styles.Wordmark } onClick={ () => handleWordmarkClick() }>Murum</div>
      <div className={ [styles.MenuButton, isOpen ? styles.MenuButtonClose : ''].join(' ') } onClick={ () => handleMenuButtonClick() }>
        <span></span>
      </div>
      <ul className={ [styles.List, isOpen ? styles.OpenList : ''].join(" ") }>
        { renderItems() }
      </ul>
    </nav>
  )
};

export default Navigation;
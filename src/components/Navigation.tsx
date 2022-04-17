// import { Link } from "react-router-dom";
import { useState } from 'react';
import styles from './Navigation.module.css';
import useStore from '../store';

const navigationItems = [
  {
    title: 'About',
    children: [
      {
        title: 'Contact',
        slug: 'contact'
      },
      {
        title: 'Bio',
        slug: 'bio'
      },
      {
        title: 'Murum - the studio',
        slug: 'murum'
      },
      {
        title: 'Press',
        slug: 'press'
      }
    ]
  },
  {
    title: 'Research',
    children: [
      {
        title: 'MOME StudioB',
        slug: 'studiob'
      },
      {
        title: 'Timboo',
        slug: 'timboo'
      }
    ]
  },
];

const renderItems = () => {

  const { openedPage, setOpenedPage } = useStore();
  
  return navigationItems.map((item, index) => {
    return <li className={ styles.Item } key={ index }>
      <span>{ item.title }</span>
        { item.children &&
          <ul className={ styles.SubList }>
            {
              item.children.map((child, index) => {
                return <li
                  className={ styles.SubItem }
                  key={ index }
                  onClick={ () => setOpenedPage(child.slug) }
                >
                  { child.title }
                </li>
              })
            }
          </ul>
        }
    </li>
  });
};

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={ styles.Navigation }>
      <div className={ styles.Wordmark }>Murum</div>
      <div className={ styles.MenuButton } onClick={ () => handleClick() }>
        <span></span>
      </div>
      <ul className={ [styles.List, isOpen ? styles.OpenList : ''].join(" ") }>
        { renderItems() }
      </ul>
    </nav>
  )
};

export default Navigation;
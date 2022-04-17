import { useState, useEffect } from 'react';
import styles from './PageContent.module.css';
import useStore from '../store';

import PressItem from '../models/PressItem';
import ContactLink from '../models/ContactLink';

function PageContent() {
  const { openedPage, setOpenedPage } = useStore();

  const [loaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    if (openedPage) {
      fetch(`https://admin.murum.studio/api/singletons/get/${openedPage}?token=b4feea70ee9842384135e890083a04`)
        .then(res => res.json())
        .then(
          (result) => {
            setContent(result);
            setIsLoaded(true);
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
    }
  }, [openedPage]);

  const renderPressItems = (items: Array<PressItem>) => {
    return items.map((item, index) => {
      return <div className={ styles.PressItem } key={ index }>
        <div className={ styles.Year }>{item.value.year}</div>
        <div className={ styles.Content } dangerouslySetInnerHTML={{ __html: item.value.content }}></div>
      </div>
    })
  };

  const renderCotactLinks = (items: Array<ContactLink>) => {
    return items.map((item, index) => {
      return <div className={ styles.ContactLink } key={ index }>
        <a className={ styles.Link } target={ item.value.external ? '_blank' : '_self' } href={ item.value.link }>{item.value.title}</a>
      </div>
    })
  };

  if(!loaded) return <div>Loading</div>;

  return (
    <div className={ [styles.Container, openedPage === null ? styles.ContainerHidden : ''].join(' ') }>
      <svg
        className={ styles.CloseButton }
        onClick={ () => setOpenedPage(null) }
        viewBox="0 0 27 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L26 26M26 1L1 26" stroke="black"/>
      </svg>
      { (openedPage !== 'studiob' && openedPage !== 'timboo') &&
        <div className={ styles.Title }>{ content.title }</div>
      }
      { (openedPage === 'studiob' || openedPage === 'timboo') &&
        <div className={ styles.LinkTitle } dangerouslySetInnerHTML={{ __html: content.title }}></div>
      }
      { openedPage === 'press' && content.items && (content.items.length > 0) &&
        renderPressItems(content.items)
      }
      { openedPage !== 'press' && openedPage !== 'contact' &&
        <div className={ styles.Content } dangerouslySetInnerHTML={{ __html: content.content }}></div>
      }
      { openedPage === 'contact' && content.links && (content.links.length > 0) &&
        <div className={ [styles.Content, styles.ContentContact ].join(' ') }>
          <div className={ styles.ContactBody } dangerouslySetInnerHTML={{ __html: content.content }}></div>
          <div className={ styles.ContactLinks }>
            { renderCotactLinks(content.links) }
          </div>
        </div>
      }
    </div>
  );
};

export default PageContent;
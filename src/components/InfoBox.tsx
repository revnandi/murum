import { useEffect, useState } from 'react';
import useStore from '../store';
import styles from './InfoBox.module.scss';
import ProjectInfo from '../models/ProjectInfo';
import { useWindowSize, Size } from '../hooks/useWindowSize';

function InfoBox({ slug, title, description, specs, tags, projectSlug, isHovered, passedFunctions }: ProjectInfo) {
  const windowSize: Size = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);
  const {
    openedProject,
    setOpenedProject
  } = useStore();

  useEffect(() => {
    setIsMobile(true);
    if(windowSize &&  windowSize.width && windowSize.width > 767) setIsMobile(false);
  }, [windowSize])
  
  const renderTags = tags.map((tag, index) => 
    <div className={ styles.TagContainer } key={ `${slug}_${index}` }>
      <div className={ styles.Tag }>{ tag }</div>
    </div>
  )

  return (
    <div className={ styles.Box }>
      { (openedProject === slug || isHovered  || isMobile) && 
        <h2 className={ styles.Title }>{ title }</h2>
      }
      { openedProject !== slug && isMobile &&
        <svg className={ styles.CloseButton } width="20" height="29" viewBox="0 0 20 29" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={ () => passedFunctions.handleProjectClick(projectSlug) }>
          <line x1="20" y1="19.5" x2="-4.37114e-08" y2="19.5" stroke="black"/>
        </svg>
      }

      { openedProject === slug &&
        <>
          <svg className={ styles.CloseButton } viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={ passedFunctions.resetActivateProject }>
            <path d="M1 1L26 26M26 1L1 26" stroke="black"/>
          </svg>
          <div className={ styles.Bottom }>
            <div className={ styles.TagsAndSpecs }>
              <div className={ styles.Tags }>
                { renderTags}
              </div>
              <div className={ styles.Specs } dangerouslySetInnerHTML={{ __html: specs }}></div>
            </div>
            <div className={ styles.Description } dangerouslySetInnerHTML={{ __html: description }}></div>
          </div>
        </> 
      }
    </div>
  )
};

export default InfoBox;
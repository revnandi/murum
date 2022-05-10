import { useEffect, useState } from 'react';
import useStore from '../store';
import styles from './InfoBox.module.css';
import ProjectInfo from '../models/ProjectInfo';

function InfoBox({ slug, title, description, specs, tags, isHovered, passedFunctions }: ProjectInfo) {
  const {
    openedProject,
    setOpenedProject
  } = useStore();
  
  const renderTags = tags.map((tag, index) => 
    <div className={ styles.TagContainer } key={ `${slug}_${index}` }>
      <div className={ styles.Tag }>{ tag }</div>
    </div>
  );

  console.log('%c RENDER Infobox','color:green;background-color:#000');

  return (
    <div className={ styles.Box }>
      { (openedProject === slug || isHovered ) && 
        <h2 className={ styles.Title }>{ title }</h2>
      }
      { openedProject === slug &&
        <>
          <svg className={ styles.CloseButton } viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={ passedFunctions.resetActivateProject }>
            <path d="M1 1L26 26M26 1L1 26" stroke="black"/>
          </svg>
          <div className={ styles.TagsAndSpecs }>
            <div className={ styles.Tags }>
              { renderTags}
            </div>
            <div className={ styles.Specs } dangerouslySetInnerHTML={{ __html: specs }}></div>
          </div>
          <div className={ styles.Description } dangerouslySetInnerHTML={{ __html: description }}></div>
        </> 
      }
    </div>
  )
};

export default InfoBox;
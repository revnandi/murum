import { useEffect, useState } from 'react';
import styles from './InfoBox.module.css';
import ProjectInfo from '../models/ProjectInfo';

function InfoBox({ id, title, description, specs, tags, isOpen, isHovered, passedFunctions }: ProjectInfo) {
  // let [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = (e: any) => {
    isHovered = true;
  };

  const handleMouseLEave = (e: any) => {
    isHovered = false;
  };
  

  const renderTags = tags.map((tag, index) => 
    <div className={ styles.TagContainer } key={ `${id}_${index}` }>
      <div className={ styles.Tag }>{ tag }</div>
    </div>
  )

  return (
    <div className={ styles.Box }>
      { (isOpen || isHovered ) && 
        <h2 className={ styles.Title }>{ title }</h2>
      }
      { isOpen &&
        <>
          <svg className={ styles.CloseButton } viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={ passedFunctions.resetActivateProject }>
            <path d="M1 1L26 26M26 1L1 26" stroke="black"/>
          </svg>
          <div className={ styles.Tags }>
            { renderTags}
          </div>
          <div className={ styles.Description } dangerouslySetInnerHTML={{ __html: description }}></div>
          <div className={ styles.Specs } dangerouslySetInnerHTML={{ __html: specs }}></div>
        </> 
      }
    </div>
  )
};

export default InfoBox;
import { useEffect, useRef, useState } from 'react';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import 'lazysizes/plugins/blur-up/ls.blur-up';
import styles from './Lightbox.module.css';

import { CursorContent } from '../App';

import { ClickPosition } from '../App';

interface Props {
  isOpen: boolean;
  images: any,
  clickedImageIndex: number,
  passedFunctions: {
    resetLightbox: (e: React.MouseEvent<HTMLElement>) => void,
    handleCursor: (value: boolean) => void,
    handleCursorChange: (value: CursorContent) => void
  },
}

function Lightbox({ isOpen, images, clickedImageIndex, passedFunctions }: Props) {
  let [currentClickedIndex, setCurrentClickedIndex] = useState(1);
  const clickPosition = useRef<ClickPosition>('none');
  const bigImage = useRef<any>(null);

  const handleMouseEnter = (e: any) => {
    if(images.length > 1) {
      if (e.target?.width * 0.5 >= e.offsetX) {
        clickPosition.current = 'prev';
      } else if (e.target?.width * 0.5 <= e.offsetX) {
        clickPosition.current = 'next';
      }
      passedFunctions.handleCursor(true);
    }
  };

  const handleMouseLeave = (e: any) => {
    passedFunctions.handleCursor(false);
    clickPosition.current = 'none';
  };

  const handleMouseMove = (e: any) => {
    if(images.length > 1) {
      if (e.target?.width * 0.5 >= e.offsetX) {
        clickPosition.current = 'prev';
        passedFunctions.handleCursorChange('←');
      } else if (e.target?.width * 0.5 <= e.offsetX) {
        passedFunctions.handleCursorChange('→');
        clickPosition.current = 'next';
      }
    }
  };


  const handleClickPrev = () => {
    if (currentClickedIndex === 0) {
      console.log("handleClickPrev");
      console.log("currentClickedIndex before change: " + currentClickedIndex);
      let indexOfLastImage = images.length - 1;
      console.log(indexOfLastImage);
      setCurrentClickedIndex(indexOfLastImage);
      console.log("currentClickedIndex after change: " + currentClickedIndex);
    } else {
      console.log("handleClickPrev else");
      console.log("currentClickedIndex before change: " + currentClickedIndex);
      setCurrentClickedIndex(currentClickedIndex--);
      console.log("currentClickedIndex after change: " + currentClickedIndex);
    }
  };

  const handleClickNext = () => {
    if (currentClickedIndex === images.length - 1) {
      console.log("handleClickNext");
      console.log("currentClickedIndex before change: " + currentClickedIndex);
      setCurrentClickedIndex(0);
      console.log("currentClickedIndex after change: " + currentClickedIndex);
    } else {
      console.log("handleClickNext else");
      console.log("currentClickedIndex before change: " + currentClickedIndex);
      // let currentIndex = currentClickedIndex;
      // currentIndex++;
      setCurrentClickedIndex(currentClickedIndex++);
      console.log("currentClickedIndex after change: " + currentClickedIndex);
    }
  };

  const handleMouseClick = () => {
    switch (clickPosition.current) {
      case 'prev':
        handleClickPrev();
        break;
      case 'next':
        handleClickNext();
        break;
    }
  };

  const addImageEventListeners = (imageElement: HTMLImageElement) => {
    imageElement.addEventListener('mouseenter', handleMouseEnter);
    imageElement.addEventListener('mouseleave', handleMouseLeave);
    imageElement.addEventListener('mousemove', handleMouseMove);
    imageElement.addEventListener('click', handleMouseClick);
  };

  const removeImageEventListeners = (imageElement: HTMLImageElement) => {
    imageElement.removeEventListener('mouseenter', handleMouseEnter);
    imageElement.removeEventListener('mouseleave', handleMouseLeave);
    imageElement.removeEventListener('mousemove', handleMouseMove);
    imageElement.removeEventListener('click', handleMouseClick);
  };

  useEffect(() => {
    console.log("useEffect [clickedImageIndex ]");
  }, [clickedImageIndex]);
  
  useEffect(() => {
    console.log("useEffect []");
    setCurrentClickedIndex(clickedImageIndex);
  }, []);
  
  useEffect(() => {
    console.log("useEffect [isOpen]");
    setCurrentClickedIndex(clickedImageIndex);
    if(bigImage.current) {
      addImageEventListeners(bigImage.current);
    }
    return () => {
      if(bigImage.current) {
        removeImageEventListeners(bigImage.current);
      }
    };
  }, [isOpen]);

  return (
    <div className={ styles.Lightbox } style={{ display: isOpen ? 'block' : 'none' }}>
      <div className={ styles.Inner } onClick={ passedFunctions.resetLightbox }>
          { images &&
            <div className={ styles.ImageContainer }>
              <img
                ref={ bigImage } 
                className={ [styles.Image, 'lazyload', 'blur-up'].join(' ') }
                src={ `https://admin.murum.studio/storage/uploads${images[currentClickedIndex].value.sizes.lqip.path}` }
                data-src={ `https://admin.murum.studio/storage/uploads${images[currentClickedIndex].value.sizes.large.path}` }
                alt=""
              />
            </div>
          }
      </div>
    </div>
  )
};

export default Lightbox;
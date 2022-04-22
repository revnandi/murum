import { useEffect, useRef, useState } from 'react';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import 'lazysizes/plugins/blur-up/ls.blur-up';
import styles from './Lightbox.module.css';
import useStore from '../store';
import { useSwipeable } from 'react-swipeable';

import { CursorContent } from '../models/CursorContent';
import{ ClickPosition } from '../models/ClickPosition';

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

function Lightbox({ clickedImageIndex, passedFunctions }: Props) {
  const {
    openedImages,
    setOpenedImages,
    isLightboxOpen,
    setIsLightboxOpen
  } = useStore();
  
  let [currentClickedIndex, setCurrentClickedIndex] = useState(1);
  const clickPosition = useRef<ClickPosition>('none');
  const bigImage = useRef<any>(null);

  const handleMouseEnter = (e: any) => {
    if(openedImages && openedImages.length > 1) {
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
    if(openedImages && openedImages.length > 1) {
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
    if (openedImages && currentClickedIndex === 0) {
      // console.log("handleClickPrev");
      // console.log("currentClickedIndex before change: " + currentClickedIndex);
      let indexOfLastImage = openedImages.length - 1;
      // console.log(indexOfLastImage);
      setCurrentClickedIndex(indexOfLastImage);
      // console.log("currentClickedIndex after change: " + currentClickedIndex);
    } else {
      // console.log("handleClickPrev else");
      // console.log("currentClickedIndex before change: " + currentClickedIndex);
      setCurrentClickedIndex(currentClickedIndex--);
      // console.log("currentClickedIndex after change: " + currentClickedIndex);
    }
  };

  const handleClickNext = () => {
    if (openedImages && currentClickedIndex === openedImages.length - 1) {
      // console.log("handleClickNext");
      // console.log("currentClickedIndex before change: " + currentClickedIndex);
      setCurrentClickedIndex(0);
      // console.log("currentClickedIndex after change: " + currentClickedIndex);
    } else {
      // console.log("handleClickNext else");
      // console.log("currentClickedIndex before change: " + currentClickedIndex);
      // let currentIndex = currentClickedIndex;
      // currentIndex++;
      setCurrentClickedIndex(currentClickedIndex++);
      // console.log("currentClickedIndex after change: " + currentClickedIndex);
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

  const swipeHandlers = useSwipeable(
    {
      onSwipedLeft: () => handleClickPrev(),
      onSwipedRight: () => handleClickPrev()
    }
  );

  const addImageEventListeners = (imageElement: HTMLImageElement) => {
    imageElement.addEventListener('mouseenter', handleMouseEnter);
    imageElement.addEventListener('mouseleave', handleMouseLeave);
    imageElement.addEventListener('mousemove', handleMouseMove);
    imageElement.addEventListener('click', handleMouseClick);
    imageElement.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  };

  const removeImageEventListeners = (imageElement: HTMLImageElement) => {
    imageElement.removeEventListener('mouseenter', handleMouseEnter);
    imageElement.removeEventListener('mouseleave', handleMouseLeave);
    imageElement.removeEventListener('mousemove', handleMouseMove);
    imageElement.removeEventListener('click', handleMouseClick);
    imageElement.removeEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  };

  useEffect(() => {
    // console.log("useEffect [clickedImageIndex ]");
  }, [clickedImageIndex]);
  
  useEffect(() => {
    // console.log("useEffect []");
    setCurrentClickedIndex(clickedImageIndex);
  }, []);
  
  useEffect(() => {
    // console.log("useEffect [isLightboxOpen]");
    setCurrentClickedIndex(clickedImageIndex);
    if(bigImage.current) {
      addImageEventListeners(bigImage.current);
    }
    return () => {
      if(bigImage.current) {
        removeImageEventListeners(bigImage.current);
      }
    };
  }, [isLightboxOpen]);

  return (
    <div className={ styles.Lightbox } style={{ display: isLightboxOpen ? 'block' : 'none' }}>
      <div className={ styles.Inner } onClick={ passedFunctions.resetLightbox }>
          { openedImages &&
            <div className={ styles.ImageContainer } {...swipeHandlers}>
              <img
                ref={ bigImage } 
                className={ [styles.Image, 'lazyload', 'blur-up'].join(' ') }
                src={ `https://admin.murum.studio/storage/uploads${openedImages[currentClickedIndex].value.sizes.lqip.path}` }
                data-src={ `https://admin.murum.studio/storage/uploads${openedImages[currentClickedIndex].value.sizes.large.path}` }
                alt=""
              />
            </div>
          }
      </div>
    </div>
  )
};

export default Lightbox;
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import 'lazysizes/plugins/blur-up/ls.blur-up';
import styles from './Carousel.module.css';

type CursorContent = 'More' | '←' | '→' | 'Open';

type ClickPosition = 'none' | 'activate' | 'open' | 'prev' | 'next';

interface Props {
  images?: Array<any>,
  passedFunctions: {
    handleCursor: (value: boolean) => void
    handleProjectClick: (value: number) => void
    handleCursorChange: (value: CursorContent) => void
    handleLightboxOpen: (value: any) => void
  },
  projectIndex: number,
  activeProjectIndex: number | null,
  isActive: boolean
};

function Carousel({ images, passedFunctions, projectIndex, activeProjectIndex }: Props) {
  const transitionDuration = 0.1;
  const imageElements = useRef(new Array());
  const totalImages = useRef(0);
  const activeImage = useRef(0);
  const clickPosition = useRef<ClickPosition>('none');
  const isActive = useRef(false);

  const handleClickActivate = () => {
    passedFunctions.handleProjectClick(projectIndex);
  };

  const handleClickOpen = () => {
    if(images && images.length > 0) {
      passedFunctions.handleLightboxOpen(images[activeImage.current])
    }
  };

  const handleClickPrev = () => {
    if (activeImage.current === 0) {
      gsap.to(imageElements.current[totalImages.current - 1] ,{
        opacity: 1,
        duration: transitionDuration,
        pointerEvents: 'auto',
        zIndex: 2
      });
      gsap.to(imageElements.current[activeImage.current] ,{
        opacity: 0,
        duration: transitionDuration,
        pointerEvents: 'none',
        zIndex: 0
      });
      activeImage.current = totalImages.current - 1;
    } else {
      gsap.to(imageElements.current[activeImage.current - 1] ,{
        opacity: 1,
        duration: transitionDuration,
        pointerEvents: 'auto',
        zIndex: 2
      });
      gsap.to(imageElements.current[activeImage.current] ,{
        opacity: 0,
        duration: transitionDuration,
        pointerEvents: 'none',
        zIndex: 0
      });
      activeImage.current = activeImage.current - 1;
    }
  };

  const handleClickNext = () => {
    if (activeImage.current === totalImages.current - 1) {
      gsap.to(imageElements.current[activeImage.current] ,{
        opacity: 0,
        duration: transitionDuration
      });
      gsap.to(imageElements.current[0] ,{
        opacity: 1,
        duration: transitionDuration
      });
      activeImage.current = 0;
    } else {
      gsap.to(imageElements.current[activeImage.current + 1] ,{
        opacity: 1,
        duration: transitionDuration
      });
      gsap.to(imageElements.current[activeImage.current] ,{
        opacity: 0,
        duration: transitionDuration
      });
      activeImage.current = activeImage.current + 1;
    }
  };

  const handleMouseEnter = (e: any) => {
    if (images && images.length > 1) {
      if (e.target?.width * 0.25 >= e.offsetX) {
        clickPosition.current = 'prev';
      } else if (e.target?.width * 0.75 <= e.offsetX) {
        clickPosition.current = 'next';
      } else {
        clickPosition.current = 'open';
      }
    } else {
      clickPosition.current = 'open';
    }
    passedFunctions.handleCursor(true);
  };

  const handleMouseLeave = () => {
    passedFunctions.handleCursor(false);
    clickPosition.current = 'none';
  };

  const handleMouseMove = (e: any) => {
    if (isActive.current) {
      if (images && images.length > 1) {
        if (e.target?.width * 0.25 >= e.offsetX) {
          clickPosition.current = 'prev';
          passedFunctions.handleCursorChange('←');
        } else if (e.target?.width * 0.75 <= e.offsetX) {
          passedFunctions.handleCursorChange('→');
          clickPosition.current = 'next';
        } else {
          passedFunctions.handleCursorChange('Open');
          clickPosition.current = 'open';
        }
      } else {
        clickPosition.current = 'open';
        passedFunctions.handleCursorChange('Open');
      }
    } else {
      clickPosition.current = 'activate';
      passedFunctions.handleCursorChange('More');
    }
  };

  const handleMouseClick = (e: any) => {
    switch (clickPosition.current) {
      case 'prev':
        handleClickPrev();
        break;
      case 'next':
        handleClickNext();
        break;
      case 'activate':
        handleClickActivate();
          break;
      case 'open':
        handleClickOpen();
        break;
      default:
        handleClickOpen();
        break;
    }
  };

  const addImageEventListeners = (imageElement: HTMLImageElement, index: number) => {
    imageElement.addEventListener('mouseenter', handleMouseEnter);
    imageElement.addEventListener('mouseleave', handleMouseLeave);
    imageElement.addEventListener('mousemove', handleMouseMove);
    imageElement.addEventListener('click', handleMouseClick);
  };
  const removeImageEventListeners = (imageElement: HTMLImageElement, index: number) => {
    imageElement.removeEventListener('mouseenter', handleMouseEnter);
    imageElement.removeEventListener('mouseleave', handleMouseLeave);
    imageElement.removeEventListener('mousemove', handleMouseMove);
    imageElement.removeEventListener('click', handleMouseClick);
  };

  useEffect(() => {
    if (imageElements.current.length > 0) {

      gsap.to(imageElements.current[0] ,{
        opacity: 1,
        pointerEvents: 'auto',
        zIndex: 2
      });

      imageElements.current[0].style.opacity = 1;
      totalImages.current = imageElements.current.length;

      imageElements.current.forEach((imageElement, index) => {
        addImageEventListeners(imageElement, index);
      })
    }

    return () => {
      if (imageElements.current.length > 0) {
        imageElements.current.forEach((imageElement, index) => {
          removeImageEventListeners(imageElement, index);
        })
      }
    }
  }, []);

  useEffect(() => {
    isActive.current = activeProjectIndex === projectIndex;
  }, [activeProjectIndex, projectIndex])
  
  

  if(images) {
    const renderImages = images.map(image => {
      return (
        <div className={ styles.ImageContainer } key={ image.value._id }>
          <img
            ref={ el => (imageElements.current = [...imageElements.current, el]) }
            className={ [styles.Image, 'lazyload', 'blur-up'].join(' ') }
            src={ `https://admin.murum.freizeit.hu/storage/uploads${image.value.sizes.lqip.path}` }
            data-src={ `https://admin.murum.freizeit.hu/storage/uploads${image.value.sizes.medium.path}` }
            alt=""
            width={ image.value.sizes.medium.width }
            height={ image.value.sizes.medium.height }
            onClick={ () => passedFunctions.handleProjectClick(projectIndex) }
          /> 
        </div>)
    });

    return (
      <div className={ styles.Container }>
        { renderImages }
      </div>
    );
  } else {
    return <div>No images</div>
  };
  
};

export default Carousel;
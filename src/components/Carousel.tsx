import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import 'lazysizes/plugins/blur-up/ls.blur-up';
import styles from './Carousel.module.css';

import { CursorContent } from '../App';

import { ClickPosition } from '../App';

interface Props {
  images?: Array<any>,
  passedFunctions: {
    handleHover: (projectIndex: number | null) => void,
    handleCursor: (value: boolean) => void,
    handleCursorChange: (value: CursorContent) => void,
    handleProjectClick: (value: number) => void,
    handleLightboxOpen: (images: any, indexOfClicked: number) => void,
  },
  projectIndex: number,
  activeProjectIndex: number | null,
  isActive: boolean
};

function Carousel({ images, passedFunctions, projectIndex, activeProjectIndex }: Props) {
  const transitionDuration = 0.1;
  const imagePreviewElement = useRef<any>(null);
  const imageElements = useRef(new Array());
  const totalImages = useRef(0);
  const activeImage = useRef(0);
  const clickPosition = useRef<ClickPosition>('none');
  const isActive = useRef(false);

  const handleClickActivate = () => {
    passedFunctions.handleProjectClick(projectIndex);
  };

  const handleClickOpen = () => {
    if(images && images.length > 0) {
      passedFunctions.handleLightboxOpen(images, activeImage.current)
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
        duration: transitionDuration,
        pointerEvents: 'none',
        zIndex: 0
      });
      gsap.to(imageElements.current[0] ,{
        opacity: 1,
        duration: transitionDuration,
        pointerEvents: 'auto',
        zIndex: 2
      });
      activeImage.current = 0;
    } else {
      gsap.to(imageElements.current[activeImage.current + 1] ,{
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
    passedFunctions.handleHover(null);
    passedFunctions.handleCursor(false);
    clickPosition.current = 'none';
  };

  const handleMouseMove = (e: any) => {
    passedFunctions.handleHover(projectIndex);
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

      // gsap.to(imageElements.current[0] ,{
      //   opacity: 1,
      //   pointerEvents: 'auto',
      //   zIndex: 2
      // });

      // imageElements.current[0].style.opacity = 1;
      totalImages.current = imageElements.current.length;

      imageElements.current.forEach((imageElement, index) => {
        addImageEventListeners(imageElement, index);
      });
    };

    if(images && images.length > 0) {
      imagePreviewElement.current.addEventListener('mouseenter', handleMouseEnter);
      imagePreviewElement.current.addEventListener('mouseleave', handleMouseLeave);
      imagePreviewElement.current.addEventListener('mousemove', handleMouseMove);
      imagePreviewElement.current.addEventListener('click', handleMouseClick);
    };

    return () => {
      if (imageElements.current.length > 0) {
        imageElements.current.forEach((imageElement, index) => {
          removeImageEventListeners(imageElement, index);
        });

        imagePreviewElement.current.removeEventListener('mousemove', handleMouseMove);
      }
    }
  }, []);

  useEffect(() => {
    isActive.current = activeProjectIndex === projectIndex;
    if(isActive.current) {
      gsap.to(imagePreviewElement.current, {
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 0
      });
      gsap.to(imageElements.current[0], {
        opacity: 1,
        pointerEvents: 'auto',
        zIndex: 2
      });
    } else {
      gsap.to(imagePreviewElement.current, {
        opacity: 1,
        pointerEvents: 'auto',
        zIndex: 1
      });
      gsap.to(imageElements.current[activeImage.current], {
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 0
      });
      activeImage.current = 0;
    }

  }, [activeProjectIndex, projectIndex])
  
  

  if(images) {
    const renderPreview = () =>  {
      return (
        <picture className={ styles.PreviewImageContainer }>
          <img
            ref={ imagePreviewElement }
            className={ [styles.PreviewImage, 'lazyload', 'blur-up'].join(' ') }
            src={ `https://admin.murum.studio/storage/uploads${images[0].value.sizes.lqip.path}` }
            data-src={ `https://admin.murum.studio/storage/uploads${images[0].value.sizes.medium.path}` }
          />
        </picture>
      )
    };

    const renderImages = images.map(image => {
      return (
        <picture className={ styles.ImageContainer } key={ image.value._id }>
          <img
            ref={ el => (imageElements.current = [...imageElements.current, el]) }
            className={ [styles.Image, 'lazyload', 'blur-up'].join(' ') }
            src={ `https://admin.murum.studio/storage/uploads${image.value.sizes.lqip.path}` }
            data-src={ `https://admin.murum.studio/storage/uploads${image.value.sizes.medium.path}` }
            alt=""
            width={ image.value.sizes.medium.width }
            height={ image.value.sizes.medium.height }
            onClick={ () => passedFunctions.handleProjectClick(projectIndex) }
          /> 
        </picture>)
    });

    return (
      <div className={ styles.Container }>
        { renderPreview() }
        { renderImages }
      </div>
    );
  } else {
    return <div>No images</div>
  };
  
};

export default Carousel;
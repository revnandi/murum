import { useEffect, useRef } from 'react';
import useStore from '../store';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import 'lazysizes/plugins/blur-up/ls.blur-up';
import styles from './Carousel.module.css';
import throttle from 'lodash.throttle';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Keyboard, EffectFade, Lazy } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/lazy';
import 'swiper/css/keyboard';

import { ClickPosition } from '../models/ClickPosition';
import { CursorType } from '../models/CursorType';

interface Props {
  images?: Array<any>,
  passedFunctions: {
    handleHover: (projectIndex: number | null) => void,
    handleCursor: (value: boolean, target: MouseEvent, functionName: string) => void,
    handleCursorChange: (value: CursorType) => void,
    handleProjectClick: (slug: string) => void,
    handleLightboxOpen: (images: any, indexOfClicked: number) => void,
  },
  projectIndex: number,
  projectSlug: string
};

function Carousel({ images, passedFunctions, projectIndex, projectSlug }: Props) {
  const {
    openedProject,
    setIsCustomCursorVisible,
    cursorType
  } = useStore();

  const throttleTime = 50;
  const imagePreviewElement = useRef<any>(null);
  const activeImage = useRef(0);
  const clickPosition = useRef<ClickPosition>('none');
  const swiperRef = useRef<any>(null);
  const swiperElementRef = useRef<any>(null);

  const localCursorType = useRef<CursorType>('none');

  const handleClickActivate = () => {
    passedFunctions.handleProjectClick(projectSlug);
  };

  const handleClickOpen = () => {
    if (images && images.length > 0) {
      passedFunctions.handleLightboxOpen(images, activeImage.current)
    }
  };

  const handleClickPrev = () => {
    swiperRef.current.slidePrev();
  };

  const handleClickNext = () => {
    swiperRef.current.slideNext();
  };

  const handleMouseEnter = (e: any) => {
    setIsCustomCursorVisible(true);
    if (images && images.length > 1) {
      if (e.currentTarget.offsetWidth * 0.25 >= e.offsetX) {
        passedFunctions.handleCursorChange('left');
      } else if (e.currentTarget.offsetWidth * 0.75 <= e.offsetX) {
        passedFunctions.handleCursorChange('right');
      } else {
        console.log('carousel handleMouseEnter open');
        passedFunctions.handleCursorChange('open');
      }
    } else {
      console.log('carousel handleMouseEnter open');
      passedFunctions.handleCursorChange('open');
    }
    passedFunctions.handleCursor(true, e, 'Carousel handleMouseLeave');
  };

  const handleMouseLeave = (e: MouseEvent) => {
    setIsCustomCursorVisible(false);
    passedFunctions.handleHover(null);
    passedFunctions.handleCursor(false, e, 'Carousel handleMouseLeave');
    // passedFunctions.handleCursorChange('none');
  };

  const handleCarouselMouseMove = (e: any) => {
    // console.log(e);
    // passedFunctions.handleHover(projectIndex);
    passedFunctions.handleCursor(true, e, 'Carousel handleCarouselMouseMove');
    if (images && images.length > 1) {
      if (e.currentTarget.offsetWidth * ((1 / 3 ) * 1) >= e.offsetX) {
        passedFunctions.handleCursorChange('left');
      } else if (e.currentTarget.offsetWidth * ((1 / 3 ) * 2) <= e.offsetX) {
        passedFunctions.handleCursorChange('right');
      } else {
        passedFunctions.handleCursorChange('open');
      }
    } else {
      passedFunctions.handleCursorChange('open');
    }
  };

  const handlePreviewMouseMove = (e: any) => {
    passedFunctions.handleCursorChange('open');
  } ;

  const handleMouseClick = (e: any) => {
    console.log('cursorType = ' + cursorType);
    switch (cursorType) {
      case 'more':
        handleClickActivate();
        break;
      case 'left':
        handleClickPrev();
        break;
      case 'right':
        handleClickNext();
        break;
      case 'open':
        handleClickOpen();
        break;
      default:
        handleClickOpen();
        break;
    }
  };

  const addSwiperEventListeners = (swiperElement: HTMLDivElement) => {
    swiperElement.addEventListener('mouseenter', handleMouseEnter);
    swiperElement.addEventListener('mouseleave', handleMouseLeave);
    swiperElement.addEventListener('mousemove', handleCarouselMouseMove);
    // swiperElement.addEventListener('click', handleMouseClick);
    // swiperElement.addEventListener('contextmenu', (e) => {
    //   e.preventDefault();
    // });
  };

  const removeSwiperEventListeners = (swiperElement: HTMLDivElement) => {
    if (!swiperElement) return;
    swiperElement.removeEventListener('mouseenter', handleMouseEnter);
    swiperElement.removeEventListener('mouseleave', handleMouseLeave);
    swiperElement.removeEventListener('mousemove', handleCarouselMouseMove);
    // swiperElement.removeEventListener('click', handleMouseClick);
    // swiperElement.removeEventListener('contextmenu', (e) => {
    //   e.preventDefault();
    // });
  };

  useEffect(() => {
    if (swiperElementRef.current) {
      addSwiperEventListeners(swiperElementRef.current);
    }

    return () => {
      if (swiperElementRef.current) {
        removeSwiperEventListeners(swiperElementRef.current);
      }
    }
  }, [swiperElementRef.current]);

  useEffect(() => {

    if (images && (images.length > 0) && (openedProject !== projectSlug)) {
      imagePreviewElement.current.addEventListener('mouseenter', handleMouseEnter);
      imagePreviewElement.current.addEventListener('mouseleave', handleMouseLeave);
      imagePreviewElement.current.addEventListener('mousemove', throttle(handlePreviewMouseMove, throttleTime));
      imagePreviewElement.current.addEventListener('click', handleMouseClick);

      // imagePreviewElement.current.addEventListener('contextmenu', (e: any) => {
      //   e.preventDefault();
      // });
    };

    return () => {
      setIsCustomCursorVisible(false);
      if(!imagePreviewElement.current) return;
      imagePreviewElement.current.removeEventListener('mouseenter', handleMouseEnter);
      imagePreviewElement.current.removeEventListener('mouseleave', handleMouseLeave);
      imagePreviewElement.current.removeEventListener('mousemove', handlePreviewMouseMove);
      imagePreviewElement.current.removeEventListener('click', handleMouseClick);
  //     imagePreviewElement.current.removeEventListener('contextmenu', (e: any) => {
  //       e.preventDefault();
  //     });
    }
  }, [imagePreviewElement.current, openedProject]);

  // useEffect(() => {
  //   first
  
  //   return () => {
  //     second
  //   };
  // }, [openedProject]);

  const swiperParams: any = {
    modules: [Keyboard, EffectFade, Lazy],
    effect: 'fade',
    fadeEffect: { crossFade: true },
    loop: true,
    speed: 200,
    keyboard: {
      enabled: true,
      onlyInViewport: false,
    },
  };

  console.log('%c RENDER Carousel','color:red;background-color:#000');

  if (images) {
    const renderPreview = () => {
      return (
        <picture className={ styles.PreviewImageContainer} style={{ display: openedProject === projectSlug ? 'none' : 'block' } }>
          <img
            ref={ imagePreviewElement }
            className={ [styles.PreviewImage, 'lazyload', 'blur-up'].join(' ') }
            src={ `https://admin.murum.studio/storage/uploads${images[0].value.sizes.lqip.path}` }
            data-src={ `https://admin.murum.studio/storage/uploads${images[0].value.sizes.medium.path}` }
            width={ images[0].value.sizes.medium.width }
            height={ images[0].value.sizes.medium.height }
          />
        </picture>
      )
    };

    return (
      <div className={styles.Container}>
        { openedProject !== projectSlug &&
          renderPreview()
        }
        { images && openedProject === projectSlug &&     
          <Swiper
            // install Swiper modules
            {...swiperParams}
            ref={swiperElementRef}
            onSwiper={(swiper) => swiperRef.current = swiper}
            className={styles.Swiper}
          >
            {
              images.map(image => {
                return (
                  <SwiperSlide
                    className={ styles.SwiperSlide }
                    key={image.value._id}
                  >
                    <picture
                      className={styles.ImageContainer}
                    >
                      <img
                        className={[styles.Image, 'lazyload', 'blur-up'].join(' ')}
                        src={`https://admin.murum.studio/storage/uploads${image.value.sizes.lqip.path}`}
                        data-src={`https://admin.murum.studio/storage/uploads${image.value.sizes.medium.path}`}
                        alt=""
                        width={image.value.sizes.medium.width}
                        height={image.value.sizes.medium.height}
                        onClick={() => passedFunctions.handleProjectClick(projectSlug)}
                      />
                    </picture>
                  </SwiperSlide>
                )
              })
          }
          </Swiper>
        }
      </div>
    );
  } else {
    return <div>No images</div>
  };

};

export default Carousel;
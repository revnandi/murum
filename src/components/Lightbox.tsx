import { useEffect, useRef, memo } from 'react';
import useStore from '../store';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import 'lazysizes/plugins/blur-up/ls.blur-up';
import styles from './Lightbox.module.css';
import throttle from 'lodash.throttle';
import { useWindowSize, Size } from '../hooks/useWindowSize';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Keyboard, EffectFade, Lazy } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/lazy';
import 'swiper/css/keyboard';

import { ClickPosition } from '../models/ClickPosition';
import { CursorType } from '../models/CursorType';

interface Props {
  isOpen: boolean;
  images: any,
  clickedImageIndex: number,
  passedFunctions: {
    resetLightbox: (e: React.MouseEvent<HTMLElement>) => void,
    handleCursor: (value: boolean) => void,
    handleCursorChange: (value: CursorType) => void,
  },
  cursorType: CursorType;
}

function Lightbox({ clickedImageIndex, passedFunctions, cursorType }: Props) {
  const throttleTime = 50;
  const {
    openedImages,
    isLightboxOpen,
    setIsLightboxOpen,
  } = useStore();

  const windowSize: Size = useWindowSize();

  // const cursorType = useStore(state => state.cursorType);

  let currentClickedIndex = useRef(1);
  const clickPosition = useRef<ClickPosition>('none');
  const swiperRef = useRef<any>(null);
  const swiperElementRef = useRef<any>(null);

  const posi = useRef<any>(null);
  const halfRef = useRef<any>(null);

  const handleMouseEnter = (e: any) => {
    if (windowSize.width && openedImages && openedImages.length > 1) {
      const target = e.currentTarget;
      const targetWidth = target.getBoundingClientRect().width;
      const offset = (windowSize.width - targetWidth) / 2;
      const calculatedCenter = (targetWidth / 2) + offset;
      if (target && (calculatedCenter >= e.clientX)) {
        clickPosition.current = 'prev';
      } else if (target && (calculatedCenter <= e.clientX)) {
        clickPosition.current = 'next';
      }
      passedFunctions.handleCursor(true);
    }
  };

  const handleMouseLeave = (e: any) => {
    clickPosition.current = 'none';
    passedFunctions.handleCursor(false);
  };

  const handleMouseMove = (e: any) => {
    if (windowSize.width && openedImages && openedImages.length > 1) {
      const target = e.currentTarget;
      const targetWidth = target.getBoundingClientRect().width;
      const offset = (windowSize.width - targetWidth) / 2;
      const calculatedCenter = (targetWidth / 2) + offset;
      if (target && (calculatedCenter >= e.clientX)) {
        clickPosition.current = 'prev';
        passedFunctions.handleCursorChange('left');
        passedFunctions.handleCursor(true);
      } else if (target && (calculatedCenter <= e.clientX)) {
        clickPosition.current = 'next';
        passedFunctions.handleCursorChange('right');
        passedFunctions.handleCursor(true);
      }
    }
  };

  const handleClickPrev = () => {
    swiperRef.current.slidePrev();
  };

  const handleClickNext = () => {
    swiperRef.current.slideNext();
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

  const handleEsc = (event: { keyCode: number; }) => {
    if (event.keyCode === 27) {
      console.log(event.keyCode);
      setIsLightboxOpen(false);
      // setOpenedImages(null);
      // setOpenedImageIndex(0);
      document.body.style.overflow = "auto";
    }
  };

  const addSwiperEventListeners = (swiperElement: HTMLDivElement) => {
    // swiperElement.addEventListener('mouseenter', handleMouseEnter, true);
    // swiperElement.addEventListener('mouseleave', handleMouseLeave, true);
    // swiperElement.addEventListener('mousemove', handleMouseMove, true);
    // swiperElement.addEventListener('click', handleMouseClick, true);
    // swiperElement.addEventListener('contextmenu', (e) => {
    //   e.preventDefault();
    // });
  };

  const removeSwiperEventListeners = (swiperElement: HTMLDivElement) => {
    // swiperElement.removeEventListener('mouseenter', handleMouseEnter);
    // swiperElement.removeEventListener('mouseleave', handleMouseLeave);
    // swiperElement.removeEventListener('mousemove', handleMouseMove);
    // swiperElement.removeEventListener('click', handleMouseClick);
    // swiperElement.removeEventListener('contextmenu', (e) => {
    //   e.preventDefault();
    // });
  };

  const changePosi = (value: string) => {
    console.log('posi changed to ', posi.current);
    posi.current = value;
  };

  useEffect(() => {
    // console.log("useEffect [clickedImageIndex ]");
  }, [clickedImageIndex]);

  useEffect(() => {
    // console.log("useEffect []");

    currentClickedIndex.current = clickedImageIndex;
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    }
  }, []);

  useEffect(() => {
    // console.log("useEffect [isLightboxOpen]");
    currentClickedIndex.current = clickedImageIndex;
    console.log(swiperElementRef.current);
    if (swiperElementRef.current) {
      addSwiperEventListeners(swiperElementRef.current);
    }
    return () => {
      if (swiperElementRef.current) {
        removeSwiperEventListeners(swiperElementRef.current);
      }
    };
  }, [isLightboxOpen]);

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

  return (
    <div className={ styles.Lightbox } style={{ display: isLightboxOpen ? 'flex' : 'none' }}>
      <div ref={ halfRef } style={{ zIndex: "8", position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", height: "40%", width: "1px", backgroundColor: "red"}}></div>
      <div
        onClick={ passedFunctions.resetLightbox }
        className={ styles.CloseButton }
      >
        <svg
          viewBox="0 0 27 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L26 26M26 1L1 26" stroke="black"/>
        </svg>
      </div>
      <div className={ styles.Inner }>
        { openedImages &&
          <Swiper
            // install Swiper modules
            {...swiperParams}
            ref={ swiperElementRef }
            onSwiper={(swiper) => swiperRef.current = swiper}
            className={ [styles.Swiper, 'LightBoxSwiper'].join(' ') }
          >
            {
              openedImages.map((image, index) => {
                return (
                  <SwiperSlide
                  className={ styles.SwiperSlide }
                    key={image.value._id}
                  >
                    <img
                      key={Date.now()}
                      className={styles.Image}
                      // src={`https://admin.murum.studio/storage/uploads${image.value.sizes.lqip.path}`}
                      src={`https://admin.murum.studio/storage/uploads${image.value.sizes.large.path}`}
                      alt=""
                    />
                  </SwiperSlide>
                )
              })
            }
          </Swiper>
        }
      </div>
    </div>
  )
};

export default memo(Lightbox);
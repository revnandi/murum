import { useEffect, useRef, useState } from 'react';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import 'lazysizes/plugins/blur-up/ls.blur-up';
import styles from './Lightbox.module.scss';
import useStore from '../store';
import throttle from 'lodash.throttle';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Keyboard, EffectFade, Lazy } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/lazy';
import 'swiper/css/keyboard';

import { CursorContent } from '../models/CursorContent';
import { ClickPosition } from '../models/ClickPosition';

interface Props {
  isOpen: boolean;
  images: any,
  clickedImageIndex: number,
  passedFunctions: {
    resetLightbox: () => void,
    handleCursor: (value: boolean) => void,
    handleCursorChange: (value: CursorContent) => void
  },
}

function Lightbox({ clickedImageIndex, passedFunctions }: Props) {
  const throttleTime = 50;
  const {
    openedImages,
    setOpenedImages,
    isLightboxOpen,
    setIsLightboxOpen
  } = useStore();

  let currentClickedIndex = useRef(1);
  const clickPosition = useRef<ClickPosition>('none');
  const swiperRef = useRef<any>(null);
  const swiperElementRef = useRef<any>(null);

  const handleMouseEnter = (e: any) => {
    if (openedImages && openedImages.length > 1) {
      if (e.target?.width * 0.5 >= e.offsetX) {
        clickPosition.current = 'prev';
      } else if (e.target?.width * 0.5 <= e.offsetX) {
        clickPosition.current = 'next';
      }
      passedFunctions.handleCursor(true);
      document.documentElement.classList.add('no-cursor');
    }
  };

  const handleMouseLeave = (e: any) => {
    passedFunctions.handleCursor(false);
    clickPosition.current = 'none';
    document.documentElement.classList.remove('no-cursor');
  };

  const handleMouseMove = (e: any) => {
    if (openedImages && openedImages.length > 1) {
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

  const addSwiperEventListeners = (swiperElement: HTMLDivElement) => {
    swiperElement.addEventListener('mouseenter', throttle(handleMouseEnter, throttleTime));
    swiperElement.addEventListener('mouseleave', throttle(handleMouseLeave, throttleTime));
    swiperElement.addEventListener('mousemove', throttle(handleMouseMove, throttleTime));
    swiperElement.addEventListener('click', throttle(handleMouseClick, throttleTime));
    swiperElement.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  };

  const removeSwiperEventListeners = (swiperElement: HTMLDivElement) => {
    swiperElement.removeEventListener('mouseenter', handleMouseEnter);
    swiperElement.removeEventListener('mouseleave', handleMouseLeave);
    swiperElement.removeEventListener('mousemove', handleMouseMove);
    swiperElement.removeEventListener('click', handleMouseClick);
    swiperElement.removeEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  };

  const handleEsc = (event: { keyCode: number; }) => {
    if (event.keyCode === 27) {
      passedFunctions.resetLightbox();
      document.body.style.overflow = "auto";
    }
  };

  useEffect(() => {
    currentClickedIndex.current = clickedImageIndex;

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    }
  }, []);

  useEffect(() => {
    currentClickedIndex.current = clickedImageIndex;
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
                    <div className={ styles.MobileControls }>
                      <svg className={ styles.ControlButton } width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.85005 19L0.950049 10.2L10.0501 1" stroke="black" strokeMiterlimit="10"/>
                      </svg>
                      <svg className={ styles.ControlButton } width="11" height="19" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.14995 0.5L10.05 9.3L0.949951 18.5" stroke="black" strokeMiterlimit="10"/>
                      </svg>
                    </div>
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

export default Lightbox;
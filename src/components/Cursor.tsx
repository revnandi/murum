import React, { useEffect, useRef } from 'react';
import useStore from '../store';
import { gsap } from 'gsap';
import styles from './Cursor.module.css';

import { CursorType } from '../models/CursorType';

interface Props {
  currentCursorType: CursorType;
}

const Cursor = ({ currentCursorType }: Props) => {
  const {
    isCustomCursorVisible,
    cursorType
  } = useStore();

  const cursorRef = useRef<HTMLDivElement>(null);

  const addEventListeners = () => {
    document.addEventListener('mousemove', handleMouseEvent);
  };

  const removeEventListeners = () => {
    document.removeEventListener('mousemove', handleMouseEvent);
  };

  let mouse = { x: 0, y: 0, scrollX: 0, scrollY: 0 };

  const handleMouseEvent = (e: MouseEvent) => {
    let boundingBoxWidth = 0;
    let boundingBoxHeight = 0;

    if(cursorRef.current) {
      boundingBoxWidth = cursorRef.current.getBoundingClientRect().width;
      boundingBoxHeight = cursorRef.current.getBoundingClientRect().height;
    }

    let relX = e.pageX,
    relY = e.pageY;

    mouse.x = relX;
    mouse.y = relY;
    mouse.scrollX = scrollX;
    mouse.scrollY = scrollY;

    gsap.to(cursorRef.current, {
      duration: 0.03,
      x: mouse.x + (scrollX - mouse.scrollX) - (boundingBoxWidth / 2 ),
      y: mouse.y + (scrollY - mouse.scrollY) - (boundingBoxHeight / 2 )
    });
  };

  useEffect(() => {
    addEventListeners();
    return () => {
      removeEventListeners();
    }
  }, []);

  useEffect(() => {
    console.log('isCustomCursorVisible in Cursor useEffect ', isCustomCursorVisible);
    if (isCustomCursorVisible) {
      gsap.to(cursorRef.current, {
        duration: 0.1,
        opacity: 1
      })
    } else {
      gsap.to(cursorRef.current, {
        duration: 0.1,
        opacity: 0
      })
    }
  }, [isCustomCursorVisible]);

  return (
    <div
      className={
        [
          styles.Cursor,
          (currentCursorType === 'left' || currentCursorType === 'right') ? styles.CursorArrow : ''
        ].join(' ')
      }
      ref={ cursorRef }
    >
      { currentCursorType === 'more' &&
        'More'
      }
      { currentCursorType === 'open' &&
        'Open'
      }
      { currentCursorType === 'left' &&
        <svg width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.85005 19L0.950049 10.2L10.0501 1" stroke="black" strokeMiterlimit="10"/>
        </svg>
      }
      { currentCursorType === 'right' &&
        <svg width="11" height="19" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.14995 0.5L10.05 9.3L0.949951 18.5" stroke="black" strokeMiterlimit="10"/>
        </svg>        
      }
    </div>
  );
};

export default Cursor;
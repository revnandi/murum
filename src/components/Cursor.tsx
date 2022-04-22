import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Cursor.module.css';

interface Props {
  isHoveringImage: boolean;
  cursorType: CursorContent;
};
 
type CursorContent = 'More' | '←' | '→' | 'Open';

function Cursor({ isHoveringImage, cursorType }: Props) {
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
  }, [])

  useEffect(() => {
    if (isHoveringImage) {
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
  }, [isHoveringImage])

  return (
    <div
      className={
        [
          styles.Cursor,
          (cursorType === '←' || cursorType === '→') ? styles.CursorArrow : ''
        ].join(' ')
      }
      ref={ cursorRef }
    >
      { cursorType !== '←' && cursorType !== '→' &&
        cursorType
      }
      { cursorType === '←' &&
        <svg width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.85005 19L0.950049 10.2L10.0501 1" stroke="black" strokeMiterlimit="10"/>
        </svg>
      }
      { cursorType === '→' &&
        <svg width="11" height="19" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.14995 0.5L10.05 9.3L0.949951 18.5" stroke="black" strokeMiterlimit="10"/>
        </svg>        
      }
    </div>
  )
};

export default Cursor;
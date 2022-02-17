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
    // const a = window.pageYOffset || document.documentElement.scrollTop;
    // console.log(e)
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
    <div className={ styles.Cursor } ref={ cursorRef }>
      { cursorType }
    </div>
  )
};

export default Cursor;
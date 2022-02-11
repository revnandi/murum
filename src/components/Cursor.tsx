import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Cursor.module.css';

function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  const addEventListeners = () => {
    document.addEventListener("mousemove", handleMouseEvent);
  };

  const removeEventListeners = () => {
    document.removeEventListener("mousemove", handleMouseEvent);
  };

  const handleMouseEvent = (e: MouseEvent) => {
    const a = window.pageYOffset || document.documentElement.scrollTop;

    let boundingBoxWidth = 0;
    let boundingBoxHeight = 0;

    if(cursorRef.current) {
      boundingBoxWidth = cursorRef.current.getBoundingClientRect().width;
      boundingBoxHeight = cursorRef.current.getBoundingClientRect().height;
    }

    let posx = e.pageX,
      posy = e.pageY - a;

    gsap.to(cursorRef.current, {
      duration: 0.03,
      x: posx - (boundingBoxWidth / 2 ),
      y: posy - (boundingBoxHeight / 2 )
    });
  };

  React.useEffect(() => {
    addEventListeners();
    return () => {
      removeEventListeners();
    }
  }, [])

  return (
    <div className={ styles.Cursor } ref={ cursorRef }>
      More
    </div>
  )
};

export default Cursor;
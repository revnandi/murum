import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Carousel.module.css';

interface Props {
  images?: Array<any>
}

function Carousel({ images }: Props) {
  const transitionDuration = 0.1;
  const [activeImage, setActiveImage] = useState(0)
  const [totalImages, setTotalImages] = useState(0)
  const imageElements = useRef(new Array());

  const handleClickPrev = () => {
    if (activeImage === 0) {
      gsap.to(imageElements.current[totalImages - 1] ,{
        opacity: 1,
        duration: transitionDuration
      });
      gsap.to(imageElements.current[activeImage] ,{
        opacity: 0,
        duration: transitionDuration
      });
      setActiveImage(totalImages - 1);
    } else {
      gsap.to(imageElements.current[activeImage - 1] ,{
        opacity: 1,
        duration: transitionDuration
      });
      gsap.to(imageElements.current[activeImage] ,{
        opacity: 0,
        duration: transitionDuration
      });
      setActiveImage(activeImage - 1);
    }
  };

  const handleClickNext = () => {
    console.log(activeImage)
    if (activeImage === totalImages - 1) {
      gsap.to(imageElements.current[activeImage] ,{
        opacity: 0,
        duration: transitionDuration
      });
      gsap.to(imageElements.current[0] ,{
        opacity: 1,
        duration: transitionDuration
      });
      setActiveImage(0);
    } else {
      gsap.to(imageElements.current[activeImage + 1] ,{
        opacity: 1,
        duration: transitionDuration
      });
      gsap.to(imageElements.current[activeImage] ,{
        opacity: 0,
        duration: transitionDuration
      });
      setActiveImage(activeImage + 1);
    }
  }; 

  useEffect(() => {
    if (imageElements.current.length > 0) {
      imageElements.current[0].style.opacity = 1;
      setTotalImages(imageElements.current.length);
    }
  }, [])
  

  if(images) {
    const renderImages = images.map(image => {
      return <img
          ref={ el => (imageElements.current = [...imageElements.current, el]) }
          className={ styles.Image }
          src={ `${import.meta.env.VITE_ADMIN_URL}/storage/uploads${image.value.sizes.medium.path}` }
          alt=""
          key={ image.value._id }
        />
    });

    return (
      <div>
        <div className={ styles.Container }>
          { renderImages }
        </div>
          <button onClick={ () => handleClickPrev() }>PREV</button>
          <button onClick={ () => handleClickNext() }>NEXT</button>
      </div>
    )
  } else {
    return <div>No images</div>
  }
  
};

export default Carousel;
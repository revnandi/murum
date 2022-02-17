import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import 'lazysizes/plugins/blur-up/ls.blur-up';
import styles from './Lightbox.module.css';

interface Props {
  isOpen: boolean;
  image: any,
  passedFunctions: {
    resetLightbox: () => void
  },
}

function Lightbox({ isOpen, image, passedFunctions }: Props) {

  return (
    <div className={ styles.Lightbox } style={{ display: isOpen ? 'block' : 'none' }} onClick={ passedFunctions.resetLightbox }>
      <div className={ styles.Inner }>
          { image &&
            <div className={ styles.ImageContainer }>
              <img
                className={ [styles.Image, 'lazyload', 'blur-up'].join(' ') }
                src={ `https://admin.murum.freizeit.hu/storage/uploads${image.value.sizes.lqip.path}` }
                data-src={ `https://admin.murum.freizeit.hu/storage/uploads${image.value.sizes.large.path}` }
                alt=""
              />
            </div>
          }
      </div>
    </div>
  )
};

export default Lightbox;
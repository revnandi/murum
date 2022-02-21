import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollToPlugin);
import './fonts/test-signifier-regular.woff';
import './fonts/test-founders-grotesk-regular.woff';
import styles from './App.module.css';
import Carousel from './components/Carousel';
import Cursor from './components/Cursor';
import InfoBox from './components/InfoBox';
import Lightbox from './components/Lightbox';
import Navigation from './components/Navigation';
import Links from './components/Links';
import Loader from './components/Loader';

type CursorContent = 'More' | '←' | '→' | 'Open';

type OpenedProject = number | null;

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [projects, setProjects] = useState([]);

  const [cursorIsHoveringImage, setCursorIsHoveringImage] = useState(false);
  const [cursorType, setCursorType] = useState<CursorContent>('More')
  const [openedProject, setOpenedProject] = useState<number | null>(null);
  const [openedImage, setOpenedImage] = useState<any>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const lightBoxFunctions = { 
    resetLightbox: () => {
      setOpenedImage(null);
      setIsLightboxOpen(false);
    }
  };

  const carouselFunctions = {
    handleHover: (projectIndex: number | null) => setHoveredProject(projectIndex),
    handleCursor: (value: boolean) => setCursorIsHoveringImage(value),
    handleProjectClick: (value: number) => {
      scrollToProject(value);
      setOpenedProject(value);
    },
    handleCursorChange: (value: 'More' | '←' | '→' | 'Open') => {
      setCursorType(value);
    },
    handleLightboxOpen: (value: any) => {
      setOpenedImage(value);
      setIsLightboxOpen(true);
    }
  };

  const infoBoxFunctions = {
    resetActivateProject: () => setOpenedProject(null)
  };

  const scrollToProject = (projectIndex: number) => {
    gsap.to(window, {duration: 0.2, scrollTo: `#project_${projectIndex}`});
  };

  useEffect(() => {
    fetch(`https://admin.murum.freizeit.hu/api/collections/get/projects?token=d165676ef94977d5aaab5ea7af6efc`)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setProjects(result.entries);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, []);


  if (error) {
    return <div>Error</div>;
  } else if (!isLoaded) {
    return <Loader />;
  } else {
    const listProjects = projects.map((project: any, index: number) =>
      <li id={ `project_${index}` } className={ styles.ProjectsItem } key={ project._id }>
        <div className={ styles.ProjectsItemInner }>
          <Carousel images={ project.images } projectIndex={ index } passedFunctions={ carouselFunctions } activeProjectIndex={ openedProject } isActive={ openedProject === index }/>
          <InfoBox
              id={ project._id }
              title={ project.title }
              description={ project.description }
              tags={ project.tags }
              isOpen={ openedProject === index }
              isHovered={ hoveredProject === index }
              passedFunctions={ infoBoxFunctions }
            />
        </div>
      </li>
    );


    return (
    <div className={ styles.App }>
      <header  className={ styles.Header }>
        <Navigation />
      </header>
      <main className={ styles.Main }>
        <ul className={ styles.ProjectsList }>
          { listProjects }
        </ul>
      </main>
      <footer className={ styles.Footer }>
        <Links />
      </footer>
      <Lightbox isOpen={ isLightboxOpen } image={ openedImage } passedFunctions={ lightBoxFunctions }/>
      <Cursor isHoveringImage={ cursorIsHoveringImage } cursorType={ cursorType } />
    </div>
    );
  }
}

export default App

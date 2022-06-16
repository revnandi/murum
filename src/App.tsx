import { useState, useEffect } from 'react';
import useStore from './store';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollToPlugin);
import styles from './App.module.css';
import { useWindowSize, Size } from './hooks/useWindowSize';

import Carousel from './components/Carousel';
import Cursor from './components/Cursor';
import InfoBox from './components/InfoBox';
import Lightbox from './components/Lightbox';
import Navigation from './components/Navigation';
import Loader from './components/Loader';
import Filters from './components/Filters';
import PageContent from './components/PageContent';

export type CursorContent = 'More' | '←' | '→' | 'Open';

function App() {
  const windowSize: Size = useWindowSize();

  const {
    allProjects,
    setAllProjects,
    filteredProjects,
    setFilteredProjects,
    activeTags,
    openedProject,
    setOpenedProject,
    openedPage,
    openedImages,
    setOpenedImages,
    isLightboxOpen,
    setIsLightboxOpen
  } = useStore();

  let { slug } = useParams();
  let navigate = useNavigate();

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [cursorIsHoveringImage, setCursorIsHoveringImage] = useState(false);
  const [cursorType, setCursorType] = useState<CursorContent>('More')
  const [openedImageIndex, setOpenedImageIndex] = useState<number>(0);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const lightBoxFunctions = {
    resetLightbox: () => {
      setIsLightboxOpen(false);
      setOpenedImages(null);
      setOpenedImageIndex(0);
      document.body.style.overflow = "auto";
    },
    handleCursor: (value: boolean) => setCursorIsHoveringImage(value),
    handleCursorChange: (value: 'More' | '←' | '→' | 'Open') => {
      setCursorType(value);
    },
  };

  const carouselFunctions = {
    handleHover: (projectIndex: number | null) => {
      setHoveredProject(projectIndex)
    },
    handleCursor: (value: boolean) => setCursorIsHoveringImage(value),
    handleProjectClick: (slug: string) => {
      setOpenedProject(slug);
      navigate(`/${slug}`);
      scrollToProject(slug);
    },
    handleCursorChange: (value: 'More' | '←' | '→' | 'Open') => {
      setCursorType(value);
    },
    handleLightboxOpen: (images: any, indexOfClicked: number) => {
      setOpenedImages(images);
      setOpenedImageIndex(indexOfClicked);
      setIsLightboxOpen(true);
      document.body.style.overflow = "hidden";
    }
  };

  const infoBoxFunctions = {
    resetActivateProject: () => {
      setOpenedProject(null);
      setHoveredProject(null);
    },
    handleProjectClick: (slug: string) => {
      setOpenedProject(slug);
      navigate(`/${slug}`);
      scrollToProject(slug);
    },
  };

  const scrollToProject = (projectSlug: any) => {
    const element = document.getElementById(projectSlug)?.getBoundingClientRect();
    if (element) {
      const topOffset = () => {
        return (window.innerHeight - element.height) / 2;
      };
      if(windowSize &&  windowSize.width && windowSize.width > 767) {
        gsap.to(window, { duration: 0.2, scrollTo: { y: `#${projectSlug}`, offsetY: topOffset() } });
      }
    };
  };

  const filterProjects = (projectsToFilter: string[] | []) => {
    // Avoid filter for empty string
    if (activeTags.length === 0) {
      return allProjects;
    }

    const filtered = projectsToFilter.filter(
      (project: any) => activeTags.some(r => project.tags.includes(r))
    );
    return filtered;
  };

  useEffect(() => {
    fetch(`https://admin.murum.studio/api/collections/get/projects?token=b4feea70ee9842384135e890083a04`)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setAllProjects(result.entries);
          // setProjects(result.entries);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, []);

  useEffect(() => {
    const projectsToFilter = filterProjects(allProjects);
    setFilteredProjects(projectsToFilter);
  }, [allProjects, activeTags]);

  useEffect(() => {
    if(slug && slug !== undefined) {
      setOpenedProject(slug);
      setTimeout(() => {
        scrollToProject(slug);
      }, 100);
    }
  }, [isLoaded, allProjects]);


  if (error) {
    return <div>Error</div>;
  } else if (!isLoaded) {
    return <Loader />;
  } else {
    const listProjects = filteredProjects.map((project: any, index: number) => {

      return <li id={ project.title_slug } className={styles.ProjectsItem} key={project._id}>
        <div className={styles.ProjectsItemInner}>
          <Carousel
            images={project.images}
            projectIndex={index}
            projectSlug={ project.title_slug }
            passedFunctions={carouselFunctions}
          />
          <InfoBox
            slug={project.title_slug}
            title={project.title}
            description={project.description}
            specs={project.specs}
            tags={project.tags}      
            projectSlug={ project.title_slug }
            isHovered={ hoveredProject === index && cursorIsHoveringImage }
            passedFunctions={ infoBoxFunctions }
          />
        </div>
      </li>
    }
    );

    return (  
      <div className={ styles.App }>
        <header className={ styles.Header }>
          <Navigation />
        </header>
        <main className={ styles.Main }>
          <Filters
            openedPage={ openedPage }
          />
          {openedPage &&
            <PageContent />
          }
          <ul className={ [styles.ProjectsList, openedPage ? styles.HiddenProjectsList : ''].join(' ') }>
            {listProjects}
          </ul>
        </main>
        <Lightbox isOpen={isLightboxOpen} images={openedImages} clickedImageIndex={openedImageIndex} passedFunctions={lightBoxFunctions} />
        <Cursor isHoveringImage={cursorIsHoveringImage} cursorType={cursorType} />
      </div>
    );
  }
}

export default App

import { useState, useEffect, useRef, memo } from 'react';
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

import { CursorType } from './models/CursorType';

function App() {
  const windowSize: Size = useWindowSize();

  const {
    allProjects,
    setAllProjects,
    filteredProjects,
    setFilteredProjects,
    activeTags,
    hoveredProject,
    setHoveredProject,
    setOpenedProject,
    openedPage,
    openedImages,
    setOpenedImages,
    openedImageIndex,
    setOpenedImageIndex
  } = useStore();

  let { slug } = useParams();
  let navigate = useNavigate();

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const cursorIsHoveringImage = useRef<boolean>(false);
  const currentCursorType = useRef<CursorType>('more');
  const isCustomCursorVisible = useRef<boolean>(false);

  const lightBoxFunctions = {
    resetLightbox: (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();

      setOpenedImages(null);
      setOpenedImageIndex(0);
      document.body.style.overflow = 'auto';
    },
    handleCursor: (value: boolean) => {
      cursorIsHoveringImage.current = value;
      console.log('isHoveringImage changed to ', cursorIsHoveringImage.current);
      console.log(currentCursorType.current);
    },
    handleCursorChange: (value: 'more' | 'left' | 'right' | 'open' | 'none') => {
      currentCursorType.current = value;
    },
  };

  const carouselFunctions = {
    handleHover: (projectIndex: number | null) => setHoveredProject(projectIndex),
    handleCursor: (value: boolean, event: MouseEvent, functionName: string) => {
      // console.log(event.currentTarget);
      console.log(functionName);
      cursorIsHoveringImage.current = value
    },
    handleCursorChange: (value: 'more' | 'left' | 'right' | 'open' | 'none') => {
      console.log(value);
      currentCursorType.current = value;
      console.log(currentCursorType.current);
    },
    handleProjectClick: (slug: string) => {
      setOpenedProject(slug);
      navigate(`/${slug}`);
      scrollToProject(slug);
    },
    handleLightboxOpen: (images: any, indexOfClicked: number) => {
      setOpenedImages(images);
      setOpenedImageIndex(indexOfClicked);
      document.body.style.overflow = "hidden";
    }
  };

  const infoBoxFunctions = {
    resetActivateProject: () => {
      setOpenedProject(null);
      setHoveredProject(null);
    }
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

      return <li id={ project.title_slug } className={ styles.ProjectsItem } key={ project._id }>
        <div className={ styles.ProjectsItemInner }>
          <Carousel
            images={ project.images }
            projectIndex={ index }
            projectSlug={ project.title_slug }
            passedFunctions={ carouselFunctions }
          />
          <InfoBox
            slug={ project.title_slug }
            title={ project.title }
            description={ project.description }
            specs={ project.specs }
            tags={ project.tags }      
            isHovered={ hoveredProject === index }
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
        {currentCursorType.current}
        <main className={ styles.Main }>
          <Filters />
          { openedPage &&
            <PageContent />
          }
          <ul className={ [styles.ProjectsList, openedPage ? styles.HiddenProjectsList : ''].join(' ') }>
            { listProjects }
          </ul>
        </main>
        {/* <Lightbox
          images={ openedImages }
          clickedImageIndex={ openedImageIndex }
          passedFunctions={ lightBoxFunctions }
          cursorType={ currentCursorType.current }
        /> */}
        <Cursor 
          currentCursorType={currentCursorType.current}
        />
      </div>
    );
  }
}

export default App

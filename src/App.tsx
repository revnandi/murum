import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollToPlugin);
import styles from './App.module.css';

import useStore from './store';

import Carousel from './components/Carousel';
import Cursor from './components/Cursor';
import InfoBox from './components/InfoBox';
import Lightbox from './components/Lightbox';
import Navigation from './components/Navigation';
import Loader from './components/Loader';
import Filters from './components/Filters';
import PageContent from './components/PageContent';

export type CursorContent = 'More' | '←' | '→' | 'Open';

type OpenedProject = number | null;

function App() {
  const {
    allProjects,
    setAllProjects,
    filteredProjects,
    setFilteredProjects,
    activeTags,
    setActiveTags,
    openedProject,
    setOpenedProject,
    openedPage,
    setOpenedPage,
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
    resetLightbox: (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();


      if (e.target === e.currentTarget) {
        setIsLightboxOpen(false);
        setOpenedImages(null);
        setOpenedImageIndex(0);
        document.body.style.overflow = "auto";
      }
    },
    handleCursor: (value: boolean) => setCursorIsHoveringImage(value),
    handleCursorChange: (value: 'More' | '←' | '→' | 'Open') => {
      setCursorType(value);
    },
  };

  const carouselFunctions = {
    handleHover: (projectIndex: number | null) => setHoveredProject(projectIndex),
    handleCursor: (value: boolean) => setCursorIsHoveringImage(value),
    handleProjectClick: (value: number, slug: string) => {
      navigate(`/${slug}`);
      scrollToProject(value);
      setOpenedProject(value);
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
    }
  };

  const scrollToProject = (projectIndex: number) => {
    const element = document.getElementById(`project_${projectIndex}`)?.getBoundingClientRect();
    if (element) {
      const topOffset = () => {
        return (window.innerHeight - element.height) / 2;
      };

      gsap.to(window, { duration: 0.2, scrollTo: { y: `#project_${projectIndex}`, offsetY: topOffset() } });
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
    if(slug) {
      console.log(allProjects);
      console.log(allProjects.findIndex((project: any) => project.title_slug === slug));
      const projectIndexToSet = allProjects.findIndex((project: any) => project.title_slug === slug);
      if(projectIndexToSet) {
        setOpenedProject(projectIndexToSet);
        setTimeout(() => {
          scrollToProject(projectIndexToSet);
        }, 100);
      };
    }

    // setOpenedProject()
  }, [isLoaded, allProjects]);


  if (error) {
    return <div>Error</div>;
  } else if (!isLoaded) {
    return <Loader />;
  } else {
    const listProjects = filteredProjects.map((project: any, index: number) => {

      return <li id={`project_${index}`} className={styles.ProjectsItem} key={project._id}>
        <div className={styles.ProjectsItemInner}>
          <Carousel
            images={project.images}
            projectIndex={index}
            projectSlug={ project.title_slug }
            passedFunctions={carouselFunctions}
            activeProjectIndex={openedProject}
            isActive={openedProject === index}
          />
          <InfoBox
            id={project._id}
            title={project.title}
            description={project.description}
            specs={project.specs}
            tags={project.tags}
            isOpen={openedProject === index}
            isHovered={hoveredProject === index}
            passedFunctions={infoBoxFunctions}
          />
        </div>
      </li>
    }
    );

    return (  
      <div className={styles.App}>
        <header className={styles.Header}>
          <Navigation />
        </header>
        <main className={styles.Main}>
          <Filters />
          {openedPage &&
            <PageContent />
          }
          <ul className={styles.ProjectsList}>
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

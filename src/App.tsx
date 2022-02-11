import { useState, useEffect } from 'react';
import './fonts/test-signifier-regular.woff';
import './fonts/test-founders-grotesk-regular.woff';
import styles from './App.module.css';
import Carousel from './components/Carousel';
import Cursor from './components/Cursor';
import InfoBox from './components/InfoBox';

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_ADMIN_URL}/api/collections/get/projects?token=${import.meta.env.VITE_API_TOKEN}`)
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
    return <div>Loading...</div>;
  } else {
    const listProjects = projects.map((project: any) =>
      <li className={ styles.ProjectsItem } key={ project._id }>
       <Carousel images={ project.images }/>
       <InfoBox
          id={ project._id }
          title={ project.title }
          description={ project.description }
          tags={ project.tags }
        />
      </li>
    );


    return (
    <div className={ styles.App }>
      <header className="App-header">
      </header>
      <main className={ styles.Main }>
        <ul className={ styles.ProjectsList }>
          { listProjects }
        </ul>
      </main>
      <Cursor />
    </div>
    );
  }
}

export default App

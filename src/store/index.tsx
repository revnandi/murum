import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface PortfolioState {
  allProjects: [];
  setAllProjects: (projets: []) => void;
  filteredProjects: string[];
  setFilteredProjects: (filteredProjects: string[]) => void;
  activeTags: string[];
  setActiveTags: (activeTags: string[]) => void;
  openedProject: number | null;
  setOpenedProject: (id: number | null) => void;
  // lightboxisVisible: boolean;
};

const useStore = create<PortfolioState>(devtools((set) => ({
  allProjects: [],
  setAllProjects: (allProjects: []) =>
    set((state) => ({
      ...state,
      allProjects
    })),

  filteredProjects: [],
  setFilteredProjects: (filteredProjects: string[]) =>
  set((state) => ({
    ...state,
    filteredProjects
  })),

  activeTags: [],
  setActiveTags: (activeTags: string[]) =>
  set((state) => ({
    ...state,
    activeTags
  })),

  openedProject: null,
  setOpenedProject: (openedProject:  number | null) =>
  set((state) => ({
    ...state,
    openedProject
  })),

})));

export default useStore;
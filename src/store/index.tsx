import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface PortfolioState {
  allProjects: [];
  setAllProjects: (projets: []) => void;

  filteredProjects: string[];
  setFilteredProjects: (filteredProjects: string[]) => void;

  activeTags: string[];
  setActiveTags: (activeTags: string[]) => void;

  openedProject: string | null;
  setOpenedProject: (slug: string | null) => void;

  openedPage: string | null;
  setOpenedPage: (slug: string | null) => void;

  openedImages: any[] | null;
  setOpenedImages: (images: any[] | null) => void;

  isLightboxOpen: boolean;
  setIsLightboxOpen: (value: boolean) => void;
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
  setOpenedProject: (openedProject:  string | null) =>
  set((state) => ({
    ...state,
    openedProject
  })),

  openedPage: null,
  setOpenedPage: (openedPage:  string | null) =>
  set((state) => ({
    ...state,
    openedPage
  })),

  openedImages: null,
  setOpenedImages: (openedImages:  any[] | null) =>
  set((state) => ({
    ...state,
    openedImages
  })),

  isLightboxOpen: false,
  setIsLightboxOpen: (isLightboxOpen: boolean) =>
  set((state) => ({
    ...state,
    isLightboxOpen
  }))

})));

export default useStore;
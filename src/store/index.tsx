import create from 'zustand';
import { devtools } from 'zustand/middleware';

import { CursorType } from '../models/CursorType';

interface PortfolioState {
  allProjects: [];
  setAllProjects: (projets: []) => void;

  filteredProjects: string[];
  setFilteredProjects: (filteredProjects: string[]) => void;

  activeTags: string[];
  setActiveTags: (activeTags: string[]) => void;

  hoveredProject: number | null;
  setHoveredProject: (hoveredProject: number | null) => void;

  openedProject: string | null;
  setOpenedProject: (slug: string | null) => void;

  openedPage: string | null;
  setOpenedPage: (slug: string | null) => void;

  openedImages: any[] | null;
  setOpenedImages: (images: any[] | null) => void;

  openedImageIndex: number;
  setOpenedImageIndex: (index: number) => void;

  isLightboxOpen: boolean;
  setIsLightboxOpen: (value: boolean) => void;

  isCustomCursorVisible: boolean;
  setIsCustomCursorVisible: (value: boolean) => void;

  cursorType: CursorType;
  setCursorType: (value: CursorType) => void;
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

  hoveredProject: null,
  setHoveredProject: (hoveredProject:  number | null) =>
  set((state) => ({
    ...state,
    hoveredProject
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

  openedImageIndex: 0,
  setOpenedImageIndex: (openedImageIndex:  number) =>
  set((state) => ({
    ...state,
    openedImageIndex
  })),

  isLightboxOpen: false,
  setIsLightboxOpen: (isLightboxOpen: boolean) =>
  set((state) => ({
    ...state,
    isLightboxOpen
  })),

  isCustomCursorVisible: false,
  setIsCustomCursorVisible: (isCustomCursorVisible: boolean) => {
  set((state) => ({
    ...state,
    isCustomCursorVisible
  }))
  console.log(isCustomCursorVisible)
  },

  cursorType: 'none',
  setCursorType: (cursorType: CursorType) =>
  set((state) => ({
    ...state,
    cursorType
  })),

})));

export default useStore;
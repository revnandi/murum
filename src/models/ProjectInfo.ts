export default interface ProjectInfo {
  id: string,
  title: string,
  description: string,
  specs: string,
  tags: Array<string>,
  isOpen: boolean,
  isHovered: boolean,
  passedFunctions: {
    resetActivateProject: () => void
  }
};
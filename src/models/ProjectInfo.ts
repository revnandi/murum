export default interface ProjectInfo {
  slug: string,
  title: string,
  description: string,
  specs: string,
  tags: Array<string>,
  isHovered: boolean,
  passedFunctions: {
    resetActivateProject: () => void
  }
};
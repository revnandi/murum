export default interface ProjectInfo {
  slug: string,
  title: string,
  description: string,
  specs: string,
  tags: Array<string>,
  projectSlug: string,
  isHovered: boolean,
  passedFunctions: {
    resetActivateProject: () => void,
    handleProjectClick: (slug: string) => void
  }
};
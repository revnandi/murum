import styles from './InfoBox.module.css';

interface Props {
  id: string,
  title: string;
  description: string,
  tags: Array<string>,
  isOpen: boolean,
  passedFunctions: {
    resetActivateProject: () => void
  }
}

function InfoBox({ id, title, description, tags, isOpen, passedFunctions }: Props) {
  const renderTags = tags.map((tag, index) => 
    <div className={ styles.TagContainer } key={ `${id}_${index}` }>
      <div className={ styles.Tag }>{ tag }</div>
    </div>
  )

  return (
    <div className={ styles.Box }>
      { isOpen &&
        <>
          <svg className={ styles.CloseButton } viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={ passedFunctions.resetActivateProject }>
            <path d="M1 1L26 26M26 1L1 26" stroke="black"/>
          </svg>
          <h2 className={ styles.Title }>{ title }</h2>
          <div className={ styles.Tags }>
            { renderTags}
          </div>
          <div className={ styles.Description } dangerouslySetInnerHTML={{ __html: description }}></div>
        </>  
      }
    </div>
  )
};

export default InfoBox;
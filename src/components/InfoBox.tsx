import styles from './InfoBox.module.css';

interface Props {
  id: string,
  title: string;
  description: string,
  tags: Array<string>,
}

function InfoBox({ id, title, description, tags }: Props) {
  const renderTags = tags.map((tag, index) => 
    <div className={ styles.Tag } key={ `${id}_${index}` }>{ tag }</div>
  )

  return (
    <div className={ styles.Box }>
      <h2 className={ styles.Title }>{ title }</h2>
      <div className={ styles.Tags }>
        { renderTags}
      </div>
      <div className={ styles.Description } dangerouslySetInnerHTML={{ __html: description }}></div>
    </div>
  )
};

export default InfoBox;
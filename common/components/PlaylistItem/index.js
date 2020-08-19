import styles from './PlaylistItem.module.scss'
import Button from '../Button'

export default function PlaylistItem({ name, thumbnail, id, onClick, className }) {
  return (
    <div onClick={onClick} className={`${styles.item} ${className ? className : ''}`}>
      <img className={styles.item_thumbnail} src={thumbnail} />
      <div className={styles.item_body}>
        <p className={styles.item_body_subtitle}> Playlist </p>
        <h3 className={styles.item_body_title}> {name} </h3>
        <Button className={styles.item_margin}>choose</Button>
      </div>
    </div>
  )
}
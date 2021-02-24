import styles from './PlaylistItem.module.scss'
import Button from '../Button'

export default function PlaylistItem({ name, thumbnail, id, onClick, className, disabled }) {
  return (
    <div onClick={onClick} className={`${styles.item} ${className || className} ${disabled || styles.item_disabled}`}>
      <img className={styles.item_thumbnail} src={thumbnail || '/logo_small.svg'} />
      <div className={styles.item_body}>
        <p className={styles.item_body_subtitle}> Playlist </p>
        <h3 className={styles.item_body_title}> {name} </h3>
        <Button className={styles.item_margin}>choose</Button>
      </div>
    </div>
  )
}
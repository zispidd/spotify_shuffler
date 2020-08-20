import styles from './Button.module.scss'
import Link from 'next/link'

export default function Button({ href, children, type, link, onClick, className, loading }) {
  if(link) {
    return (
      // <Link href={href}>
        <a href={href} className={`${styles.button_default} ${className ? className : ''}`}>
          { children }
        </a>
      // </Link>
    )
  }
  return (
    <button onClick={onClick} className={type === 'green' ? `${styles.button_green} ${className ? className : ''}` : `${styles.button_default}  ${className ? className : ''}`}>
      { children }
      {loading ? <div className={styles.loading}>
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" display="block" preserveAspectRatio="xMidYMid" viewBox="0 0 100 100"><circle cx="50" cy="50" r="35" fill="none" stroke="#fff" strokeDasharray="164.93361431346415 56.97787143782138" strokeWidth="10" transform="rotate(43.48 50 50)"><animateTransform attributeName="transform" dur="1s" keyTimes="0;1" repeatCount="indefinite" type="rotate" values="0 50 50;360 50 50"></animateTransform></circle></svg>
      </div> : null}
    </button>
  )
}
import styles from './Navbar.module.scss'
import Link from 'next/link'
import { SPOTIFY_API } from '../../constants'
import Button from '../Button'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setLogOut } from '../../store/actions/actions'
import { useRouter } from 'next/router'

function Navbar({ user, logged, setLogOut }) {
  const router = useRouter()
  function logOut() {
    setLogOut()
    router.push('/')
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.navbar_container}>
        <div className={styles.navbar_container_wrapper}>
          <Link href='/'>
            <a><img src='/logo.svg' /></a>
          </Link>
          <div className={styles.navbar_container_wrapper_menu}>
            <nav>
              <a target='_blank' href='https://github.com'>Github</a>
            </nav>
            {
              logged ? <div className={styles.navbar_container_wrapper_menu_logged}>
                <img className={styles.navbar_container_wrapper_menu_logged_avatar} src={user.images[0].url} />
                <span> {user.display_name} </span>
                <button onClick={logOut}>
                  <img width='15px' src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJNMjU1LjE1IDQ2OC42MjVINjMuNzg3Yy0xMS43MzcgMC0yMS4yNjItOS41MjYtMjEuMjYyLTIxLjI2MlY2NC42MzhjMC0xMS43MzcgOS41MjYtMjEuMjYyIDIxLjI2Mi0yMS4yNjJIMjU1LjE1YzExLjc1OCAwIDIxLjI2Mi05LjUwNCAyMS4yNjItMjEuMjYyUzI2Ni45MDguODUgMjU1LjE1Ljg1SDYzLjc4N0MyOC42MTkuODUgMCAyOS40NyAwIDY0LjYzOHYzODIuNzI0YzAgMzUuMTY4IDI4LjYxOSA2My43ODcgNjMuNzg3IDYzLjc4N0gyNTUuMTVjMTEuNzU4IDAgMjEuMjYyLTkuNTA0IDIxLjI2Mi0yMS4yNjIgMC0xMS43NTgtOS41MDQtMjEuMjYyLTIxLjI2Mi0yMS4yNjJ6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTUwNS42NjQgMjQwLjg2MUwzNzYuMzg4IDExMy4yODZjLTguMzM1LTguMjUtMjEuODE1LTguMTQzLTMwLjA2NS4yMTNzLTguMTY1IDIxLjgxNS4yMTMgMzAuMDY1bDkyLjM4NSA5MS4xNzNIMTkxLjM2MmMtMTEuNzU4IDAtMjEuMjYyIDkuNTA0LTIxLjI2MiAyMS4yNjIgMCAxMS43NTggOS41MDQgMjEuMjYzIDIxLjI2MiAyMS4yNjNoMjQ3LjU1OWwtOTIuMzg1IDkxLjE3M2MtOC4zNzcgOC4yNS04LjQ0MSAyMS43MDktLjIxMyAzMC4wNjVhMjEuMjU1IDIxLjI1NSAwIDAwMTUuMTM5IDYuMzM2YzUuNDAxIDAgMTAuODAxLTIuMDQxIDE0LjkyNi02LjEyNGwxMjkuMjc2LTEyNy41NzVBMjEuMzAzIDIxLjMwMyAwIDAwNTEyIDI1NS45OThjMC01LjY5Ni0yLjI3NS0xMS4xMTgtNi4zMzYtMTUuMTM3eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==' />
                </button>
              </div>
                : <Button link href={SPOTIFY_API}> log in with spotify</Button>
            }
          </div>
        </div>
      </div>
    </header>
  )
}

const mapStateToProps = state => ({
  user: state.user,
  logged: state.logged
})

const mapDispatchToProps = dispatch => ({
  setLogOut: bindActionCreators(setLogOut, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { getMe } from "../../store/actions/actions"
import { useEffect } from "react"
import Navbar from "../Navbar"
import Head from "next/head"

function Layout({ children, ...props }) {
  useEffect(() => {
    function getMe() {
      props.getMe(window.localStorage.getItem('token'))
    }
    getMe()
  }, [])
  return (
    <main>
      <Head>
        <title>Spotify playlist shuffler</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {children}
    </main>
  )
}

const mapDispatchToProps = dispatch => ({
  getMe: bindActionCreators(getMe, dispatch)
})

export default connect(null, mapDispatchToProps)(Layout)
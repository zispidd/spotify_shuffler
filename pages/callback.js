import { withRouter } from 'next/router'
import { useEffect } from 'react'
import Layout from '../common/components/Layout'

function Callback({ router }) {
  useEffect(() => {
    try {
      const token = router.asPath.substring(10).split('access_token=')[1].split('&')[0]
      if(token) {
        window.localStorage.setItem('token', token)
      }
      router.push('/')
    } catch (error) {
      router.push('/')
    }
  }, [])
  return (
    <Layout>
      Redirect..
    </Layout>
  )
}

export default withRouter(Callback)
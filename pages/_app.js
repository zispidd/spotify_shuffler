import '../styles/global.scss'
import { wrapper } from '../common/store'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default wrapper.withRedux(MyApp)

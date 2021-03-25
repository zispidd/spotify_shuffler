import Layout from '../common/components/Layout'
import styles from '../styles/Home.module.scss'
import { Component } from 'react'
import Item from '../common/components/PlaylistItem'
import axios from 'axios'
import { connect } from 'react-redux'
import Button from '../common/components/Button'
import { SPOTIFY_API } from '../common/constants'

class Home extends Component {
  state = {
    thumbnail: 'https://i.imgur.com/U7TDfAz.png',
    name: null,
    id: null,
    playlists: [],
    description: null,
    owner: null,
    loading: false
  }

  componentDidMount() {
    this.getPlaylists()
    console.log(this.props)
  }

  getPlaylists = async () => {
    let token = window.localStorage.getItem('token')
    const { data } = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me/playlists',
      headers: {
        Authorization: `Bearer ${token}`
      },
      validateStatus: false
    })
    if (data.error) return
    console.log(data)
    const playlists = data.items.filter(r => r.owner.id === this.props.user.id)
    this.setState({
      playlists
    })
  }

  shufflePlaylist = async () => {
    this.setState({
      loading: true
    })
    let items = []
    let token = window.localStorage.getItem('token')
    const getTracks = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/playlists/${this.state.id}`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      validateStatus: false
    })
    if (getTracks.data.error) return
    getTracks.data.tracks.items.map(r => {
      items.push(r.track.uri)
    })
    let updatedArray = this.shuffle(items)
    const updatePlaylist = await axios({
      method: 'put',
      url: `https://api.spotify.com/v1/playlists/${this.state.id}/tracks?uris=` + updatedArray.join(','),
      headers: {
        Authorization: `Bearer ${token}`
      },
      validateStatus: false
    })
    this.setState({
      loading: false
    })
  }

  shuffle = a => {
    let j, x, i
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      x = a[i]
      a[i] = a[j]
      a[j] = x
    }
    return a
  }

  selectPlaylist = item => {
    this.setState({
      id: item.id,
      name: item.name,
      thumbnail: item.images[0].url,
      description: item.description,
      owner: item.owner
    })
  }

  render() {
    return (
      <Layout link={this.props.SPOTIFY_LINK}>
        <div className='container'>
          <div className={styles.selected_playlist}>
            <div className={styles.selected_playlist_thumbnail_block}>
              <img className={styles.selected_playlist_thumbnail} src={this.state.thumbnail} />
            </div>
            <div className={styles.selected_playlist_info}>
              {
                !this.state.id ?
                  <div>
                    <p className={styles.selected_playlist_info_subtitle}>Welcome to</p>
                    <h1 className={styles.selected_playlist_info_title}>Spotify shuffler</h1>
                  </div> : <div>
                    <p className={styles.selected_playlist_info_subtitle}>Playlist</p>
                    <h1 className={styles.selected_playlist_info_title}>{this.state.name}</h1>
                    <p className={styles.selected_playlist_info_owner}> <span>Created by</span> {this.state.owner.display_name} </p>
                    <div className={styles.selected_playlist_info_button}>
                      <Button type='green' className={styles.selected_playlist_info_button} loading={this.state.loading} onClick={this.shufflePlaylist}> Shuffle playlist </Button>
                    </div>

                  </div>
              }
            </div>
          </div>
          {this.props.logged ? <div className='row'>
            {this.state.playlists.length > 0 ? this.state.playlists.map(r => (
              <div className='col-md-6 col-lg-4 col-xxl-3 item' key={r.id}>
                <Item
                  thumbnail={r.images[0] && r.images[0].url}
                  name={r.name}
                  onClick={() => this.selectPlaylist(r)}
                  id={r.id}
                  description={r.description}
                />
              </div>
            )) : null}
          </div> :
            <div className={styles.log_in}>
              <p>Log in with spotify to shuffle playlists</p>
            </div>}
        </div>
      </Layout>
    )
  }
}

export async function getStaticProps() {
  return {
    props: {
      SPOTIFY_LINK: SPOTIFY_API
    }
  }
}

const mapStateToProps = state => ({
  user: state.user,
  logged: state.logged
})

export default connect(mapStateToProps, null)(Home)
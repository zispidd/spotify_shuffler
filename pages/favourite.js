import React, { useEffect, useState } from 'react'
import styles from '../styles/Favourite.module.scss'
import { container } from '../styles/Home.module.scss'
import Button from '../common/components/Button'
import Layout from '../common/components/Layout'
import PlaylistItem from '../common/components/PlaylistItem'
import { connect } from 'react-redux'
import Router from 'next/router'
import axios from 'axios'
import { CREATE_PLAYLIST_BODY } from '../common/constants'

function Favourite(props) {
  const [loading, setLoading] = useState(false)
  const [playlist, setPlaylist] = useState(null)

  useEffect(() => {
    if (!props.logged) {
      Router.push('/')
    }
  }, [])

  async function createPlaylist() {
    setLoading(true)

    const token = window.localStorage.getItem('token')
    
    const userId = props.user.id
    const tracks = []

    await new Promise(resolve => {
      let offset = 0
      let limit = 50
      const makeRequest = async () => {
        const getFavourites = await axios({
          method: 'get',
          url: `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`,
          headers: {
            Authorization: `Bearer ${token}`
          },
          validateStatus: false
        })

        if (getFavourites.data.items.length === 0) return resolve(true)

        getFavourites.data.items.map(track => tracks.push(track.track))

        offset += limit
        makeRequest()
      }

      makeRequest()
    })

    const createPlaylistLink = `https://api.spotify.com/v1/users/${userId}/playlists`

    const createEmptyPlaylist = await axios({
      method: 'post',
      url: createPlaylistLink,
      data: CREATE_PLAYLIST_BODY,
      headers: {
        Authorization: `Bearer ${token}`
      },
      validateStatus: false
    })

    const playlistId = createEmptyPlaylist.data.id

    const chunks = tracks.reduce((resultArray, item, index) => { 
      const chunkIndex = Math.floor(index / 100)
    
      if(!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []
      }
    
      resultArray[chunkIndex].push(item.uri)
    
      return resultArray
    }, [])

    await Promise.all(chunks.map(async chunk => {
      const addTracksURL = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=` + chunk.join(',')

      await axios({
        method: 'put',
        url: addTracksURL,
        data: {
          uris: chunk
        },
        headers: {
          Authorization: `Bearer ${token}`
        },
        validateStatus: false
      })
    }))

    const getPlaytlistStats = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/playlists/${playlistId}`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      validateStatus: false
    })

    setPlaylist(getPlaytlistStats.data)
    setLoading(false)
  }

  return (
    <Layout link={props.SPOTIFY_LINK}>
      <div className={container}>
        <div className={styles.flex}>
          {
            props.logged ?
              <>
                <h1>Create playlist from your favourite tracks?</h1>
                <Button onClick={createPlaylist} loading={loading} className={styles.btn}>Create</Button>
                {
                  playlist && <PlaylistItem
                  thumbnail={playlist.images[0]?.url}
                  name={playlist.name}
                  id={playlist.id}
                  description={playlist.description}
                  />
                }
              </> : <p>Log in with spotify to shuffle playlists</p>
          }
        </div>
      </div>
    </Layout>
  )
}

const mapStateToProps = state => ({
  user: state.user,
  logged: state.logged
})

export default connect(mapStateToProps, null)(Favourite)

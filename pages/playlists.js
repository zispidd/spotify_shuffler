import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Layout from '../common/components/Layout'
import styles from '../styles/Playlists.module.scss'
import PlaylistItem from '../common/components/PlaylistItem'
import { connect } from 'react-redux'
import Router from 'next/router'
import { TabList, TabPanel, Tabs, Tab } from 'react-tabs'
import { CREATE_COPY_PLAYLIST_BODY } from '../common/constants'

function Playlists(props) {
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [playlists, setPlaylists] = useState([])
  const [userPlaylists, setUserPlaylists] = useState([])

  const [stageActive, setStageActive] = useState(false)
  const [firstItem, setFirstItem] = useState(null)
  const [secondItem, setSecondItem] = useState(null)

  useEffect(() => {
    if (!props.logged) {
      Router.push('/')
      return
    }

    loadPlaylists()
  }, [])

  async function loadPlaylists() {
    setError(null)

    const token = window.localStorage.getItem('token')


    const request = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me/playlists',
      headers: {
        Authorization: `Bearer ${token}`
      },
      validateStatus: false
    })

    if (request.status !== 200) return

    setPlaylists(request.data.items)

    setUserPlaylists(request.data.items
        .filter(r => r.owner.id === props.user.id))
  }

  async function createCopy(id) {
    setSuccess(null)

    const token = window.localStorage.getItem('token')
    const tracks = []

    await new Promise(resolve => {
      let offset = 0
      let limit = 100
      const makeRequest = async () => {
        const getPlaylistTracks = await axios({
          method: 'get',
          url: `https://api.spotify.com/v1/playlists/${id}/tracks?limit=${limit}&offset=${offset}`,
          headers: {
            Authorization: `Bearer ${token}`
          },
          validateStatus: false
        })

        if (getPlaylistTracks.data.items.length === 0) return resolve(true)

        getPlaylistTracks.data.items.map(track => {
          if (track.is_local) return
          tracks.push(track.track.uri)
        })

        offset += limit
        makeRequest()
      }

      makeRequest()
    })

    const createEmptyPlaylist = await axios({
      method: 'post',
      url: `https://api.spotify.com/v1/users/${props.user.id}/playlists`,
      data: CREATE_COPY_PLAYLIST_BODY,
      headers: {
        Authorization: `Bearer ${token}`
      },
      validateStatus: false
    })

    const chunks = tracks.reduce((resultArray, item, index) => { 
      const chunkIndex = Math.floor(index / 100)
    
      if(!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []
      }
    
      resultArray[chunkIndex].push(item)
    
      return resultArray
    }, [])

    await Promise.all(chunks.map(async chunk => {
      const addTracksURL = `https://api.spotify.com/v1/playlists/${createEmptyPlaylist.data.id}/tracks?uris=` + chunk.join(',')

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

    setSuccess(true)
  }

  function selectFirstPlaylist(id) {
    setFirstItem(id)
    setStageActive(true)
  }

  function selectSecondPlaylist(id) {
    console.log(id)
    setSecondItem(id)
    console.log(secondItem)
    startCopy()
  }

  async function startCopy() {
    setSuccess(null)

    const token = window.localStorage.getItem('token')

    const firstTracks = []
    const secondTracks = []

    await new Promise(resolve => {
      let offset = 0
      let limit = 100
      const makeRequest = async () => {
        const getPlaylistTracks = await axios({
          method: 'get',
          url: `https://api.spotify.com/v1/playlists/${firstItem}/tracks?limit=${limit}&offset=${offset}`,
          headers: {
            Authorization: `Bearer ${token}`
          },
          validateStatus: false
        })

        if (getPlaylistTracks.data.items.length === 0) return resolve(true)

        getPlaylistTracks.data.items.map(track => {
          if (track.is_local) return
          firstTracks.push(track.track.uri)
        })

        offset += limit
        makeRequest()
      }

      makeRequest()
    })

    await new Promise(resolve => {
      let offset = 0
      let limit = 100
      const makeRequest = async () => {
        const getPlaylistTracks = await axios({
          method: 'get',
          url: `https://api.spotify.com/v1/playlists/${secondItem}/tracks?limit=${limit}&offset=${offset}`,
          headers: {
            Authorization: `Bearer ${token}`
          },
          validateStatus: false
        })

        if (getPlaylistTracks.data.items.length === 0) return resolve(true)

        getPlaylistTracks.data.items.map(track => {
          if (track.is_local) return
          secondTracks.push(track.track.uri)
        })

        offset += limit
        makeRequest()
      }

      makeRequest()
    })

    const tracks = [...secondTracks, ...firstTracks]

    const chunks = tracks.reduce((resultArray, item, index) => { 
      const chunkIndex = Math.floor(index / 100)
    
      if(!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []
      }
    
      resultArray[chunkIndex].push(item)
    
      return resultArray
    }, [])

    await Promise.all(chunks.map(async chunk => {
      const addTracksURL = `https://api.spotify.com/v1/playlists/${secondItem}/tracks?uris=` + chunk.join(',')

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

    setSuccess(true)
  }

  return (
    <Layout>
      <div className='container'>
        <div className='row'>
          <div className={styles.wrapper}>
            <h1>Welcome to playlist tools menu</h1>

            {
              error && (
                <div className='alert alert-danger' role='alert'>
                  An error occured
                </div>
              )
            }

            {
              success && (
                <div className='alert alert-success' role='alert'>
                  Success!
                </div>
              )
            }

            <div>
              <Tabs>
                <TabList className={styles.tabs}>
                  <Tab>Copy playlist</Tab>
                  <Tab>Copy tracks to mine from another playlist?</Tab>
                </TabList>

                <TabPanel>
                {playlists.length > 0 ?
                  <div className='row'>
                    {playlists.map(r => (
                      <div className='col-md-6 col-lg-4 col-xxl-3 item' key={r.id}>
                        <PlaylistItem
                          thumbnail={r.images[0] && r.images[0].url}
                          name={r.name}
                          onClick={() => createCopy(r.id)}
                          id={r.id}
                          description={r.description}
                        />
                      </div>
                    ))}
                  </div> :
                  <h1>Playlists not found</h1>
                }
                </TabPanel>
                <TabPanel>
                  
                {!stageActive ? 
                  <div>
                    <h2>Select playlist which we're going to copy tracks</h2>

                    {playlists.length > 0 ?
                      <div className='row'>
                        {playlists.map(r => (
                          <div className='col-md-6 col-lg-4 col-xxl-3 item' key={r.id}>
                            <PlaylistItem
                              thumbnail={r.images[0] && r.images[0].url}
                              name={r.name}
                              onClick={() => selectFirstPlaylist(r.id)}
                              id={r.id}
                              description={r.description}
                            />
                          </div>
                        ))}
                      </div> :
                      <h1>Playlists not found</h1>
                    }
                  </div> : 
                  <div>
                    <h2>Select playlist which we're going to paste tracks</h2>

                    {userPlaylists.length > 0 ?
                      <div className='row'>
                        {userPlaylists.map(r => (
                          <div className='col-md-6 col-lg-4 col-xxl-3 item' key={r.id}>
                            <PlaylistItem
                              thumbnail={r.images[0] && r.images[0].url}
                              name={r.name}
                              onClick={() => selectSecondPlaylist(r.id)}
                              id={r.id}
                              description={r.description}
                            />
                          </div>
                        ))}
                      </div> :
                      <h1>Playlists not found</h1>
                    }
                  </div>
                  }
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

const mapStateToProps = state => ({
  user: state.user,
  logged: state.logged
})

export default connect(mapStateToProps, null)(Playlists)

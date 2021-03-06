export const SPOTIFY_ENDPOINT = 'https://accounts.spotify.com/authorize'
export const SPOTIFY_SCOPE = [
  'playlist-modify-public',
  'playlist-modify-private',
  'playlist-read-private',
  'user-read-private'
]
export const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
export const SPOTIFY_URL = process.env.SPOTIFY_REDIRECT_URL || 'http://localhost:3000/callback'
export const CREATE_PLAYLIST_BODY = {
  name: 'Liked songs',
  public: false,
  description: 'Your liked songs. created by https://spotify-shuffler.vercel.app/'
}

export const CREATE_COPY_PLAYLIST_BODY = {
  name: 'Copy of playlist',
  public: false,
  description: 'Copy playlist. created by https://spotify-shuffler.vercel.app/'

}

export const SPOTIFY_API = `${SPOTIFY_ENDPOINT}?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${SPOTIFY_URL}&scope=${SPOTIFY_SCOPE.join(
  '%20'
)}&response_type=token&show_dialog=true`
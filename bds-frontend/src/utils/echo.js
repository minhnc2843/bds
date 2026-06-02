import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

let echoInstance = null

export const getEcho = () => {
  if (echoInstance) return echoInstance

  echoInstance = new Echo({
    broadcaster:    'reverb',
    key:            import.meta.env.VITE_REVERB_APP_KEY,
    wsHost:         import.meta.env.VITE_REVERB_HOST,
    wsPort:         import.meta.env.VITE_REVERB_PORT,
    wssPort:        import.meta.env.VITE_REVERB_PORT,
    forceTLS:       false,
    enabledTransports: ['ws'],
    authEndpoint:   'http://localhost/bds-api/public/broadcasting/auth',
    auth: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        Accept: 'application/json',
      },
    },
  })

  return echoInstance
}

export const destroyEcho = () => {
  if (echoInstance) {
    echoInstance.disconnect()
    echoInstance = null
  }
}
import { useCallback, useEffect } from 'react'
import firebase from '../firebase'

function useCheckoutUser (props) {
  const { setUser, history, clearUser } = props
  const checkout = useCallback(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user)
        history.push('/')
      } else {
        history.push('/login')
        clearUser()
      }
    })
  }, [setUser, history, clearUser])
  useEffect(() => {
    checkout()
  }, [checkout])
}

export default useCheckoutUser

import { createContext, useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import Loading from '~/components/Loading/Loading'

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({})
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  const auth = getAuth()

  useEffect(() => {
    const unsubcribed = auth.onIdTokenChanged((user) => {
      if (user?.uid) {
        setUser(user)
        if (user.accessToken !== localStorage.getItem('accessToken')) {
          localStorage.setItem('accessToken', user.accessToken)
          window.location.reload()
        }
        setIsLoading(false)
        return
      }

      // reset user info
      setIsLoading(false)
      setUser({})
      localStorage.clear()
      navigate('/')
    })

    return () => {
      unsubcribed()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {isLoading ? <Loading /> : children}
    </AuthContext.Provider>
  )
}

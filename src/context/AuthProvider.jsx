import { createContext, useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import Loading from '~/components/Loading/Loading'

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged((user) => {
      if (user?.uid) {
        setUser(user)
        const token = user.accessToken
        if (token !== localStorage.getItem('accessToken')) {
          localStorage.setItem('accessToken', token)
          window.location.reload()
        }
        setIsLoading(false)
      } else {
        // Reset user info
        setUser(null)
        localStorage.clear()
        setIsLoading(false)
        navigate('/')
      }
    })

    return unsubscribe
  }, [navigate, auth])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {isLoading ? <Loading /> : children}
    </AuthContext.Provider>
  )
}

import { getAuth } from 'firebase/auth'
import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loading from '~/components/Loading/Loading'

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  const auth = getAuth()
  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (user?.uid) {
        setUser(user)
        if (user.accessToken !== localStorage.getItem('accessToken')) {
          const token = await user.getIdToken()
          localStorage.setItem('accessToken', token)
        }
        setIsLoading(false)
      } else {
        setUser(null)
        localStorage.clear()
        setIsLoading(false)
        navigate('/')
      }
    })

    return unsubscribe
  }, [auth, navigate])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {isLoading ? <Loading /> : children}
    </AuthContext.Provider>
  )
}

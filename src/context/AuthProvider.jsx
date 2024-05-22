import { getAuth } from 'firebase/auth'
import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '~/components/Loading/Loading'

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  const auth = getAuth()

  useEffect(() => {
    const checkTokenExpiration = async () => {
      const user = auth.currentUser
      if (user) {
        try {
          const tokenResult = await user.getIdTokenResult()
          const expirationTime = new Date(tokenResult.expirationTime).getTime()
          const currentTime = Date.now()
          if (expirationTime < currentTime) {
            const newToken = await user.getIdToken(true)
            localStorage.setItem('accessToken', newToken)
          }
        } catch (error) {
          toast.error('Something went wrong! Please refresh this page!')
        }
      }
    }

    const interval = setInterval(checkTokenExpiration, 60000)

    return () => clearInterval(interval)
  }, [auth])

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (user?.uid) {
        setUser(user)
        try {
          const token = await user.getIdToken()
          localStorage.setItem('accessToken', token)
        } catch (error) {
          toast.error('Something went wrong! Please refresh this page!')
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

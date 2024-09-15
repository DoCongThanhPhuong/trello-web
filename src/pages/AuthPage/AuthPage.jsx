import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { loginAPI } from '~/apis'

function AuthPage() {
  const auth = getAuth()
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()

    const {
      user: { uid, email, photoURL, displayName }
    } = await signInWithPopup(auth, provider)

    await loginAPI({
      uid: uid,
      email: email,
      avatar: photoURL,
      displayName: displayName
    })

    const token = await auth.currentUser.getIdToken(true)
    localStorage.setItem('accessToken', token)
    setIsAuthenticated(true)
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/boards')
    }
  }, [isAuthenticated, navigate])

  if (localStorage.getItem('accessToken')) {
    return <Navigate to="/boards" />
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        width: '100vw',
        height: '100vh',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'
      }}
    >
      <Typography variant="h5" sx={{ color: 'white' }}>
        Welcome to Trello
      </Typography>
      <Button
        sx={{
          color: 'white',
          border: '1px solid white',
          '&:hover': {
            borderWidth: '1px'
          }
        }}
        onClick={handleLoginWithGoogle}
      >
        Login with Google
      </Button>
    </Box>
  )
}

export default AuthPage

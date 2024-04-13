import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { Navigate } from 'react-router-dom'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { createNewUserAPI } from '~/apis'

function AuthPage() {
  const auth = getAuth()

  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()

    const {
      user: { uid, email, photoURL, displayName }
    } = await signInWithPopup(auth, provider)

    createNewUserAPI({
      uid: uid,
      email: email,
      avatar: photoURL,
      displayName: displayName
    })
  }

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
        gap: 2,
        width: '100vw',
        height: '100vh',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: '10px', color: 'white' }}>
        Welcome to Trello
      </Typography>
      <Button sx={{ color: 'white' }} onClick={handleLoginWithGoogle}>
        Login with Google
      </Button>
    </Box>
  )
}

export default AuthPage

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { getProfileAPI } from '~/apis'
import AppBar from '~/components/AppBar/AppBar'
import Loading from '~/components/Loading/Loading'

function UserProfile() {
  const [profile, setProfile] = useState(null)
  useEffect(() => {
    getProfileAPI().then((data) => {
      setProfile(data)
    })
  }, [])

  if (!profile) return <Loading />

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
        color: 'white'
      }}
    >
      <AppBar />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar
          alt="Avatar"
          sx={{ width: 56, height: 56 }}
          src={profile?.avatar}
        />
        <Box>
          <Typography variant="h6" component="h1">
            {profile?.displayName}
          </Typography>
          <Typography variant="subtitle1">{profile?.email}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default UserProfile

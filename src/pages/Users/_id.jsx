import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AppBar from '~/components/AppBar/AppBar'

function UserProfile() {
  return (
    <Box>
      <AppBar />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar alt="Avatar" src="" sx={{ width: 56, height: 56 }} />
        <Box>
          <Typography variant="h6" component="h1">
            Đỗ Công Thanh Phương
          </Typography>
          <Typography variant="subtitle1">bido23082003@gmail.com</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default UserProfile

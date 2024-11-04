import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

function Loading({ caption = 'Loading...' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'
      }}
    >
      <CircularProgress
        sx={{
          color: 'white'
        }}
      />
      <Typography
        sx={{
          color: 'white'
        }}
      >
        {caption}
      </Typography>
    </Box>
  )
}

export default Loading

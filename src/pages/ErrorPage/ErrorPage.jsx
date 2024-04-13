import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()

  return (
    <div id="error-page">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 2,
          minHeight: '100vh',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'
        }}
      >
        <Typography variant="h1" style={{ color: 'white' }}>
          Opps!
        </Typography>
        <Typography variant="h6" style={{ color: 'white' }}>
          Sorry, an unexpected error has occurred.
        </Typography>
        <Typography variant="h6" style={{ color: 'white' }}>
          {error.statusText || error.message}
        </Typography>
      </Box>
    </div>
  )
}

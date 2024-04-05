import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import myteam from '~/assets/images/myteam.jpg'

import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        bgcolor: '#4158d0',
        backgroundImage:
          'linear-gradient(43deg, #4158c0 0%, #c850c0 46%, #ffcc70 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Grid
        container
        spacing={6}
        sx={{
          display: 'flex',
          alignItems: 'center',
          maxWidth: '1300px',
          padding: '50px'
        }}
      >
        <Grid item xs={12} md={7}>
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{ paddingBottom: '15px', color: 'white' }}
          >
            Trello brings all your tasks, teammates, and tools together
          </Typography>
          <Typography
            variant="h6"
            sx={{ opacity: '0.8', paddingBottom: '30px', color: 'white' }}
          >
            Keep everything in the same place—even if your team isn’t.
          </Typography>
          <Link to={'/boards'} style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                display: 'inline-block',
                p: '8px 16px',
                bgcolor: '#2e2ed4',
                borderRadius: '4px'
              }}
            >
              <Typography variant="h6" sx={{ color: 'white' }}>
                Get started
              </Typography>
            </Box>
          </Link>
        </Grid>
        <Grid item xs={12} md={5}>
          <img
            src={myteam}
            alt="My Team"
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Home

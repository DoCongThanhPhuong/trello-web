import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import boarbg from '~/assets/images/boardbg.jpg'

function BoardCard({ board }) {
  return (
    <Card
      sx={{
        minWidth: '300px',
        maxWidth: '300px',
        height: '240px',
        cursor: 'pointer',
        boxShadow: '0 2px 2px rgba(0, 0, 0, 0.2)'
      }}
    >
      <Link to={`/boards/${board?._id}`} style={{ textDecoration: 'none' }}>
        <CardMedia
          sx={{ height: '180px' }}
          image={boarbg}
          title={board?.title}
        />
        <CardContent sx={{ p: 1.5 }}>
          <Typography
            sx={{
              fontWeight: 'bold',
              color: (theme) =>
                theme.palette.mode === 'dark' ? 'white' : 'black'
            }}
          >
            {board?.title}
          </Typography>
        </CardContent>
      </Link>
    </Card>
  )
}

export default BoardCard

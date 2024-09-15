import CardMedia from '@mui/material/CardMedia'

function CardCover({ cover }) {
  return (
    cover && (
      <CardMedia
        sx={{ height: 140, borderRadius: '4px 4px 0 0' }}
        image={cover}
      />
    )
  )
}

export default CardCover

import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { toast } from 'react-toastify'

function CardTitle({ title, onUpdateTitle }) {
  const [openUpdateTitleForm, setOpenUpdateTitleForm] = useState(false)
  const [cardTitle, setCardTitle] = useState(title)

  const toggleOpenUpdateTitleForm = () =>
    setOpenUpdateTitleForm(!openUpdateTitleForm)
  const updateCardTitle = () => {
    if (!cardTitle) {
      toast.error('Please enter a title for this card!')
      return
    }

    if (cardTitle === title) {
      toggleOpenUpdateTitleForm()
      return
    }

    onUpdateTitle(cardTitle)
    toggleOpenUpdateTitleForm()
  }

  return (
    <Box sx={{ mt: 1 }}>
      {!openUpdateTitleForm ? (
        <Typography
          variant="h6"
          component="h2"
          onClick={toggleOpenUpdateTitleForm}
        >
          {title}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            fullWidth
            label="Edit title"
            variant="outlined"
            type="text"
            size="small"
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
          />
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={updateCardTitle}
          >
            Save
          </Button>
          <CloseIcon
            onClick={toggleOpenUpdateTitleForm}
            fontSize="small"
            sx={{
              color: (theme) => theme.palette.warning.light,
              cursor: 'pointer'
            }}
          />
        </Box>
      )}
    </Box>
  )
}

export default CardTitle

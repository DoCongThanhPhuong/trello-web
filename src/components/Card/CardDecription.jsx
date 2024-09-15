import EditIcon from '@mui/icons-material/Edit'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { updateCardDetailsAPI } from '~/apis'

function CardDescription({ description, setDescription, cardId }) {
  const [openEditDescriptionForm, setOpenEditDescriptionForm] = useState(
    !description
  )
  const toggleEditDescriptionForm = () =>
    setOpenEditDescriptionForm(!openEditDescriptionForm)

  const editCardDescription = () => {
    if (!description) {
      toast.error('Please enter a description for this card!')
      return
    }

    updateCardDetailsAPI(cardId, { description })
    toggleEditDescriptionForm()
  }

  return (
    <Box>
      <Typography sx={{ mb: 1, fontWeight: 'bold' }}>Description</Typography>
      {!description || openEditDescriptionForm ? (
        <Box>
          <TextField
            placeholder="Add a more detailed description..."
            fullWidth
            multiline
            rows={2}
            sx={{ mb: 1 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={editCardDescription}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={toggleEditDescriptionForm}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ textAlign: 'justify', wordBreak: 'break-word' }}>
            {description}
          </Typography>
          <IconButton
            size="small"
            aria-label="edit"
            onClick={toggleEditDescriptionForm}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  )
}

export default CardDescription

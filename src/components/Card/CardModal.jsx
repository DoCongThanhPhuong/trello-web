import AttachmentIcon from '@mui/icons-material/Attachment'
import CancelIcon from '@mui/icons-material/Cancel'
import ChecklistIcon from '@mui/icons-material/Checklist'
import Groups2Icon from '@mui/icons-material/Groups2'
import LabelIcon from '@mui/icons-material/Label'
import ScheduleIcon from '@mui/icons-material/Schedule'
import TaskIcon from '@mui/icons-material/Task'
import WallpaperIcon from '@mui/icons-material/Wallpaper'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import { useState } from 'react'
import { updateCardDetailsAPI } from '~/apis'
import usePreviewImg from '~/hooks/usePreviewImg'
import CardComments from './CardComments'
import CardDescription from './CardDecription'
import CardTitle from './CardTitle'

const MODAL_STYLES = {
  position: 'absolute',
  p: 2,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 560, md: 800 },
  height: { xs: '90%', sm: 600 },
  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#efefef'),
  boxShadow: 12,
  borderRadius: '8px',
  overflowY: 'scroll'
}

const BUTTON_STYLES = {
  width: '100%',
  justifyContent: 'flex-start',
  py: 1
}

function CardModal({ card, openModal, handleCloseModal }) {
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg()
  const [cardDescription, setCardDescription] = useState(card.description || '')
  const [cardComments, setCardComments] = useState(card.comments || [])

  const updateCardDetails = () => {
    if (!imgUrl) {
      handleCloseModal()
      return
    }
    card.cover = imgUrl
    handleCloseModal()
    updateCardDetailsAPI(card._id, { cover: imgUrl })
    setImgUrl('')
  }

  const updateCardTitle = (newTitle) => {
    updateCardDetailsAPI(card._id, { title: newTitle })
    card.title = newTitle
  }

  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      data-no-dnd="true"
    >
      <Box sx={MODAL_STYLES}>
        {(card.cover || imgUrl) && (
          <Box
            component="img"
            sx={{
              height: 100,
              width: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              borderRadius: '4px'
            }}
            alt="Card Cover"
            src={imgUrl || card.cover}
          />
        )}
        <CardTitle title={card.title} onUpdateTitle={updateCardTitle} />
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            gap: 4
          }}
        >
          <Box sx={{ flexGrow: { xs: 1, sm: 8 }, flexBasis: 0 }}>
            <CardDescription
              description={cardDescription}
              setDescription={setCardDescription}
              cardId={card._id}
            />
            <CardComments
              comments={cardComments}
              setComments={setCardComments}
              cardId={card._id}
            />
          </Box>
          <Box sx={{ flexGrow: { xs: 1, sm: 2 }, flexBasis: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<TaskIcon />}
                sx={BUTTON_STYLES}
                onClick={updateCardDetails}
              >
                Save
              </Button>
              <Button
                variant="contained"
                component="label"
                startIcon={<WallpaperIcon />}
                sx={BUTTON_STYLES}
              >
                Cover
                <input type="file" hidden onChange={handleImageChange} />
              </Button>
              <Button
                variant="contained"
                startIcon={<Groups2Icon />}
                sx={BUTTON_STYLES}
              >
                Members
              </Button>
              <Button
                variant="contained"
                startIcon={<LabelIcon />}
                sx={BUTTON_STYLES}
              >
                Labels
              </Button>
              <Button
                variant="contained"
                startIcon={<ChecklistIcon />}
                sx={BUTTON_STYLES}
              >
                Checklist
              </Button>
              <Button
                variant="contained"
                startIcon={<ScheduleIcon />}
                sx={BUTTON_STYLES}
              >
                Dates
              </Button>
              <Button
                variant="contained"
                component="label"
                startIcon={<AttachmentIcon />}
                sx={BUTTON_STYLES}
              >
                Attachments
                <input type="file" hidden />
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<CancelIcon />}
                sx={BUTTON_STYLES}
                onClick={handleCloseModal}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default CardModal

import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { Card as MuiCard } from '@mui/material'
import Typography from '@mui/material/Typography'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import TaskIcon from '@mui/icons-material/Task'
import WallpaperIcon from '@mui/icons-material/Wallpaper'
import Groups2Icon from '@mui/icons-material/Groups2'
import LabelIcon from '@mui/icons-material/Label'
import ChecklistIcon from '@mui/icons-material/Checklist'
import ScheduleIcon from '@mui/icons-material/Schedule'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import usePreviewImg from '~/hooks/usePreviewImg'
import { updateCardDetailsAPI } from '~/apis'
import { toast } from 'react-toastify'

const MODAL_STYLES = {
  position: 'absolute',
  p: 2,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 560, md: 800 },
  height: { xs: '90%', sm: 600 },
  bgcolor: 'background.paper',
  boxShadow: 12,
  borderRadius: '8px',
  overflowY: 'scroll'
}
const BUTTON_STYLES = {
  width: '100%',
  justifyContent: 'flex-start',
  py: 1
}

function Card({ card }) {
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: card._id, data: { ...card } })

  const dndKitCardStyles = {
    // touchAction: 'none', // Dành cho sensor default dạng Pointer Sensor
    // Nếu sử dụng CSS.Tranform như doc thì sẽ bị lỗi kiểu stretch
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #16a085' : undefined
  }

  const shouldShowCardActions = () => {
    return (
      !!card?.memberIds?.length ||
      !!card?.comments?.length ||
      !!card?.attachments?.length
    )
  }

  const updateCardDetails = async () => {
    if (!imgUrl) return
    card.cover = imgUrl
    handleCloseModal()
    await updateCardDetailsAPI(card._id, { cover: imgUrl })
    setImgUrl('')
    toast.success('Card was updated successfully!')
  }

  return (
    <>
      <MuiCard
        ref={setNodeRef}
        style={dndKitCardStyles}
        {...attributes}
        {...listeners}
        sx={{
          cursor: 'pointer',
          boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
          overflow: 'unset',
          display: card?.FE_PlaceholderCard ? 'none' : 'block',
          border: '1px solid transparent',
          '&:hover': { borderColor: (theme) => theme.palette.primary.main }
        }}
      >
        {card?.cover && (
          <CardMedia
            sx={{ height: 140, borderRadius: '4px 4px 0 0' }}
            image={card?.cover}
          />
        )}

        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>{card?.title}</Typography>
            <Tooltip title="Card details">
              <MoreHorizIcon fontSize="small" onClick={handleOpenModal} />
            </Tooltip>
          </Box>
        </CardContent>
        {shouldShowCardActions() && (
          <CardActions sx={{ p: '0 4px 8px 4px' }}>
            {!!card?.memberIds?.length && (
              <Button size="small" startIcon={<GroupIcon />}>
                {card?.memberIds?.length}
              </Button>
            )}

            {!!card?.comments?.length && (
              <Button size="small" startIcon={<CommentIcon />}>
                {card?.comments?.length}
              </Button>
            )}

            {!!card?.attachments?.length && (
              <Button size="small" startIcon={<AttachmentIcon />}>
                {card?.attachments?.length}
              </Button>
            )}
          </CardActions>
        )}
      </MuiCard>
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {card?.title}
          </Typography>
          <Box
            sx={{
              marginTop: 1,
              display: 'flex',
              flexDirection: { xs: 'column-reverse', sm: 'row' },
              gap: 1
            }}
          >
            <Box
              sx={{
                flexGrow: { xs: 1, sm: 8 },
                flexBasis: 0
              }}
            >
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Cupiditate quia, similique iusto reprehenderit quidem, optio
              rerum, assumenda sed minus deleniti laboriosam molestias harum ut
              maiores. Porro at tempore voluptatum quis!
            </Box>
            <Box
              sx={{
                flexGrow: { xs: 1, sm: 2 },
                flexBasis: 0
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="contained"
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
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default Card

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import AttachmentIcon from '@mui/icons-material/Attachment'
import CancelIcon from '@mui/icons-material/Cancel'
import ChecklistIcon from '@mui/icons-material/Checklist'
import CloseIcon from '@mui/icons-material/Close'
import CommentIcon from '@mui/icons-material/Comment'
import EditIcon from '@mui/icons-material/Edit'
import GroupIcon from '@mui/icons-material/Group'
import Groups2Icon from '@mui/icons-material/Groups2'
import LabelIcon from '@mui/icons-material/Label'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ScheduleIcon from '@mui/icons-material/Schedule'
import TaskIcon from '@mui/icons-material/Task'
import WallpaperIcon from '@mui/icons-material/Wallpaper'
import { Card as MuiCard } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Modal from '@mui/material/Modal'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { updateCardDetailsAPI } from '~/apis'
import usePreviewImg from '~/hooks/usePreviewImg'

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

function Card({ card }) {
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg()
  const [cardComments, setCardComments] = useState(card.comments || [])
  const [newComment, setNewComment] = useState('')
  const [cardTitle, setCardTitle] = useState(card.title)
  const [openUpdateTitleForm, setOpenUpdateTitleForm] = useState(false)
  const [cardDescription, setCardDescription] = useState(card.description || '')
  const [openEditDescriptionForm, setOpenEditDescriptionForm] = useState(
    !card.description
  )
  const toggleOpenUpdateTitleForm = () =>
    setOpenUpdateTitleForm(!openUpdateTitleForm)
  const toggleEditDescriptionForm = () =>
    setOpenEditDescriptionForm(!openEditDescriptionForm)

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
      !!cardComments?.length ||
      !!card?.attachments?.length
    )
  }

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

  const updateCardTitle = () => {
    if (!cardTitle) {
      toast.error('Please enter a title for this card!')
      return
    }

    if (cardTitle === card.title) {
      toggleOpenUpdateTitleForm()
      return
    }

    updateCardDetailsAPI(card._id, {
      title: cardTitle
    })
    card.title = cardTitle
    toggleOpenUpdateTitleForm()
  }

  const editCardDescription = () => {
    if (!cardDescription) {
      toast.error('Please enter a description for this card!')
      return
    }

    updateCardDetailsAPI(card._id, {
      description: cardDescription
    })
    toggleEditDescriptionForm()
    card.description = cardDescription
  }

  const addNewComment = async () => {
    if (!newComment) {
      return
    }
    const updatedCard = await updateCardDetailsAPI(card._id, {
      comment: { content: newComment }
    })
    setNewComment('')
    setCardComments(updatedCard.comments)
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
            <Typography>{card.title}</Typography>
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

            {!!cardComments?.length && (
              <Button size="small" startIcon={<CommentIcon />}>
                {cardComments?.length}
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

      {/* Card Modal */}
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
          <Box sx={{ mt: 1 }}>
            {!openUpdateTitleForm ? (
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                onClick={toggleOpenUpdateTitleForm}
              >
                {card.title}
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Add a comment"
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
          <Box
            sx={{
              marginTop: 2,
              display: 'flex',
              flexDirection: { xs: 'column-reverse', sm: 'row' },
              gap: 4
            }}
          >
            <Box
              sx={{
                flexGrow: { xs: 1, sm: 8 },
                flexBasis: 0
              }}
            >
              <Box>
                <Typography sx={{ mb: 1, fontWeight: 'bold' }}>
                  Description
                </Typography>
                {!card.description || openEditDescriptionForm ? (
                  <Box>
                    <TextField
                      placeholder="Add a more detailed description..."
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ mb: 1 }}
                      value={cardDescription}
                      onChange={(e) => setCardDescription(e.target.value)}
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
                    <Typography
                      sx={{
                        textAlign: 'justify',
                        wordBreak: 'break-word'
                      }}
                    >
                      {card?.description}
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
              <Box sx={{ mt: 3 }}>
                <Typography sx={{ mb: 1, fontWeight: 'bold' }}>
                  Comments
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    fullWidth
                    label="Add a comment"
                    variant="outlined"
                    type="text"
                    size="small"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={addNewComment}
                  >
                    Save
                  </Button>
                </Box>

                {cardComments.length > 0 ? (
                  cardComments.map((comment, index) => (
                    <Paper
                      key={index}
                      style={{ padding: '8px 12px', marginTop: 10 }}
                    >
                      <Grid container wrap="nowrap" spacing={2}>
                        <Grid item>
                          <Avatar
                            alt="Avatar"
                            src={comment.userAvatar}
                            sx={{ width: 32, height: 32 }}
                          />
                        </Grid>
                        <Grid justifyContent="left" item xs zeroMinWidth>
                          <Typography
                            style={{ fontWeight: 'bold', textAlign: 'left' }}
                          >
                            {comment.userDisplayName}
                          </Typography>
                          <Typography
                            sx={{
                              textAlign: 'justify',
                              wordBreak: 'break-word'
                            }}
                          >
                            {comment.content}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))
                ) : (
                  <Typography sx={{ mt: 1 }}>No comments available</Typography>
                )}
              </Box>
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
    </>
  )
}

export default Card

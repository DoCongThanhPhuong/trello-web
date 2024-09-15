import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Card as MuiCard } from '@mui/material'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import CardActionsComponent from '~/components/Card/CardActions'
import CardCover from '~/components/Card/CardCover'
import CardModal from '~/components/Card/CardModal'

function Card({ card }) {
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: card._id, data: { ...card } })

  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #16a085' : undefined
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
        <CardCover cover={card.cover} />
        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>{card.title}</Typography>
            <Tooltip title="Card details">
              <MoreHorizIcon fontSize="small" onClick={handleOpenModal} />
            </Tooltip>
          </Box>
        </CardContent>
        <CardActionsComponent
          memberIds={card.memberIds}
          comments={card.comments}
          attachments={card.attachments}
        />
      </MuiCard>
      <CardModal
        card={card}
        openModal={openModal}
        handleCloseModal={handleCloseModal}
      />
    </>
  )
}

export default Card

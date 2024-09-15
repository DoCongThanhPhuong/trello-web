import AttachmentIcon from '@mui/icons-material/Attachment'
import CommentIcon from '@mui/icons-material/Comment'
import GroupIcon from '@mui/icons-material/Group'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'

function CardActionsComponent({ memberIds, comments, attachments }) {
  const shouldShowCardActions = () => {
    return !!memberIds?.length || !!comments?.length || !!attachments?.length
  }

  return (
    shouldShowCardActions() && (
      <CardActions sx={{ p: '0 4px 8px 4px' }}>
        {!!memberIds?.length && (
          <Button size="small" startIcon={<GroupIcon />}>
            {memberIds.length}
          </Button>
        )}
        {!!comments?.length && (
          <Button size="small" startIcon={<CommentIcon />}>
            {comments.length}
          </Button>
        )}
        {!!attachments?.length && (
          <Button size="small" startIcon={<AttachmentIcon />}>
            {attachments.length}
          </Button>
        )}
      </CardActions>
    )
  )
}

export default CardActionsComponent

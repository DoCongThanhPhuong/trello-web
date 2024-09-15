import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { updateCardDetailsAPI } from '~/apis'

function CardComments({ comments, setComments, cardId }) {
  const [newComment, setNewComment] = useState('')

  const addNewComment = async () => {
    if (!newComment) return

    const updatedCard = await updateCardDetailsAPI(cardId, {
      comment: { content: newComment }
    })
    setNewComment('')
    setComments(updatedCard.comments)
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography sx={{ mb: 1, fontWeight: 'bold' }}>Comments</Typography>
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

      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <Paper key={index} style={{ padding: '8px 12px', marginTop: 10 }}>
            <Grid container wrap="nowrap" spacing={2}>
              <Grid item>
                <Avatar
                  alt="Avatar"
                  src={comment.userAvatar}
                  sx={{ width: 32, height: 32 }}
                />
              </Grid>
              <Grid justifyContent="left" item xs zeroMinWidth>
                <Typography style={{ fontWeight: 'bold', textAlign: 'left' }}>
                  {comment.userDisplayName}
                </Typography>
                <Typography
                  sx={{ textAlign: 'justify', wordBreak: 'break-word' }}
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
  )
}

export default CardComments

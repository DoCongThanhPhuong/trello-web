import { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import AddCardIcon from '@mui/icons-material/AddCard'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import ListCards from './ListCards/ListCards'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import { useConfirm } from 'material-ui-confirm'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Column({
  column,
  createNewCard,
  deleteColumnDetails,
  updateColumnTitle
}) {
  const INPUT_STYLES = {
    '& label': { color: 'text.primary' },
    '& input': {
      color: (theme) => theme.palette.primary.main,
      bgcolor: (theme) => {
        theme.palette.mode === 'dark' ? '#333643' : 'white'
      }
    },
    '& label.Mui-focused': {
      color: (theme) => theme.palette.primary.main
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: (theme) => theme.palette.primary.main
      },
      '&:hover fieldset': {
        borderColor: (theme) => theme.palette.primary.main
      },
      '&.Mui-focused fieldset': {
        borderColor: (theme) => theme.palette.primary.main
      }
    },
    '& .MuiOutlinedInput-input': {
      borderRadius: 1
    }
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: column._id, data: { ...column } })

  const dndKitColumnStyles = {
    // touchAction: 'none', // Dành cho sensor default dạng Pointer Sensor
    // Nếu sử dụng CSS.Tranform như doc thì sẽ bị lỗi kiểu stretch
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // Cards đã được sắp xếp ở component cha cao nhất
  const orderedCards = column.cards

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState('')

  const addNewCard = () => {
    if (!newCardTitle) {
      toast.error('Please enter a title for this card!', {
        position: 'bottom-right'
      })
      return
    }

    // Tạo dữ liệu Card để gọi API
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }

    createNewCard(newCardData)

    // Đóng trạng thái thêm Card mới & Clear Input
    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  const [openColumnTitleForm, setOpenColumnTitleForm] = useState(false)
  const toggleOpenColumnTitleForm = () =>
    setOpenColumnTitleForm(!openColumnTitleForm)

  const [newUpdateColumnTitle, setNewUpdateColumnTitle] = useState(column.title)

  const updateNewColumnTitle = () => {
    if (!newUpdateColumnTitle) {
      toast.error('Please enter a title for this column!')
      return
    }

    updateColumnTitle(column._id, newUpdateColumnTitle)

    // Đóng trạng thái thêm Card mới & Clear Input
    toggleOpenColumnTitleForm()
    setNewUpdateColumnTitle(column.title)
  }

  // Xử lý xóa một Column và Cards bên trong nó
  const confirmDeleteColumn = useConfirm()

  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: 'Delete this Column?',
      confirmationKeyword: column.title,
      description: `Are you sure you want to delete this column? Type ${column.title} to confirm your action`,
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
      // description:
      //   'This action will permanently delete this column and its cards! Are you sure?',
      // allowClose: false,
      // dialogProps: { maxWidth: 'xs' },
      // confirmationButtonProps: { color: 'primary' },
      // cancellationButtonProps: { color: 'inherit' }
      // buttonOrder: ['confirm', 'cancel']
    })
      .then(() => {
        deleteColumnDetails(column._id)
      })
      .catch(() => {})
  }

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#333643' : '#ebecf0',
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) =>
            `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}
      >
        {/* Box Column Header */}
        <Box
          sx={{
            height: (theme) => theme.trello.columnHeaderHeight,
            p: 2
          }}
        >
          {!openColumnTitleForm ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography
                variant="h6"
                onClick={toggleOpenColumnTitleForm}
                sx={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {column?.title}
              </Typography>
              <Box>
                <Tooltip title="More options">
                  <ExpandMoreIcon
                    sx={{ color: 'text.primary', cursor: 'pointer' }}
                    id="basic-column-dropdown"
                    aria-controls={open ? 'basic-menu-column' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                  />
                </Tooltip>
                <Menu
                  id="basic-menu-column"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-column-dropdown'
                  }}
                >
                  <MenuItem
                    onClick={toggleOpenNewCardForm}
                    sx={{
                      '&:hover': {
                        color: 'success.light',
                        '& .add-card-icon': {
                          color: 'success.light'
                        }
                      }
                    }}
                  >
                    <ListItemIcon>
                      <AddCardIcon fontSize="small" className="add-card-icon" />
                    </ListItemIcon>
                    <ListItemText>Add a card</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <ContentCut fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Cut</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <ContentCopy fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copy</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <ContentPaste fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Paste</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={handleDeleteColumn}
                    sx={{
                      '&:hover': {
                        color: 'warning.dark',
                        '& .delete-forever-icon': {
                          color: 'warning.dark'
                        }
                      }
                    }}
                  >
                    <ListItemIcon>
                      <DeleteForeverIcon
                        fontSize="small"
                        className="delete-forever-icon"
                      />
                    </ListItemIcon>
                    <ListItemText>Delete this column</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <Cloud fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Archive this column</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <TextField
                label="Enter column title..."
                type="text"
                size="small"
                variant="outlined"
                autoFocus
                data-no-dnd="true"
                value={newUpdateColumnTitle}
                onChange={(e) => setNewUpdateColumnTitle(e.target.value)}
                sx={INPUT_STYLES}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  data-no-dnd="true"
                  onClick={updateNewColumnTitle}
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{
                    boxShadow: 'none',
                    // border: '1px solid',
                    // borderColor: (theme) => theme.palette.success.main,
                    '&:hover': {
                      bgcolor: (theme) => theme.palette.success.main
                    }
                  }}
                >
                  <CheckIcon fontSize="small" />
                </Button>
                <CloseIcon
                  data-no-dnd="true"
                  onClick={toggleOpenColumnTitleForm}
                  fontSize="small"
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: 'pointer'
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>

        {/* Box Columns List Cards*/}
        <ListCards cards={orderedCards} />

        {/* Box Column Footer */}
        <Box
          sx={{
            height: (theme) => theme.trello.columnFooterHeight,
            p: 2
          }}
        >
          {!openNewCardForm ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Button
                startIcon={<AddCardIcon />}
                onClick={toggleOpenNewCardForm}
              >
                Add a card
              </Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <TextField
                label="Enter card title..."
                type="text"
                size="small"
                variant="outlined"
                autoFocus
                data-no-dnd="true"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={INPUT_STYLES}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  data-no-dnd="true"
                  onClick={addNewCard}
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{
                    boxShadow: 'none',
                    // border: '1px solid',
                    // borderColor: (theme) => theme.palette.success.main,
                    '&:hover': {
                      bgcolor: (theme) => theme.palette.success.main
                    }
                  }}
                >
                  Add
                </Button>
                <CloseIcon
                  data-no-dnd="true"
                  onClick={toggleOpenNewCardForm}
                  fontSize="small"
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: 'pointer'
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  )
}

export default Column

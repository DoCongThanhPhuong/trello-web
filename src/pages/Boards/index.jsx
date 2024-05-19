import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import AppBar from '~/components/AppBar/AppBar'
import Loading from '~/components/Loading/Loading'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import { AppBar as MuiAppBar } from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import GridViewIcon from '@mui/icons-material/GridView'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import SettingsIcon from '@mui/icons-material/Settings'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

import { Link } from 'react-router-dom'
import { createNewBoardAPI, getBoardsByUserIdAPI } from '~/apis'

const DRAWER_WIDTH = 200
const INPUT_STYLES = {
  '& label': { color: 'white' },
  '& input': { color: 'white' },
  '& label.Mui-focused': { color: 'white' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white'
    },
    '&:hover fieldset': {
      borderColor: 'white'
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white'
    }
  }
}

function Boards() {
  const [boards, setBoards] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getBoardsByUserIdAPI().then((boards) => {
      setBoards(boards)
      setIsLoading(false)
    })
  }, [])

  const [openNewBoardForm, setOpenNewBoardForm] = useState(false)
  const toggleOpenNewBoardForm = () => setOpenNewBoardForm(!openNewBoardForm)
  const [newBoardTitle, setNewBoardTitle] = useState('')
  const [newBoardDescription, setNewBoardDescription] = useState('')
  const [newBoardType, setNewBoardType] = useState(true)

  const handleChange = () => setNewBoardType(!newBoardType)

  const addNewBoard = async () => {
    if (!newBoardTitle) {
      toast.error('Please enter board title!')
      return
    }

    if (!newBoardDescription) {
      toast.error('Please enter board description!')
      return
    }

    // Tạo dữ liệu cho Board mới để gọi API
    const newBoardData = {
      title: newBoardTitle,
      description: newBoardDescription,
      type: newBoardType ? 'public' : 'private'
    }

    const createdBoard = await createNewBoardAPI({
      ...newBoardData
    })

    // Cập nhật state Boards
    const newBoards = [...boards]
    newBoards.push(createdBoard)
    setBoards(newBoards)

    // Đóng trạng thái thêm Board mới & Clear Inputs
    toggleOpenNewBoardForm()
    setNewBoardTitle('')
    setNewBoardDescription('')
    setNewBoardType(true)
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'
      }}
    >
      <MuiAppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <AppBar />
      </MuiAppBar>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box'
          }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {[
              { text: 'Boards', icon: <DashboardIcon /> },
              { text: 'Hightlights', icon: <FavoriteBorderIcon /> },
              { text: 'Views', icon: <GridViewIcon /> },
              { text: 'Members', icon: <PeopleAltIcon /> },
              { text: 'Settings', icon: <SettingsIcon /> }
            ].map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText>{item.text}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, py: 3, overflowX: 'auto' }}>
        <Toolbar />
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            flexWrap: 'wrap',
            minWidth: '700px',
            paddingLeft: 4
          }}
        >
          {boards.map((board) => (
            <Card
              key={board?._id}
              sx={{
                minWidth: '300px',
                maxWidth: '300px',
                height: '240px',
                cursor: 'pointer',
                boxShadow: '0 2px 2px rgba(0, 0, 0, 0.2)'
              }}
            >
              <Link
                to={`/boards/${board?._id}`}
                style={{ textDecoration: 'none' }}
              >
                <CardMedia
                  sx={{ height: '180px' }}
                  image="/boardbg.jpg"
                  title={board?.title}
                />
                <CardContent sx={{ p: 1.5 }}>
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      color: (theme) =>
                        theme.palette.mode === 'dark' ? 'white' : 'black'
                    }}
                  >
                    {board?.title}
                  </Typography>
                </CardContent>
              </Link>
            </Card>
          ))}

          {/* Box add new board CTA */}
          {!openNewBoardForm ? (
            <Box
              onClick={toggleOpenNewBoardForm}
              sx={{
                minWidth: '300px',
                maxWidth: '300px',
                borderRadius: '6px',
                height: 'fit-content',
                bgcolor: 'rgba(0, 0, 0, 0.6)'
              }}
            >
              <Button
                sx={{
                  color: 'white',
                  width: '100%',
                  justifyContent: 'flex-start',
                  paddingX: '32px',
                  py: 1
                }}
                startIcon={<AddIcon />}
              >
                Create a new board
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                minWidth: '300px',
                maxWidth: '300px',
                p: 2,
                borderRadius: '6px',
                height: 'fit-content',
                bgcolor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}
            >
              <TextField
                label="Enter board title..."
                type="text"
                size="small"
                variant="outlined"
                autoFocus
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                sx={INPUT_STYLES}
              />
              <TextField
                label="Enter board description..."
                type="text"
                size="small"
                variant="outlined"
                value={newBoardDescription}
                onChange={(e) => setNewBoardDescription(e.target.value)}
                sx={INPUT_STYLES}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography sx={{ color: 'white' }}>Type: </Typography>
                <FormControlLabel
                  control={
                    <Switch checked={newBoardType} onChange={handleChange} />
                  }
                  label={newBoardType ? 'Public' : 'Private'}
                  sx={{ color: 'white' }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  onClick={addNewBoard}
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: (theme) => theme.palette.success.main
                    }
                  }}
                >
                  Create
                </Button>
                <CloseIcon
                  onClick={toggleOpenNewBoardForm}
                  fontSize="small"
                  sx={{
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': { color: (theme) => theme.palette.warning.light }
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default Boards

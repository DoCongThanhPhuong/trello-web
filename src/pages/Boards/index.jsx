import { useState } from 'react'
import { toast } from 'react-toastify'
import AppBar from '~/components/AppBar/AppBar'
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

import { Link } from 'react-router-dom'

function Boards() {
  const boards = [
    { _id: '65fabae5b7d812b159b77124', title: 'Board 01 Thanh Phương' },
    { _id: '660e9c6f06bb0b2e253c6390', title: 'Board 02 Thanh Phương' }
  ]

  const drawerWidth = 200

  const [openNewBoardForm, setOpenNewBoardForm] = useState(false)
  const toggleOpenNewBoardForm = () => setOpenNewBoardForm(!openNewBoardForm)

  const [newBoardTitle, setNewBoardTitle] = useState('')

  const addNewBoard = () => {
    if (!newBoardTitle) {
      toast.error('Please enter list title!')
      return
    }

    // Tạo dữ liệu Board để gọi API
    const newBoardData = {
      title: newBoardTitle
    }

    // Đóng trạng thái thêm Board mới & Clear Input
    toggleOpenNewBoardForm()
    setNewBoardTitle('')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: '#efefef'
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
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText>Boards</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <FavoriteBorderIcon />
                </ListItemIcon>
                <ListItemText>Hightlights</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <GridViewIcon />
                </ListItemIcon>
                <ListItemText>Views</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <PeopleAltIcon />
                </ListItemIcon>
                <ListItemText>Members</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflowX: 'auto' }}>
        <Toolbar />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, paddingX: 4 }}>
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
                style={{
                  textDecoration: 'none',
                  color: (theme) =>
                    theme.palette.mode === 'dark' ? 'white' : 'black'
                }}
                to={`/boards/${board?._id}`}
              >
                <CardMedia
                  sx={{ height: '180px' }}
                  image="https://avatars.githubusercontent.com/u/99084016?s=400&u=c3f9fa59deca6877371fa38f62311303a0757fa7&v=4"
                  title="green iguana"
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
                bgcolor: '#3333333d',
                paddingX: '32px'
              }}
            >
              <Button
                sx={{
                  color: 'black',
                  width: '100%',
                  justifyContent: 'flex-start',
                  pl: 2.5,
                  py: 1
                }}
                startIcon={<AddIcon />}
              >
                Add another list
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                minWidth: '250px',
                maxWidth: '250px',
                mx: 2,
                p: 1,
                borderRadius: '6px',
                height: 'fit-content',
                bgcolor: '#3333333d',
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}
            >
              <TextField
                label="Enter list title..."
                type="text"
                size="small"
                variant="outlined"
                autoFocus
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'black' },
                  '& input': { color: 'black' },
                  '& label.Mui-focused': { color: 'black' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black'
                    },
                    '&:hover fieldset': {
                      borderColor: 'black'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'black'
                    }
                  }
                }}
              />
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
                  Add list
                </Button>
                <CloseIcon
                  onClick={toggleOpenNewBoardForm}
                  fontSize="small"
                  sx={{
                    color: 'black',
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

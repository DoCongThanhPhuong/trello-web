import DashboardIcon from '@mui/icons-material/Dashboard'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import GridViewIcon from '@mui/icons-material/GridView'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import SettingsIcon from '@mui/icons-material/Settings'
import { Drawer as MuiDrawer } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'

const DRAWER_WIDTH = 200
function Drawer() {
  return (
    <MuiDrawer
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
    </MuiDrawer>
  )
}

export default Drawer

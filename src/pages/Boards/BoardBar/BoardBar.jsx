import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FilterListIcon from '@mui/icons-material/FilterList'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import { capitalizeFirstLetter } from '~/utils/formatters'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ board, members }) {
  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2,
        overflowX: 'auto',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
        '&::-webkit-scrollbar-track': {
          m: 2
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={MENU_STYLES}
            icon={<DashboardIcon />}
            label={board?.title}
            clickable
          />
        </Tooltip>
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automatic"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
          startIcon={<PersonAddIcon />}
        >
          Invite
        </Button>
        <AvatarGroup
          max={7}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              height: 32,
              width: 32,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': {
                bgcolor: '#a4b0be'
              }
            }
          }}
        >
          {members?.map((member) => (
            <Tooltip key={member._id} title={member.displayName}>
              <Avatar alt={member.displayName} src={member.avatar} />
            </Tooltip>
          ))}
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar

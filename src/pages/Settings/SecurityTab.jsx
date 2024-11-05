import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import PasswordIcon from '@mui/icons-material/Password'
import LockResetIcon from '@mui/icons-material/LockReset'
import LockIcon from '@mui/icons-material/Lock'
import LogoutIcon from '@mui/icons-material/Logout'

import {
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useForm } from 'react-hook-form'
import { useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { logoutUserAPI, updateUserAPI } from '~/redux/user/userSlice'

function SecurityTab() {
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  // Ôn lại: https://www.npmjs.com/package/material-ui-confirm
  const confirmChangePassword = useConfirm()
  const submitChangePassword = (data) => {
    confirmChangePassword({
      // Title, Description, Content...vv của gói material-ui-confirm đều có type là ReactNode nên có thể thoải sử dụng MUI components, rất tiện lợi khi cần custom styles
      title: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LogoutIcon sx={{ color: 'warning.dark' }} /> Change Password
        </Box>
      ),
      description:
        'You have to login again after successfully changing your password. Continue?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    })
      .then(() => {
        const { currentPassword, newPassword } = data
        toast
          .promise(dispatch(updateUserAPI({ currentPassword, newPassword })), {
            pending: 'Updating...'
          })
          .then((res) => {
            if (!res.error) {
              toast.success('Change password successfully, please login again!')
              dispatch(logoutUserAPI())
            }
          })
      })
      .catch(() => {})
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          maxWidth: '1200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3
        }}
      >
        <Box>
          <Typography variant="h5">Security Dashboard</Typography>
        </Box>
        <form onSubmit={handleSubmit(submitChangePassword)}>
          <Box
            sx={{
              width: '400px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Box>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PasswordIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                {...register('currentPassword', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
                error={!!errors['currentPassword']}
              />
              <FieldErrorAlert errors={errors} fieldName={'currentPassword'} />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                {...register('newPassword', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
                error={!!errors['newPassword']}
              />
              <FieldErrorAlert errors={errors} fieldName={'newPassword'} />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="New Password Confirmation"
                type="password"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockResetIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                {...register('newPasswordConfirmation', {
                  validate: (value) => {
                    if (value === watch('newPassword')) return true
                    return 'Password confirmation does not match.'
                  }
                })}
                error={!!errors['newPasswordConfirmation']}
              />
              <FieldErrorAlert
                errors={errors}
                fieldName={'newPasswordConfirmation'}
              />
            </Box>

            <Box>
              <Button
                className="interceptor-loading"
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Change
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default SecurityTab

import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import ReactDOM from 'react-dom/client'
import theme from '~/theme'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ConfirmProvider } from 'material-ui-confirm'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import '~/firebase/config'
import { Provider } from 'react-redux'
import store from './redux/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <CssVarsProvider theme={theme}>
      <ConfirmProvider
        defaultOptions={{
          allowClose: false,
          dialogProps: { maxWidth: 'xs' },
          confirmationButtonProps: { color: 'primary' },
          cancellationButtonProps: { color: 'inherit' }
        }}
      >
        <CssBaseline />
        <RouterProvider router={router} />
        <ToastContainer position="bottom-left" theme="colored" />
      </ConfirmProvider>
    </CssVarsProvider>
  </Provider>
)

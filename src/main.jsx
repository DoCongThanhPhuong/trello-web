import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import { ConfirmProvider } from 'material-ui-confirm'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import theme from '~/theme'
import App from './App'
import store from './redux/store'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/">
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
          <App />
          <ToastContainer position="bottom-left" theme="colored" />
        </ConfirmProvider>
      </CssVarsProvider>
    </Provider>
  </BrowserRouter>
)

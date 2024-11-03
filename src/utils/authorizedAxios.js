import axios from 'axios'
import { toast } from 'react-toastify'

const axiosInstance = axios.create()

axiosInstance.defaults.timeout = 1000 * 60 * 10
axiosInstance.defaults.withCredentials = true

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

let refreshTokenPromise = null

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const originalRequest = error.config
    if (error.response?.status === 410 && originalRequest) {
      if (!refreshTokenPromise) {
        // const auth = getAuth()
        // const user = auth.currentUser
        // if (user) {
        //   refreshTokenPromise = user
        //     .getIdToken(true)
        //     .then((newToken) => {
        //       localStorage.setItem('accessToken', newToken)
        //       axiosInstance.defaults.headers.Authorization = `Bearer ${newToken}`
        //     })
        //     .catch((err) => {
        //       return Promise.reject(err)
        //     })
        //     .finally(() => {
        //       refreshTokenPromise = null
        //     })
        // } else {
        //   return Promise.reject(new Error('User not logged in'))
        // }
      }

      return refreshTokenPromise.then(() => {
        return axiosInstance(originalRequest)
      })
    }

    if (error.response?.status !== 410) {
      toast.error(error.response?.data?.message || error?.message)
    }

    return Promise.reject(error)
  }
)

export default axiosInstance

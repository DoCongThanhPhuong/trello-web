import { API_ROOT } from './utils/constants'
import { io } from 'socket.io-client'
export const socketIoInstance = io(API_ROOT)

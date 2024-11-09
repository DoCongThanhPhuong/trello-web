import { combineReducers, configureStore } from '@reduxjs/toolkit'
import persistReducer from 'redux-persist/es/persistReducer'
import storage from 'redux-persist/lib/storage'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { activeCardReducer } from './activeCard/activeCardSlide'
import { notificationsReducer } from './notifications/notificationsSlice'
import { userReducer } from './user/userSlice'

const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['user']
}

const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  activeCard: activeCardReducer,
  user: userReducer,
  notifications: notificationsReducer
})

const persistReducers = persistReducer(rootPersistConfig, reducers)

export default configureStore({
  reducer: persistReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

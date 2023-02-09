import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { locationPersist, userPersist } from '../utils/persistConfig';
import userReducer from './slice/auth.slice';
import locationReducer from './slice/location.slice';
import modalReducer from './slice/modal.slice';
import enableReducer from './slice/enabledQuery.slice';
import postReducer from './slice/post.slice';
import offsetReducer from './slice/offset.slice';
import conversationPopupSlice from './slice/conversationPopup.slice';
const rootReducer = combineReducers({
  auth: persistReducer(userPersist, userReducer),
  location: persistReducer(locationPersist, locationReducer),
  modal: modalReducer,
  enableQuery: enableReducer,
  postReducer: postReducer,
  offset: offsetReducer,
  conversationPopup: conversationPopupSlice,
});

export default rootReducer;

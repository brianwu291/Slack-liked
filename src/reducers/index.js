import { combineReducers } from 'redux';
import { userReducer } from './userReducers';
import { channelReducer } from './channelReducers';
import { colorReducer } from './colorReducers';


export default combineReducers({
  user: userReducer,
  channel: channelReducer,
  colors: colorReducer
});
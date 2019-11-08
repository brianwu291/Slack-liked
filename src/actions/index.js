import * as actionTypes from './actionTypes';

/** set user action */
export const setUser = (user = null) => {
  return {
    type: actionTypes.SET_USER,
    payload: {
      currentUser: user
    }
  };
}
export const clearUser = () => {
  return {
    type: actionTypes.CLEAR_USER
  };
}

/** set channel action */
export const setCurrentChannel = (channel = null) => {
  return {
    type: actionTypes.SET_CURRENT_CHANNEL,
    payload: {
      currentChannel: channel
    }
  };
}

export const setPrivateChannel = (isPrivateChannel = false) => {
  return {
    type: actionTypes.SET_PRIVATE_CHANNEL,
    payload: {
      isPrivateChannel
    }
  };
}

export const setUserPosts = (userPosts = null) => {
  return {
    type: actionTypes.SET_USER_POSTS,
    payload: {
      userPosts
    }
  };
} 

/** color actions */
export const setColors = (primaryColor = '', secondaryColor = '') => {
  return {
    type: actionTypes.SET_COLORS,
    payload: {
      primaryColor,
      secondaryColor
    }
  };
}
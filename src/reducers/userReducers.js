import * as actionTypes from '../actions/actionTypes';

const initialUserState = {
  currentUser: null,
  isLoading: true
};

export const userReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoading: false
      };
    case actionTypes.CLEAR_USER:
      return {
        ...state,
        isLoading: false
      };
    default: 
      return state;
  }
}

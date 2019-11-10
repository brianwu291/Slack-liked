import * as actionTypes from '../actions/actionTypes';

const initColorsState = {
  primaryColor: '#4c3c4c',
  secondaryColor:'#eee' 
}

export const colorReducer = (state = initColorsState, action) => {
  switch (action.type) {
    case actionTypes.SET_COLORS:
      return {
        ...state,
        primaryColor: action.payload.primaryColor,
        secondaryColor: action.payload.secondaryColor
      };
      
    default:
      return state;
  }
}
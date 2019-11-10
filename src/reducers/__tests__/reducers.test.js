import { userReducer } from '../userReducers'
import { channelReducer } from '../channelReducers'
import { colorReducer } from '../colorReducers'
import * as actionTypes from '../../actions/actionTypes'

describe('channelReducers', () => {
  const initialChannelState = {
    currentChannel: null,
    isPrivateChannel: false,
    userPosts: null
  }

  it('should return correct state on set current channel', () => {
    const action = {
      type: actionTypes.SET_CURRENT_CHANNEL,
      payload: {
        currentChannel: {
          createdBy: {
            avatar: "https://firebasestorage.googleapis.com/v0/b/react-slack-dev-6776d.appspot.com/o/avatar%2Fusers%2F4oEbFQk6yQMsPPYfG1z4fWW3cA03?alt=media&token=e3ea2b4f-ff36-47b4-bd45-57e47acc6d07",
            name: "BrianWu"
          },
          details: "discuss JavaScript",
          id: 123,
          name: "JavaScript",
        }
      }
    }
    const newState = channelReducer(initialChannelState, action)
    expect(newState.currentChannel.name).toBe('JavaScript')
    expect(newState.currentChannel.id).toBe(123)
    expect(newState.currentChannel.details).toBe('discuss JavaScript')
    expect(newState.currentChannel.createdBy.avatar).toBe('https://firebasestorage.googleapis.com/v0/b/react-slack-dev-6776d.appspot.com/o/avatar%2Fusers%2F4oEbFQk6yQMsPPYfG1z4fWW3cA03?alt=media&token=e3ea2b4f-ff36-47b4-bd45-57e47acc6d07')
    expect(newState.currentChannel.createdBy.name).toBe('BrianWu')
  })

  it('should return correct state on set private channel', () => {
    const action = {
      type: actionTypes.SET_PRIVATE_CHANNEL,
      payload: { isPrivateChannel: true }
    }
    const newState = channelReducer(initialChannelState, action)
    expect(newState.isPrivateChannel).toEqual(true)
  })

  it('should return correct state on set user posts', () => {
    const action = {
      type: actionTypes.SET_USER_POSTS,
      payload: {
        userPosts: {
          BWTest: {
            avatar: "https://gravatar.com/avatar/bcedffa3bca2bad6e1d6ed71968b93fa?d=identicon",
            count: 2
          },
          fuckMan: {
            avatar: "https://gravatar.com/avatar/fbde15a50a4d4326a301238abbe4f371?d=identicon",
            count: 8
          }
        }
      }
    }
    const newSate = channelReducer(initialChannelState, action)
    expect(newSate.userPosts.BWTest.avatar).toEqual('https://gravatar.com/avatar/bcedffa3bca2bad6e1d6ed71968b93fa?d=identicon')
    expect(newSate.userPosts.BWTest.count).toEqual(2)
    expect(newSate.userPosts.fuckMan.avatar).toEqual('https://gravatar.com/avatar/fbde15a50a4d4326a301238abbe4f371?d=identicon')
    expect(newSate.userPosts.fuckMan.count).toEqual(8)
  })
})

describe('userReducers', () => {
  const initialUserState = {
    currentUser: null,
    isLoading: true
  }

  it('should return correct state on set user', () => {
    const action = {
      type: actionTypes.SET_USER,
      payload: {
        currentUser: {
          displayName: "BrianWu",
          email: "brianwu291@gmail.com",
          emailVerified: false
        }
      }
    }
    const newState = userReducer(initialUserState, action)
    expect(newState.currentUser.displayName).toBe('BrianWu')
    expect(newState.currentUser.email).toBe('brianwu291@gmail.com')
    expect(newState.currentUser.emailVerified).toBe(false)
    expect(newState.isLoading).toEqual(false)
  })
  
  it('should return correct state on clear user', () => {
    const action = { type: actionTypes.CLEAR_USER }
    const newSate = userReducer(initialUserState, action)
    expect(newSate.isLoading).toEqual(false)
  })
})

describe('colorReducer', () => {
  const initColorsState = {
    primaryColor: '#4c3c4c',
    secondaryColor:'#eee' 
  }

  it('should return correct state on color select', () => {
    const action = {
      type: actionTypes.SET_COLORS,
      payload: {
        primaryColor: '#0000',
        secondaryColor: '#fff'
      }
    }
    const newState = colorReducer(initColorsState, action)
    expect(newState.primaryColor).toBe('#0000')
    expect(newState.secondaryColor).toBe('#fff')
  })
  
})


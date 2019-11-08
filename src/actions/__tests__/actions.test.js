import * as actionTypes from '../actionTypes'
import * as actions from '../index'

describe('SaveUser', () => {
  it('should have correct actionType on saveUser', () => {
    const action = actions.setUser()
    expect(action.type).toEqual(actionTypes.SET_USER)
  })
  it('should have correct payload on saveUser', () => {
    const action = actions.setUser({ displayName: "BrianWu", email: "brianwu291@gmail.com", emailVerified: false})
    expect(action.payload.currentUser.displayName).toEqual('BrianWu')
    expect(action.payload.currentUser.email).toEqual('brianwu291@gmail.com')
    expect(action.payload.currentUser.emailVerified).toBe(false)
  })
})

describe('ClearUser', () => {
  it('should have correct actionType on clearUser', () => {
    const action = actions.clearUser()
    expect(action.type).toEqual(actionTypes.CLEAR_USER)
  })
})

describe('SetCurrentChannel', () => {
  it('should have correct actionType on setCurrentChannel', () => {
    const action = actions.setCurrentChannel()
    expect(action.type).toEqual(actionTypes.SET_CURRENT_CHANNEL)
  })
  it('should have correct payload on setCurrentChannel', () => {
    const action = actions.setCurrentChannel({
      createdBy: {
        avatar: "https://firebasestorage.googleapis.com/v0/b/react-slack-dev-6776d.appspot.com/o/avatar%2Fusers%2F4oEbFQk6yQMsPPYfG1z4fWW3cA03?alt=media&token=e3ea2b4f-ff36-47b4-bd45-57e47acc6d07",
        name: "BrianWu"
      },
      details: "discuss JavaScript",
      id: 123,
      name: "JavaScript",
    })
    expect(action.payload.currentChannel.details).toEqual('discuss JavaScript')
    expect(action.payload.currentChannel.id).toBe(123)
    expect(action.payload.currentChannel.name).toEqual("JavaScript")
    expect(action.payload.currentChannel.createdBy.avatar).toBe("https://firebasestorage.googleapis.com/v0/b/react-slack-dev-6776d.appspot.com/o/avatar%2Fusers%2F4oEbFQk6yQMsPPYfG1z4fWW3cA03?alt=media&token=e3ea2b4f-ff36-47b4-bd45-57e47acc6d07")
    expect(action.payload.currentChannel.createdBy.name).toBe("BrianWu")
  })
})

describe('SetPrivateChannel', () => {
  it('should have correct actionType on setPrivateChannel', () => {
    const action = actions.setPrivateChannel()
    expect(action.type).toEqual(actionTypes.SET_PRIVATE_CHANNEL)  
  })
  it('should have correct payload on setPrivateChannel', () => {
    const action = actions.setPrivateChannel(true)
    expect(action.payload.isPrivateChannel).toBe(true)
  })
})

describe('setUserPosts', () => {
  it('should have correct actionType on setUserPosts', () => {
    const action = actions.setUserPosts()
    expect(action.type).toEqual(actionTypes.SET_USER_POSTS)
  })
  it('should have correct payload on setUserPost', () => {
    const action = actions.setUserPosts({
      Brian: { avatar: 'https://123', count: 12 },
      Peter: { avatar: 'https://456', count: 13 },
      Max: { avatar: 'https://789', count: 10 }
    })
    const result = action.payload.userPosts
    expect(result.Brian.avatar).toBe('https://123')
    expect(result.Peter.avatar).toBe('https://456')
    expect(result.Max.avatar).toBe('https://789')

    expect(result.Brian.count).toEqual(12)
    expect(result.Peter.count).toEqual(13)
    expect(result.Max.count).toEqual(10)
  })
})

describe('setColors', () => {
  it('should have correct actionType on setColors', () => {
    const action = actions.setColors()
    expect(action.type).toEqual(actionTypes.SET_COLORS) 
  })
  it('should have correct payload on setColors', () => {
    const action = actions.setColors('#4c3c4c', '#eee')
    expect(action.payload.primaryColor).toBe('#4c3c4c')
    expect(action.payload.secondaryColor).toBe('#eee')
  })
})


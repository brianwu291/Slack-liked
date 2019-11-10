import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'
import ColorPanel from './ColorPanel'
import SidePanel from './SidePanel'
import Messages from './Messages'
import MetaPanel from './MetaPanel'
import './css/App.css'

const App = ({ currentUser, currentChannel, isPrivateChannel, userPosts, primaryColor, secondaryColor }) => {
  return (
    <Grid 
      columns="equal"
      className="app"
      style={{ background: secondaryColor }}>
      <ColorPanel 
        key={currentUser && currentUser.name}
        currentUser={currentUser}/>
      <SidePanel
        key={currentUser && currentUser.id} 
        currentUser={currentUser}
        primaryColor={primaryColor}/>

      <Grid.Column
        style={{ marginLeft: '320px' }}>
        <Messages
          key={currentChannel && currentChannel.id} 
          currentChannel={currentChannel}
          currentUser={currentUser}
          isPrivateChannel={isPrivateChannel}/>
      </Grid.Column>

      <Grid.Column
        width={4}>
        <MetaPanel 
          isPrivateChannel={isPrivateChannel}
          currentChannel={currentChannel}
          userPosts={userPosts}
          key={currentChannel && currentChannel.name}/>
      </Grid.Column>  
    </Grid>
  );
}

const mapStateToProps = ({ user, channel, colors }) => ({
  currentUser: user.currentUser,
  currentChannel: channel.currentChannel,
  isPrivateChannel: channel.isPrivateChannel,
  userPosts: channel.userPosts,
  primaryColor: colors.primaryColor,
  secondaryColor: colors.secondaryColor
})

App.propTypes = {
  currentUser: PropTypes.object,
  currentChannel: PropTypes.object,
  isPrivateChannel: PropTypes.bool,
  userPosts: PropTypes.object,
  primaryColor: PropTypes.string,
  secondaryColor: PropTypes.string,
}

export default connect(mapStateToProps)(App)

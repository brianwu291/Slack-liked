import React from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import { Icon, Menu } from 'semantic-ui-react';

class Starred extends React.Component {
  state = {
    user: this.props.currentUser,
    usersRef: firebase.database().ref('users'),
    activeChannel: '',
    starredChannels: []
  };

  componentDidMount(){
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }

  addListeners = userId => {
    this.state.usersRef
      .child(userId)
      .child('starred')
      .on('child_added', snap => {
        const starredChannel = { id: snap.key, ...snap.val() };
        this.setState({ 
          starredChannels: [...this.state.starredChannels, starredChannel]
        });
      });

    this.state.usersRef
    .child(userId)
    .child('starred')
    .on('child_removed', snap => {
      const channelToRemove = { id: snap.key, ...snap.val() };
      const filteredChannels = this.state.starredChannels.filter(channel => channel.id !== channelToRemove.id);
      this.setState({ starredChannels:  filteredChannels})
    })
  }

  setActiveChannel = channel => {
    this.setState({ ...this.state, activeChannel: channel.id, channel });
  }

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
  }

  displayChannels = starredChannels => {
    return starredChannels.length > 0 && starredChannels.map(channel => {
      return (
        <Menu.Item
          key={channel.id}
          name={channel.name}
          onClick={() => this.changeChannel(channel)}
          style={{ opacity: 0.7 }}
          active={channel.id === this.state.activeChannel}>
          # {channel.name}
        </Menu.Item>
      );
    });
  }

  render(){
    const { starredChannels } = this.state;
    return(
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="star"
              style={{ marginRight: '5px' }}/> STARRED
          </span>{"  "}
          ({starredChannels.length}) 
        </Menu.Item>
        {this.displayChannels(starredChannels)}
      </Menu.Menu>
    );
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred);
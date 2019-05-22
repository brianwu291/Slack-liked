import React from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import { Icon, Menu } from 'semantic-ui-react';

class DirectMessages extends React.Component {
  state = {
    activeChannel: '',
    user: this.props.currentUser,
    users: [],
    usersRef: firebase.database().ref('users'),
    connectedRef: firebase.database().ref('.info/connected'),
    presenceRef: firebase.database().ref('presence')
  }

  componentDidMount(){
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }

  addListeners = currentUserUid => {
    let loadedUsers = [];
    this.state.usersRef.on('child_added', snap => {
      if (currentUserUid !== snap.key) {
        let user = snap.val();
        user['uid'] = snap.key;
        user['status'] = 'offline';
        loadedUsers.push(user);
        this.setState({ ...this.state, users: loadedUsers });
      }
    });

    this.state.connectedRef.on('value', snap => {
      if (snap.val() === true) {
        const ref = this.state.presenceRef.child(currentUserUid);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if (err !== null) {
            console.log(err);
          }
        });
      }
    });

    this.state.presenceRef.on('child_added', snap => {
      if (currentUserUid !== snap.key) {
        // add status to user
        this.addStatusToUser(snap.key);
      }
    });

    this.state.presenceRef.on('child_removed', snap => {
      if (currentUserUid !== snap.key) {
        // remove status to user
        this.addStatusToUser(snap.key, false)
      }
    });
  }

  addStatusToUser = (userId, connected = true) => {
    const updatedUsers = this.state.users.reduce((pre, user) => {
      if (userId === user.uid) {
        user['status'] = `${connected ? 'online' : 'offline'}`;
      }
      return pre.concat(user);
    }, []);
    this.setState({ ...this.state, users: updatedUsers });
  }

  isUserOnline = user => (user.status === 'online');

  getChannelId = userId => {
    const currentUserId = this.state.user.uid;
    return userId < currentUserId ?
      `${userId}/${currentUserId}` : `${currentUserId}/${userId}`;
  }

  setActiveChannel = userId => {
    this.setState({ ...this.state, activeChannel: userId });
  }

  changeChannel = user => {
    const channelId = this.getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name
    };
    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
    this.setActiveChannel(user.uid);
  }

  render(){
    const { users, activeChannel } = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail"/>
            DIRECT MESSAGES
          </span>{' '}
          ({ users.length })
        </Menu.Item>
        {users.map(user => {
          return <Menu.Item
            key={user.uid}
            active={user.uid === activeChannel}
            onClick={() => this.changeChannel(user)}
            style={{ opecity: 0.7, fontStyle: 'italic' }}>
            <Icon
              name="circle"
              color={this.isUserOnline(user) ? 'green' : 'red'}/>
            @ {user.name}
          </Menu.Item>
        })}
      </Menu.Menu>
    );
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(DirectMessages);
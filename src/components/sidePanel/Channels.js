import React from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import { Menu, Icon, Modal, Form, Input, Button, Label } from 'semantic-ui-react';

class Channels extends React.Component {
  state = {
    user: this.props.currentUser,
    activeChannel: '',
    channel: null,
    channels: [],
    channelName: '',
    channelDetails: '',
    channelsRef: firebase.database().ref('channels'),
    messagesRef: firebase.database().ref('messages'),
    typingRef: firebase.database().ref('typing'),
    notifications: [],
    modal: false,
    firstLoad: true
  };

  componentDidMount(){
    this.addListeners();
  }
  
  componentWillUnmount(){
    this.removeListeners();
  }

  addListeners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on('child_added', snap => {
      loadedChannels.push(snap.val());
      this.setState({...this.state, channels: loadedChannels}, () => {
        this.setFirstChannel();
      });
      this.addNotificationListener(snap.key);
    });
  }

  addNotificationListener = channelId => {
    this.state.messagesRef.child(channelId).on('value', snap => {
      const { channel, notifications } = this.state;
      if (channel) {
        this.handleNotifications(channelId, channel.id, notifications, snap);
      }
    });
  }

  handleNotifications = (channelId, currentChannelId, notifications, snap) => {
    let lastTotal = 0;
    let index = notifications.findIndex(notification => notification.id === channelId);

    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;
        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;          
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0
      });
    }

    this.setState({ ...this.state, notifications })
  }

  removeListeners = () => {
    this.state.channelsRef.off();
    this.state.channels.forEach(channel => {
      this.state.messagesRef.child(channel.id).off();
    })
  }

  setFirstChannel = () => {
    const { firstLoad, channels } = this.state;
    if (firstLoad && channels.length > 0) {
      this.props.setCurrentChannel(channels[0]);
      this.setActiveChannel(channels[0], () => {
        this.setState({ ...this.state, channel: channels[0] });
      });
    }
    this.setState(state => (
      {...state, firstLoad: false}
      )
    );
  }

  closeModal = () => this.setState({ ...this.state, modal: false });

  openModal = () => this.setState({ ...this.state, modal: true });

  handleChange = e => {
    this.setState({ ...this.state, [e.target.name]: e.target.value })
  }
  
  isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails;

  handleSubmit = e => {
    e.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  }

  addChannel = () => {
    const { channelsRef, channelName, channelDetails, user } = this.state;

    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ ...this.state, channelName: '', channelDetails: '' });
        this.closeModal();
        console.log('channel added!');
      })
      .catch(err => {
        console.log(err);
      })
  }

  displayChannels = channels => {
    return channels.length > 0 && channels.map(channel => {
      return (
        <Menu.Item
          key={channel.id}
          name={channel.name}
          onClick={() => this.changeChannel(channel)}
          style={{ opacity: 0.7 }}
          active={channel.id === this.state.activeChannel}>
          {this.getNotificationCount(channel) && 
            <Label
              color="red">
              {this.getNotificationCount(channel)}
            </Label>} 
          # {channel.name}
        </Menu.Item>
      );
    });
  }

  getNotificationCount = channel => {
    let count = 0;
    this.state.notifications.forEach(notification => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });
    if (count > 0) {
      return count;
    }
  }

  changeChannel = channel => {
    this.setActiveChannel(channel, this.clearNotifications);
    this.state.typingRef
      .child(this.state.channel.id)
      .child(this.state.user.uid)
      .remove();
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
  }

  setActiveChannel = (channel, fn) => {
    this.setState({ activeChannel: channel.id, channel }, () => {
      fn();
    });
  }

  clearNotifications = () => {
    let index = this.state.notifications.findIndex(notification => notification.id === this.state.channel.id);
    if (index !== -1) {
      let updateNotifications = [...this.state.notifications];
      updateNotifications[index].total = this.state.notifications[index].lastKnownTotal;
      updateNotifications[index].count = 0;
      this.setState({ ...this.state, notifications: updateNotifications });
    }
  }

  render(){
    const { channels, modal } = this.state;
    return(
      <React.Fragment>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name="exchange"
                style={{ marginRight: '5px' }}/>Channels
            </span>{"  "}
            ({channels.length}) 
            <Icon name="add" onClick={this.openModal}/>
          </Menu.Item>
          {this.displayChannels(channels)}
        </Menu.Menu>

        { /** add channel modal */ }
        <Modal
          basic
          open={modal}
          onClose={this.closeModal}>
          <Modal.Header>
            Add a Channel
          </Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input 
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  onChange={this.handleChange}/>
              </Form.Field>
              <Form.Field>
                <Input 
                  fluid
                  label="About the Channel"
                  name="channelDetails"
                  onChange={this.handleChange}/>
              </Form.Field>
            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button 
              color="green"
              inverted
              onClick={this.handleSubmit}>
              <Icon name="checkmark"/> Add
            </Button>
            <Button 
              color="red"
              inverted onClick={this.closeModal}>
              <Icon name="remove"/> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels);
import React from 'react';
import { connect } from 'react-redux';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase'; 
import { setUserPosts } from '../../actions';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import Message from './Message';
import Typing from './Typing';
import Skeleton from './Skeleton'

class Messages extends React.Component {
  state = {
    privateChannel: this.props.isPrivateChannel,
    privateMessagesRef:firebase.database().ref('privateMessages'),
    messagesRef: firebase.database().ref('messages'),
    messages: [],
    messagesLoading: true,
    channel: this.props.currentChannel,
    isChannelStarred: false,
    user: this.props.currentUser,
    usersRef: firebase.database().ref('users'),
    numUniqueUsers: '',
    searchTerm: '',
    searchLoading: false,
    searchResult: [],
    typingRef: firebase.database().ref('typing'),
    typingUsers: [],
    connectRef: firebase.database().ref('.info/connected')
  }

  componentDidMount() {
    const { user, channel } = this.state;
    if (user && channel) {
      this.addListeners(channel.id);
      this.addUserStarsListener(channel.id, user.uid);
    }
  }

  componentDidUpdate(preProps, preState) {
    if (this.messagesEnd) {
      this.scrollToBottom();
    }
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
  }

  addUserStarsListener = (channelId, userId) => {
    this.state.usersRef
      .child(userId)
      .child('starred')
      .once('value')
      .then(data => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channelId);
          this.setState({ isChannelStarred: prevStarred });
        }
      })
  }

  addListeners = channelId => {
    this.addMessageListener(channelId);
    this.addTypingListener(channelId);
  }

  addTypingListener = channelId => {
    let typingUsers = [];
    this.state.typingRef.child(channelId).on('child_added', snap => {
      if (snap.key !== this.state.user.uid) {
        typingUsers = typingUsers.concat({
          id: snap.key,
          name: snap.val()
        });
        this.setState({ typingUsers });
      }
    });

    this.state.typingRef.child(channelId).on('child_removed', snap => {
      const index = typingUsers.findIndex(user => user.id === snap.key);
      if (index !== -1) {
        typingUsers = typingUsers.filter(user => user.id !== snap.key);
        this.setState({ typingUsers });
      }
    })

    this.state.connectRef.on('value', snap => {
      if (snap.val() === true) {
        this.state.typingRef
          .child(channelId)
          .child(this.state.user.uid)
          .onDisconnect()
          .remove(err => {
            if (err !== null) {
               console.log(err)
            }
          })
      }
    })
  }

  addMessageListener = channelId => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    ref.child(channelId).on('child_added', snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,  
        messagesLoading: false
      }, () => {
        this.countUniqueUsers(loadedMessages);
        this.countUserPosts(loadedMessages);
      });
    })
  }

  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef, privateChannel } = this.state;
    return privateChannel ? privateMessagesRef : messagesRef;
  }

  handleStar = () => {
    this.setState(state => (
      { isChannelStarred: !state.isChannelStarred }
    ), () => this.starChannel())
  }

  starChannel = () => {
    if (this.state.isChannelStarred) {
      const { user, channel } = this.state;
      this.state.usersRef
        .child(`${user.uid}/starred`)
        .update({
          [channel.id]: {
            name: channel.name,
            details: channel.details,
            createdBy: {
              name: channel.createdBy.name,
              avatar: channel.createdBy.avatar
            }
          }
        })
    } else {
      const { user, channel } = this.state;
      this.state.usersRef
        .child(`${user.uid}/starred`)
        .child(channel.id)
        .remove(err => {
          if (err !== null) {
            console.log(err);
          } 
        })
    }
  }

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((pre, message) => {
      if (!pre.includes(message.user.name)) {
        pre.push(message.user.name);
      }
      return pre;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? "s" : ""}`;
    this.setState({ ...this.state, numUniqueUsers });
  }

  countUserPosts = messages => {
    let userPosts = messages.reduce((pre, message) => {
      if (message.user.name in pre) {
        pre[message.user.name].count += 1;
      } else {
        pre[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        };
      }
      return pre;
    }, {});
    this.props.setUserPosts(userPosts);
  }

  displayMessages = messages => {
    return messages.length > 0 && messages.map(message => (
      <Message 
        key={message.timestamp}
        message={message}
        user={this.state.user}/>
    ))
  }

  displayChannelName = channel => {
    return channel ? 
      `${this.state.privateChannel ? 
        '@' : '#'} ${channel.name}` : '';
  }

  handleSearchChange = e => {
    this.setState({
      ...this.state, 
      searchTerm: e.target.value,
      searchLoading: e.target.value ? true : false
    }, () => {
      this.handleSearchMessages();
    });
  }

  handleSearchMessages = () => {
    const channelMessages = [ ...this.state.messages ];
    const regex = new RegExp(this.state.searchTerm, 'gi');
    const searchResult = channelMessages.reduce((pre, message) => {
      if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
        pre.push(message);
      }
      return pre;
    }, []);
    this.setState({ ...this.state, searchResult });
  }

  displayTypingUsers = users => {
    users.length > 0 && users.map(user => (
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '.2em' }} key={user.id}>
        <span className="user__typing">{user.name} is typing</span><Typing />
      </div>
    ))
  }

  displayMessagesSkeleton = loading => loading ? (
      <React.Fragment>
        {[...Array(10)].map((_, idx) => (
          <Skeleton
            key={idx}
          />
        ))}
      </React.Fragment>
    ) : null

  render(){
    const {
      messagesRef,
      messages,
      channel,
      user,
      numUniqueUsers,
      searchTerm,
      searchResult,
      searchLoading,
      privateChannel,
      isChannelStarred,
      typingUsers,
      messagesLoading,
    } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          isPrivateChannel={privateChannel}
          handleStar={this.handleStar}
          isChannelStarred={isChannelStarred}/>
        
        <Segment>
          <Comment.Group className='messages'>
            {this.displayMessagesSkeleton(messagesLoading)}
            {searchTerm ?
              this.displayMessages(searchResult) :
              this.displayMessages(messages)}
            {this.displayTypingUsers(typingUsers)}
            <div ref={node => (this.messagesEnd = node)}></div>
          </Comment.Group>
        </Segment>
        
        <MessagesForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
          isPrivateChannel={privateChannel}
          getMessagesRef={this.getMessagesRef}/>
      </React.Fragment>
    );
  }
}

export default connect(null, { setUserPosts })(Messages);

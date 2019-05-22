import React from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';
import uuidv4 from 'uuid/v4';
import firebase from '../../firebase';

import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

class MessagesForm extends React.Component {
  state = {
    storageRef: firebase.storage().ref(),
    typingRef: firebase.database().ref('typing'),
    uploadTask: null,
    uploadState: '',
    percentUploaded: 0,
    message: '',
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    loading: false,
    errors: [],
    modal: false
  };

  openModal = () => this.setState({ ...this.state, modal: true });

  closeModal = () => this.setState({ 
    ...this.state, 
    modal: false 
  });

  handleChange = e => {
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  }

  createMessage = (fileUrl = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      }
    };
    if (fileUrl !== null) {
      message['image'] = fileUrl;
    } else {
      message['content'] = this.state.message;
    }
    return message;
  }

  handleTypingAnimation = () => {
    const { message, typingRef, channel, user } = this.state;
    if (message) {
      typingRef
        .child(channel.id)
        .child(user.id)
        .set(user.displayName);
    } else {
      typingRef
        .child(channel.id)
        .child(user.id)
        .remove();     
    }
  }

  sendMessage = () => {
    const { getMessagesRef } = this.props;
    const { message, channel, user, typingRef } = this.state;

    if (message) {
      this.setState({ loading: true });
      getMessagesRef()
        .child(this.state.channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ 
            loading: false, 
            message: '', 
            errors: [] 
          });
          typingRef
            .child(channel.id)
            .child(user.id)
            .remove();  
            })
        .catch(err => {
          this.setState({
            loading: false, 
            errors: this.state.errors.concat(err) 
          });
        })
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: 'Add A Message!' })  
      });
    }
  }

  pressEnterToSendMessage = e => {
    if (e.keyCode === 13) {
      this.sendMessage();
    } 
  }

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref.child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ 
          ...this.state, 
          uploadState: 'done' 
        });
      })
      .catch(err => {
        this.setState({ 
          ...this.state, 
          errors: this.state.errors.concat(err)
        });  
      })
  }

  putImgOnChannel = () => {
    const pathToUpload = this.state.channel.id;
    const ref = this.props.getMessagesRef();
    this.state.uploadTask.on('state_changed', snap => {
      const percentUploaded = Math.round(
        (snap.bytesTransferred / snap.totalBytes) * 100
      );
      this.setState({ ...this.state, percentUploaded, modal: false });
    }, err => {
      this.setState({ 
        ...this.state, 
        errors: this.state.errors.concat(err),
        uploadState: 'error',
        uploadTask: null
      });
    }, () => {
      this.state.uploadTask.snapshot.ref.getDownloadURL()
        .then(downloadURL => {
          this.sendFileMessage(downloadURL, ref, pathToUpload);
        })
        .catch(err => {
          this.setState({ 
            ...this.state, 
            errors: this.state.errors.concat(err),
            uploadState: 'error',
            uploadTask: null
          })
        })
      }
    )
  }

  getPath = () => {
    if (this.props.isPrivateChannel) {
      return `chat/private-${this.state.channel.id}`;
    } else {
      return `chat/public`;
    }
  }

  uploadFile = (file, metadata) => {
    const filePath = `${this.getPath()}/${uuidv4()}.jpg`;
    const uploadTask = this.state.storageRef.child(filePath).put(file, metadata);
    this.setState({
      ...this.state,
      uploadState: 'uploading',
      uploadTask
    }, () => {
      this.putImgOnChannel();
    });
  };

  render(){
    const { errors, message, loading, modal, uploadState, percentUploaded } = this.state;
    return (
      <Segment className="message__form">
        <Input
          fluid
          className={
            errors.some(err => err.message.includes('message')) 
              ? 'error' : ''
          }
          name="message"
          value={message}
          style={{ marginBottom: '0.7em' }}
          label={ <Button icon={"add"}/> }
          labelPosition="left"
          placeholder="Write your message"
          onChange={this.handleChange}
          onKeyDown={() => {
            this.pressEnterToSendMessage();
            this.handleTypingAnimation();
          }
        }/>
        <Button.Group icon widths="2">
          <Button
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            disabled={loading}
            onClick={this.sendMessage}/>
          <Button
            disabled={uploadState === 'uploading'}
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
            onClick={this.openModal}/>
        </Button.Group>
          <FileModal 
            modal={modal}
            closeModal={this.closeModal}
            uploadFile={this.uploadFile}/>
          <ProgressBar 
            uploadState={uploadState}
            percentUploaded={percentUploaded}/>
      </Segment>
    );
  }
}

export default MessagesForm;
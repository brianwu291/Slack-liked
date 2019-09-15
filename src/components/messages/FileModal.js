import React from 'react';
import mime from 'mime-types';
import { Modal, Input, Button, Icon } from 'semantic-ui-react';

class FileModal extends React.Component {
  state = {
    file: null,
    authorized: ['image/jpeg', 'image/png']
  };

  addFile = e => {
    const file = e.target.files[0];
    if (file) {
      this.setState({ file });
    }
  }

  isAuthorized = filename => (
    this.state.authorized.includes(mime.lookup(filename))
  );

  clearFile = () => this.setState({ file: null });

  sendFile = () => {
    const { file } = this.state;
    const { uploadFile } = this.props;

    if (file !== null) {
      if (this.isAuthorized(file.name)) {
        const metadata = { contentTypes: mime.lookup(file.name) };
        uploadFile(file, metadata);
        this.clearFile();
      }
    }
  }

  render(){
    const { closeModal, modal } = this.props;
    return (
      <Modal
        basic
        open={modal}
        onClose={closeModal}>
        <Modal.Header>
          Select An Image File
        </Modal.Header>
        <Modal.Content>
          <Input 
            fluid
            label="File types: jpg, png" 
            name="file"
            type="file"
            onChange={this.addFile}/>
        </Modal.Content>
        <Modal.Actions>
          <Button 
            color="green" 
            inverted
            onClick={this.sendFile}>
            <Icon name="checkmark"/>
            Send  
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove"/>
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FileModal;
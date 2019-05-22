import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import firebase from '../../firebase';
import md5 from 'md5';

class Register extends React.Component {
  state = { 
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('users')
  };

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return !username.length || !email.length || !password.length || !passwordConfirmation.length;
  }

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else{
      return true;
    }
  }

  isFormValid = () => {
    let errors = [], error;
    if (this.isFormEmpty(this.state)) {
      // throw error 
      error = { message: 'Fill In All Fields!' };
      this.setState({ ...this.state, errors: errors.concat(error) });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      // throw error
      error = { message: 'Password Is Invalid!' };
      this.setState({...this.state, errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  }

  displayErrors = errors => errors.map(
    (error, ind) => <p key={ind}>{error.message}</p>
  );

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value, 
    });
  };

  saveUser = ({ user }) => {
    return this.state.usersRef.child(user.uid).set({
      name: user.displayName,
      avatar: user.photoURL
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    if (this.isFormValid()) {
      this.setState({ ...this.state, errors: [], loading: true });
      const { email, password } = this.state;
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(createdUser => {
          console.log(createdUser);
          createdUser.user.updateProfile({
            displayName: this.state.username,
            photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
          })
          .then(() => {
            this.saveUser(createdUser)
              .then(() => {
                console.log('user save');
              })
              .catch(err => {
                console.log(err);
              })
          })
          .catch(err => {
            console.log(err);
            this.setState({ 
              ...this.satate, 
              errors: this.state.errors.concat(err),
              loading: false 
            })
          })
        })
        .catch(err => {
          console.log(err);
          this.setState({ ...this.state, errors: this.state.errors.concat(err), loading: false });
        })
    }
  };
  
  handleInputError = (errors, inputName) => {
    return errors.some(
      error => error.message.toLowerCase().includes(inputName)) ? 'error' : '';
  }

  render(){
    const { username, email, password, passwordConfirmation, errors, loading } = this.state;
    return(
      <Grid
        className="app" 
        textAlign="center" 
        verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header 
            as="h1" 
            icon 
            color="orange" 
            textAlign="center">
            <Icon 
              name="puzzle piece" 
              color="orange"/>
            Register For DevChat
          </Header>
          <Form 
            size="large"
            onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input 
                fluid 
                name="username" 
                icon="user"
                iconPosition="left" 
                placeholder="Username" 
                onChange={this.handleChange} 
                type="text"
                value={username}/>
              <Form.Input 
                fluid 
                name="email" 
                icon="mail"
                className={this.handleInputError(errors, 'email')} 
                iconPosition="left" 
                placeholder="Email Address" 
                onChange={this.handleChange} 
                type="email"
                value={email}/>
              <Form.Input 
                fluid 
                name="password" 
                icon="lock"
                className={this.handleInputError(errors, 'password')} 
                iconPosition="left" 
                placeholder="Password" 
                onChange={this.handleChange} 
                type="password"
                value={password}/>
              <Form.Input 
                fluid 
                name="passwordConfirmation" 
                icon="repeat"
                className={this.handleInputError(errors, 'password')} 
                iconPosition="left" 
                placeholder="Password Confirmation" 
                onChange={this.handleChange} 
                type="password"
                value={passwordConfirmation}/>
              <Button
                className={loading ? 'loading' : ''}
                disabled={loading} 
                color="orange" 
                fluid 
                size="large">
                Register
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Already Registered ? 
            <Link 
              to="/login" 
              style={{ marginLeft: '10px' }}>
              Login
            </Link>  
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
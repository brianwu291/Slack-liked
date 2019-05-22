import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import firebase from '../../firebase';

class Login extends React.Component {
  state = { 
    email: '',
    password: '',
    errors: [],
    loading: false,
  };

  displayErrors = errors => errors.map(
    (error, ind) => <p key={ind}>{error.message}</p>
  );

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value, 
    });
  };

  isFormValid = ({ email, password }) => email && password;

  handleSubmit = e => {
    e.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ ...this.state, errors: [], loading: true });
      const { email, password } = this.state;
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(signedInUser => {
          console.log(signedInUser);
        })
        .catch(err => {
          console.log(err);
          this.setState({ 
            ...this.state, 
            errors: this.state.errors.concat(err),
            loading: false
          });
        })
    }
  };
  
  handleInputError = (errors, inputName) => {
    return errors.some(
      error => error.message.toLowerCase().includes(inputName)) ? 'error' : '';
  }

  render(){
    const { email, password, errors, loading } = this.state;
    return(
      <Grid
        className="app" 
        textAlign="center" 
        verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header 
            as="h1" 
            icon 
            color="violet" 
            textAlign="center">
            <Icon 
              name="code branch" 
              color="violet"/>
            Login To DevChat
          </Header>
          <Form 
            size="large"
            onSubmit={this.handleSubmit}>
            <Segment stacked>
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
              <Button
                className={loading ? 'loading' : ''}
                disabled={loading} 
                color="violet" 
                fluid 
                size="large">
                Login
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
            Do not have an account ? 
            <Link 
              to="/register" 
              style={{ marginLeft: "10px" }}>
              Register
            </Link>  
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
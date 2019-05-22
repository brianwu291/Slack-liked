import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import firebase from './firebase';

import { createStore, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import { setUser, clearUser } from './actions';
import rootReducers from './reducers';
import App from './components/App';
import Spinner from './components/Spinner';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

import './components/css/App.css';
import 'semantic-ui-css/semantic.min.css';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducers, composeEnhancers());

class Root extends React.Component {
  componentDidMount(){
    const { setUser, history, clearUser } = this.props;
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        history.push('/');
      } else {
        history.push('/login');
        clearUser();
      }
    });
  }

  render(){
    return this.props.isLoading ? <Spinner /> : (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  isLoading: user.isLoading
});

const RootWithAuth = withRouter(connect(mapStateToProps, { setUser, clearUser })(Root));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>, 
  document.getElementById('root')
);
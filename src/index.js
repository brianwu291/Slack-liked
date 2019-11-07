import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, withRouter } from 'react-router-dom'

import { createStore, compose } from 'redux'
import { Provider, connect } from 'react-redux'
import { setUser, clearUser } from './actions'
import rootReducers from './reducers'
import useCheckoutUser from './customHooks/useCheckoutUser'
import Root from './Root'

import './components/css/App.css'
import 'semantic-ui-css/semantic.min.css'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(rootReducers, composeEnhancers())

const withUseCheckUer = Component => ({ setUser, history, clearUser, isLoading }) => {
  useCheckoutUser({ setUser, history, clearUser })
  return (
    <React.Fragment>
      <Component isLoading={isLoading} />
    </React.Fragment>
  )
}

const mapStateToProps = ({ user }) => ({
  isLoading: user.isLoading
})

const withConnect = connect(mapStateToProps, { setUser, clearUser })(withUseCheckUer(Root))
const RootWithAuth = withRouter(withConnect)

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>, 
  document.getElementById('root')
)

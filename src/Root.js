import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'

import App from './components/App'
import Spinner from './components/Spinner'
import Register from './components/auth/Register'
import Login from './components/auth/Login'

const Root = ({ isLoading = false }) => isLoading ? <Spinner /> :
<Switch>
  <Route exact path="/" component={App} />
  <Route path="/login" component={Login} />
  <Route path="/register" component={Register} />
</Switch>

Root.propTypes = {
  isLoading: PropTypes.bool
}

export default Root

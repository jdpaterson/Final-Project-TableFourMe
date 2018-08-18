import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ComponentHandler from './components/ComponentHandler.jsx';

import '../scss/application.scss';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/admin" component={ComponentHandler} />
          <Route path="/reservations/:res_code" component={ComponentHandler} />
          <Route exact path="/" component={ComponentHandler} />
        </div>
      </Router>
    )
  }
}

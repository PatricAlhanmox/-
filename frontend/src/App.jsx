import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import HomePage from './HomePage';
import userLogin from './auth/login';
import logOut from './auth/logout';
import userRegister from './auth/register';

function App () {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={userLogin} />
          <Route exact path="/listings" component={HomePage} />
          <Route exact path="/user/auth/register" component={userRegister} />
          <Route exact path="/user/auth/logout" component={logOut} />
        </Switch>
      </BrowserRouter>
    </>
  );
}
export default App;

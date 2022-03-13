import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import HomePage from './HomePage';
import userLogin from './auth/login';
import logOut from './auth/logout';
import userRegister from './auth/register';
import addPilot from './nameList/addPilot';
import edditPilot from './nameList/edditPilot';
import handleDeletion from './nameList/removePilot';

function App () {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={userLogin} />
          <Route exact path="/listings" component={HomePage} />
          <Route exact path="/listings/new" component={addPilot} />
          <Route exact path="/listings/eddit" component={edditPilot} />
          <Route exact path="/listings/remove" component={handleDeletion} />
          <Route exact path="/user/auth/register" component={userRegister} />
          <Route exact path="/user/auth/logout" component={logOut} />
        </Switch>
      </BrowserRouter>
    </>
  );
}
export default App;

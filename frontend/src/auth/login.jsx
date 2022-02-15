import React from 'react';
import { Button, TextField } from '@material-ui/core';
import LoginIcon from '@mui/icons-material/Login';
import ArticleIcon from '@mui/icons-material/Article';
import LockOutlined from '@material-ui/icons/LockOutlined';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { Redirect } from 'react-router-dom';

const urlPath = 'http://localhost:5005';
function jumpToRegister () {
  window.location = './user/auth/register';
}
function userLogin () {
  const ifLoggedIn = localStorage.getItem('token');
  if (ifLoggedIn) {
    return (<Redirect to="/listings"/>)
  }
  function handleLogin (event) {
    event.preventDefault();
    const requestBag = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: event.target.email.value,
        password: event.target.password.value,
      })
    };
    fetch(`${urlPath}/user/auth/login`, requestBag).then(response => {
      if (response.status === 200) {
        response.json().then(res => {
          const token = res.token;
          localStorage.setItem('token', token);
          localStorage.setItem('time', res.timeV);
          localStorage.setItem('month', res.month);
          window.location = './listings';
        })
      } else if (response.status === 400 || response.status === 403) {
        response.json().then(res => {
          alert(res.error);
        })
      }
    })
  }

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box >
          <Box component="form" onSubmit={(event) => handleLogin(event)} sx = {{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <LockOutlined color="primary" />
            <TextField
              margin="normal"
              id="email"
              label="输入名字"
              name="email"
              autoFocus
            />
            <TextField
              margin="normal"
              id="password"
              label="输入密码"
              name="password"
              autoFocus
            />
            <Button
              type="submit"
              id="submit"
              variant="contained"
              style={{ backgroundColor: '#4134B4' }}
            >
              Login <LoginIcon />
            </Button>
            <Button
              onClick={() => jumpToRegister()}
              style={{ backgroundColor: '#6124B4' }}
            >
              Register <ArticleIcon />
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
export default userLogin;

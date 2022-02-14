import { Container, Button, TextField } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import LockOutlined from '@material-ui/icons/LockOutlined';
import { Alert } from '@mui/material';
import React from 'react';

const urlPath = 'http://localhost:5005';
function userRegister () {
  const [password, setPassword] = React.useState(0);
  const [confirmPassword, setConfirmPassword] = React.useState(0);
  function handleRegister (event) {
    event.preventDefault();
    const myDate = new Date();
    const date = myDate.getMonth();
    const requestBag = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: event.target.email.value,
        password: event.target.password.value,
        name: '随便啥名',
        time: 0,
        date: date + 1,
      })
    };
    fetch(`${urlPath}/user/auth/register`, requestBag).then(response => {
      if (response.status === 200) {
        response.json().then(res => {
          const token = res.token;
          localStorage.setItem('token', token);
          window.location = '../../listings';
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
          <Box component="form" onSubmit={(event) => handleRegister(event)} sx = {{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <LockOutlined color="primary" />
            <TextField
              margin="normal"
              id="email"
              label="输入姓名"
              name="email"
              autoFocus
              />
            <TextField
              margin="normal"
              id="password"
              label="输入密码"
              name="password"
              autoFocus
              onChange={(event) => setPassword(event.target.value)}
            />
            <TextField
              margin="normal"
              id="confirmPassword"
              label="重复输入密码"
              name="confirm password"
              autoFocus
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
            {(password !== confirmPassword ? (<Alert severity="error">Please enter the same password<br /></Alert>) : <></>)}
            <Button
              type="submit"
              id="submit"
              variant="contained"
              style={{ backgroundColor: '#4134B4' }}
            >
              提交
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
export default userRegister;

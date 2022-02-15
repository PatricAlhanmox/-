import React from 'react';
import { Button, TextField } from '@material-ui/core';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import LogoutIcon from '@mui/icons-material/Logout';
import Container from '@material-ui/core/Container';
import { Typography, Toolbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import logOut from './auth/logout';

const urlPath = 'http://localhost:5005';

function LinearProgressWithLabel (props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

function numbersFun () {
  return null;
}

LinearProgressWithLabel.propTypes = {
  value: numbersFun,
};

function checkMonth () {
  const myd = new Date();
  const currentMonth = myd.getMonth();
  if (currentMonth > localStorage.getItem('month')) {
    return currentMonth;
  } else {
    return 0;
  }
}

function HomePage () {
  const [, setPage] = React.useState('Home');
  const [precentage, setPercentage] = React.useState(0);
  const [time, setTime] = React.useState(localStorage.time);
  const [month, setMonth] = React.useState(0);
  function handleHomePage (event) {
    event.preventDefault();
    const requestBag = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token') + ''
      },
      body: JSON.stringify({
        time: event.target.time.value,
        date: month
      })
    }
    fetch(`${urlPath}/listings`, requestBag).then(response => {
      if (response.status === 200) {
        response.json().then(res => {
          setTime(res.timeValue);
          console.log(`timeValue is ${res.timeValue}`);
          localStorage.time = time;
          console.log(`timeValue is ${time}`);
        })
      } else if (response.status === 400 || response.status === 403) {
        response.json().then(res => {
          alert(res.error);
        })
      }
    })
  }
  React.useEffect(() => {
    setMonth(checkMonth());
    setPercentage((time % 35) / 35 * 100);
  }, [time]);
  return (
    <>
      <Container component="main" sx={{ display: 'flex' }}>
        <Toolbar sx={{ borderBottom: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={() => setPage('Home')}>
            Home
          </Button>
          <form onSubmit={() => logOut()}>
            <Button type="submit">
              <LogoutIcon color="primary"/><Typography component="p">LOGOUT</Typography>
            </Button>
          </form>
        </Toolbar>
      </Container>
      <Container component="main" sx={{ justifyContent: 'center' }}>
        <Box component="form" onSubmit={(event) => handleHomePage(event)} sx={{ width: '100%' }}>
          <LinearProgressWithLabel value={precentage} />
          <TextField
            margin="normal"
            id="time"
            label="输入要增加的飞行时间"
            name="time"
            autoFocus
            /**
              onChange={(e) => { getTimeType(e) } }
            */
          />
          <Button
            type="submit"
            id="submit"
            variant="contained"
            style={{ backgroundColor: '#4134B4' }}
          >
            <AddIcon fontSize='large' />
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default HomePage;

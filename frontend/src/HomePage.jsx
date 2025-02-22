import React from 'react';
import { Container, Button, Box, Typography, Toolbar, ButtonGroup } from '@material-ui/core';
import LinearProgress from '@mui/material/LinearProgress';
import LogoutIcon from '@mui/icons-material/Logout';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import logOut from './auth/logout';

const urlPath = 'http://localhost:5005';

function jumpToAddPilot () {
  window.location = '/listings/new';
}

function removeDuplicate () {
  for (let i = 0; i < localStorage.length; i++) {
    for (let j = i + 1; j < localStorage.length; j++) {
      if (localStorage.key(i) !== 'token') {
        if (localStorage.getItem(localStorage.key(i)) === localStorage.getItem(localStorage.key(j))) {
          localStorage.removeItem(localStorage.key(j));
        }
      }
    }
  }
}

function sortPilot () {
  const arrNum = [];
  let j = 0;
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i) !== 'token') {
      arrNum[j] = parseInt(localStorage.getItem(localStorage.key(i)));
      j++;
    }
  }
  let swap = 0;
  for (let m = 0; m < arrNum.length; m++) {
    for (let n = 0; n < arrNum.length; n++) {
      if (arrNum[m] < arrNum[n]) {
        swap = arrNum[m];
        arrNum[m] = arrNum[n];
        arrNum[n] = swap;
      }
    }
  }
  for (let k = 0; k < arrNum.length; k++) {
    localStorage.setItem(k + 1, arrNum[k]);
  }
}

function LinearProgressWithLabel (props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', marginLeft: '2%' }}>
      <Box sx={Math.round(props.value) > 100 ? { width: `${(Math.round(props.value) * 4 / 5).toString()}%`, mr: 1 } : { width: '80%', mr: 1 }}>
        <LinearProgress variant="determinate" color={ Math.round(props.value) >= 100 ? 'success' : 'secondary' } {...props} />
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

function HomePage () {
  const [listings, setlistings] = React.useState([]);
  const [localLen, setLocalLen] = React.useState(0);
  const curDate = new Date();
  const curMonth = parseInt(curDate.getMonth()) + 1;
  const requestBag = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token') + ''
    }
  }
  React.useEffect(() => {
    fetch(`${urlPath}/listings`, requestBag)
      .then(r => r.json())
      .then((data) => {
        setlistings(data.listings);
        setLocalLen(localStorage.length);
        sortPilot();
        removeDuplicate();
      })
  }, [localLen]);
  return <>
    <Container component="main" sx={{ display: 'flex' }}>
      <Toolbar sx={{ borderBottom: 1, display: 'flex', justifyContent: 'space-around', marginBottom: '2%' }}>
        <Button>
          Home
        </Button>
        <form onSubmit={() => logOut()}>
          <Button type="submit">
            <LogoutIcon color="primary"/><Typography component="p">LOGOUT</Typography>
          </Button>
        </form>
        <Button onClick={() => jumpToAddPilot()}>
          <AirlineSeatReclineNormalIcon fontSize='large' color='primary'/><Typography component="p">点此增加飞行员</Typography>
        </Button>
      </Toolbar>
    </Container>
    <main>
      {listings.map((listing, idx) => {
        return (
          <Container component="main" maxWidth="lg" key={idx}>
            <Box sx = {{ border: '1px solid green' }}>
              <Box sx = {{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginLeft: '2%' }}>
                <Box sx = {{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '80%' }}>
                  <Typography flexDirection='column' variant="body1">姓名: {listing.name}</Typography>
                  <ButtonGroup variant="contained" color="primary">
                    <Button color='primary' size="large" onClick={() => { window.location = '/listings/eddit/'; localStorage.setItem('idx', idx) }} >编辑</Button>
                    <Button color='primary' size="large" onClick={() => { window.location = '/listings/remove/'; localStorage.setItem('idx', idx) }} >删除</Button>
                    <Button color='primary' size="large" onClick={() => { window.location = '/listings/detail/'; localStorage.setItem('idx', idx) }} >细节</Button>
                  </ButtonGroup >
                </Box>
              </Box>
              <LinearProgressWithLabel value={listing.monthlyTime[curMonth] / listing.goalTime[curMonth] * 100 } />
            </Box>
            <div>
              <br />
            </div>
          </Container>
        )
      })}
    </main>
  </>;
}

export default HomePage;

import React from 'react';
import { Container, Button, Box, Typography, Toolbar } from '@material-ui/core';
import LinearProgress from '@mui/material/LinearProgress';
import LogoutIcon from '@mui/icons-material/Logout';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import logOut from './auth/logout';

const urlPath = 'http://localhost:5005';

function jumpToAddPilot () {
  window.location = '/listings/new';
}

function sortPilot () {
  let tmp = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const curKey = localStorage.key(i);
    if (curKey[0] === 'i' && curKey[1] === 'd' && curKey[2] !== 'x') {
      for (let j = 1; j < localStorage.length; j++) {
        const innerCurKey = localStorage.key(j);
        if (innerCurKey[0] === 'i' && innerCurKey[1] === 'd' && innerCurKey[2] !== 'x') {
          if (localStorage.getItem(innerCurKey) > localStorage.getItem(curKey)) {
            console.log('here');
            tmp = localStorage.getItem(innerCurKey);
            const smaller = localStorage.getItem(curKey);
            localStorage.setItem(curKey, tmp);
            localStorage.setItem(innerCurKey, smaller);
          }
        }
      }
    }
  }
}

function LinearProgressWithLabel (props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
      <Box sx={{ width: '85%', mr: 1 }}>
        <LinearProgress variant="determinate" color={ Math.round(props.value) >= 40 ? 'success' : 'secondary' } {...props} />
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
  const curDate = new Date();
  const curSeason = Math.ceil(curDate.getMonth() / 3);
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
      })
  }, []);
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
              <Box sx = {{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '1%' }}>
                <Box sx = {{ display: 'flex', margin: '1%' }}>
                  {
                    listing.thumbnail === '' ? <Typography variant="body1">No pictures yet</Typography> : <Typography variant="body1"> <img src={ listing.thumbnail } /> </Typography>
                  }
                </Box>
                <Box sx = {{ display: 'flex', justifyContent: 'space-between', marginLeft: '15%' }}>
                  <Typography variant="body1">姓名: {listing.name}</Typography>
                  <Typography variant="body1">上级: {listing.leader}</Typography>
                  <Typography width="12%" variant="body1">月起落数: {listing.patternNumber}</Typography>
                  <Typography width="12%" variant="body1">本月飞行小时: {listing.monthlyTime}</Typography>
                  <Typography width="12%" variant="body1">本季飞行小时: {listing.quaterTime[curSeason]}</Typography>
                  <Typography width="12%" variant="body1">本年飞行小时: {listing.yearlyTime}</Typography>
                  <Box width="15%">
                    <Button color='primary' border="5" size="medium" variant="contained" onClick={() => { window.location = '/listings/eddit/'; sortPilot(); localStorage.setItem('idx', idx) }} >编辑</Button>
                    <Button color='primary' border="5" size="medium" variant="contained" onClick={() => { window.location = '/listings/remove/'; sortPilot(); localStorage.setItem('idx', idx) }} >删除</Button>
                  </Box>
                </Box>
              </Box>
              <LinearProgressWithLabel value={parseInt(listing.monthlyTime)} />
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

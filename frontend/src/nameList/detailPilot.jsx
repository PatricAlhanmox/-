import React from 'react';
import { Container, Button, Box } from '@material-ui/core';
import { Typography } from '@mui/material';
import logOut from '../auth/logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';

const urlPath = 'http://localhost:5005';

function pilotDetail () {
  const [listings, setlistings] = React.useState([]);
  const [monthListing, setMonthListing] = React.useState([]);
  const [goalListing, setGoalListing] = React.useState([]);
  const [quaterListing, setQuaterListing] = React.useState([]);
  const curDate = new Date();
  const curMonth = parseInt(curDate.getMonth());
  const curSeason = Math.floor(curDate.getMonth() / 3);
  const idx = parseInt(localStorage.getItem('idx'));
  const listID = localStorage.getItem(idx + 1);
  const requestBag = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token') + ''
    }
  };
  function addData (listings) {
    let tmpArray = [];
    let tmpQArray = [];
    let tmpGArray = [];
    const monthArray = JSON.stringify(listings.monthlyTime);
    const quaterArray = JSON.stringify(listings.quaterTime);
    const goalArray = JSON.stringify(listings.goalTime);
    tmpArray = JSON.stringify(listings.monthlyTime).substring(1, monthArray.length - 1).split(',');
    tmpQArray = JSON.stringify(listings.quaterTime).substring(1, quaterArray.length - 1).split(',');
    tmpGArray = JSON.stringify(listings.goalTime).substring(1, goalArray.length - 1).split(',');
    for (let i = 0; i < tmpArray.length; i++) {
      tmpArray[i] = tmpArray[i].split(':')[1];
      tmpGArray[i] = tmpGArray[i].split(':')[1];
      setMonthListing([...tmpArray, tmpArray[i]]);
      setGoalListing([...tmpGArray, tmpGArray[i]]);
    }
    for (let j = 0; j < tmpQArray.length; j++) {
      tmpQArray[j] = tmpQArray[j].split(':')[1];
      setQuaterListing([...tmpQArray, tmpQArray[j]]);
    }
  }
  React.useEffect(() => {
    fetch(`${urlPath}/listings/detail/${listID}`, requestBag)
      .then(r => r.json())
      .then((data) => {
        setlistings(data.listings);
        addData(data.listings);
        localStorage.removeItem('idx');
      })
  }, []);
  return (<>
    <Container component="main" maxWidth="md">
      <form onSubmit={() => logOut()}>
        <Button variant="contained" type="submit">
          <LogoutIcon color="primary"/><Typography component="p">LOGOUT</Typography>
        </Button>
      </form>
      <Button type="submit" onClick={() => { window.location = '../' }}>
        <ArrowBackIcon color="primary"/><Typography variant="body2" component="p">Go Back</Typography>
      </Button>
      <Container component="main" maxWidth="lg" key={idx}>
        <Box sx = {{ display: 'flex', flexDirection: 'column', alignItems: 'left', margin: '1%' }}>
          <Box sx = {{ display: 'flex', margin: '1%' }}>
            {
              listings.thumbnail === '' ? <Typography variant="body1">No pictures yet</Typography> : <Typography variant="body1"> <img src={ listings.thumbnail } /> </Typography>
            }
          </Box>
          <Typography variant="body1">姓名: {listings.name}</Typography>
          <Typography variant="body1">上级: {listings.leader}</Typography>
          <Typography variant="body1">全年飞行小时: {listings.yearlyTime}</Typography>
          <Typography variant="body1">本月飞行小时: {goalListing[curMonth]}</Typography>
          <Typography variant="body1">本月起落数: {listings.patternNumber}</Typography>
          <Typography variant="body1">本月飞行小时: {monthListing[curMonth]}</Typography>
          <Typography variant="body1">本季飞行小时: {quaterListing[curSeason]}</Typography>
        </Box>
      </Container>
    </Container>
  </>);
}

export default pilotDetail;

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
  const [quaterListing, setQuaterListing] = React.useState();
  const idx = parseInt(localStorage.getItem('idx'));
  const listID = localStorage.getItem(idx + 1);
  const requestBag = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token') + ''
    }
  };
  React.useEffect(() => {
    fetch(`${urlPath}/listings/detail/${listID}`, requestBag)
      .then(r => r.json())
      .then((data) => {
        setlistings(data.listings);
        let tmpArray = []
        const monthArray = JSON.stringify(data.listings.monthlyTime);
        tmpArray = JSON.stringify(data.listings.monthlyTime).substring(1, monthArray.length - 1).split(',');
        for (let i = 0; i < tmpArray.length; i++) {
          tmpArray[i] = tmpArray[i].split(':')[1];
        }
        console.log(tmpArray);
        setMonthListing(tmpArray);
        setQuaterListing(JSON.stringify(data.listings.quaterTime));
        // localStorage.removeItem('idx');
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
          <Typography variant="body1">本月起落数: {listings.patternNumber}</Typography>
          <Typography variant="body1">本月飞行小时: {monthListing}</Typography>
          <Typography variant="body1">本季飞行小时: {quaterListing}</Typography>
        </Box>
      </Container>
    </Container>
  </>);
}

export default pilotDetail;

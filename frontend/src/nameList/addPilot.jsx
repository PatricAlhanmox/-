import { React } from 'react';
import Box from '@material-ui/core/Box';
import { Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CreateIcon from '@mui/icons-material/Create';
import { Container, TextField, Button } from '@material-ui/core';
import logOut from '../auth/logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import fileToDataUrl from '../asset/helper';

const urlPath = 'http://localhost:5005';
function addPilot () {
  function handleCreation (event) {
    event.preventDefault();
    fileToDataUrl(document.getElementById('Thumbnail').files[0]).then(r => {
      const requestBag = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token') + ''
        },
        body: JSON.stringify({
          name: event.target.name.value,
          patternNumber: event.target.patternNumber.value,
          monthlyTime: event.target.monthlyTime.value,
          quaterTime: event.target.quaterTime.value,
          yearlyTime: event.target.yearlyTime.value,
          thumbnail: r
        })
      };
      fetch(`${urlPath}/listings/new`, requestBag).then(response => {
        if (response.status === 200) {
          response.json().then(res => {
            const listId = res.listingId;
            const idNext = res.listingLen;
            localStorage.setItem(`${idNext}`, listId);
            window.location = '../';
          })
        } else if (response.status === 400 || response.status === 403) {
          response.json().then(res => {
            alert(res.error);
            console.log(res.error);
          })
        }
      });
    })
  }

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
      <Box component="form" onSubmit={(event) => handleCreation(event) } sx = {{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5">增加此中队的飞行员</Typography>
        <TextField
          margin="normal"
          id="name"
          label="飞行员姓名"
          name="name"
          autoFocus
        />
        <TextField
          margin="normal"
          id="patternNumber"
          label="本月起落数"
          name="Bathroom"
          autoFocus
        />
        <TextField
          margin="normal"
          id="monthlyTime"
          label="飞行员本月小时数"
          name="Address"
          autoFocus
        />
        <TextField
          margin="normal"
          id="quaterTime"
          label="飞行员本季小时数"
          name="Price"
          autoFocus
        />
        <TextField
          margin="normal"
          id="yearlyTime"
          label="飞行员本年小时数"
          name="Price"
          autoFocus
        />
        <Typography variant="p">头像</Typography>
        <input
          margin="normal"
          id="Thumbnail"
          lable="上传头像"
          name="Thumbnail"
          type="file"
          multiple="multiple"
        />
        <Button type="submit">
          <CreateIcon margin="normal" color="primary"/><Typography variant="p" component="p">Create</Typography>
        </Button>
      </Box>
    </Container>
  </>);
}

export default addPilot;

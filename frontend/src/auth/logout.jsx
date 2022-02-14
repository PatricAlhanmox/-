import React from 'react';

const urlPath = 'http://localhost:5005';
function logOut () {
  const requestBag = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token')
    },
    body: JSON.stringify()
  };
  fetch(`${urlPath}/user/auth/logout`, requestBag).then(response => {
    if (response.status === 200) {
      response.json().then(res => {
        localStorage.removeItem('token');
        window.location = '../';
      })
    } else if (response.status === 400 || response.status === 403) {
      response.json().then(res => {
        alert(res.error);
      })
    }
  })
  return (
    <></>
  );
}
export default logOut;

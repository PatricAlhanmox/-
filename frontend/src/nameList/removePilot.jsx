import { React } from 'react';
const urlPath = 'http://localhost:5005';
function handleDeletion () {
  const requestBag = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token') + ''
    },
    body: JSON.stringify({})
  }
  const item = parseInt(localStorage.getItem('idx')) + 1;
  const listID = localStorage.getItem(`${item}`);
  fetch(`${urlPath}/listings/remove/${listID}`, requestBag).then(r => {
    if (r.status === 200) {
      r.json().then(res => {
        localStorage.removeItem('idx');
        localStorage.removeItem(`${item}`);
        alert('deleted successfully');
        window.location = '../';
      })
    } else if (r.status === 400 || r.status === 403) {
      r.json().then(res => {
        console.log(res.error);
      })
    }
  })
  return (<>
  </>)
}

export default handleDeletion;

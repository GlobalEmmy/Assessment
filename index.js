
const addNewRoom = () => {
    const room = {
      name: form.name.value,
      attendee: form.attendee.value,
      booked: 0,
      description: form.description.value,
      status: parseInt(form.status.value, 10)
    }
      db.collection('rooms').add(room)
      .then(() => {
      // Reset the form values
      form.name.value = "",
      form.attendee.value = "",
      form.description.value = "",
      form.status.value = ""
  
      alert('Your room has been successfully saved')
      })
      .catch(err => console.log(err))
  }
  let bookedRooms = [];

const bookRoom = (booked, id) => {
  const getBookedRoom = localStorage.getItem('booked-room');

    if (getBookedRoom) {
     bookedRooms = JSON.parse(localStorage.getItem('booked-room'));
      if(bookedRooms.includes(id)) {
        alert('Seems like you have already booked this room') 
      } 
      else {
        saveBooking(booked, id)
     }
    } 
    else {
        saveBooking(booked, id)
    }
};

const saveBooking = (booked, id) => {
    bookedRooms.push(id);
    localStorage.setItem('booked-room', JSON.stringify(bookedRooms));

    const data = { booked: booked +1 }
    db.collection('room').doc(id).update(data)
    .then(() => alert('Room successfully booked'))
    .catch(err => console.log(err))
}

const roomContainer = document.querySelector('.room-container')
const nav = document.querySelector('nav')
const welcomeRoom = document.querySelector('.welcome-room')
const form = document.querySelector('.form')

const showRoom = (room, id) => {
  const {name, attendee, status, description, booked} = room

  const roomStatus = status === 0 ? 'free': 'paid'
  const output = `
        <div class="card">
          <div class="card--details">
            <div>
              <h1>${name}</h1>
              <span>${attendee - booked} attendees</span>
            </div>
            <span class="card--details-ribbon ribbon-${roomStatus}">
                ${roomStatus}
            </span>
             <p>${description}</p>
            <button onclick="bookRoom(${booked} ,'${id}')" class="btn btn-tertiary">Book</button>
          </div>
        </div>
        `
    roomContainer.innerHTML += output;
}
const showLatestRoom = (latestRoom, id) => {
  
    const {name, attendee, status, description, booked} = latestRoom 
    // Get the first room
      welcomeRoom.innerHTML = `
      <h1>${name}</h1>
      <p>${description.length >= 100 ? `${description.substring(0, 100)}...` : description}</p>
      <div>
        <span>Attendees: ${attendee - booked}</span>
        <span>Status: ${status === 0 ? 'free': 'paid'}</span>
       </div>
       <button onclick="bookRoom(${booked} ,'${id}')" class="btn btn-tertiary">Book</button>
      `
  }
  
  form.addEventListener('submit', e => {
    e.preventDefault()
    addNewRoom()
  })
  
  window.onscroll = () =>  {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      nav.style.background = 'var(--tertiary-color)';
      nav.style.boxShadow = '0 10px 42px rgba(25,17,34,.1)';
    } else {
      nav.style.background = 'none';
      nav.style.boxShadow = 'none';
    }
  }
 
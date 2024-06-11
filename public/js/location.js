document.addEventListener('DOMContentLoaded', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      document.getElementById('location').textContent = "Geolocation is not supported by this browser.";
    }
  });
  
  function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
  
    // Display the coordinates on the page
    document.getElementById('location').textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
  
    // Send the coordinates to the server using a POST request
    fetch('/api/brewery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ latitude, longitude })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Response from server:', data);
      // Handle the response from the server if needed
    })
    .catch(error => console.error('Error sending location data:', error));
  }
  
  function showError(error) {
    let message = '';
    switch(error.code) {
      case error.PERMISSION_DENIED:
        message = "User denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        message = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        message = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        message = "An unknown error occurred.";
        break;
    }
    document.getElementById('location').textContent = message;
  }
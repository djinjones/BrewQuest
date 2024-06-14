let map;
let infoWindows = [];
let breweryMarkers = [];

document.addEventListener('DOMContentLoaded', () => {
  initMap();
});



function initMap() {
  // Default location (if Geolocation fails)
  const defaultLocation = { lat: -34.397, lng: 150.644 };

  // Create the map centered at the default location
  map = new google.maps.Map(document.getElementById('map'), {
    center: defaultLocation,
    zoom: 8
  });

  // Check if Geolocation is supported by the browser
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Set the map's center to the current location
      map.setCenter(currentLocation);

      // Optionally add a marker at the current location
      new google.maps.Marker({
        position: currentLocation,
        map: map,
        title: 'You are here'
      });

      const currentCoords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      getNearBreweries(currentCoords);

    }, function() {
      // Handle error if Geolocation fails
      handleLocationError(true, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, map.getCenter());
  }
}

// Handle errors with Geolocation
function handleLocationError(browserHasGeolocation, pos) {
  const infoWindow = new google.maps.InfoWindow({
    map: map
  });
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}

async function getNearBreweries(currentCoords) {
  try {
    const response = await fetch('/api/brewery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentCoords),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Clear existing infoWindows
    infoWindows.forEach(infoWindow => infoWindow.close());
    infoWindows = [];
    breweryMarkers.forEach(marker => marker.setMap(null));
    breweryMarkers = [];

    // Create markers for each brewery
    data.slice(0, 15).forEach(brewery => {
      const location = {
        lat: parseFloat(brewery.latitude),
        lng: parseFloat(brewery.longitude),
      };

      const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: brewery.name,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div>
            <h3>${brewery.name}</h3>
            <p>Type: ${brewery.brewery_type}</p>
            <p>Address: ${brewery.street}, ${brewery.city}, ${brewery.state}, ${brewery.postal_code}</p>
            <p>Country: ${brewery.country}</p>
            <p>Phone: ${brewery.phone}</p>
            <p>Website: <a href="${brewery.website_url}" target="_blank">${brewery.website_url}</a></p>
            <button class="review-button" data-brewery-id="${brewery.id}">Leave a Review</button>
            <div class="reviews" data-review-id="${brewery.id}"></div>
          </div>
        `,
      });

      infoWindows.push(infoWindow);
      breweryMarkers.push(marker);

      // Open info window on marker click
      marker.addListener('click', () => {
        closeAllInfoWindows();
        infoWindow.open(map, marker);
        map.setZoom(10); // Adjust the zoom level as needed
        map.setCenter(marker.getPosition());
      });
    });

    displayBreweriesList(data);
  } catch (err) {
    console.error('Error fetching nearby breweries:', err);
  }
}

// Function to display breweries list
function displayBreweriesList(data) {
  const breweriesListContainer = document.getElementById('breweries-list-container');

  // Clear previous list
  breweriesListContainer.innerHTML = '';

  // Create list items for each brewery
  data.slice(0, 15).forEach(brewery => {
    const breweryInfo = document.createElement('div');
    breweryInfo.classList.add('brewery-info');
    breweryInfo.innerHTML = `
      <h3>${brewery.name}</h3>
      <p>Type: ${brewery.brewery_type}</p>
      <p>Address: ${brewery.street}, ${brewery.city}, ${brewery.state}, ${brewery.postal_code}</p>
      <p>Country: ${brewery.country}</p>
      <p>Phone: ${brewery.phone}</p>
      <p>Website: <a href="${brewery.website_url}" target="_blank">${brewery.website_url}</a></p>
      <button class="review-button" data-brewery-id="${brewery.id}">Leave a Review</button>
    </div>
    `;

    breweryInfo.addEventListener('click', () => {
      const location = { lat: parseFloat(brewery.latitude), lng: parseFloat(brewery.longitude) };
      const index = data.findIndex(b => b.name === brewery.name); // Find index of brewery in data array
      closeAllInfoWindows();
      infoWindows[index].open(map, breweryMarkers[index]); // Open corresponding info window
      map.setZoom(10);
      map.setCenter(location); // Center map to brewery location
    });

    breweriesListContainer.appendChild(breweryInfo);
  });
}

// Function to close all info windows
function closeAllInfoWindows() {
  infoWindows.forEach(infoWindow => infoWindow.close());
}

async function leaveReview(breweryId, title, review) {
    try {
        const response = await fetch('/api/blogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                breweryId: breweryId,
                // rating: rating,
                title: title,
                content: review,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Optionally, handle successful review submission (e.g., display a message)
        console.log('Review submitted successfully!');
    } catch (err) {
        console.error('Error submitting review:', err);
    }
}

function openReviewModal(breweryId) {
    const modal = document.getElementById('reviewModal');
    const submitReviewButton = document.getElementById('submitReview');

    // Set the brewery ID in a data attribute of the modal
    modal.setAttribute('data-brewery-id', breweryId);

    // Show the modal
    modal.style.display = 'block';

    // Add event listener to the submit review button
    submitReviewButton.addEventListener('click', () => {
        //const rating = document.getElementById('rating').value;
        const title = document.getElementById('title').value;
        const review = document.getElementById('review').value;

        // Submit the review
        leaveReview(breweryId, title, review);

        // Close the modal after submitting the review
        modal.style.display = 'none';

        // Clear input fields in the modal
        //document.getElementById('rating').value = '';
        document.getElementById('title').value = '';
        document.getElementById('review').value = '';
    });
}

document.getElementById('map').addEventListener('click', function(event) {
    // Check if the clicked element is a review button
    if (event.target.classList.contains('review-button')) {
        // Get the brewery ID from the data attribute
        const breweryId = event.target.getAttribute('data-brewery-id');
        
        // Open the review modal
        openReviewModal(breweryId);
    }
});


function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    modal.style.display = 'none';
}

// Event listener for the close button on the modal
document.querySelector('.close').addEventListener('click', closeReviewModal);
// var marker = new google.maps.Marker({
//     position: location,
//     map: map,
//     title: 'Hello World!',  // Tooltip text
//     icon: 'path_to_custom_icon.png'  // Custom icon
//   })

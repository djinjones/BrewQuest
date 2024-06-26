let map;
let infoWindows = [];
let breweryMarkers = [];

document.addEventListener('DOMContentLoaded', () => {
  initMap();
});

function initMap() {
  const defaultLocation = { lat: -34.397, lng: 150.644 };

  map = new google.maps.Map(document.getElementById('map'), {
    center: defaultLocation,
    zoom: 8
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.setCenter(currentLocation);

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
      handleLocationError(true, map.getCenter());
    });
  } else {
    handleLocationError(false, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, pos) {
  const infoWindow = new google.maps.InfoWindow({
    map: map
  });
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}

async function getBreweryData(breweryId) {
  try {
    const response = await fetch(`/brewery/${breweryId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Process the data as needed
    console.log('Brewery data:', data);
  } catch (err) {
    console.error('Error fetching brewery data:', err);
  }
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

    infoWindows.forEach(infoWindow => infoWindow.close());
    infoWindows = [];
    breweryMarkers.forEach(marker => marker.setMap(null));
    breweryMarkers = [];

    for (const brewery of data.slice(0, 15)) {
      const location = {
        lat: parseFloat(brewery.latitude),
        lng: parseFloat(brewery.longitude),
      };

      const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: brewery.name,
      });

      const reviews = await getBreweryReviews(brewery.id);

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
            <div class="reviews" data-review-id="${brewery.id}">
              ${reviews.map(review => `<p><strong>${review.title}:</strong> ${review.content}</p>`).join('')}
            </div>
          </div>
        `,
      });

      infoWindows.push(infoWindow);
      breweryMarkers.push(marker);

      marker.addListener('click', () => {
        closeAllInfoWindows();
        infoWindow.open(map, marker);
        map.setZoom(10);
        map.setCenter(marker.getPosition());
      });
    }

    displayBreweriesList(data);
  } catch (err) {
    console.error('Error fetching nearby breweries:', err);
  }
}

async function getBreweryReviews(breweryId) {
  try {
    const response = await fetch(`/api/brewery/${breweryId}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const brewery = await response.json();
    //console.log(brewery, 'Brewery map.js:146'); 
    console.log('reviews: ', brewery.blogs)
    return 
  } catch (err) {
    console.error(`Error fetching reviews for brewery ${breweryId}:`, err);
    return [];
  }
}

function displayBreweriesList(data) {
  const breweriesListContainer = document.getElementById('breweries-list-container');
  breweriesListContainer.innerHTML = '';

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
    `;

    breweryInfo.addEventListener('click', () => {
      const location = { lat: parseFloat(brewery.latitude), lng: parseFloat(brewery.longitude) };
      const index = data.findIndex(b => b.name === brewery.name);
      const breweryId = breweryInfo.getAttribute('data-brewery-id');
      
      closeAllInfoWindows();
      infoWindows[index].open(map, breweryMarkers[index]);
      map.setZoom(10);
      map.setCenter(location);
    });

    breweriesListContainer.appendChild(breweryInfo);
  });
}

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
        brewery_id: breweryId,
        title: title,
        content: review,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Review submitted successfully!');
  } catch (err) {
    console.error('Error submitting review:', err);
  }
}

function openReviewModal(breweryId) {
  const modal = document.getElementById('reviewModal');
  const submitReviewButton = document.getElementById('submitReview');

  modal.setAttribute('data-brewery-id', breweryId);
  modal.style.display = 'block';

  submitReviewButton.addEventListener('click', () => {
    const title = document.getElementById('title').value;
    const review = document.getElementById('review').value;

    leaveReview(breweryId, title, review);

    modal.style.display = 'none';

    document.getElementById('title').value = '';
    document.getElementById('review').value = '';
  });
}

document.getElementById('map').addEventListener('click', function(event) {
  if (event.target.classList.contains('review-button')) {
    const breweryId = event.target.getAttribute('data-brewery-id');
    openReviewModal(breweryId);
  } else if (event.target.classList.contains('brewery-info')) {
    const breweryId = event.target.getAttribute('data-brewery-id');
    getBreweryReviews(breweryId);
  }
});

document.getElementById('breweries-list-container').addEventListener('click', function(event) {
  if (event.target.classList.contains('brewery-info')) {
    const breweryId = event.target.getAttribute('data-brewery-id');
    getBreweryReviews(breweryId);
  }
})

function closeReviewModal() {
  const modal = document.getElementById('reviewModal');
  modal.style.display = 'none';
}

document.querySelector('.close').addEventListener('click', closeReviewModal);

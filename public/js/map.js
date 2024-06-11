function initMap() {
    // Default location (if Geolocation fails)
    var defaultLocation = { lat: -34.397, lng: 150.644 };
    
    // Create the map centered at the default location
    var map = new google.maps.Map(document.getElementById('map'), {
        center: defaultLocation,
        zoom: 8
    });

    // Check if Geolocation is supported by the browser
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var currentLocation = {
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
    var infoWindow = new google.maps.InfoWindow({
        map: map
    });
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

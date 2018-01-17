// functin that makes sure that forms are validated
function checkform(form) {
    // get all the inputs within the submitted form
    var inputs = form.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        // only validate the inputs that have the required attribute
        if(inputs[i].hasAttribute("required")){
            if(inputs[i].value == ""){
                // found an empty field that is required
                alert("Please fill all required fields");
                return false;
            }
        }
    }
    return true;
}

var map, infoWindow;

function initMap() {
  latLng = new google.maps.LatLng(49, 123)

  map = new google.maps.Map(document.getElementById('add-map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 12,
    gestureHandling: 'cooperative',
    disableDefaultUI: true,
    styles: globalMapTheme
  });
  infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  map.addListener('click', function(e) {
    $('#lat').val(e.latLng.lat); // JQuery to change the value of the input field
    $('#lng').val(e.latLng.lng);
    Materialize.toast('Location recorded! ' + e.latLng, 4000)
    console.log(e.latLng.lat);
    placeMarkerAndPanTo(e.latLng, map);
  });


}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

// adds a marker on map when user clicks on a place on the map
function placeMarkerAndPanTo(latLng, map) {
  var marker = new google.maps.Marker({
    position: latLng,
    map: map
  });
  map.panTo(latLng);
}
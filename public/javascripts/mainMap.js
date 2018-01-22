
function initMap() {
  latLng = new google.maps.LatLng(49, 123)

  var styleBright = [{"featureType":"water","stylers":[{"color":"#19a0d8"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"},{"weight":6}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#e85113"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efe9e4"},{"lightness":-40}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#efe9e4"},{"lightness":-20}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"lightness":100}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"lightness":-100}]},{"featureType":"road.highway","elementType":"labels.icon"},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape","stylers":[{"lightness":20},{"color":"#efe9e4"}]},{"featureType":"landscape.man_made","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"lightness":100}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"lightness":-100}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"hue":"#11ff00"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"lightness":100}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"hue":"#4cff00"},{"saturation":58}]},{"featureType":"poi","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#f0e4d3"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#efe9e4"},{"lightness":-25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#efe9e4"},{"lightness":-10}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"simplified"}]}]

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 11,
    gestureHandling: 'cooperative',
    disableDefaultUI: true,
    styles: styleBright
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

  /* map.addListener('click', function(e) {
   placeMarkerAndPanTo(e.latLng, map);
 }); */

  for (var i = 0; i < spots.length; i++) { // loop through all the locations and render a marker
    var outlet = "No";
    var date = (spots[i].date).toString().substring(0, 10);
    if (spots[i].isOutlet) { outlet = "Yes"; }

    if (spots[i].name == null) {
      addMarker(spots[i].coords, spots[i].address, spots[i]._id, spots[i].points, spots[i].type, spots[i].goodFor, outlet, date, spots[i].personPosting);
    } else {
      addMarker(spots[i].coords, spots[i].name, spots[i]._id, spots[i].points, spots[i].type, spots[i].goodFor, outlet, date, spots[i].personPosting);

    }
  }

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

// adds a marker as well as an info box containing the rating of the spot
function addMarker(coords, address, id, points, type, goodFor, hasOutlet, date, personPosting) {
  var upvote = "/upvote/" + id;
  // string that is used to render the html in the info box
  var contentString2 = '<div id="content" class="info"><div class="row"><div class="col s2"><br>' +
  '<form action="/upvote/'+ id +'" method="POST">'+
  '<input class="vote-button up" type="submit" name="upvote" value="↑"/></form><b style="padding-left: 10px;">'+ points +
  '</b><form action="/downvote/'+ id +'" method="POST">'+
  '<input class="vote-button down" type="submit" name="downvote" value="↓"/>'+
  '</form></div>' + '<div class="col s10" id="text"><br><b>' + address + '</b>'+
  '<p><i class="inline-icon material-icons">filter_hdr</i>Spot type: <b>' + type + '</b></p>'+
    '<p><i class="inline-icon material-icons">flight</i>Flying style: <b>' + goodFor + '</b></p>'+
  '<p><i class="inline-icon material-icons">visibility</i>  <a href="/view/' + id + '">View spot...</a></p></div></div><div class="divider"></div></div></div></div>'+
  '</div><br></div><div class="right-align"> Spot added by ' + personPosting + ' on ' + date + '</div></div>' ;

  var infowindow = new google.maps.InfoWindow({
    content: contentString2
  });

  var icon = {
    url: "https://i.imgur.com/2b7gHaQ.png", // url
    scaledSize: new google.maps.Size(50, 50)
  };

  var marker = new google.maps.Marker({
     position: coords,
     map: map,
     type: type,
     goodFor: goodFor
  });

  allMarkers.push(marker);

  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

}

function filterMarkersStyle(goodFor) {
  console.log(goodFor);
  for (i = 0; i < spots.length; i++) {
        marker = allMarkers[i];
        // If is same category or category not picked
        if (marker.goodFor == goodFor || goodFor.length === 0) {
            marker.setVisible(true);
        }
        // Categories don't match
        else {
            marker.setVisible(false);
        }
    }
}

function filterMarkersType(type) {
  console.log(type);
  for (i = 0; i < spots.length; i++) {
        marker = allMarkers[i];
        // If is same category or category not picked
        if (marker.type == type || type.length === 0) {
            marker.setVisible(true);
        }
        // Categories don't match
        else {
            marker.setVisible(false);
        }
    }
}


function initMap() {
  latLng = new google.maps.LatLng(49, 123)

  map = new google.maps.Map(document.getElementById('map'), {
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
  var contentString2 = '<div id="content" class="info"><div class="row"><div class="col s1.5"><br>' +
  '<form action="/upvote/'+ id +'" method="POST">'+
  '<input class="vote-button up" type="submit" name="upvote" value="↑"/></form><b style="padding-left: 10px;">'+ points +
  '</b><form action="/downvote/'+ id +'" method="POST">'+
  '<input class="vote-button down" type="submit" name="downvote" value="↓"/>'+
  '</form></div>' + '<div class="col s10.5" id="text"><br><b>' + address + '</b><ul><li>This spot is good for <b>' + goodFor + '</b> and is a <b>' + type +
  '</b>.</li><li> <div>Are you able to charge packs here: <b>' + hasOutlet +
  '</b></li>'+
  '<li><a href="/view/' + id + '">View spot...</a></li></ul></div></div><div class="divider"></div></div></div></div>'+
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
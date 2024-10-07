function initMap() {
  var riversState = { lat: 4.7513, lng: 6.0715 }; // Coordinates for Rivers State, Nigeria
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: riversState,
  });

  var marker = new google.maps.Marker({
    position: riversState,
    map: map,
  });
}

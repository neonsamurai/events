
Template.eventDetails.event = function () {
  console.log(Session.get('event'));
  return Session.get('event');
};

/**
 * Test implementation for Google maps API
 */
Template.gmaps.rendered = function() {
  var event = Session.get('event');
  console.log(event.where);
  var geocoder = new google.maps.Geocoder();
  var loc;
  var mapOptions;
  var map;
  geocoder.geocode({
    address: event.where
  },

  function(result, status) {
    loc = result[0].geometry.location;
    mapOptions = {
      zoom: 16,
      center: new google.maps.LatLng(loc.lat(), loc.lng()),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(
      document.getElementById('map_canvas'),
      mapOptions
      );
    marker = new google.maps.Marker({
      position: mapOptions.center,
      map: map,
      title: event.title
  });
  });
};


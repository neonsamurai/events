/**
 * Publishes selected Event object in the Session object for access by other
 * template helpers.
 * @return {Object} Selected event object.
 */
Template.eventDetails.event = function () {
  return Session.get('event');
};

Template.event_edit_form.event = function() {
  return Session.get('event');
};

/**
 * Google maps configuration.
 */
Template.gmaps.rendered = function() {
  var event = Session.get('event');
  var geocoder = new google.maps.Geocoder();
  var loc;
  var mapOptions;
  var map;
  geocoder.geocode({
    address: event.where
  },
  /**
   * Geocoder callback to invoke map configuration. See
   * http://goo.gl/rTLmJ for details
   *
   * @param  {Object} result Geocoder result object.
   * @param  {String} status Return status code from Geocoding.
   */
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


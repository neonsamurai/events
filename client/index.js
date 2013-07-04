/**
 * Controllers for template 'eventsList'.
 *
 */

/**
 * Gets all valid Event objects for display in the list view.
 * This means all events where:
 *   - the event is public
 *   OR
 *   - the user is the event's owner
 *   OR
 *   - the user is on the invite list
 * @return {Array} Array of Event objects
 */
Template.eventsList.eventList = function() {
  var user = Meteor.user();
  var email;
  if (user) {
    email = user.emails && user.emails[0].address ||
      user.services.google.email || user.services.facebook.email;
    return Events.find({
      $or: [{
          public: true
        }, {
          "owner._id": user._id
        }, {
          invited: {
            $in: [email]
          }
        }
      ]
    }).fetch();
  } else {
    return Events.find({
      public: true
    });
  }


};

// --- end template 'eventsList' ---------------------------------------------
// ---------------------------------------------------------------------------

Template.eventsList.eventIsVisible = function(eventId) {
  var event = Events.findOne(eventId);
  var email = Meteor.user().services.google.email ||
    Meteor.user().services.facebook.email || Meteor.user().emails[0].address;
  return event.public || event.owner == Meteor.userId() ||
    _.contains(event.invited, email);
};


/**
 * Controllers for template 'navbar'.
 *
 * Navbar is rendered on the top of the page. It contains all buttons and
 * dropdowns for the user.
 */
Template.navbar.loggedIn = function() {
  return Meteor.userId();
};

Template.navbar.events({
  'click #event_create': function() {
    Session.set('showEventCreate', true);
  }
});
// --- end template 'navbar' -------------------------------------------------
// ---------------------------------------------------------------------------


/**
 * Controllers for template 'event_create_form'.
 *
 * This template is rendered when a users clicks the 'Event erstellen' button.
 */

Template.event_create_form.events({
  'click .btn-primary': function(event, template) {
    console.log(template);
    // get form data...
    var title = template.find('#inputTitle').value;
    var description = template.find('#inputDescription').value;
    var when = template.find('#inputDateWhen').value;
    var hashtag = template.find('#inputHashtag').value;
    var where = template.find('#inputAdress').value;
    var publicToggle = template.find('#inputPublicToggle').checked;
    // prepare event object
    var eventData = {
      title: title,
      description: description,
      when: when,
      hashtag: hashtag,
      where: where,
      public: publicToggle
    };
    // invoke server create event method
    Meteor.call('createEvent', eventData);
    template.find('#eventCreateForm').reset();
  }
});

/**
 * This callback is fired, when the template has been rendered and the DOM is
 * ready. It adds the date time picker control to the corresponding input
 * field in the form.
 * @return {none} nothing is returned.
 */
Template.event_create_form.rendered = function() {
  $('#inputDateWhen').datetimepicker({
    format: 'dd-mm-yyyy hh:ii',
    language: 'de'
  });
};
// --- end template 'event_create_form' --------------------------------------
// ---------------------------------------------------------------------------


Template.smallMap.rendered = function() {
  var event = this.data;
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
      disableDefaultUI: true,
      draggable: false,
      zoom: 16,
      center: new google.maps.LatLng(loc.lat(), loc.lng()),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(
      document.getElementById(event._id),
      mapOptions);
    marker = new google.maps.Marker({
      position: mapOptions.center,
      map: map,
      title: event.title
    });
  });
};
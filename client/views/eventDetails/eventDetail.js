/**
 * Publishes selected Event object in the Session object for access by other
 * template helpers.
 * @return {Object} Selected event object.
 */
Template.eventDetails.event = function() {
  return Session.get('event');
};


Template.event_edit_form.selectedEvent = function() {
  return Session.get('event');
};

Template.rsvpWidget.attending = function() {
  var selectedEvent = Session.get('event');
  var attending = false;
  _.each(selectedEvent.rsvps, function(rsvp) {
    if (rsvp._id === Meteor.user()._id) {
      attending = true;
    }
  });
  return attending;
};

Template.rsvpWidget.events({
  'click #attend': function() {
    Meteor.call('attend', Session.get('event')._id);
  },
  'click #unattend': function() {
    Meteor.call('unattend', Session.get('event')._id);
  }
});

Template.eventInviteForm.canInvite = function() {
  var event = Session.get('event');
  console.log(event.public);
  return !event.public && Meteor.userId() === event.owner._id;
};

Template.eventInviteForm.invitations = function() {
  return Session.get('event').invited;
};

Template.eventInviteForm.events({
  'submit': function(event, template) {
    event.preventDefault();
    var inviteesInput = template.find('#inputInvitees').value;
    var inviteesInputArray = inviteesInput.split(',');
    var inviteesOutputArray = [];

    _.each(inviteesInputArray, function(invitee) {
      // trim whitespace from emails
      var email = $.trim(invitee);
      // push emails only if valid.
      if (!(email === '' ||
        email.indexOf('@') == -1 ||
        email.indexOf('.') == -1)) {
        inviteesOutputArray.push($.trim(invitee));
      }
    });
    console.log(inviteesOutputArray);
    template.find('#inviteForm').reset();
    _.each(inviteesOutputArray, function(email) {
      console.log(email);
      Meteor.call('invite', Session.get('event')._id, Meteor.userId(), email);
    });
  },
  'click .icon-remove': function(event, template) {
    var invitee = event.toElement.id;
    Meteor.call('uninvite',
      Session.get('event')._id, Meteor.userId(), invitee);
  }
});

Template.event_edit_form.events({
  'click .btn-primary': function(event, template) {
    var thisEvent = Session.get('event');
    // get form data...
    var title = template.find('#inputEditTitle').value;
    var description = template.find('#inputEditDescription').value;
    var when = template.find('#inputEditDateWhen').value;
    var hashtag = template.find('#inputEditHashtag').value;
    var where = template.find('#inputEditAdress').value;
    var publicToggle = template.find('#inputEditPublicToggle').checked;
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
    Events.update(thisEvent._id, {
      $set: eventData
    });
  }
});

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
      mapOptions);
    marker = new google.maps.Marker({
      position: mapOptions.center,
      map: map,
      title: event.title
    });
  });
};
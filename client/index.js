/**
 * Controllers for template 'page'.
 *
 * This is the global template which is parent to all other templates.
 */

/**
 * Generates a customised welcome message for each user on login.
 * @return {String} Welcome message
 */
Template.page.eventList = function() {
  return Events.find().fetch();
};

Template.page.events({
  'click .btn': function() {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined') console.log("You pressed a button");
  }
});
// --- end template 'page' ---------------------------------------------------
// ---------------------------------------------------------------------------



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
    if (typeof console !== 'undefined') console.log("You pressed the 'Event erstellen' button.");
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
    console.log('EventCreateForm.submit...');
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
    // invoke server method
    console.log('Calling createEvent...');
    Meteor.call('createEvent', eventData);
  }
});

/**
 * This callback is called, when the template has been rendered and the DOM is
 * ready. It adds the date time picker control to the corresponding input
 * field in the form.
 * @return {none} nothing is returned.
 */
Template.event_create_form.rendered = function() {
  console.log('event form rendered');
  $('#inputDateWhen').datetimepicker({
    format: 'dd-mm-yyyy hh:ii',
    language: 'de'
  });
};
// --- end template 'event_create_form' --------------------------------------
// ---------------------------------------------------------------------------


/**
 * Test implementation for Google maps API
 */
Template.gmaps.rendered = function() {
  var geocoder = new google.maps.Geocoder();
  var loc;
  var mapOptions;
  var map;
  geocoder.geocode({
    address: 'Luxemburger Straße 34, Berlin'
  },

  function(result, status) {
    console.log(result[0].geometry.location);
    console.log(status);
    loc = result[0].geometry.location;
    console.log(loc.lat());
    mapOptions = {
      zoom: 16,
      center: new google.maps.LatLng(loc.lat(), loc.lng()),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map_canvas'),
    mapOptions);
    console.log(map);
  });
};

Meteor.pages({

},
{
  defaults: {
    layout: 'page'
  }
});
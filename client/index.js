/**
 * Controllers for template 'eventsList'.
 *
 */

/**
 * Gets all Event objects for display in the list view.
 * @return {Array} Array of Event objects
 */
Template.eventsList.eventList = function() {
  return Events.find().fetch();
};

// --- end template 'eventsList' ---------------------------------------------
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



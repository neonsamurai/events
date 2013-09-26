/**
 * This is greatly inspired by the Meteor Parties example which can be found
 * here: http://goo.gl/qydjY
 */

// Create a Meteor.Collection to hold our Events.
Events = new Meteor.Collection("Events");

/**
 * Permissions configuration of our Events collection. This gives us fine
 * control of which operations are allowed by whom via the Collections API.
 * Other operations must be defined as Meteor.methods.
 * @return {Boolean}  true if allowed. false if not allowed.
 */
Events.allow({
  /**
   * Do not allow any wild inserts. Use createEvent method instead!
   * @param  {String} userId ID of logged in user.
   * @param  {Object} event  Event object.
   * @return {false}        API inserts are never allowed.
   */
  insert: function(userId, event) {
    return false;
  },
  /**
   * Users can only update their own events. And they cannot put users on the
   * rsvps list. They have to do it themselves.
   * @param  {String} userId   ID of logged in user.
   * @param  {Object} event    Event object.
   * @param  {Array} fields   Fields to be changed.
   * @param  {String} modifier Description of the change in mongoDB syntax.
   * @return {Boolean}          Whether or not to allow the update.
   */
  update: function(userId, event, fields, modifier) {
    console.log('UPDATING...');
    if (userId !== event.owner._id) {
      return false; // kein Besitzer
    }
    // List of allowed fields to modify
    var allowed = [
        "title",
        "description",
        "hashtag",
        "where",
        "when",
        "public"
    ];
    // Check for disallowed fields
    if (_.difference(fields, allowed).length) {
      return false;
    }
    return true;
  },
  /**
   * Users can only delete their own events.
   * @param  {String} userId  ID of logged in user.
   * @param  {Object} event   Event object.
   * @return {Boolean}        Wheter or not to allow the delete.
   */
  remove: function(userId, event) {
    return event.owner === userId;
  }
});

/**
 * Lists methods which allow advanced operations or wrap disallowed operations
 * to avoid abuse.
 */
Meteor.methods({
  /**
   * Provides validation and creates an event object.
   * @param  {Object} options   Form data.
   * @return {Events.insert()}  Preconfigured Events.insert() method.
   */
  createEvent: function(options) {
    options = options || {};
    console.log(options);
    // Validate the Event object.
    // Is a field missing?
    if (!(
      // Is there a title?
      typeof options.title === "string" && 
          options.title.length &&
      // Is there a description?
      typeof options.description === "string" &&
        options.description.length &&
      // Is there a location?
      typeof options.where === "string" && 
        options.where.length &&
      // Is there a date?
      typeof options.when === "string" && 
        options.when.length
    ))
      throw new Meteor.Error(400, "Required parameter missing");
    if (options.title.length > 100)
      throw new Meteor.Error(413, "Title too long");
    if (options.description.length > 1000)
      throw new Meteor.Error(413, "Description too long");
    if (options.where.length > 1000)
      throw new Meteor.Error(413, "Address too long.");
    if (!this.userId)
      throw new Meteor.Error(403, "You must be logged in");

    return Events.insert({
      owner: Meteor.user(),
      title: options.title,
      hashtag: options.hashtag,
      description: options.description,
      where: options.where,
      when: options.when,
      public: options.public,
      invited: [],
      rsvps: [Meteor.user()]
    });
  },

  /**
   * Inserts the user object into the rsvps list.
   * @param  {String} eventId ID of the selected event object.
   * @return {Events.update()}         Preconfigured Events.update() method.
   */
  attend: function(eventId) {
    return Events.update({
      _id: eventId
    }, {
      $push: {
        rsvps: Meteor.user()
      }
    });
  },

  unattend: function(eventId) {
    return Events.update({
      _id: eventId
    }, {
      $pull: {rsvps: {_id: {$in: [Meteor.user()._id]}}}
    });
  },

  invite: function(eventId, userId, invitee) {
    var event = Events.findOne(eventId);
    if (!event || event.owner._id !== userId)
      throw new Meteor.Error(404, "No such event");
    if (event.public)
      throw new Meteor.Error(400,
        "That event is public. No need to invite people.");
    if (userId == event.owner._id && !_.contains(event.invited, invitee)) {
      Events.update(eventId, {
        $addToSet: {
          invited: invitee
        }
      });
    }
  },

  uninvite: function (eventId, userId, invitee) {
    var event = Events.findOne(eventId);
    if (userId == event.owner._id && _.contains(event.invited, invitee)) {
      Events.update({
        _id: eventId
      }, {
        $pull: {
          invited: invitee
        }
      });
    }
  },

  // Users
  displayName: function(user) {
    if (user.profile && user.profile.name)
      return user.profile.name;
    return user.emails[0].address;
  }
});

var contactEmail = function(user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;
  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;
  return null;
};

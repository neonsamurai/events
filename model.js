Events = new Meteor.Collection("Events");

Events.allow({
  insert: function (userId, event){
    return false;
  },
  update: function (userId, event, fields, modifier) {
    if (userId !==event.owner)
      return false; // kein Besitzer

    var allowed = ["title", "decription", "hashtag", "where", "when", "public"];
    if (_.difference(fields, allowed).length)
      return false;
    return true;
  },

  remove: function(userId, event) {
    // Events kann nur der Besitzer löschen
    return event.owner === userId;
  }
});

attending = function(event) {
  return (_.groupBy(event.rsvps, 'rsvp').yes || []).length;
};

Meteor.methods({
  createEvent: function (options) {
    options = options || {};
    console.log(options);
    if (! (typeof options.title === "string" && options.title.length &&
           typeof options.description === "string" &&
           options.description.length &&
           typeof options.where === "string" && options.where.length &&
           typeof options.when === "string" && options.when.length))
      throw new Meteor.Error(400, "Required parameter missing");
    if (options.title.length > 100)
      throw new Meteor.Error(413, "Title too long");
    if (options.description.length > 1000)
      throw new Meteor.Error(413, "Description too long");
    if (options.where.length > 1000)
      throw new Meteor.Error(413, "Address too long.");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");

    return Events.insert({
      owner: this.userId,
      title: options.title,
      hashtag: options.hashtag,
      description: options.description,
      where: options.where,
      when: options.when,
      public: options.publicToggle,
      invited: [],
      rsvps: []
    });
  },

  invite: function (eventId, userId) {
    var event = Events.findOne(eventId);
    if (! event || event.owner !== this.userId)
      throw new Meteor.Error(404, "No such event");
    if (event.public)
      throw new Meteor.Error(400,
                             "That event is public. No need to invite people.");
    if (userId !== event.owner && ! _.contains(event.invited, userId)) {
      Events.update(eventId, { $addToSet: { invited: userId } });

      var from = contactEmail(Meteor.users.findOne(this.userId));
      var to = contactEmail(Meteor.users.findOne(userId));
      if (Meteor.isServer && to) {
        // This code only runs on the server. If you didn't want clients
        // to be able to see it, you could move it to a separate file.
        Email.send({
          from: "noreply@example.com",
          to: to,
          replyTo: from || undefined,
          subject: "EVENT: " + event.title,
          text:
"Hey, I just invited you to '" + event.title + "' Events" +
"\n\nCome check it out: " + Meteor.absoluteUrl() + "\n"
        });
      }
    }
  },

// Users
displayName: function (user) {
  if (user.profile && user.profile.name)
    return user.profile.name;
  return user.emails[0].address;
}});

var contactEmail = function (user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;
  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;
  return null;
};

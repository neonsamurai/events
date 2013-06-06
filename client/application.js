
setEvent = function(context) {
    var _id = context.params.event_id;
    console.log(context);
    Session.set("event", Events.findOne(_id));
};

Meteor.pages({
  '/': 'eventsList',
  '/events/:event_id': {to: 'eventDetails', before: setEvent}
}, {
  defaults: {
    layout: 'page'
  }
});
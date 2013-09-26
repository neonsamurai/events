/**
 * Gets the event ID from the routing URL and finds the corresponding event
 * object.
 * @param  {Object} context Page routing object.
 * @return {Object}         Event object.
 */
setEvent = function(context) {
  var _id = context.params.event_id;
  Session.set("event", Events.findOne(_id));
};

/**
 * Page routing configuration.
 *
 * 'route': 'template' | {config}
 *
 *  - to: 'template to use'
 *  - before: 'functions to invoke before routing'
 */
Meteor.pages({
  '/': 'eventsList',
  '/about': 'aboutPage',
  '/contact': 'contactPage',
  '/events/:event_id': {
    to: 'eventDetails',
    before: setEvent
  }
}, {
  defaults: {
    layout: 'page'
  }
});

Template.page.greeting = function () {
  return "Willkommen bei Events!.";
};

Template.page.events({
  'click .btn' : function () {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined')
      console.log("You pressed a button");
  }
});

Template.navbar.events({
  'click #event_create' : function () {
    if (typeof console !== 'undefined')
      console.log("You pressed the 'Event erstellen' button.");
    Session.set('showEventCreate', true);
  }
});
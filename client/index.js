Template.page.greeting = function () {
  return "Welcome to cool events.";
};

Template.page.events({
  'click input' : function () {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined')
      console.log("You pressed the button");
  }
});

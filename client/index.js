/**
 * Controllers for template 'page'.
 *
 * This is the global template which is parent to all other templates.
 */

/**
 * Generates a customised welcome message for each user on login.
 * @return {String} Welcome message
 */
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
// --- end template 'page' -----------------------------------------------------
// -----------------------------------------------------------------------------



/**
 * Controllers for template 'navbar'.
 *
 * Navbar is rendered on the top of the page. It contains all buttons and
 * dropdowns for the user.
 */
Template.navbar.events({
  'click #event_create' : function () {
    if (typeof console !== 'undefined')
      console.log("You pressed the 'Event erstellen' button.");
    Session.set('showEventCreate', true);
  }
});
// --- end template 'navbar' ---------------------------------------------------
// -----------------------------------------------------------------------------



/**
 * Controllers for template 'user_loggedout'.
 *
 * This template renders the dropdown when the user is not logged in. It
 * contains the various login buttons, the login form and the registration form.
 */

/**
 * Event handlers for
 * - Facebook login
 * - Google login
 * - Login form for local account
 * - Registration button for local account
 */
Template.user_loggedout.events({
  'click #login_facebook' : function () {
    console.log('Log in with Facebook');
  },
  'click #login_google' : function () {
     console.log('Log in with Google');
  },
  'submit' : function (event, template) {
    event.preventDefault();
    var email = template.find('#form_email').value;
    var password = template.find('#form_password').value;
    console.log('Login with ' + email + ' / ' + password);
    console.log(event);
    console.log(template);
  },
  'click #create_user' : function () {
    console.log('Create User...');
  }
});
// --- end template 'user_loggedout' -------------------------------------------
// -----------------------------------------------------------------------------



/**
 * Controllers for template 'event_create_form'.
 *
 * This template is rendered when a users clicks the 'Event erstellen' button.
 */

/**
 * This callback is called, when the template has been rendered and the DOM is
 * ready. It adds the date time picker control to the corresponding input field
 * in the form.
 * @return {none} nothing is returned.
 */
Template.event_create_form.rendered = function () {
  $('#inputDateWhen').datetimepicker({
    format: 'dd-mm-yyyy hh:ii',
    language: 'de'
  });
};
// --- end template 'event_create_form' ----------------------------------------
// -----------------------------------------------------------------------------
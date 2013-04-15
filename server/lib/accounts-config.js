/**
 * Configuration for external login services.
 */

// Facebook login
Accounts.loginServiceConfiguration.remove({
  service: 'facebook'
});

Accounts.loginServiceConfiguration.insert({
  service: 'facebook',
  appId: Meteor.settings.facebook.appId,
  secret: Meteor.settings.facebook.secret
});

// Google login
Accounts.loginServiceConfiguration.remove({
  service: 'google'
});

Accounts.loginServiceConfiguration.insert({
  service: 'google',
  clientId: Meteor.settings.google.clientId,
  secret: Meteor.settings.google.secret
});


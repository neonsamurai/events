/**
 * Configuration for external login services.
 */

// Facebook login
Accounts.loginServiceConfiguration.remove({
  service: 'facebook'
});

Accounts.loginServiceConfiguration.insert({
  service: 'facebook',
  appId: '358902167563107',
  secret: 'f97d90b6d46764f519850023167780e5'
});

// Google login
Accounts.loginServiceConfiguration.remove({
  service: 'google'
});

Accounts.loginServiceConfiguration.insert({
  service: 'google',
  clientId: '643584666489.apps.googleusercontent.com',
  secret: 'RFkXdFYHfeUMHSE6vdRlQaLI'
});


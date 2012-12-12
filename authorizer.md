Facebook Authorizer
====================

Authorizer provides a mechanism for getting access to the Facebook SDK. It takes care of loading and auth'ing your apps.

It:
* Makes it easy to ensure that tasks are executed in the right order.
* Ensures that two components that require the Facebook SDK do not conflict with each other.
* Allows you to avoid the nasty Facebook boilerplate loader code

It automatically retrieves the Facebook app id from the document.

Built Files
-----------
http://facebook-web-clients.appspot.com/static/facebook-authorizer-1.0.js
http://facebook-web-clients.appspot.com/static/facebook-authorizer-1.0.min.js

Dependencies
------------

Authorizer needs script loader used for loading the Facebook SDK. It will use either RequireJS or
Curl, depending on which is available. It also relies on ECMAScript5 functions (Function.prototype.bind).

getInstance()
---------------

Gets an instance of authorizer which is shared between all clients in the browser.

```
require(["facebook-authorizer-1.0.js"], function () {
        var authorizer = guardian.facebook.Authorizer.getInstance();
    });
```

authorizer.getLoginStatus()
----------------

To assess if you're logged in or not.  If the Facebook SDK is not already on the page, authorizer will insert it for you.

After checking login status, authorizer will fetch basic user data (see below)

```
authorizer.getLoginStatus()

authorizer.onConnected.then(function(FB) {
    FB.api(...);
});

authorizer.onNotLoggedIn.then(function() {
    console.log("Please log in");
});

authorizer.onNotAuthorized.then(function() {
    console.log("Please authorize the Guardian!");
});
```

authorizer.login()
----------------

If not logged in, prompts your user to log into facebook and authorize the relevent Guardian app.

This may generate a popup dialog prompting the user for their username and password. To prevent popup blockers from
supressing the dialog this call must be made as a direct result of a user action (e.g. a button click)
and within the same execution scope (ie. not resulting from a callback).

After logging in, authorizer will fetch basic user data (see below)

```
authorizer.login().then(function (FB) {
    FB.api(...);
});
```

authorizer.onUserDataLoaded
----------------

A promise like object which is resolved following a call to login or getLoginStatus. You can register it before or after the call to login or getLoginStatus.

```
authorizer.login();

authorizer.onUserDataLoaded.then(function(userData) {
    console.log("Hi " + userData.first_name);
});
```

authorizer.onConnected
----------------

A promise like object which is resolved once the user is logged in and fully auth'd the Guardian app. It gives you a reference to the FB object.

```
authorizer.login();

authorizer.onConnected.then(function(FB) {
    FB.api(...);
});
```

authorizer.onNotLoggedIn
----------------

A promise like object which is resolved if the user is not logged in

```
authorizer.notLoggedIn.then(function() {
    console.log("Please log in");
});
```

authorizer.onNotAuthorized
----------------

A promise like object which is resolved if the user is logged in but not authorized to use the app.

```
authorizer.onNotAuthorized.then(function() {
    console.log("Please use the Guardian with Facebook!");
});
```
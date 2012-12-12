Facebook Web Clients
====================

A set of front end components for performing social actions.

Building
--------

The Javascript files are built with GruntJS (npm install gruntjs)

To build and run the tests, enter the following from the project base dir:

```
grunt test
```

Running Locally
---------------
Note that you will need to be on a domain expected by the appropriate guardian facebook app for the auth to be successful.

For instance, for "theguardian" facebook app:

Add the following to your /etc/hosts:
```
127.0.0.1 fwc.guardian.co.uk
```

Then visit http://fwc.guardian.co.uk:8080/test/demo.html


Facebook Users
--------------

Here's a test user FB account:
vkokdic_wongson_1354618831@tfbnw.net
PW: 123456

Micro App
---------

Slot: above-article-embed

Name: facebook-agree-disagree-component

On App Engine
-------------

http://facebook-web-clients.appspot.com/test/demo.html

JS API
------

Authorizer provides a mechanism for getting access to the FB object. It takes care of loading and auth'ing your apps and
makes it easy to ensure that tasks are executed in the right order.

It automatically retrieves the facebook app id from the document.

```
require([baseURI + "/static/facebook-authorizer-1.0.js"],
    function () {

        var authorizer = guardian.facebook.Authorizer.getInstance();

        authorizer.getLoginStatus().then(function (FB) {
            FB.api(...);
        });

        authorizer.onUserDataLoaded.then(function(userData)) {
            console.log("Hi, " + userData.first_name);
        });

    });
```




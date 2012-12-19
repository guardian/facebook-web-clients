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

Installing as a Micro App
-------------------------

Section: Football
Slot: above-standfirst

Name: facebook-agree-disagree-component
Rule type: Always


Section: Comment is free
Slot: above-standfirst

Name: facebook-agree-disagree-component
Rule type: Always


On App Engine
-------------

http://facebook-web-clients.appspot.com/test/demo.html

Authorizer API
--------------

https://github.com/guardian/facebook-web-clients/blob/master/authorizer.md



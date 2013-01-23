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

Installing as a Micro App
-------------------------

### Add the MicroApp

Here is the definition:
https://raw.github.com/guardian/facebook-web-clients/master/src/scripts/components/vote/microapp/microapp.xml

Name: facebook-components
Provider: Guardian
Root URI: http://facebook-web-clients.appspot.com/
Documentation URI: https://raw.github.com/guardian/facebook-web-clients/master/README.md
Code Location: https://github.com/guardian/facebook-web-clients
Owner: Core

You can then add the component to any article page.

On App Engine
-------------

http://facebook-web-clients.appspot.com/test/demo.html

Authorizer API
--------------

https://github.com/guardian/facebook-web-clients/blob/master/authorizer.md



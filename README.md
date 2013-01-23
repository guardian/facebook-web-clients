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

* Name: facebook-components
* Provider: Guardian
* Root URI: http://facebook-web-clients.appspot.com/
* Documentation URI: https://raw.github.com/guardian/facebook-web-clients/master/README.md
* Code Location: https://github.com/guardian/facebook-web-clients
* Owner: Core
* XML:
  https://raw.github.com/guardian/facebook-web-clients/master/src/scripts/components/vote/microapp/microapp.xml
* Ignore root cms path, section etc.

You can then add a facebook vote to any article.

There are three types of vote to choose from:

### Think (Headline) is Likely / Unlikely on Facebook
If the headline is making a prediction that the user can decide is likely or unlikely to happen.

### Agree / Disagree (with Headline) on Facebook
If there is a controversial headline (which poses a yes / no question). For instance the user
can agree or disagree with a headline such as "Should there be an EU Referendum?"

### Agree / Disagree (with Author's Opinion) on Facebook
If the opinion of the author is controversial (as opposed to the topic). The user can elect to agree or disagree with
the author's opinion. This should be placed at the bottom of the article so the user can read the full article before
making up their mind.

URLS
-------------

### Demo Page
http://facebook-web-clients.appspot.com/test/demo.html

### Facebook Authorizer API
https://github.com/guardian/facebook-web-clients/blob/master/authorizer.md



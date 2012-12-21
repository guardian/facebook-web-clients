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

### Football Section

Go to Tools > Edit Slot Rules
Section: Football
Slot: above-standfirst
Component: facebook-components: Agree / Disagree (with Headline) on Facebook
Rule type: Has Tag: Rumour Mill (series)

### Commentisfree Section

Add the following tags
* controversial-headline ("Controversial Headlines")
* controverail-opinion ("Controversial Opinions")

Go to Tools > Edit Slot Rules
Section: Commentisfree
Slot: above-standfirst
Component: facebook-components: Agree / Disagree (with Headline) on Facebook
Rule type: Has Tag: controversial-headline (keyword)

Section: Common
Slot: below-article-embed
Component: facebook-components: Agree / Disagree (with Opinion) on Facebook
Rule type: Has Tag: controversial-opinion (keyword)
Order: At the top

On App Engine
-------------

http://facebook-web-clients.appspot.com/test/demo.html

Authorizer API
--------------

https://github.com/guardian/facebook-web-clients/blob/master/authorizer.md



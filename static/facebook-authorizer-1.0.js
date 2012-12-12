/* Facebook Web Clients 1.0 */

ensurePackage("guardian.facebook");
/**
 * EventEmitter v4.0.3 - git.io/ee
 * Oliver Caldwell
 * MIT license
 */

;(function(exports) {
    // JSHint config - http://www.jshint.com/
    /*jshint laxcomma:true*/
    /*global define:true*/

    // Place the script in strict mode
    'use strict';

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class Manages event registering and emitting.
     */
    function EventEmitter(){}

    // Shortcuts to improve speed and size

    // Easy access to the prototype
    var proto = EventEmitter.prototype

    // Existence of a native indexOf
        , nativeIndexOf = Array.prototype.indexOf ? true : false;

    /**
     * Finds the index of the listener for the event in it's storage array
     *
     * @param {Function} listener Method to look for.
     * @param {Function[]} listeners Array of listeners to search through.
     * @return {Number} Index of the specified listener, -1 if not found
     */
    function indexOfListener(listener, listeners) {
        // Return the index via the native method if possible
        if(nativeIndexOf) {
            return listeners.indexOf(listener);
        }

        // There is no native method
        // Use a manual loop to find the index
        var i = listeners.length;
        while(i--) {
            // If the listener matches, return it's index
            if(listeners[i] === listener) {
                return i;
            }
        }

        // Default to returning -1
        return -1;
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     *
     * @param {String} evt Name of the event to return the listeners from.
     * @return {Function[]} All listener functions for the event.
     * @doc
     */
    proto.getListeners = function(evt) {
        // Create a shortcut to the storage object
        // Initialise it if it does not exists yet
        var events = this._events || (this._events = {});

        // Return the listener array
        // Initialise it if it does not exist
        return events[evt] || (events[evt] = []);
    };

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     *
     * @param {String} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     * @doc
     */
    proto.addListener = function(evt, listener) {
        // Fetch the listeners
        var listeners = this.getListeners(evt);

        // Push the listener into the array if it is not already there
        if(indexOfListener(listener, listeners) === -1) {
            listeners.push(listener);
        }

        // Return the instance of EventEmitter to allow chaining
        return this;
    };

    /**
     * Alias of addListener
     * @doc
     */
    proto.on = proto.addListener;

    /**
     * Removes a listener function from the specified event.
     *
     * @param {String} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     * @doc
     */
    proto.removeListener = function(evt, listener) {
        // Fetch the listeners
        // And get the index of the listener in the array
        var listeners = this.getListeners(evt)
            , index = indexOfListener(listener, listeners);

        // If the listener was found then remove it
        if(index !== -1) {
            listeners.splice(index, 1);

            // If there are no more listeners in this array then remove it
            if(listeners.length === 0) {
                this._events[evt] = null;
            }
        }

        // Return the instance of EventEmitter to allow chaining
        return this;
    };

    /**
     * Alias of removeListener
     * @doc
     */
    proto.off = proto.removeListener;

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added.
     *
     * @param {String|Object} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     * @doc
     */
    proto.addListeners = function(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     *
     * @param {String|Object} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     * @doc
     */
    proto.removeListeners = function(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     * @doc
     */
    proto.manipulateListeners = function(remove, evt, listeners) {
        // Initialise any required variables
        var i
            , value
            , single = remove ? this.removeListener : this.addListener
            , multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of it's properties to this method
        if(typeof evt === 'object') {
            for(i in evt) {
                if(evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if(typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while(i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        // Return the instance of EventEmitter to allow chaining
        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     *
     * @param {String} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     * @doc
     */
    proto.removeEvent = function(evt) {
        // Remove different things depending on the state of evt
        if(evt) {
            // Remove all listeners for the specified event
            this._events[evt] = null;
        }
        else {
            // Remove all listeners in all events
            this._events = null;
        }

        // Return the instance of EventEmitter to allow chaining
        return this;
    };

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     *
     * @param {String} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each argument.
     * @return {Object} Current instance of EventEmitter for chaining.
     * @doc
     */
    proto.emitEvent = function(evt, args) {
        // Get the listeners for the event
        // Also initialise any other required variables
        var listeners = this.getListeners(evt)
            , i = listeners.length
            , response;

        // Loop over all listeners assigned to the event
        // Apply the arguments array to each listener function
        while(i--) {
            // If the listener returns true then it shall be removed from the event
            // The function is executed either with a basic call or an apply if there is an args array
            response = args ? listeners[i].apply(null, args) : listeners[i]();
            if(response === true) {
                this.removeListener(evt, listeners[i]);
            }
        }

        // Return the instance of EventEmitter to allow chaining
        return this;
    };

    /**
     * Alias of emitEvent
     * @doc
     */
    proto.trigger = proto.emitEvent;

    exports.EventEmitter = EventEmitter;

}(this));
(function () {

    function RepeatablePromise() {
        this.callbacks = [];
    }

    RepeatablePromise.prototype.invalidate = function () {
        this.args = undefined;
    };

    RepeatablePromise.prototype.resolve = function () {
        this.args = Array.prototype.slice.apply(arguments);
        console.log(this.args);
        var i, numCallbacks = this.callbacks.length;
        for (i = 0; i < numCallbacks; i++) {
            this.callbacks[i].apply(null, this.args);
        }
    };

    RepeatablePromise.prototype.then = function (fn) {
        this.callbacks.push(fn);
        if (this.args !== undefined) {
            fn.apply(null, this.args);
        }
    };

    var permissions = {scope: 'email,publish_actions,publish_stream'};

    /**
     * Provides a means for client scripts to access the Facebook API and authenticate users.
     * @constructor
     */
    function Authorizer() {
        this.authDeferred = new RepeatablePromise();
        this.scriptLoadDeferred = new RepeatablePromise();
        this.userDataDeferred = new RepeatablePromise();
    }

    Authorizer.prototype = Object.create(EventEmitter.prototype);

    /**
     * An access token used to authenticate the user's Facebook session. Note that at present
     * the authenticator does not handle access tokens expiring.
     * @see https://developers.facebook.com/docs/howtos/login/debugging-access-tokens/
     * @type {String}
     */
    Authorizer.accessToken = null;

    /**
     * The user's id which can be used to retrieve further data from the Facebook open graph
     * For instance you could call the following URL: https://graph.facebook.com/{userId}
     * @type {String}
     */
    Authorizer.userId = null;

    /**
     * The Facebook user data object. Includes propertiers for the user's id, name, first_name, last_name, username, gender and locale.
     * You can get the user's profile picture by substituting the username into the following call to the Graph API
     * http://graph.facebook.com/" + userData.username + "/picture
     * @see http://graph.facebook.com/btaylor
     * @type {Object}
     */
    Authorizer.userData = null;

    /**
     * Gets the user to login. This may generate a popup dialog prompting the user for their username and password.
     * To prevent popup blockers from supressing the dialog this call must be made as a direct result of a user action
     * and within the same execution scope (ie not resulting from a callback). Client methods can also subscribe to the
     * following events fired during the login process (see _handleGotLoginStatus)
     *
     * @see https://developers.facebook.com/docs/reference/javascript/FB.login/
     * @return A promise which is resolved once the user has been authenticated and authorized the Guardian app
     */
    Authorizer.prototype.login = function () {
        if (!this.accessToken) {
            this._loadFacebookAPI().then(function (FB) {
                FB.login(this._handleGotLoginStatus.bind(this), permissions);
            }.bind(this))
        }
        return this.authDeferred;
    };

    /**
     * Checks whether the user is logged in and has authorised the app. Returns a promise which is resolved
     * when the user is full connected and authenticated for the app.Client methods can also subscribe to the
     * following events fired during the login process (see _handleGotLoginStatus)
     *
     * @see https://developers.facebook.com/docs/reference/javascript/FB.getLoginStatus/
     * @return A promise which is resolved when the user has been authenticated and authorized the Guardian app
     */
    Authorizer.prototype.getLoginStatus = function () {
        this._loadFacebookAPI().then(function (FB) {
            FB.getLoginStatus(this._handleGotLoginStatus.bind(this), permissions);
        }.bind(this));
        return this.authDeferred;
    };

    /**
     * Returns a promise providing access to the user data.
     * @return {*}
     */
    Authorizer.prototype.whenGotUserData = function () {
        return this.userDataDeferred;
    };

    /* End of public methods */

    var scriptId = 'facebook-jssdk';

    /**
     * Called when the user logs in or checks login status. If the user is fully auth'd to use the app, then
     * it will resolve the authorized promise. It will also trigger one of the following events
     *
     * Authorizer.AUTHORIZED: Triggered when the user is not signed into their account
     * Authorizer.NOT_LOGGED_IN: Triggered when the user is not signed into their account
     * Authorizer.NOT_AUTHORIZED: Triggered when the user signed into their account but has not authorised the app
     *
     * If the user is logged in, the Authorizer will also fetch user data (see _handleGotUserData)
     *
     * @param response The response from facebook following a call to getLoginStatus or getLogin.
     * @private
     */
    Authorizer.prototype._handleGotLoginStatus = function (response) {
        switch (response.status) {
            case 'connected':
                this.accessToken = response.authResponse.accessToken;
                this.userId = response.authResponse.userID;
                this.trigger(Authorizer.AUTHORIZED);
                this._getUserData();
                this.authDeferred.resolve(FB);
                break;
            case 'not_authorized':
                this._getUserData();
                this.trigger(Authorizer.NOT_AUTHORIZED);
                break;
            default:
                this.trigger(Authorizer.NOT_LOGGED_IN);
        }

    };

    /**
     * Fetches data about the user. When this is complete it triggers the following:
     * Authorizer.GOT_USER_DETAILS: Which includes a single parameter with the userData JSON
     * This data is also made available as a field on the authorizer.
     */
    Authorizer.prototype._getUserData = function () {
        FB.api("/me", this._handleGotUserData.bind(this));
    };

    /**
     * Called when the Facebook API returns data about the user
     * @param {Object} data The data from the server
     * @private
     */
    Authorizer.prototype._handleGotUserData = function (data) {
        if (data && !data.error) {
            this.userData = data;
            this.userDataDeferred.resolve(this.userData);
            this.trigger(Authorizer.GOT_USER_DETAILS, [data]);
        }
    };

    /**
     * Gets the Facebook APP id for the relevent guardian app. It will first check
     * window.identity.facebook.appId.
     *
     * If this is not present, then it will extract the from the fb:app_id meta tag on the page.
     * Note that the meta tag always displays the production app id, so is not correct in preproduction environments.
     *
     * @private
     */
    Authorizer.prototype.getAppId = function () {
        var identityId = window.identity && identity.facebook && identity.facebook.appId,
            metaTag = document.querySelector && document.querySelector("meta[property='fb:app_id']");
        return identityId || metaTag && metaTag.content;
    };

    /**
     * @private
     */
    Authorizer.prototype._handleScriptLoaded = function () {

        FB.init({
            appId: this.getAppId(),
            channelUrl: '//' + document.location.host + ':' + document.location.port + '/channel.html',
            status: true, // check login status
            cookie: true, // enable cookies to allow the server to access the session
            xfbml: true  // parse XFBML
        });

        this.scriptLoadDeferred.resolve(FB);

    };

    /**
     * Loads the Facebook script using RequireJS or Curl JS
     * @private
     */
    Authorizer.prototype._loadFacebookScript = function () {
        var scriptLoader = require || curl;
        scriptLoader(['//connect.facebook.net/en_US/all.js'], this._handleScriptLoaded.bind(this))
    };

    /**
     * Loads the Facebook API. Not intended for direct use: call the function you intend to use (login or getloginstatus)
     * and these will load the facebook api or use the existing version as required.
     * @private
     */
    Authorizer.prototype._loadFacebookAPI = function () {
        if (window.FB) {
            this.scriptLoadDeferred.resolve(window.FB);
        } else if (!document.getElementById(scriptId) && !this._requiredAlready) {
            this._requiredAlready = true;
            this._loadFacebookScript();
        }
        return this.scriptLoadDeferred;
    };

    /**
     * Removes all events from the authorizer
     */
    Authorizer.prototype.destroy = function () {
        this.removeEvent(); // removes all events
    };

    /** @event */
    Authorizer.GOT_USER_DETAILS = "gotUserDetails";

    /** @event */
    Authorizer.NOT_LOGGED_IN = "notLoggedIn";

    /** @event */
    Authorizer.NOT_AUTHORIZED = "notAuthorized";

    /** @event */
    Authorizer.AUTHORIZED = "connected";

    guardian.facebook.Authorizer = Authorizer;

})();


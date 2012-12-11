(function () {

    var permissions = {scope: 'email,publish_actions,publish_stream'};

    function Authorizer() {
        this.authDeferred = jQuery.Deferred();
        this.scriptLoadDeferred = jQuery.Deferred();
    }

    Authorizer.prototype = Object.create(EventEmitter.prototype);

    Authorizer.accessToken = null;
    Authorizer.userId = null;
    Authorizer.userData = null;

    /**
     * Gets the user to login
     * @return A promise which is resolved when the user has been authenticated and authorized the Guardian app
     */
    Authorizer.prototype.authUser = function () {
        console.log("Authorizer: authUser");
        if (!this.accessToken) {
            this._loadFacebookAPI().then(function () {
                FB.login(this.handleGotLoginStatus.bind(this), permissions);
            }.bind(this))
        }
        return this.authDeferred.promise();
    };

    /**
     * Checks if the user is logged in and has authorised the app
     * @return A promise which is resolved when the user has been authenticated and authorized the Guardian app
     */
    Authorizer.prototype.getLoginStatus = function () {
        console.log("Authorizer: getLoginStatus");
        this._loadFacebookAPI().then(function () {
            // Checks if the current user is logged in and has authorized the app
            FB.getLoginStatus(this.handleGotLoginStatus.bind(this), permissions);
        }.bind(this));
        return this.authDeferred.promise();
    };


    /* End of public methods */

    var scriptId = 'facebook-jssdk';

    Authorizer.prototype.handleGotLoginStatus = function (response) {

        console.log("Authorizer: Got Login Status: " + response.status);

        switch (response.status) {
            case 'connected':
                this.accessToken = response.authResponse.accessToken;
                this.userId = response.authResponse.userID;
                console.log("Authorizer: Access token: " + this.accessToken);
                this.trigger(Authorizer.AUTHORIZED);
                this._getUserData();
                this.authDeferred.resolve();
                break;
            case 'not_authorized':
                this._getUserData();
                this.trigger(Authorizer.NOT_AUTHORIZED);
                break;
            default:
                this.trigger(Authorizer.NOT_LOGGED_IN);
        }

    };

    Authorizer.prototype._handleGotUserData = function(data) {
        if (data && !data.error) {
            this.userData = data;
            this.trigger(Authorizer.GOT_USER_DETAILS, [data]);
        }
    };

    /**
     * Gets the user data
     */
    Authorizer.prototype._getUserData = function () {
        console.log("Authorizer: Getting user data");
        FB.api("/me", this._handleGotUserData.bind(this));
    };

    /**
     * @private
     */
    Authorizer.prototype.getAppId = function () {
        console.log("Authorizer: Getting app id");
        var identityId = window.identity && identity.facebook && identity.facebook.appId;
        return identityId || jQuery("meta[property='fb:app_id']").attr("content");
    };

    /**
     * @private
     */
    Authorizer.prototype.scriptLoaded = function () {

        console.log("Authorizer: Handling script loaded");

        FB.init({
            appId: this.getAppId(),
            channelUrl: '//' + document.location.host + ':' + document.location.port + '/channel.html',
            status: true, // check login status
            cookie: true, // enable cookies to allow the server to access the session
            xfbml: true  // parse XFBML
        });

        this.scriptLoadDeferred.resolve();

    };

    /**
     * @private
     */
    Authorizer.prototype._configureFacebookScript = function () {
        require(['http://connect.facebook.net/en_US/all.js'], this.scriptLoaded.bind(this))
    };

    /**
     * @private
     */
    Authorizer.prototype._loadFacebookAPI = function () {
        console.log("Authorizer: Loading Facebook API");

        if (window.FB) {
            this.scriptLoadDeferred.resolve();
        } else if (!document.getElementById(scriptId) && !this.requiredAlready) {
            this.requiredAlready = true;
            this._configureFacebookScript();
        }
        return this.scriptLoadDeferred.promise();
    };

    Authorizer.prototype.destroy = function() {
        this.removeEvent(); // remove all events
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


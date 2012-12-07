(function () {

    var permissions = {scope: 'email,publish_actions,publish_stream'};

    function Authorizer() {
        this.authDeferred = jQuery.Deferred();
        this.scriptLoadDeferred = jQuery.Deferred();
    }

    Authorizer.prototype = Object.create(Subscribable.prototype);

    Authorizer.accessToken = null;
    Authorizer.userId = null;

    /**
     * Gets the user to login
     * @return A promise which is resolved when the user has been authenticated and authorized the Guardian app
     */
    Authorizer.prototype.authUser = function () {
        if (!this.accessToken) {
            this._loadFacebookAPI().then(function (FB) {
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
        this._loadFacebookAPI().then(function (FB) {
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
                this.fire("connected");
                this._getUserData();
                this.authDeferred.resolve();
                break;
            case 'not_authorized':
                this._getUserData();
                this.fire("notAuthorized");
                break;
            default:
                this.fire("notLoggedIn");
        }

    };

    /**
     * Gets the user data
     */
    Authorizer.prototype._getUserData = function () {
        console.log("Authorizer: Getting user data");
        FB.api("/me", function (data) {
            if (data && !data.error) {
                this.fire("gotUserDetails", data);
            }
        }.bind(this));
    };

    /**
     * @private
     */
    Authorizer.prototype.getAppId = function () {
        var identityId = window.identity && identity.facebook && identity.facebook.appId;
        return identityId || jQuery("meta[property='fb:app_id']").attr("content");
    };

    /**
     * @private
     */
    Authorizer.prototype.scriptLoaded = function () {

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
     * @private
     */
    Authorizer.prototype._configureFacebookScript = function (js) {
        js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";
        js.onload = this.scriptLoaded.bind(this);
    };

    /**
     * @private
     */
    Authorizer.prototype._loadFacebookAPI = function () {
        var firstScript, scriptElement;

        if (!document.getElementById(scriptId)) {
            scriptElement = document.createElement('script');
            scriptElement.id = scriptId;
            firstScript = document.getElementsByTagName('script')[0];
            this._configureFacebookScript(scriptElement);
            firstScript.parentNode.insertBefore(scriptElement, firstScript);
        } else {
            this.scriptLoadDeferred.resolve({FB: window.FB})
        }
        return this.scriptLoadDeferred.promise();
    };

    guardian.facebook.Authorizer = Authorizer;

})();


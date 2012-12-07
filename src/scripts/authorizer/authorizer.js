(function () {

    var permissions = {scope: 'email,publish_actions,publish_stream'};

    function Authorizer() {
        this.authDeferred = jQuery.Deferred();
    }

    Authorizer.prototype = Object.create(Subscribable.prototype);

    Authorizer.accessToken = null;
    Authorizer.userId = null;

    Authorizer.prototype.getPromise = function () {
        return this.authDeferred.promise();
    };

    Authorizer.prototype.getAppId = function () {
        var identityId = window.identity && identity.facebook && identity.facebook.appId;
        return identityId || jQuery("meta[property='fb:app_id']").attr("content");
    };

    Authorizer.prototype.scriptLoaded = function () {

        FB.init({
            appId: this.getAppId(),
            channelUrl: '//' + document.location.host + ':' + document.location.port + '/channel.html',
            status: true, // check login status
            cookie: true, // enable cookies to allow the server to access the session
            xfbml: true  // parse XFBML
        });

        this.getLoginStatus();

    };

    Authorizer.prototype.authUser = function () {
        if (!this.accessToken) {
            FB.login(this.handleGotLoginStatus.bind(this), permissions);
        }
        return this.getPromise();
    };

    Authorizer.prototype.getLoginStatus = function () {
        // Check if the current user is logged in and has authorized the app
        FB.getLoginStatus(this.handleGotLoginStatus.bind(this), permissions);
        return this.getPromise();
    };

    Authorizer.prototype.handleGotLoginStatus = function (response) {

        console.log("Authorizer: Got Login Status: " + response.status);

        switch (response.status) {
            case 'connected':
                this.accessToken = response.authResponse.accessToken;
                this.userId = response.authResponse.userID;
                console.log("Authorizer: Access token: " + this.accessToken);
                this.fire("connected");
                this.getUserData();
                this.authDeferred.resolve();
                break;
            case 'not_authorized':
                this.getUserData();
                this.fire("notAuthorized");
                break;
            default:
                this.fire("notLoggedIn");
        }

    };

    Authorizer.prototype.getUserData = function () {
        console.log("Authorizer: Getting user data");
        FB.api("/me", function (data) {
            if (!data.error) {
                this.fire("gotUserDetails", data);
            }
        }.bind(this));
    };

    var scriptId = 'facebook-jssdk';

    /**
     * @private
     */
    Authorizer.prototype._configureFacebookScript = function (js) {
        js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";
        js.onload = this.scriptLoaded.bind(this);
    };

    Authorizer.prototype.loadFacebookAPI = function () {
        var firstScript, scriptElement;

        if (!document.getElementById(scriptId)) {
            scriptElement = document.createElement('script');
            scriptElement.id = scriptId;
            firstScript = document.getElementsByTagName('script')[0];
            this._configureFacebookScript(scriptElement);
            firstScript.parentNode.insertBefore(scriptElement, firstScript);
        } else {
            this.getLoginStatus();
        }
        return this.getPromise();
    };

    guardian.facebook.Authorizer = Authorizer;

})();


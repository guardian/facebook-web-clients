(function () {

    var permissions = {scope: 'email,publish_actions,publish_stream'};

    function Authorizer() {
        this.authDeferred = jQuery.Deferred();
    }

    Authorizer.prototype = Object.create(Subscribable.prototype);

    Authorizer.prototype.getPromise = function () {
        return this.authDeferred.promise();
    };

    Authorizer.prototype.getAppId = function () {
        return jQuery("meta[property='fb:app_id']").attr("content");
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
        FB.login(this.handleGotLoginStatus.bind(this), permissions);
        return this.getPromise();
    };

    Authorizer.prototype.getLoginStatus = function () {
        // Check if the current user is logged in and has authorized the app
        FB.getLoginStatus(this.handleGotLoginStatus.bind(this), permissions);
        return this.getPromise();
    };

    Authorizer.prototype.handleGotLoginStatus = function (response) {

        console.log(response.status);

        console.log(response);

        switch (response.status) {
            case 'connected':
                this.authDeferred.resolve();
                break;
            case 'not_authorized':
                this.fire("notAuthorized");
                break;
            default:
                this.fire("notLoggedIn");
        }

    };

    Authorizer.prototype.authorize = function () {
        var js, id = 'facebook-jssdk', ref = document.getElementsByTagName('script')[0];
        if (!document.getElementById(id)) {
            js = document.createElement('script');
            js.id = id;
            js.async = true;
            js.src = "//connect.facebook.net/en_US/all.js";
            js.onload = this.scriptLoaded.bind(this);
            ref.parentNode.insertBefore(js, ref);
        }
        return this.getPromise();
    };

    guardian.facebook.Authorizer = Authorizer;

})();


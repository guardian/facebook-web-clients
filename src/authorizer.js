(function () {

    function Authorizer() {
        this.authDeferred = jQuery.Deferred();
    }

    Authorizer.prototype = Object.create(Subscribable.prototype);

    Authorizer.prototype.getPromise = function () {
        return this.authDeferred.promise();
    };

    Authorizer.prototype.scriptLoaded = function () {

        FB.init({
            appId: '289251094430759',
            channelUrl: '//olly.guardian.co.uk:8080/channel.html', // TODO: Change this
            status: true, // check login status
            cookie: true, // enable cookies to allow the server to access the session
            xfbml: true  // parse XFBML
        });

        this.getLoginStatus();

    };

    Authorizer.prototype.authUser = function () {
        FB.login(this.handleGotLoginStatus.bind(this), {scope: 'email'});
    };

    Authorizer.prototype.getLoginStatus = function () {
        // Check if the current user is logged in and has authorized the app
        FB.getLoginStatus(this.handleGotLoginStatus.bind(this));
        return this.getPromise();
    };

    Authorizer.prototype.handleGotLoginStatus = function (response) {

        if (response && response.status == 'connected') {

            this.fire("authOK");
            this.authDeferred.resolve();

        } else {

            this.fire("authRequired");

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


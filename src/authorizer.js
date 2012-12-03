(function () {

    function Authorizer() {
        this.authDeferred = jQuery.Deferred();
    }

    Authorizer.prototype.getPromise = function () {
        return this.authDeferred.promise();
    };

    Authorizer.prototype.scriptLoaded = function () {

        document.getElementById("loginButton").onclick = this.authUser.bind(this);

        FB.init({
            appId: '289251094430759',
            channelUrl: '//olly.guardian.co.uk:8080/channel.html', // TODO: Change this
            status: true, // check login status
            cookie: true, // enable cookies to allow the server to access the session
            xfbml: true  // parse XFBML
        });

        // Check if the current user is logged in and has authorized the app
        FB.getLoginStatus(this.checkLoginStatus.bind(this));

    };

    Authorizer.prototype.authUser = function () {
        FB.login(this.checkLoginStatus.bind(this), {scope: 'email'});
    };

    Authorizer.prototype.checkLoginStatus = function (response) {

        console.log(response.status);

        if (response && response.status == 'connected') {

            deferred.resolve();

        } else {

            // Display the login button
            document.getElementById('loginButton').style.display = 'block';
        }
    };

    Authorizer.prototype.authorize = function (d) {
        var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
        if (!d.getElementById(id)) {
            js = d.createElement('script');
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


(function () {

    function Authorizer(document) {
        this.authDeferred = jQuery.Deferred();
        this.initialise(document);
    }

    Authorizer.prototype.getPromise = function () {
        return this.authDeferred.promise();
    };

    Authorizer.prototype.scriptLoaded = function () {

        document.getElementById("loginButton").onclick = authUser;

        FB.init({
            appId: '289251094430759',
            channelUrl: '//olly.guardian.co.uk:8080/channel.html', // TODO: Change this
            status: true, // check login status
            cookie: true, // enable cookies to allow the server to access the session
            xfbml: true  // parse XFBML
        });

        // Check if the current user is logged in and has authorized the app
        FB.getLoginStatus(checkLoginStatus);

        // Login in the current user via Facebook and ask for email permission
        function authUser() {
            FB.login(checkLoginStatus, {scope: 'email'});
        }

        // Check the result of the user status and display login button if necessary
        function checkLoginStatus(response) {
            if (response && response.status == 'connected') {

                // Hide the login button
                document.getElementById('loginButton').style.display = 'none';

                var
                    model = new guardian.facebook.VoteModel(),
                    view = new guardian.facebook.VoteComponent(".voteComponent", model, guardian.ui.CanvasDonut),
                    controller = new guardian.facebook.VoteController(model);

                controller.initialise("test.json");

            } else {

                // Display the login button
                document.getElementById('loginButton').style.display = 'block';
            }
        }

    };

    Authorizer.prototype.initialise = function (d) {
        var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement('script');
        js.id = id;
        js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";
        js.onload = this.scriptLoaded.bind(this);
        ref.parentNode.insertBefore(js, ref);
    };

    guardian.facebook.Authorizer = Authorizer;

})();


(function () {

    var baseURI = window.baseURI || "http://facebook-web-clients.appspot.com";

    require([
        baseURI + "/static/facebook-authorizer-1.0.js",
        baseURI + "/static/facebook-banner-1.0.js"
    ],
        function () {

            console.log("Banner");

            var
                authorizer = guardian.facebook.Authorizer.getInstance(),
                signed_in = jQ.cookie('GU_MI'),
                in_grace_period = guardian.r2.identity.facebookBanner.hasUserSignedOutInLast24Hours(),
                permanently_dismissed_upsell = (guardian.r2.identity.facebookBanner.cookie().hidden >= 4);

            //if (!signed_in && !in_grace_period && !permanently_dismissed_upsell) {
            if (true) {
                authorizer.getLoginStatus();
                authorizer.onUserDataLoaded.then(function (response) {
                    var name = response.first_name;
                    if (response.email) {
                        console.log("Signed in to Facebook banner thingy");
                        //guardian.r2.identity.facebookBanner.signedIn(name, response.user);
                    } else {
                        guardian.r2.identity.facebookBanner.noEmail(name);
                    }
                });
                var noticeBar = jQ('.identity-noticebar');
                if (noticeBar.length === 0) {
                    authorizer.onNotAuthorized.then(guardian.r2.identity.facebookBanner.notAuthed);
                }
            }

        });
})();
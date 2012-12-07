(function () {

    module("Facebook Authorizer", {
        setup: function () {
            authorizer = new guardian.facebook.Authorizer();
            FB = {
                api: sinon.spy(function (path, callback) {
                    callback(userData);
                }),
                getLoginStatus: sinon.stub(),
                init: sinon.stub()
            };
            userDetailsCallback = sinon.stub();
            authorizer._configureFacebookScript = function() {
                this.scriptLoaded();
            };
            authorizer.on("gotUserDetails", userDetailsCallback);
        },
        teardown: function () {
            delete window.FB;
            jQuery("meta").remove();
            jQuery("#facebook-jssdk").remove();
        }
    });

    var authorizer, userData, userDetailsCallback;

    test("Calls FB.init() after loading the script", function () {

        authorizer.loadFacebookAPI();

        thenThe(FB.init).shouldHaveBeen(calledOnce);

    });

    test("Doesn't add the script or FB.init() more than once", function () {

        authorizer.loadFacebookAPI();

        thenThe(FB.init).shouldHaveBeen(calledOnce);

        equal(jQuery("#facebook-jssdk").length, 1);

        authorizer.loadFacebookAPI();

        thenThe(FB.init).shouldNotHaveBeen(calledAgain);

    });

    test("Gets Facebook App ID from the page", function () {

        given(jQuery("head").append('<meta property="fb:app_id" content="289251094430759">'));

        equal(authorizer.getAppId(), "289251094430759");

    });

    test("Gets Facebook App ID from identity if available", function () {

        given(window.identity = {
            facebook: {
                appId: "123456789"
            }
        });

        given(jQuery("head").append('<meta property="fb:app_id" content="289251094430759">'));

        equal(authorizer.getAppId(), "123456789");

    });

    test("Gets user data", function () {

        given(userData = {
            "name": "Olly"
        });

        when(authorizer.getUserData());

        thenThe(userDetailsCallback)
            .shouldHaveBeen(calledOnce)
            .and(calledWith(userData))

    });

    test("Doesn't fire if no user data", function () {

        given(userData = {
            "error": "Something bad happened"
        });

        when(authorizer.getUserData());

        thenThe(userDetailsCallback).shouldHaveBeen(notCalled);

    })

})();
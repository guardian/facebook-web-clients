(function () {

    module("Facebook Authorizer", {
        setup: function () {
            authorizer = new guardian.facebook.Authorizer();
            userDetailsCallback = sinon.stub();
            authorizer._configureFacebookScript = function () {
                window.FB = {
                    api: sinon.spy(function (path, callback) {
                        callback(userData);
                    }),
                    login: sinon.spy(function (callback, permissions) {
                        callback(loginResponse);
                    }),
                    getLoginStatus: sinon.stub(),
                    init: sinon.stub()
                };
                this.scriptLoaded(window.FB);
            };
            authorizer.on(guardian.facebook.Authorizer.GOT_USER_DETAILS, userDetailsCallback);
        },
        teardown: function () {
            delete window.FB;
            authorizer.destroy();
            jQuery("meta").remove();
            jQuery("#facebook-jssdk").remove();
        }
    });

    var authorizer, userData, loginResponse, userDetailsCallback;

    test("Calls FB.init() after loading the script", function () {

        authorizer.getLoginStatus();

        thenThe(FB.init).shouldHaveBeen(calledOnce);

    });

    test("Doesn't load the script or call FB.init() more than once", function () {

        authorizer.getLoginStatus();

        thenThe(FB.init).shouldHaveBeen(calledOnce);

        authorizer.getLoginStatus();

        thenThe(FB.init).shouldNotHaveBeen(calledAgain);

    });

    test("Will load Facebook if requested to auth the user", function () {

        given(loginResponse = {
            status: 'connected',
            authResponse: {
                accessToken: '123',
                userID: '123456'
            }
        });

        authorizer.authUser();

        thenThe(FB.init).shouldHaveBeen(calledOnce);
        equal(authorizer.accessToken, '123');
        equal(authorizer.userId, '123456');

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

        given(loginResponse = {
            status: 'not_authorized'
        });

        given(userData = {
            "name": "Olly"
        });

        when(authorizer.authUser());

        thenThe(userDetailsCallback)
            .shouldHaveBeen(calledOnce)
            .and(calledWith(userData))

    });

    test("Doesn't fire if no user data", function () {

        given(loginResponse = {
            status: 'not_authorized'
        });

        given(userData = {
            "error": "Something bad happened"
        });

        when(authorizer.authUser());

        thenThe(userDetailsCallback).shouldHaveBeen(notCalled);

    })

})();
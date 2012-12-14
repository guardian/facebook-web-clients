(function () {

    module("Facebook Authorizer", {
        setup: function () {
            authorizer = guardian.facebook.Authorizer.getInstance();
            userDetailsCallback = sinon.stub();
            sinon.spy(authorizer, "getLoginStatus");
            authorizer._loadFacebookScript = function () {
                window.FB = {
                    api: sinon.spy(function (path, callback) {
                        callback(userData);
                    }),
                    login: sinon.spy(function (callback, permissions) {
                        callback(loginResponse);
                    }),
                    getLoginStatus: sinon.spy(function (callback) {
                        callback(loginResponse);
                    }),
                    init: sinon.stub()
                };
            };
            authorizer.onUserDataLoaded.then(userDetailsCallback);
        },
        teardown: function () {
            delete window.FB;
            authorizer.destroy();
            jQuery("meta").remove();
            jQuery("#facebook-jssdk").remove();
        }
    });

    function whenTheScriptLoads() {
        authorizer._handleScriptLoaded(window.FB);
    }

    var authorizer, userData, loginResponse = {status: 'unknown'}, userDetailsCallback;

    test("Calls FB.init() after loading the script", function () {

        authorizer.getLoginStatus();

        whenTheScriptLoads();

        thenThe(FB.init).shouldHaveBeen(calledOnce);

    });

    test("Doesn't load the script or call FB.init() more than once", function () {

        authorizer.getLoginStatus();

        whenTheScriptLoads();

        thenThe(FB.init).shouldHaveBeen(calledOnce);

        authorizer.getLoginStatus();

        thenThe(FB.init).shouldNotHaveBeen(calledAgain);

    });

    test("Queues calls to getLoginStatus", function () {

        var callback1 = sinon.stub(), callback2 = sinon.stub();

        given(loginResponse = {
            status: 'connected',
            authResponse: {
                accessToken: '123',
                userID: '123456'
            }
        });

        authorizer.getLoginStatus().then(callback1);

        authorizer.getLoginStatus().then(callback2);

        whenTheScriptLoads();

        thenThe(callback1).shouldHaveBeen(calledOnce);
        thenThe(callback2).shouldHaveBeen(calledOnce);
        thenThe(FB.getLoginStatus).shouldHaveBeen(calledOnce);

    });

    test("Will load Facebook if requested to auth the user", function () {

        given(loginResponse = {
            status: 'connected',
            authResponse: {
                accessToken: '123',
                userID: '123456'
            }
        });

        authorizer.login();

        whenTheScriptLoads();

        thenThe(FB.init).shouldHaveBeen(calledOnce);
        equal(authorizer.accessToken, '123');
        equal(authorizer.userId, '123456');

    });

    test("Will not try to login to facebook more than once", function () {

        authorizer.login();
        authorizer.login();

        whenTheScriptLoads();

        thenThe(FB.login).shouldHaveBeen(calledOnce);

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

        when(authorizer.login());

        whenTheScriptLoads();

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

        when(authorizer.login());

        thenThe(userDetailsCallback).shouldHaveBeen(notCalled);

    })

})();
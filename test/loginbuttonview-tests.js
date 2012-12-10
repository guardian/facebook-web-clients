(function () {

    module("Login Button", {
        setup: function () {
            jQuery("body").append('<div class="facebook-auth-status"><div class="user-details"></div></div>');
            authorizer = new guardian.facebook.Authorizer();
            sinon.spy(authorizer, "authUser");
            authorizer._configureFacebookScript = sinon.stub();
        },
        teardown: function () {
            jQuery(".facebook-auth-status").remove();
        }
    });

    var authorizer, view;

    test("Logged In", function () {
        given(loggedIn());
        given(newView());
        thenThe(jQuery(".user-details .login")).should(haveText("Logged in"));
    });

    test("Not Logged In", function () {
        given(loggedIn());
        given(newView());
        when(authorizer.trigger(guardian.facebook.Authorizer.NOT_LOGGED_IN));
        thenThe(jQuery(".user-details .login")).should(haveText("Log in to Facebook"));
    });

    test("Auth User on Second Login Attempt", function () {
        given(loggedIn());
        given(newView());
        when(authorizer.trigger(guardian.facebook.Authorizer.NOT_LOGGED_IN));
        when(authorizer.trigger(guardian.facebook.Authorizer.NOT_LOGGED_IN));
        thenThe(authorizer.authUser).shouldHaveBeen(calledOnce);
    });

    test("Show User Details", function () {
        given(loggedIn());
        given(newView());
        when(authorizer.trigger(guardian.facebook.Authorizer.GOT_USER_DETAILS, [{name: "Olly"}]));
        thenThe(jQuery(".user-details .login")).should(haveText("Logged in as Olly"));
    });

    test("Show User Details only if defined", function () {
        given(loggedIn());
        given(newView());
        when(authorizer.trigger(guardian.facebook.Authorizer.GOT_USER_DETAILS, [{}]));
        thenThe(jQuery(".user-details .login")).should(haveText("Logged in"));
    });

    /* End of tests */

    function loggedIn() {
        authorizer.getLoginStatus = sinon.stub().returns({
            then: function (fn) {
                fn();
            }
        })
    }

    function newView() {
        view = new guardian.facebook.LoginButtonView(".facebook-auth-status", authorizer)
    }

})();
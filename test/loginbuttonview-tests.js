(function () {

    module("Login Button", {
        setup: function () {
            jQuery("body").append('<div class="facebook-auth-status"><div class="user-details"></div></div>');
            authorizer = sinon.stub(Object.create(guardian.facebook.Authorizer.prototype));
            Subscribable.prepareInstance(authorizer);
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
        when(authorizer.fire("notLoggedIn"));
        thenThe(jQuery(".user-details .login")).should(haveText("Log in to Facebook"));
    });

    test("Auth User on Second Login Attempt", function () {
        given(loggedIn());
        given(newView());
        when(authorizer.fire("notLoggedIn"));
        when(authorizer.fire("notLoggedIn"));
        thenThe(authorizer.authUser).shouldHaveBeen(calledOnce);
    });

    test("Show User Details", function () {
        given(loggedIn());
        given(newView());
        when(authorizer.fire("gotUserDetails", {name: "Olly"}));
        thenThe(jQuery(".user-details .login")).should(haveText("Logged in as Olly"));
    });

    test("Show User Details only if defined", function () {
        given(loggedIn());
        given(newView());
        when(authorizer.fire("gotUserDetails", {}));
        thenThe(jQuery(".user-details .login")).should(haveText("Logged in"));
    });

    /* End of tests */

    function loggedIn() {
        authorizer.loadFacebookAPI.returns({
            then: function (fn) {
                fn();
            }
        })
    }

    function newView() {
        view = new guardian.facebook.LoginButtonView(".facebook-auth-status", authorizer)
    }

})();
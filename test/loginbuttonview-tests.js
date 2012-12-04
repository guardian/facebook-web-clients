(function () {

    module("Login Button", {
        setup: function () {
            jQuery("body").append('<div class="facebookAuthStatus"><div class="userDetails"></div></div>');
            authorizer = sinon.stub(Object.create(guardian.facebook.Authorizer.prototype));
            Subscribable.prepareInstance(authorizer);
        },
        teardown: function () {
            jQuery(".facebookAuthStatus").remove();
        }
    });

    var authorizer, view;

    test("Logged In", function () {
        given(loggedIn());
        given(newView());
        thenThe(jQuery(".userDetails .login")).should(haveText("Logged in"));
    });

    test("Not Logged In", function () {
        given(loggedIn());
        given(newView());
        when(authorizer.fire("notLoggedIn"));
        thenThe(jQuery(".userDetails .login")).should(haveText("Log in to Facebook"));
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
        thenThe(jQuery(".userDetails .login")).should(haveText("Logged in as Olly"));
    });

    /* End of tests */

    function loggedIn() {
        authorizer.authorize.returns({
            then: function (fn) {
                fn();
            }
        })
    }

    function newView() {
        view = new guardian.facebook.LoginButtonView(".facebookAuthStatus", authorizer)
    }

})();
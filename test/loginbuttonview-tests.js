(function () {

    module("Login Button", {
        setup: function () {
            jQuery("body").append('' +
                '<div class="social-summary">' +
                '<div class="avatar"></div>' +
                '<a></a>' +
                '</div>'
            );
            authorizer = new guardian.facebook.Authorizer();
            sinon.spy(authorizer, "authUser");
            authorizer._configureFacebookScript = sinon.stub();
        },
        teardown: function () {
            jQuery(".social-summary").remove();
        }
    });

    var authorizer, view;

    test("Logged In", function () {
        given(loggedIn());
        given(newView());
        thenThe(jQuery(".social-summary a")).should(haveText("Your vote will be counted and shared on Facebook"));
    });

    test("Not Logged In", function () {
        given(loggedIn());
        given(newView());
        when(authorizer.trigger(guardian.facebook.Authorizer.NOT_LOGGED_IN));
        thenThe(jQuery(".social-summary a")).should(haveText("Your vote will be counted and shared on Facebook"));
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
        when(authorizer.trigger(guardian.facebook.Authorizer.GOT_USER_DETAILS, [
            {first_name: "Olly"}
        ]));
        thenThe(jQuery(".social-summary a")).should(haveText("Olly, your vote will be counted and shared on Facebook"));
    });

    test("Show User Details only if defined", function () {
        given(loggedIn());
        given(newView());
        when(authorizer.trigger(guardian.facebook.Authorizer.GOT_USER_DETAILS, [
            {}
        ]));
        thenThe(jQuery(".social-summary a")).should(haveText("Your vote will be counted and shared on Facebook"));
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
        view = new guardian.facebook.LoginButtonView(".social-summary", authorizer)
    }

})();
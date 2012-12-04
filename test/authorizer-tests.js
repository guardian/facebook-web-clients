(function () {

    module("Authorizer", {
        setup: function () {
            authorizer = new guardian.facebook.Authorizer();
            FB = {};
            FB.api = sinon.spy(function(path, callback) {
                callback(userData);
            });
            userDetailsCallback = sinon.stub();
            authorizer.on("gotUserDetails", userDetailsCallback);
        },
        teardown: function () {
            jQuery("meta").remove();
        }
    });

    var authorizer, userData, userDetailsCallback;

    test("Gets Facebook App Id from the page", function () {

        given(jQuery("head").append('<meta property="fb:app_id" content="289251094430759">'));

        equal(authorizer.getAppId(), "289251094430759");

    });

    test("Gets user data", function() {

        given(userData = {
            "name": "Olly"
        });

        when(authorizer.getUserData());

        thenThe(userDetailsCallback)
            .shouldHaveBeen(calledOnce)
            .and(calledWith(userData))

    });

    test("Doesn't fire if no user data", function() {

        given(userData = {
            "error": "Something bad happened"
        });

        when(authorizer.getUserData());

        thenThe(userDetailsCallback).shouldHaveBeen(notCalled);

    })

})();
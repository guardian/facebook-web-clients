(function () {

    module("Login Button", {
        setup: function () {
            jQuery("body").append('' +
                '<div class="social-summary">' +
                '<div class="avatar"></div>' +
                '<div class="message"></div>' +
                '</div>'
            );
            authorizer = new guardian.facebook.Authorizer();
            sinon.spy(authorizer, "login");
            authorizer._loadFacebookScript = sinon.stub();
            model = new EventEmitter();
            model.getVotelabel = sinon.stub();
        },
        teardown: function () {
            jQuery(".social-summary").remove();
        }
    });

    var authorizer, view, model;

    test("Logged In", function () {
        given(loggedIn());
        given(newView());
        thenThe(jQuery(".social-summary .message a")).should(haveText("Your vote will be counted and shared on Facebook"));
    });

    test("Not Logged In", function () {
        given(loggedIn());
        given(newView());
        when(authorizer.onNotLoggedIn.resolve());
        thenThe(jQuery(".social-summary .message a")).should(haveText("Your vote will be counted and shared on Facebook"));
    });

    test("Auth User on Second Login Attempt", function () {
        given(loggedIn());
        given(newView());
        when(authorizer.onNotLoggedIn.resolve());
        when(authorizer.onNotLoggedIn.resolve());
        thenThe(authorizer.login).shouldHaveBeen(calledOnce);
    });

    test("Show User Details", function () {
        given(loggedIn());
        given(newView());
        when(userHasLoginDetails({first_name: "Olly", username: "foo"}));
        thenThe(jQuery(".social-summary"))
            .should(haveText("Olly, your vote will be counted and shared on Facebook"), inElement(".message"))
            .should(haveAttribute("src", "http://graph.facebook.com/foo/picture"), inElement(".avatar"));

        when(theUserVotesFor("agree"));

        thenThe(jQuery(".social-summary"))
            .should(haveText("Olly, your vote 'agree' was counted and shared on Facebook"), inElement(".message"));

    });

    test("Show User Details only if defined", function () {
        given(loggedIn());
        given(newView());
        when(userHasLoginDetails(null));
        thenThe(jQuery(".social-summary .message a")).should(haveText("Your vote will be counted and shared on Facebook"));
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
        view = new guardian.facebook.LoginButtonView(".social-summary", authorizer, model)
    }

    function userHasLoginDetails(json) {
        authorizer._handleGotUserData(json);
    }

    function theUserVotesFor(choice) {
        model.choice = choice;
        model.getVotelabel.returns(choice);
        model.trigger(guardian.facebook.VoteModel.DATA_CHANGED);
    }

})();
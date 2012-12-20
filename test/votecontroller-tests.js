(function () {

    var fakePromise = {
        then: function (fn) {
            fn();
        }
    };

    module("Vote Controller", {
        setup: function () {
            jQuery.ajax = sinon.stub(jQuery, "ajax");
            jQuery.ajax.returns({
                then: function (fn) {
                    fn({
                        data: json
                    });
                }
            });
            window.FB = {
                api: sinon.stub()
            };
            model = sinon.stub(new guardian.facebook.VoteModel());
            deferred = jQuery.Deferred();
            model.whenDataIsSet.returns(deferred.promise());

            authorizer = guardian.facebook.Authorizer.getInstance();

            sinon.stub(authorizer, "_loadFacebookAPI");
            sinon.stub(authorizer, "getLoginStatus");
            sinon.stub(authorizer, "login");

            authorizer._loadFacebookAPI.returns(fakePromise);
            authorizer.getLoginStatus.returns(fakePromise);
            authorizer.login.returns(fakePromise);
            authorizer.onNotAuthorized = fakePromise;

            view = new EventEmitter();
            controller = new guardian.facebook.VoteController(model, view, authorizer)
        },
        teardown: function () {
            authorizer.destroy();
            jQuery.ajax.restore();
            delete window.FB;
        }
    });

    var model, controller, authorizer, deferred, json = {
        "pollId": "400303938",
        "questions": [
            {
                "id": 7694,
                "count": 1627,
                "answers": [
                    {
                        "question": 7694,
                        "id": "Agree",
                        "count": 1421
                    },
                    {
                        "question": 7694,
                        "id": "Disagree",
                        "count": 206
                    }
                ]
            }
        ]
    };

    test("Updates the model with JSON", function () {
        when(controller.initialise("/some_url"));
        thenThe(model.setAllData).shouldHaveBeen(calledOnce);
    });

    test("Posts the custom action to facebook", function () {
        when(controller.initialise("/some_url"));
        thenThe(jQuery.ajax).shouldHaveBeen(calledOnce);

    });

    test("Agree with author polls", function () {
        when(controller.initialise("/some_url", guardian.facebook.VoteController.AGREE_WITH_AUTHOR));
        thenThe(jQuery.ajax)
            .shouldHaveBeen(calledOnce)
            .shouldHaveBeen(calledWith(mapWith("url", "/some_url/poll?type=agree_with_author")));
    });

    test("Agree with headline polls", function () {
        when(controller.initialise("/some_url", guardian.facebook.VoteController.AGREE_WITH_HEADLINE));
        thenThe(jQuery.ajax)
            .shouldHaveBeen(calledOnce)
            .shouldHaveBeen(calledWith(mapWith("url", "/some_url/poll?type=agree_with_headline")));
    });

    test("Handles already voted", function () {
        when(controller.initialise("/some_url"));
        given(userAlreadyVoted());
        when(view.trigger("voted", ["Disagree"]));
        thenThe(model.registerVote).shouldNotHaveBeen(calledOnce);
    });

    test("Handles error", function () {
        when(controller.initialise("/some_url"));
        given(serverHasError());
        when(view.trigger("voted", ["Disagree"]));
        thenThe(model.registerVote).shouldNotHaveBeen(calledOnce);
    });

    /* end of tests */

    function userAlreadyVoted() {
        jQuery.ajax.returns({
            then: function (callback) {
                // dont call the success
            },
            fail: function (callback) {
                callback();
            }
        });
    }

    function serverHasError() {
        jQuery.ajax.returns({
            then: function (callback) {
                callback({
                    error: {
                        message: "An unexpected error has occurred. Please retry your request later."
                    }
                })
            }
        });
    }

})();
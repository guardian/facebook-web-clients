(function () {


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

            model = fakeModel();
            authorizer = fakeAuthorizer();
            view = fakeView();

            controller = new guardian.facebook.VoteController(model, view, authorizer);
            sinon.spy(controller, "handleVoteFailed");
        },
        teardown: function () {
            authorizer.destroy();
            jQuery.ajax.restore();
            delete window.FB;
        }
    });

    var model, controller, view, authorizer, json = {
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

    test("Loads the poll upon initialise and passes data to model", function () {
        given(normalPollResponse());
        when(controller.initialise("/some_url"));
        thenThe(jQuery.ajax).shouldHaveBeen(calledOnce);
        thenThe(model.setAllData).shouldHaveBeen(calledOnce);
    });

    test("Handles error if the server cannot return the poll", function () {
        given(serverHasError());
        when(controller.initialise("/some_url"));
        thenThe(jQuery.ajax).shouldHaveBeen(calledOnce);
        thenThe(model.setAllData).shouldNotHaveBeen(calledOnce);
    });

    test("Agree with author polls", function () {
        given(model.type = guardian.facebook.VoteModel.AGREE_WITH_OPINION);
        when(controller.initialise("/some_url"));
        thenThe(jQuery.ajax)
            .shouldHaveBeen(calledOnce)
            .shouldHaveBeen(calledWith(mapWith("url", "/some_url/poll?type=agree_with_opinion")));
    });

    test("Agree with headline polls", function () {
        given(model.type = guardian.facebook.VoteModel.AGREE_WITH_HEADLINE);
        when(controller.initialise("/some_url"));

        thenThe(jQuery.ajax)
            .shouldHaveBeen(calledOnce)
            .shouldHaveBeen(calledWith(mapWith("url", "/some_url/poll?type=agree_with_headline")));

        when(model.trigger("voted", ["disagree"]));
        thenThe(jQuery.ajax)
            .shouldHaveBeen(calledAgain)
            .shouldHaveBeen(calledWith(mapWith("url", "/some_url/vote")));
    });

    test("Handles already voted", function () {
        when(controller.initialise("/some_url"));
        given(userAlreadyVoted());
        when(model.trigger("voted", ["Disagree"]));
        thenThe(model.registerVote).shouldNotHaveBeen(calledOnce);
    });

    test("Handles error", function () {
        when(controller.initialise("/some_url"));
        given(serverHasError());
        when(model.trigger("voted", ["Disagree"]));
        thenThe(model.registerVote).shouldNotHaveBeen(calledOnce);
    });

    test("Handles voting error", function () {
        given(serverHasError());

        when(controller.initialise("/some_url"));
        when(model.trigger("voted", ["disagree"]));

        thenThe(jQuery.ajax).shouldHaveBeen(calledWith(mapWith("url", "/some_url/vote")));

        thenThe(controller.handleVoteFailed).shouldHaveBeen(calledOnce);
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
                    data: {
                        error: {
                            message: "An unexpected error has occurred. Please retry your request later."
                        }
                    }
                })
            }
        });
    }

    function normalPollResponse() {
        jQuery.ajax.returns({
            then: function (callback) {
                var json = {
                    "status": "ok",
                    "data": {"pollId": "http://www.gucode.co.uk/football/2012/nov/28/football-transfer-rumours-redknapp-defoe", "questions": [
                        {
                            "questionid": "0",
                            "answers": [
                                {"id": "think_likely", "count": 0, "label": "Likely"},
                                {"id": "think_unlikely", "count": 0, "label": "Unlikely"}
                            ]
                        }
                    ]}};
                callback(json)
            }
        });
    }

})();
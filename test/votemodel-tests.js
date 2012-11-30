(function () {

    module("Vote Model", {
        setup: function () {
            model = new guardian.facebook.VoteModel()
        }
    });

    var model;

    test("Register Vote", function () {

        equal(model.getTotal(), 0);

        when(model.registerVote("agree"));

        equal(model.getAgree(), 1);
        equal(model.getDisagree(), 0);
        equal(model.getTotal(), 1);
        equal(model.getAgreePercent(), 100)

    });

    test("Voted Already", function () {

        ok(!model.votedAlready());

        when(model.registerVote("agree"));

        ok(model.votedAlready());

    });

    test("Messages", function () {

        equal(model.getSummaryText(), "Be the first of your friends to share your opinion");

        when(model.registerVote("disagree"));

        equal(model.getSummaryText(), "You said that this rumour is Unlikely");

    });

    test("Set data", function () {

        given(model.setAllData({
            "id": "rumour001",
            "agree": {
                label: "Likely",
                count: 100
            },
            "disagree": {
                label: "Unlikely",
                count: 300
            }
        }));

        equal(model.getTotal(), 400);
        equal(model.getAgreePercent(), 25);

    });

    test("FiftyFifty", function () {

        given(model.setAllData({
            "id": "rumour001",
            "agree": {
                label: "Likely",
                count: 0
            },
            "disagree": {
                label: "Unlikely",
                count: 0
            }
        }));

        equal(model.getTotal(), 0);
        equal(model.getAgreePercent(), 50);

    })

})();
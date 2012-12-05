(function () {

    function Donut() {
    }

    Donut.prototype.render = function () {
    };

    module("Vote Component", {
        setup: function () {
            jQuery("body").append('' +
                '<div class="voteComponent">' +
                '<div class="voteArea">' +
                '<span class="choice btn agree" data-action="agree"><span class="label"></span><span class="count"></span></span>' +
                '<div class="donutContainer"></div>' +
                '<span class="choice btn disagree" data-action="disagree"><span class="count"></span><span class="label"></span></span>' +
                '</div>' +
                '<div class="socialSummary">' +
                '<span class="text">Be the first of your friends to share your opinion.</span>' +
                '<img src="../static/facebookIcon_16x16.gif"/>' +
                '</div>' +
                '</div>');
            model = new guardian.facebook.VoteModel();
            view = new guardian.facebook.VoteComponent(".voteComponent", model, Donut);
            view.on("voted", function (vote) {
                model.registerVote(vote);
            });
        },
        teardown: function () {
            model.destroy();
            view.destroy();
            jQuery(".voteComponent").remove();
        }
    });

    var model, view;

    test("Render", function () {

        givenSomeData();

        when(view.render());

        thenThe(jQuery("[data-action='answer1']"))
            .should(haveText("0"), inElement(".count"))
            .should(haveText("Likely"), inElement(".label"));

        thenThe(jQuery("[data-action='answer2']"))
            .should(haveText("0"), inElement(".count"))
            .should(haveText("Unlikely"), inElement(".label"));

    });

    test("Hides buttons after vote", function () {

        givenSomeData();

        thenThe(jQuery(".btn")).should(haveSize(0));

        when(model.setAllowedToVote(true));

        thenThe(jQuery(".btn")).should(haveSize(2));

        when(theUserClicksOn("[data-action='answer1']"));

        thenThe(jQuery(".btn")).should(haveSize(0));

    });

    test("Updates count", function () {

        givenSomeData();

        when(model.setAllowedToVote(true));

        when(theUserClicksOn("[data-action='answer1']"));

        thenThe(jQuery("[data-action='answer1']"))
            .should(haveText("1"), inElement(".count"));

    });

    test("Updates social summary", function () {

        givenSomeData();

        when(model.setAllowedToVote(true));

        when(theUserClicksOn("[data-action='answer2']"));

        thenThe(jQuery(".socialSummary .text"))
            .should(haveText("Your response was: Unlikely"));

    });

    function givenSomeData() {
        given(model.setAllData({
            "id": "question1",
            "answers": [
                {
                    "question": 7694,
                    "label": "Likely",
                    "id": "answer1",
                    "count": 0
                },
                {
                    "question": 7694,
                    "label": "Unlikely",
                    "id": "answer2",
                    "count": 0
                }
            ]
        }));
    }

})();
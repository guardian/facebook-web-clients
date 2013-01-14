(function () {

    function Donut() {
    }


    module("Vote Component", {
        setup: function () {
            Donut.prototype.setPercent = sinon.stub();
            jQuery("body").append('' +
                '<div class="vote-component">' +
                '<div class="vote-area">' +
                '<span class="choice btn agree" data-action="agree"><span class="label"></span><span class="count"></span></span>' +
                '<div class="donut-container"></div>' +
                '<span class="choice btn disagree" data-action="disagree"><span class="count"></span><span class="label"></span></span>' +
                '</div>' +
                '<div class="social-summary">' +
                '<span class="text">Be the first of your friends to share your opinion.</span>' +
                '<img src="../../static/facebookIcon_16x16.gif"/>' +
                '</div>' +
                '</div>');
            model = new guardian.facebook.VoteModel();
            sinon.spy(model, "registerVote");
            numberFormatter = sinon.spy(function (v) {
                return v
            });
            view = new guardian.facebook.VoteComponent(".vote-component", model, Donut, numberFormatter);
            view.on("voted", function (vote) {
                model.registerVote(vote);
            });
        },
        teardown: function () {
            view.destroy();
            model.destroy();
            jQuery(".vote-component").remove();
        }
    });

    var model, view, numberFormatter;

    test("Render", function () {

        givenSomeData();

        when(view.render());

        thenThe(jQuery("[data-action='answer1']"))
            .should(haveText("0"), inElement(".count"))
            .should(haveText("Likely"), inElement(".label"))
            .shouldNot(haveClass("selected"))
            .shouldNot(haveClass("disabled"));

        thenThe(jQuery("[data-action='answer2']"))
            .should(haveText("0"), inElement(".count"))
            .should(haveText("Unlikely"), inElement(".label"))
            .shouldNot(haveClass("selected"))
            .shouldNot(haveClass("disabled"));

        thenThe(Donut.prototype.setPercent).shouldHaveBeen(calledWith(50));

    });

    test("Formats Counts", function () {

        given(view.numberFormatter = function (v) {
            return "A" + v;
        });

        givenSomeData();

        when(view.render());

        thenThe(jQuery("[data-action='answer1']"))
            .should(haveText("A0"), inElement(".count"));

        thenThe(jQuery("[data-action='answer2']"))
            .should(haveText("A0"), inElement(".count"));

    });

    test("Updates buttons after vote", function () {

        givenSomeData();

        thenThe(jQuery(".btn")).should(haveSize(2));

        when(theUserClicksOn("[data-action='answer1']"));

        thenThe(jQuery("[data-action='answer1']"))
            .should(haveClass("selected"));

        thenThe(jQuery("[data-action='answer2']"))
            .should(haveClass("disabled"));

    });

    test("Can only vote once", function () {

        givenSomeData();

        when(theUserClicksOn("[data-action='answer1']"));
        thenThe(model.registerVote).shouldHaveBeen(calledOnce);

        when(theUserClicksOn("[data-action='answer1']"));
        thenThe(model.registerVote).shouldNotHaveBeen(calledAgain);

        when(theUserClicksOn("[data-action='answer2']"));
        thenThe(model.registerVote).shouldNotHaveBeen(calledAgain);

    });

    test("Updates count", function () {

        givenSomeData();

        when(theUserClicksOn("[data-action='answer1']"));

        thenThe(jQuery("[data-action='answer1']"))
            .should(haveText("1"), inElement(".count"));

        thenThe(Donut.prototype.setPercent).shouldHaveBeen(calledWith(100));

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
(function () {

    function Donut() {}
    Donut.prototype.render = function(){};

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
        },
        teardown: function () {
            jQuery(".voteComponent").remove();
        }
    });

    var model, view;

    test("Render", function () {

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

        when(view.render());

        thenThe(jQuery("[data-action='agree']"))
            .should(haveText("100"), inElement(".count"))
            .should(haveText("Likely"), inElement(".label"));

        thenThe(jQuery("[data-action='disagree']"))
            .should(haveText("300"), inElement(".count"))
            .should(haveText("Unlikely"), inElement(".label"));

    });

    test("Hides buttons after vote", function () {

        thenThe(jQuery(".btn")).should(haveSize(2));

        when(theUserClicksOn("[data-action='agree']"));

        thenThe(jQuery(".btn")).should(haveSize(0));

    });

    test("Updates count", function () {

        when(theUserClicksOn("[data-action='agree']"));

        thenThe(jQuery("[data-action='agree']"))
            .should(haveText("1"), inElement(".count"));

    });

    test("Updates summary", function () {

        when(theUserClicksOn("[data-action='disagree']"));

        thenThe(jQuery(".socialSummary .text"))
            .should(haveText("You said that this rumour is Unlikely"));

    })

})();
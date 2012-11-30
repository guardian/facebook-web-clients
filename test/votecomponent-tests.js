(function () {

    module("Vote Component", {
        setup: function () {
            jQuery("body").append('' +
                '<div class="voteComponent">' +
                '<div class="voteArea">' +
                '<span class="choice btn agree" data-action="agree">Likely<span class="count"></span></span>' +
                '<div class="donutContainer"></div>' +
                '<span class="choice btn disagree" data-action="disagree"><span class="count"></span>Unlikely</span>' +
                '</div>' +
                '<div class="socialSummary">' +
                '<span class="text">Be the first of your friends to share your opinion.</span>' +
                '<img src="../static/facebookIcon_16x16.gif"/>' +
                '</div>' +
                '</div>');
            model = new guardian.facebook.VoteModel();
            view = new guardian.facebook.VoteComponent(".voteComponent", model);
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
            .should(haveText("100"), inElement(".count"));

        thenThe(jQuery("[data-action='disagree']"))
            .should(haveText("300"), inElement(".count"));


    })

})();
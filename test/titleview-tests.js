(function () {

    module("Title View", {
        setup: function () {
            jQuery("body").append('' +
                '<li class="byline">' +
                '<a class="contributor" rel="author">Paul Doyle</a>' +
                '</li>' +
                '<div class="vote-component">' +
                '<strong class="vote-title"></strong>' +
                '</div>');
            model = new guardian.facebook.VoteModel();
        },
        teardown: function () {
            model.destroy();
            jQuery(".vote-component").remove();
        }
    });

    var model, view;

    test("Render", function () {

        given(view = new guardian.facebook.TitleView(".vote-title", model));
        given(model.type = guardian.facebook.VoteModel.AGREE_WITH_OPINION);

        when(view.render());

        thenThe(jQuery(".vote-title"))
            .should(haveText("Do you agree with Paul Doyle?"));

    });

})();
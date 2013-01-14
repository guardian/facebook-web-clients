(function () {

    module("Title View", {
        setup: function () {
            jQuery("body").append('' +
                '<li class="byline"></li>' +
                '<div class="vote-component">' +
                '<strong class="vote-title"></strong>' +
                '</div>');
            model = new guardian.facebook.VoteModel();
        },
        teardown: function () {
            model.destroy();
            jQuery(".byline").remove();
            jQuery(".vote-component").remove();
        }
    });

    var model, view;

    test("Agree with one author", function () {

        given(jQuery(".byline").html('<a class="contributor" rel="author">Paul Doyle</a>'));
        given(view = new guardian.facebook.TitleView(".vote-title", model));
        given(model.type = guardian.facebook.VoteModel.AGREE_WITH_OPINION);

        when(view.render());

        thenThe(jQuery(".vote-title"))
            .should(haveText("Do you agree with Paul Doyle?"));

    });


    test("Agree with one author, avoiding the image in the link", function () {

        given(jQuery(".byline").html('<a class="contributor" rel="author">Paul Doyle<img class="contributor-pic-small" src="http://static.guimcode.co.uk/sys-images/Guardian/Pix/pictures/2012/12/18/1355843386792/thomassowell_140x140.jpg" width="60" height="60" alt="Thomas Sowell" title="Contributor picture"></a>'));
        given(view = new guardian.facebook.TitleView(".vote-title", model));
        given(model.type = guardian.facebook.VoteModel.AGREE_WITH_OPINION);

        when(view.render());

        thenThe(jQuery(".vote-title"))
            .should(haveText("Do you agree with Paul Doyle?"));

    });

    test("Agree with two authors", function () {

        given(jQuery(".byline").html('<a class="contributor" rel="author">Paul Doyle</a> and <a class="contributor" rel="author">Matt Williams</a>'));
        given(view = new guardian.facebook.TitleView(".vote-title", model));
        given(model.type = guardian.facebook.VoteModel.AGREE_WITH_OPINION);

        when(view.render());

        thenThe(jQuery(".vote-title"))
            .should(haveText("Do you agree with Paul Doyle and Matt Williams?"));

    });

    test("Agree with headline", function () {

        given(view = new guardian.facebook.TitleView(".vote-title", model));
        given(model.type = guardian.facebook.VoteModel.AGREE_WITH_HEADLINE);

        when(view.render());

        thenThe(jQuery(".vote-title"))
            .should(haveText("Do you agree?"));

    });


})();
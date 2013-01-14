(function () {

    function TitleView(selector, model) {
        this.jContainer = jQuery(selector);

        if (!this.jContainer.length) {
            throw new Error("Title view has no element: " + selector);
        }

        this.model = model;
        this.render();
    }

    TitleView.prototype.model = null;
    TitleView.prototype.jContainer = null;

    TitleView.getAuthors = function () {
        return jQuery("[rel='author']").map(function () {
            return jQuery(this).text();
        }).get();
    };

    TitleView.prototype.render = function () {
        var title = "";
        switch (this.model.type) {
            case guardian.facebook.VoteModel.AGREE_WITH_OPINION:
                title = "Do you agree with " + TitleView.getAuthors().join(" and ") + "?";
                break;
            case guardian.facebook.VoteModel.AGREE_WITH_HEADLINE:
                title = "Do you agree?";
                break;
        }
        this.jContainer.html(title);
    };

    guardian.facebook.TitleView = TitleView;

})();
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
        return jQuery("[rel='author']").html();
    };

    TitleView.prototype.render = function () {
        switch (this.model.type) {
            case guardian.facebook.VoteModel.AGREE_WITH_OPINION:
                this.jContainer.html("Do you agree with " + TitleView.getAuthors() + "?");
                break;
            default:
                this.jContainer.html("");
        }
    };

    guardian.facebook.TitleView = TitleView;

})();
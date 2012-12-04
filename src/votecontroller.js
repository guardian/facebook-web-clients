(function () {

    function VoteController(model, view, authorizer) {
        this.model = model;
        this.view = view;
        this.authorizer = authorizer;
    }

    VoteController.prototype.model = null;
    VoteController.prototype.view = null;
    VoteController.prototype.authorizer = null;

    VoteController.prototype.initialise = function (url) {
        this.view.on("voted", this.submitVote, this);
        jQuery.ajax({
            url: url
        }).then(this.handleLoadedData.bind(this));
    };

    VoteController.prototype.handleLoadedData = function (json) {
        this.model.setAllData(json.questions[0]);
    };

    VoteController.prototype.getArticleId = function () {
        return jQuery("meta[property='og:url']").attr("content");
    };

    VoteController.prototype.submitVote = function (choice) {
        this.authorizer.authUser().then(function () {

            FB.api(
                '/me/' + VoteController.APP_NAMESPACE + ':' + choice,
                'post', {
                    article: this.getArticleId()
                },
                this.handlePostResponse.bind(this)
            );

            this.model.registerVote(choice);

        }.bind(this));
    };

    VoteController.prototype.handlePostResponse = function(response) {
        if (response.error) {
            console.error(response.error.message);
        } else {
            console.log("Posted response to Facebook OK");
        }
        console.log(arguments);
    };

    VoteController.prototype.destroy = function () {
        this.model.un(null, this);
    };

    VoteController.APP_NAMESPACE = "theguardian-spike";

    guardian.facebook.VoteController = VoteController;

})();
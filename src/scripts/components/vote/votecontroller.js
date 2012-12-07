(function () {

    function VoteController(model, view, authorizer) {
        this.model = model;
        this.view = view;
        this.authorizer = authorizer;
    }

    VoteController.prototype.model = null;
    VoteController.prototype.view = null;
    VoteController.prototype.authorizer = null;

    VoteController.prototype.initialise = function (baseURI) {
        this.baseURI = baseURI;
        this.authorizer.on("connected", this.checkExistingVote, this);
        this.authorizer.on("notAuthorized", this.handleNotAuthorized, this);
        this.view.on("voted", this.submitVote, this);
        jQuery.ajax({
            url: this.baseURI + "/poll",
            dataType:'jsonp',
            data: {
                article: this.getArticleId()
            }
        }).then(this.handleLoadedData.bind(this));
    };

    VoteController.prototype.handleLoadedData = function (json) {
        this.model.setAllData(json.questions[0]);
    };

    VoteController.prototype.getArticleId = function () {
        return jQuery("meta[property='og:url']").attr("content");
    };

    VoteController.prototype.checkExistingVote = function () {

        console.log("Controller: Checking for existing votes  on user " + this.authorizer.userId);

        jQuery.ajax({
            url: this.baseURI + "/user",
            type: "GET",
            dataType:'jsonp',
            data: {
                article: this.getArticleId(),
                user: this.authorizer.userId
            }
        }).then(this.handleUserExistingVote.bind(this));

    };

    VoteController.prototype.handleNotAuthorized = function () {
        console.log("Controller: User is not authorized to use app, but showing buttons");
        this.model.setAllowedToVote(true);
    };

    VoteController.prototype.handleUserExistingVote = function (user) {

        if (user.choice) {
            console.log("Controller: User has already voted for " + user.choice);
            this.model.registerVote(user.choice, false);
        } else {
            console.log("Controller: User has not voted yet");
            this.model.setAllowedToVote(true);
        }
    };

    VoteController.prototype.submitVote = function (choice) {
        this.authorizer.authUser().then(function () {
            jQuery.ajax({
                url: this.baseURI + "/vote",
                dataType:'jsonp',
                data: {
                    article: this.getArticleId(),
                    access_token: this.authorizer.accessToken,
                    user: this.authorizer.userId,
                    action: choice
                }
            }).then(this.handlePostResponse.bind(this, choice));

        }.bind(this));
    };

    VoteController.prototype.handlePostResponse = function (choice, response) {
        if (response.error) {
            console.error("Controller: Sorry - could not register your vote: " + response.error.message);
        } else {
            console.log("Controller: Posted response to Facebook OK. Voted for " + choice);
            this.model.registerVote(choice, true);
        }
    };

    VoteController.prototype.destroy = function () {
        this.model.un(null, this);
    };

    VoteController.APP_NAMESPACE = "theguardian-spike";

    guardian.facebook.VoteController = VoteController;

})();
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

        this.authorizer.onNotAuthorized.then(this.handleNotAuthorized.bind(this));
        this.authorizer.onConnected.then(this.checkExistingVote.bind(this));
        this.authorizer.onConnected.then(this.submitVoteWhenLoggedIn.bind(this));

        this.view.on("voted", this.submitVote.bind(this));
        jQuery.ajax({
            url: this.baseURI + "/poll",
            dataType: 'jsonp',
            data: {
                article: this.getArticleId()
            }
        }).then(handleResponse(this.handleLoadedData.bind(this)));
    };

    VoteController.prototype.handleNotAuthorized = function () {
        console.log("Controller: User is not authorized to use app, but showing buttons");
        this.model.setAllowedToVote(true);
    };

    VoteController.prototype.handleLoadedData = function (json) {
        console.log(json);
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
            dataType: 'jsonp',
            data: {
                article: this.getArticleId(),
                user: this.authorizer.userId
            }
        }).then(handleResponse(this.handleUserExistingVote.bind(this)));

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
        this.choice = choice;
        this.authorizer.login().then(this.submitVoteWhenLoggedIn.bind(this));
    };

    VoteController.prototype.submitVoteWhenLoggedIn = function () {
        if (this.choice) {
            jQuery.ajax({
                url: this.baseURI + "/vote",
                dataType: 'jsonp',
                data: {
                    article: this.getArticleId(),
                    access_token: this.authorizer.accessToken,
                    user: this.authorizer.userId,
                    action: this.choice
                }
            }).then(handleResponse(this.handlePostResponse.bind(this, this.choice)));
        }
        this.choice = null;
    };

    VoteController.prototype.handlePostResponse = function (choice, response) {
        console.log("Controller: Posted response to Facebook OK. Voted for " + choice);
        this.model.registerVote(choice, true);
    };

    function handleResponse(successFunction) {
        return (function (response) {
            if (response.error) {
                console.error(response.error.message);
            } else {
                successFunction(response.data)
            }
        });
    }

    VoteController.APP_NAMESPACE = "theguardian-spike";

    guardian.facebook.VoteController = VoteController;

})();
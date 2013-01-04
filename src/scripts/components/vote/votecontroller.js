(function () {

    function VoteController(model, view, authorizer) {
        this.model = model;
        this.view = view;
        this.authorizer = authorizer;
    }

    VoteController.prototype.baseURI = null;
    VoteController.prototype.model = null;
    VoteController.prototype.view = null;
    VoteController.prototype.authorizer = null;

    /**
     * Initialises callbacks and makes a call to get the poll data from the server.
     * @param {String} baseURI The base URI for this and all subsequent XHR requests
     * @param {String} type The type of poll to request (agree_with_author or agree_with_headline)
     */
    VoteController.prototype.initialise = function (baseURI, type) {
        this.baseURI = baseURI;

        this.authorizer.onNotAuthorized.then(this.handleNotAuthorized.bind(this));
        this.authorizer.onConnected.then(this.checkExistingVote.bind(this));
        this.authorizer.onConnected.then(this.submitVoteWhenLoggedIn.bind(this));

        this.view.on("voted", this.submitVote.bind(this));
        jQuery.ajax({
            url: this.baseURI + "/poll?type=" + type,
            dataType: 'jsonp',
            jsonpCallback: 'votecontroller',
            data: {
                article: this.getArticleId()
            }
        }).then(handleResponse(this.handleLoadedData.bind(this)));
    };

    VoteController.prototype.handleNotAuthorized = function () {
        this.model.setAllowedToVote(true);
    };

    VoteController.prototype.handleLoadedData = function (json) {
        this.model.setAllData(json.questions[0]);
    };

    VoteController.prototype.getArticleId = function () {
        return jQuery("meta[property='og:url']").attr("content");
    };

    VoteController.prototype.checkExistingVote = function () {

        jQuery.ajax({
            url: this.baseURI + "/user",
            type: "GET",
            dataType: 'jsonp',
            jsonpCallback: 'votecontroller',
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
                jsonpCallback: 'votecontroller',
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

    /**
     * Type of vote when the user is asked to agree with the opinion of the author on a topic
     * @type {string}
     */
    VoteController.AGREE_WITH_OPINION = "agree_with_opinion";

    /**
     * Type of vote when the user is asked to agree with the headline of the article (not the author's opinion on the matter)
     * @type {string}
     */
    VoteController.AGREE_WITH_HEADLINE = "agree_with_headline";

    /**
     * Type of vote when the user is asked to consider whether the proposal is likely or not
     * @type {string}
     */
    VoteController.THINK_LIKELY = "think_headline_likely";

    guardian.facebook.VoteController = VoteController;

})();
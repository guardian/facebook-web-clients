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
     */
    VoteController.prototype.initialise = function (baseURI) {
        this.baseURI = baseURI;

        this.authorizer.onNotAuthorized.then(this.handleNotAuthorized.bind(this));
        this.authorizer.onConnected.then(this.checkExistingVote.bind(this));
        this.authorizer.onConnected.then(this.submitVoteWhenLoggedIn.bind(this));

        this.model.on("voted", this.submitVote.bind(this));

        jQuery.ajax({
            url: this.baseURI + "/poll?type=" + this.model.type,
            dataType: 'jsonp',
            jsonpCallback: 'votecontroller_initialise',
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
            jsonpCallback: 'votecontroller_existingvotecheck',
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
        this.model.submittedChoice = choice;
        this.authorizer.login().then(this.submitVoteWhenLoggedIn.bind(this));
        this.authorizer.cancelledLogin.then(this.cancelVoteSubmission.bind(this));
    };

    VoteController.prototype.cancelVoteSubmission = function () {
        this.model.submittedChoice = null;
        this.view.render();
    };

    VoteController.prototype.submitVoteWhenLoggedIn = function () {
        if (this.model.submittedChoice) {
            jQuery.ajax({
                url: this.baseURI + "/vote",
                dataType: 'jsonp',
                jsonpCallback: 'votecontroller_submitvote',
                data: {
                    article: this.getArticleId(),
                    access_token: this.authorizer.accessToken,
                    user: this.authorizer.userId,
                    action: this.model.submittedChoice
                }
            }).then(handleResponse(
                    this.handlePostResponse.bind(this, this.model.submittedChoice),
                    this.handleVoteFailed.bind(this)
                ));
        }
        this.model.submittedChoice = null;
    };

    VoteController.prototype.handlePostResponse = function (choice, response) {
        console.log("Controller: Posted response to Facebook OK. Voted for " + choice);
        this.model.registerVote(choice, true);
    };

    VoteController.prototype.handleVoteFailed = function () {
        console.log("Unable to vote. Possibly already voted already or has not given permission to do so.");
        this.view.render();
    };

    function handleResponse(successFunction, errorFunction) {
        return (function (response) {
            if (response.data.error) {
                errorFunction && errorFunction();
                console.error("Error from server: " + response.data.error.message);
            } else {
                successFunction(response.data)
            }
        });
    }

    guardian.facebook.VoteController = VoteController;

})();
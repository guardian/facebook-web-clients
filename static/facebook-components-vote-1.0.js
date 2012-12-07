/* Facebook Web Clients 1.0 */

ensurePackage("guardian.facebook");
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
(function () {

    function LoginButtonView(selector, authorizer) {
        this.jContainer = jQuery(selector);
        this.authorizer = authorizer;
        this.authorizer.getLoginStatus().then(this.showLoggedIn.bind(this));
        this.authorizer.on("notLoggedIn", this.showLoginButton, this);
        this.authorizer.on("notAuthorized", this.showAuthorizeButton, this);
        this.authorizer.on("gotUserDetails", this.showLoggedIn, this);
        this.jContainer.delegate(".login", "click.vote-component", this.handleLoginClick.bind(this));
    }

    LoginButtonView.prototype.showLoggedIn = function (userDetails) {
        if (userDetails && userDetails.name) {
            this.jContainer.find(".user-details").html("<span class='login'>Logged in as " + userDetails.name + "</span>");
        } else {
            this.jContainer.find(".user-details").html("<span class='login'>Logged in</span>");
        }
    };

    LoginButtonView.prototype.showLoginButton = function () {
        if (this.jContainer.find("a.login").length) {
            this.handleLoginClick();
            return;
        }
        this.jContainer.find(".user-details").html("<a class='login' href='http://www.facebook.com/'>Log in to Facebook</a>")
    };

    LoginButtonView.prototype.showAuthorizeButton = function () {
        console.log("Showing authorize button");
        if (this.jContainer.find(".login").length) {
            this.handleLoginClick();
            return;
        }
        this.jContainer.find(".user-details").html("<a class='login' href='http://www.facebook.com/'>Use the Guardian Facebook App</a>")
    };

    LoginButtonView.prototype.handleLoginClick = function () {
        this.jContainer.find(".user-details").empty();
        this.authorizer.authUser();
        return false;
    };

    guardian.facebook.LoginButtonView = LoginButtonView;

})();
(function () {

    function VoteModel() {
        this.choice = undefined;
        this.allowedToVote = true;
        this.dataDeferred = jQuery.Deferred();
    }

    VoteModel.prototype = Object.create(Subscribable.prototype);

    VoteModel.prototype.questionId = null;
    VoteModel.prototype.options = null;
    VoteModel.prototype.choice = null;
    VoteModel.prototype.allowedToVote = null;

    VoteModel.prototype.setAllData = function (data) {
        this.questionId = data.id;
        this.answers = data.answers;
        this.fire("dataChanged");
        this.dataDeferred.resolve();
    };

    VoteModel.prototype.whenDataIsSet = function () {
        return this.dataDeferred.promise();
    };

    VoteModel.prototype.setAllowedToVote = function (allowedToVote) {
        this.allowedToVote = allowedToVote;
        this.fire("dataChanged");
    };

    VoteModel.prototype.getAgree = function () {
        return this.answers && this.answers[0].count;
    };

    VoteModel.prototype.getDisagree = function () {
        return this.answers && this.answers[1].count;
    };

    VoteModel.prototype.getTotal = function () {
        return this.getAgree() + this.getDisagree();
    };

    VoteModel.prototype.getAnswerById = function (answerId) {
        return this.answers.filter(function (answer) {
            return answer.id == answerId;
        })[0];
    };

    VoteModel.prototype.registerVote = function (answerId, changeCounts) {

        this.whenDataIsSet().then(function () {
            var answer = this.getAnswerById(answerId);
            if (answer) {
                if (changeCounts === undefined || changeCounts === true) {
                    console.log("Model: Registering new vote: " + answerId);
                    answer.count++;
                } else {
                    console.log("Model: Noticing existing vote: " + answerId);
                }
                this.choice = answerId;
                this.fire("dataChanged");
            } else {
                console.log("Unrecognised vote: " + answerId)
            }
        }.bind(this));

    };

    VoteModel.prototype.getSummaryText = function () {
        if (this.choice) {
            return "Your response was: " + this.getAnswerById(this.choice).label;
        } else {
            return "Your vote will be counted and shared on Facebook";
        }
    };

    VoteModel.prototype.canVote = function () {
        return !this.choice && this.allowedToVote;
    };

    VoteModel.prototype.getAgreePercent = function () {
        var total = this.getTotal();
        if (total) {
            return (this.getAgree() / total) * 100;
        } else {
            return VoteModel.EVEN;
        }
    };

    VoteModel.prototype.destroy = function () {
        this.un();
    };

    VoteModel.EVEN = 50;

    guardian.facebook.VoteModel = VoteModel;

})();
(function () {

    function VoteComponent(selector, model, donutClass) {
        this.jContainer = jQuery(selector).removeClass("initially-off");
        this.model = model;
        this.initialise(donutClass);
    }

    VoteComponent.prototype = Object.create(Subscribable.prototype);

    VoteComponent.prototype.jContainer = null;
    VoteComponent.prototype.donut = null;
    VoteComponent.prototype.model = null;

    VoteComponent.prototype.initialise = function (donutClass) {
        this.jContainer.html(VoteComponent.HTML);
        this.model.on("dataChanged", this.render, this);
        this.donut = new donutClass(this.jContainer.find(".donut-container"));
        this.jContainer.delegate(".btn", "click.vote-component", this.handleButtonClick.bind(this));
    };

    VoteComponent.prototype.setVotingInProgress = function () {
        this.jContainer.find(".social-summary .text").html("Sending your vote to Facebook...");
    };

    VoteComponent.prototype.render = function () {

        this.donut.render(this.model.getAgreePercent());

        var answers = this.model.answers;
        this.jContainer.find(".choice").each(function (index, element) {

            var answer = answers[index];
            jQuery(element).attr("data-action", answer.id);
            jQuery(element).find(".count").html(answer.count);
            jQuery(element).find(".label").html(answer.label);

        });

        this.jContainer.find(".choice").toggleClass("btn", this.model.canVote());
        this.jContainer.find(".social-summary .text").html(this.model.getSummaryText());
    };

    VoteComponent.prototype.handleButtonClick = function (jEvent) {
        var jTarget = jQuery(jEvent.currentTarget),
            action = jTarget.data("action");
        this.jContainer.find(".btn").removeClass("btn");
        this.fire("voted", action);
    };

    VoteComponent.prototype.destroy = function () {
        this.model.un(null, this);
        this.jContainer.undelegate(".vote-component");
    };

    VoteComponent.HTML = '' +
        '<div class="vote-component">' +
        '<div class="vote-area">' +
        '<span class="choice agree" data-action="agree"><span class="label"></span><span class="count"></span></span>' +
        '<div class="donut-container"></div>' +
        '<span class="choice disagree" data-action="disagree"><span class="count"></span><span class="label"></span></span>' +
        '</div>' +
        '<div class="social-summary">' +
        '<span class="text"></span>' +
        '<div class="facebook-auth-status">' +
        '<div class="user-details"></div>' +
        '</div>' +
        '</div>' +
        '</div>';

    guardian.facebook.VoteComponent = VoteComponent;

})();
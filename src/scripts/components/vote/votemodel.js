(function () {

    /**
     * @constructor
     * @param {String} type The type of poll, eg "agree_with_opinion"
     */
    function VoteModel(type) {
        this.type = type;
        this.choice = undefined;
        this.allowedToVote = true;
        this.submittedChoice = null;
        this.dataDeferred = jQuery.Deferred();
    }

    VoteModel.prototype = Object.create(EventEmitter.prototype);

    VoteModel.prototype.type = null;
    VoteModel.prototype.questionId = null;
    VoteModel.prototype.options = null;
    VoteModel.prototype.choice = null;
    VoteModel.prototype.allowedToVote = null;
    VoteModel.prototype.submittedChoice = null;

    VoteModel.prototype.setAllData = function (data) {
        this.answers = data.answers;
        this.trigger(VoteModel.DATA_CHANGED);
        this.dataDeferred.resolve();
    };

    VoteModel.prototype.setSubmittedChoice = function (choice) {
        if (this.canVote()) {
            this.submittedChoice = choice;
            this.trigger("voted", [choice]);
        }
    };

    VoteModel.prototype.whenDataIsSet = function () {
        return this.dataDeferred.promise();
    };

    VoteModel.prototype.setAllowedToVote = function (allowedToVote) {
        this.allowedToVote = allowedToVote;
        this.trigger(VoteModel.DATA_CHANGED);
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
                this.trigger(VoteModel.DATA_CHANGED);
            } else {
                console.log("Unrecognised vote: " + answerId)
            }
        }.bind(this));

    };

    VoteModel.prototype.getVotelabel = function () {
        if (this.choice) {
            return this.getAnswerById(this.choice).label;
        } else {
            return undefined;
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
        this.removeEvent(); // remove all events
    };

    /**
     * @event
     */
    VoteModel.DATA_CHANGED = "dataChanged";

    VoteModel.EVEN = 50;

    /**
     * Type of vote when the user is asked to agree with the opinion of the author on a topic
     * @type {string}
     */
    VoteModel.AGREE_WITH_OPINION = "agree_with_opinion";

    /**
     * Type of vote when the user is asked to agree with the headline of the article (not the author's opinion on the matter)
     * @type {string}
     */
    VoteModel.AGREE_WITH_HEADLINE = "agree_with_headline";

    /**
     * Type of vote when the user is asked to consider whether the proposal is likely or not
     * @type {string}
     */
    VoteModel.THINK_LIKELY = "think_headline_likely";

    guardian.facebook.VoteModel = VoteModel;

})();
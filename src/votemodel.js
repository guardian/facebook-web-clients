(function () {

    function VoteModel() {
        this.choice = undefined;
        this.allowedToVote = false;
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
    };

    VoteModel.prototype.setAllowedToVote = function(allowedToVote) {
        this.allowedToVote =  allowedToVote;
        this.fire("dataChanged");
    };

    VoteModel.prototype.getAgree = function () {
        return this.answers[0].count;
    };

    VoteModel.prototype.getDisagree = function () {
        return this.answers[1].count;
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
        console.log("Registering vote: " + answerId);
        var answer = this.getAnswerById(answerId);
        if (answer) {
            if (changeCounts === undefined || changeCounts === true) {
                answer.count++;
            }
            this.choice = answerId;
            this.fire("dataChanged");
        } else {
            console.log("Unrecognised vote: " + answerId)
        }
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

    VoteModel.prototype.destroy = function() {
        this.un();
    };

    VoteModel.EVEN = 50;

    guardian.facebook.VoteModel = VoteModel;

})();
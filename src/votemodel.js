(function () {

    function VoteModel() {
        this.options = {
            "agree": {
                label: "Likely",
                count: 1
            },
            "disagree": {
                label: "Unlikely",
                count: 3
            }
        };
        this.choice = undefined;
    }

    VoteModel.prototype.options = null;
    VoteModel.prototype.choice = null;

    VoteModel.prototype.getAgree = function() {
        return this.options.agree.count;
    };

    VoteModel.prototype.getDisagree = function() {
        return this.options.disagree.count;
    };

    VoteModel.prototype.getTotal = function () {
        return this.getAgree() + this.getDisagree();
    };

    VoteModel.prototype.registerVote = function (choice) {
        this.options[choice].count++;
        this.choice = choice;
    };

    VoteModel.prototype.getSummaryText = function () {
        if (this.choice) {
            return "You said that this rumour is " + this.options[this.choice].label;
        } else {
            return "Be the first of your friends to share your opinion";
        }
    };

    VoteModel.prototype.votedAlready = function () {
        return !!this.choice;
    };

    VoteModel.prototype.getAgreePercent = function () {
        var total = this.getTotal();
        if (total) {
            return (this.options.agree.count / total) * 100;
        } else {
            return VoteModel.EVEN;
        }
    };

    VoteModel.EVEN = 50;

    guardian.facebook.VoteModel = VoteModel;

})();
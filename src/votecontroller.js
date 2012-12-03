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

    VoteController.prototype.submitVote = function (choice) {
        this.authorizer.authorize().then(function() {
            this.model.registerVote(choice);
        }.bind(this));
    };

    VoteController.prototype.destroy = function () {
        this.model.un(null, this);
    };

    guardian.facebook.VoteController = VoteController;

})();
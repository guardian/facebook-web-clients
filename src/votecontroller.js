(function () {

    function VoteController(model) {
        this.model = model;
    }

    VoteController.prototype.model = null;

    VoteController.prototype.initialise = function(url) {
        jQuery.ajax({
            url: url
        }).then(this.handleLoadedData.bind(this));
    };

    VoteController.prototype.handleLoadedData = function(json) {
        console.log("Got data: " + json);
        this.model.setAllData(json.questions[0]);
    };

    guardian.facebook.VoteController = VoteController;

})();
(function() {

    function VoteComponent(selector) {
        this.jContainer = jQuery(selector);
        this.initialise();
    }

    VoteComponent.prototype.jContainer = null;
    VoteComponent.prototype.donut = null;

    VoteComponent.prototype.initialise = function() {
        this.donut = new guardian.ui.Donut(this.jContainer.find(".donutContainer"));
        this.jContainer.delegate(".btn", "click.voteComponent", this.handleButtonClick.bind(this));
    };

    VoteComponent.prototype.render = function() {
        this.donut.render();
    };

    VoteComponent.prototype.handleButtonClick = function(jEvent) {
        var jTarget = jQuery(jEvent.currentTarget),
            action = jTarget.data("action");

        alert("Thank you for deciding to " + action);

    };

    VoteComponent.prototype.destroy = function() {
        this.jContainer.undelegate(".voteComponent");
    };

    guardian.facebook.VoteComponent = VoteComponent;

})();
(function() {

    function VoteComponent(selector, model) {
        this.jContainer = jQuery(selector);
        this.model = model;
        this.initialise();
    }

    VoteComponent.prototype.jContainer = null;
    VoteComponent.prototype.donut = null;
    VoteComponent.prototype.model = null;

    VoteComponent.prototype.initialise = function() {
        this.donut = new guardian.ui.Donut(this.jContainer.find(".donutContainer"));
        this.jContainer.delegate(".btn", "click.voteComponent", this.handleButtonClick.bind(this));
        this.jContainer.find("[data-action='agree'] .count").html(this.model.agree);
        this.jContainer.find("[data-action='disagree'] .count").html(this.model.disagree);
    };

    VoteComponent.prototype.render = function() {
        this.donut.render(this.model.getAgreePercent());
    };

    VoteComponent.prototype.handleButtonClick = function(jEvent) {
        var jTarget = jQuery(jEvent.currentTarget),
            action = jTarget.data("action");

        this.jContainer.find(".btn").removeClass("btn");

    };

    VoteComponent.prototype.destroy = function() {
        this.jContainer.undelegate(".voteComponent");
    };

    guardian.facebook.VoteComponent = VoteComponent;

})();
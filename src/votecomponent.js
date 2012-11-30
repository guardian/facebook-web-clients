(function () {

    function VoteComponent(selector, model) {
        this.jContainer = jQuery(selector);
        this.model = model;
        this.initialise();
    }

    VoteComponent.prototype.jContainer = null;
    VoteComponent.prototype.donut = null;
    VoteComponent.prototype.model = null;

    VoteComponent.prototype.initialise = function () {
        this.donut = new guardian.ui.CanvasDonut(this.jContainer.find(".donutContainer"));
        this.jContainer.delegate(".btn", "click.voteComponent", this.handleButtonClick.bind(this));
    };

    VoteComponent.prototype.render = function () {
        this.donut.render(this.model.getAgreePercent());

        this.jContainer.find("[data-action='agree'] .count").html(this.model.getAgree());
        this.jContainer.find("[data-action='agree'] .label").html(this.model.options.agree.label);

        this.jContainer.find("[data-action='disagree'] .count").html(this.model.getDisagree());
        this.jContainer.find("[data-action='disagree'] .label").html(this.model.options.disagree.label);

        if (this.model.votedAlready()) {
            this.jContainer.find(".btn").removeClass("btn");
        }
        this.jContainer.find(".socialSummary .text").html(this.model.getSummaryText());
    };

    VoteComponent.prototype.handleButtonClick = function (jEvent) {
        var jTarget = jQuery(jEvent.currentTarget),
            action = jTarget.data("action");
        this.model.registerVote(action);
        this.render();
    };

    VoteComponent.prototype.destroy = function () {
        this.jContainer.undelegate(".voteComponent");
    };

    guardian.facebook.VoteComponent = VoteComponent;

})();
(function () {

    function VoteComponent(selector, model, donutClass) {
        this.jContainer = jQuery(selector);
        this.model = model;
        this.initialise(donutClass);
    }

    VoteComponent.prototype = Object.create(Subscribable.prototype);

    VoteComponent.prototype.jContainer = null;
    VoteComponent.prototype.donut = null;
    VoteComponent.prototype.model = null;

    VoteComponent.prototype.initialise = function (donutClass) {
        this.model.on("dataChanged", this.render, this);
        this.donut = new donutClass(this.jContainer.find(".donut-container"));
        this.jContainer.delegate(".btn", "click.vote-component", this.handleButtonClick.bind(this));
    };

    VoteComponent.prototype.setVotingInProgress = function() {
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

    guardian.facebook.VoteComponent = VoteComponent;

})();
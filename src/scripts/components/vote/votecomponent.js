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

        if (!this.animated) {
            this.animated = true;
            jQuery(".vote-component").animate({"height": "180px"});
        }
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
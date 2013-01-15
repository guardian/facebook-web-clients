(function () {

    function VoteComponent(selector, model, donutClass, numberFormatter) {
        this.jContainer = jQuery(selector).removeClass("initially-off");
        this.model = model;
        this.numberFormatter = numberFormatter;
        this.initialise(donutClass);
    }

    VoteComponent.prototype = Object.create(EventEmitter.prototype);

    VoteComponent.prototype.jContainer = null;
    VoteComponent.prototype.donut = null;
    VoteComponent.prototype.numberFormatter = null;
    VoteComponent.prototype.model = null;

    VoteComponent.prototype.initialise = function (donutClass) {
        this.jContainer.html(VoteComponent.HTML);
        this.renderCallback = this.render.bind(this);
        this.model.on("dataChanged", this.renderCallback);
        this.donut = new donutClass(this.jContainer.find(".donut-container"));
        this.jContainer.delegate(".btn:not(.disabled)", "click.vote-component", this.handleButtonClick.bind(this));
    };

    VoteComponent.prototype.updateButton = function (answers, index, element) {
        var answer = answers[index], jElement = jQuery(element);
        jElement.attr("data-action", answer.id);
        jElement.find(".count").html(this.numberFormatter(answer.count));
        jElement.find(".label").html(answer.label);
        if (this.model.choice) {
            jElement.removeClass("btn");
            if (answer.id == this.model.choice) {
                jElement.addClass("selected");
            } else {
                jElement.addClass("disabled");
            }
        } else {
            jElement.addClass("btn");
        }
    };

    VoteComponent.prototype.render = function () {

        this.donut.setPercent(this.model.getAgreePercent());

        this.jContainer.find(".choice")
            .each(this.updateButton.bind(this, this.model.answers));

        if (!this.animated) {
            this.animated = true;
            jQuery(".vote-component").animate({"height": "180px"});
        }
    };

    VoteComponent.prototype.handleButtonClick = function (jEvent) {
        var jTarget = jQuery(jEvent.currentTarget),
            action = jTarget.data("action");
        if (this.model.canVote()) {
            jTarget.find(".label").text("Sharing...");
            this.trigger("voted", [action]);
        }
    };

    VoteComponent.prototype.destroy = function () {
        this.model.removeEvent("dataChanged", this.renderCallback);
        this.jContainer.undelegate(".vote-component");
    };

    VoteComponent.HTML = '' +
        '<div class="vote-component">' +
        '<strong class="vote-title"></strong>' +
        '<div class="social-summary">' +
        '<img class="avatar initially-off" />' +
        '<img class="facebookIcon" src="http://facebook-web-clients.appspot.com/static/facebookIcon_16x16.gif" />' +
        '<div class="message"></div>' +
        '</div>' +
        '<div class="vote-area">' +
        '<span class="choice agree btn zone-primary-background" data-action="agree"><span class="tick">&#10004;</span><span class="label"></span><span class="count zone-primary-background"></span></span>' +
        '<div class="donut-container"></div>' +
        '<span class="choice disagree btn zone-secondary-background" data-action="disagree"><span class="count zone-secondary-background"></span><span class="label"></span><span class="tick">&#10004;</span></span>' +
        '</div>' +
        '</div>';

    guardian.facebook.VoteComponent = VoteComponent;

})();
/* Facebook Web Clients 1.0 */

ensurePackage("guardian.ui");
ensurePackage("guardian.facebook");
(function (jQuery) {

    function Donut(container) {
        this.jContainer = jQuery(container);
        this.initialise();
    }

    Donut.prototype.jContainer = null;
    Donut.prototype.paper = null;

    Donut.prototype.initialise = function () {
        var width = this.jContainer.width(),
            height = this.jContainer.height(),
            centerX = width / 2,
            centerY = height / 2,
            radius = (Math.min(width, height) - 24) / 2;

        this.paper = new window.Raphael(this.jContainer[0], width, height);
        this.paper.customAttributes.notch = function (percent) {
            var alpha = 360 / 100 * percent,
                rads = (90 - alpha) * Math.PI / 180,
                dx = width * Math.cos(rads),
                dy = width * Math.sin(rads),
                path;
            path = [
                ["M", centerX, centerY],
                ["l", dx, -dy]
            ];
            return {path: path};
        };
        this.paper.customAttributes.arc = function (percent) {
            var alpha = 360 / 100 * percent,
                a = (90 - alpha) * Math.PI / 180,
                x = centerX + radius * Math.cos(a),
                y = centerY - radius * Math.sin(a),
                path;
            if (percent == 100) {
                path = [
                    ["M", centerX, centerY - radius],
                    ["A", radius, radius, 0, 1, 1, centerX - 0.01, centerX - radius]
                ];
            } else {
                path = [
                    ["M", centerX, centerY - radius],
                    ["A", radius, radius, 0, +(alpha > 180), 1, x, y]
                ];
            }
            return {path: path};
        };
        this.paper.customAttributes.turn = function (percent, centerAngle) {
            var alpha = 360 / 100 * percent,
                angle = centerAngle - (alpha / 2);
            return ({"transform": ["R" + angle, centerX, centerX].join()});
        };
    };

    Donut.prototype.render = function (percent) {

        if (!this.rightSegment) {

            this.paper.path()
                .attr(Donut.NEGATIVE)
                .attr({arc: [100]});

            var
                rightSegment = this.paper.path()
                    .attr(Donut.POSITIVE)
                    .attr({arc: [50]}),
                notch1 = this.paper.path()
                    .attr(Donut.NOTCH)
                    .attr({notch: [0]}),
                notch2 = this.paper.path()
                    .attr(Donut.NOTCH)
                    .attr({notch: [50]}),
                group = this.paper.set()
                    .push(rightSegment, notch1, notch2)
                    .attr({turn: [50, Donut.LEFT_ANGLE]});

            this.rightSegment = rightSegment;
            this.notch2 = notch2;
            this.group = group;

        }

        this.rightSegment.animate({arc: [percent]}, 500, "ease-in-out");
        this.notch2.animate({notch: [percent]}, 500, "ease-in-out");
        this.group.animate({turn: [percent, Donut.LEFT_ANGLE]}, 500, "ease-in-out")

    };

    Donut.LEFT_ANGLE = 270;
    Donut.RIGHT_ANGLE = 90;
    Donut.POSITIVE = {stroke: "#3A7D00", "stroke-width": 18};
    Donut.NEGATIVE = {stroke: "#0D3D00", "stroke-width": 18};
    Donut.NOTCH = {stroke: "#fff", "stroke-width": 4};

    guardian.ui.Donut = Donut;

})(window.jQuery);
(function () {

    function VoteModel() {
        this.options = {
            "agree": {
                label: "Likely",
                count: "1"
            },
            "disagree": {
                label: "Unlikely",
                count: 3
            }
        };
        this.vote = undefined;
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
        if (this.vote) {
            return "You think that this rumour is " + this.options[this.choice].label;
        } else {
            return "Be the first of your friends to share your opinion";
        }
    };

    VoteModel.prototype.votedAlready = function () {
        return false;//return !!this.choice;
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
        this.donut = new guardian.ui.Donut(this.jContainer.find(".donutContainer"));
        this.jContainer.delegate(".btn", "click.voteComponent", this.handleButtonClick.bind(this));
    };

    VoteComponent.prototype.render = function () {
        this.donut.render(this.model.getAgreePercent());
        this.jContainer.find("[data-action='agree'] .count").html(this.model.getAgree());
        this.jContainer.find("[data-action='disagree'] .count").html(this.model.getDisagree());
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
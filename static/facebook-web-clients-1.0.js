/* Facebook Web Clients 1.0 */

ensurePackage("guardian.ui");
ensurePackage("guardian.facebook");
(function (jQuery) {

    function SVGDonut(container) {
        this.jContainer = jQuery(container);
        this.initialise();
    }

    SVGDonut.prototype.jContainer = null;
    SVGDonut.prototype.paper = null;

    SVGDonut.prototype.initialise = function () {
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

    SVGDonut.prototype.render = function (percent) {

        if (!this.rightSegment) {

            this.paper.path()
                .attr(SVGDonut.NEGATIVE)
                .attr({arc: [100]});

            var
                rightSegment = this.paper.path()
                    .attr(SVGDonut.POSITIVE)
                    .attr({arc: [50]}),
                notch1 = this.paper.path()
                    .attr(SVGDonut.NOTCH)
                    .attr({notch: [0]}),
                notch2 = this.paper.path()
                    .attr(SVGDonut.NOTCH)
                    .attr({notch: [50]}),
                group = this.paper.set()
                    .push(rightSegment, notch1, notch2)
                    .attr({turn: [50, SVGDonut.LEFT_ANGLE]});

            this.rightSegment = rightSegment;
            this.notch2 = notch2;
            this.group = group;

        }

        this.rightSegment.animate({arc: [percent]}, 500, "ease-in-out");
        this.notch2.animate({notch: [percent]}, 500, "ease-in-out");
        this.group.animate({turn: [percent, SVGDonut.LEFT_ANGLE]}, 500, "ease-in-out")

    };

    SVGDonut.LEFT_ANGLE = 270;
    SVGDonut.RIGHT_ANGLE = 90;
    SVGDonut.POSITIVE = {stroke: "#3A7D00", "stroke-width": 18};
    SVGDonut.NEGATIVE = {stroke: "#0D3D00", "stroke-width": 18};
    SVGDonut.NOTCH = {stroke: "#fff", "stroke-width": 4};

    guardian.ui.SVGDonut = SVGDonut;

})(window.jQuery);
(function (jQuery) {

    function CanvasDonut(container) {
        this.jContainer = jQuery(container);
        this.initialise();
    }

    CanvasDonut.prototype.jContainer = null;
    CanvasDonut.prototype.ctx = null;

    CanvasDonut.prototype.getCanvas = function () {

        var canvas = document.createElement("canvas");
        canvas.width = this.jContainer.width();
        canvas.height = this.jContainer.height();
        this.jContainer[0].appendChild(canvas);

        if (window.G_vmlCanvasManager) {
            return window.G_vmlCanvasManager.initElement(canvas);
        } else {
            return canvas;
        }
    };

    CanvasDonut.prototype.initialise = function () {
        var canvas = this.getCanvas();
        this.ctx = canvas.getContext('2d');
    };

    CanvasDonut.prototype.render = function (dp) {

        var ctx = this.ctx,
            width = this.jContainer.width(),
            height = this.jContainer.height(),
            cx = width / 2,
            cy = height / 2,
            R = (Math.min(width, height) - 24) / 2,
            dr = (Math.PI * 2) * ((100 - dp) / 100),
            hdr = (dr / 2),
            dx = (R *2) * Math.cos(hdr),
            dy = (R *2) * Math.sin(hdr);

        ctx.clearRect(0,0, width, height);

        // draw the disagree arc as a full circle
        this.setStroke(CanvasDonut.NEGATIVE);
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2, true);
        ctx.stroke();

        // draw the agree arc on top
        this.setStroke(CanvasDonut.POSITIVE);
        ctx.beginPath();
        ctx.arc(cx, cy, R, -hdr, +hdr, true);
        ctx.stroke();

        // draw the notches on top
        this.setStroke(CanvasDonut.NOTCH);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + dx, cy + dy);
        ctx.stroke();

        // draw the notches on top
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + dx, cy - dy);
        ctx.stroke();

    };

    CanvasDonut.prototype.setStroke = function(settings) {
        this.ctx.lineWidth = settings["stroke-width"];
        this.ctx.strokeStyle = settings["stroke"];
    };

    CanvasDonut.POSITIVE = {stroke: "#3A7D00", "stroke-width": 18};
    CanvasDonut.NEGATIVE = {stroke: "#0D3D00", "stroke-width": 18};
    CanvasDonut.NOTCH = {stroke: "#fff", "stroke-width": 4};

    guardian.ui.CanvasDonut = CanvasDonut;

})(window.jQuery);
(function () {

    function VoteModel() {
        this.options = {
            "id": "rumour001",
            "agree": {
                label: "Likely",
                count: 0
            },
            "disagree": {
                label: "Unlikely",
                count: 0
            }
        };
        this.choice = undefined;
    }

    VoteModel.prototype.options = null;
    VoteModel.prototype.choice = null;

    VoteModel.prototype.setAllData = function (data) {
        this.options = data;
    };

    VoteModel.prototype.getAgree = function () {
        return this.options.agree.count;
    };

    VoteModel.prototype.getDisagree = function () {
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
(function () {

    function VoteComponent(selector, model, donutClass) {
        this.jContainer = jQuery(selector);
        this.model = model;
        this.initialise(donutClass);
    }

    VoteComponent.prototype.jContainer = null;
    VoteComponent.prototype.donut = null;
    VoteComponent.prototype.model = null;

    VoteComponent.prototype.initialise = function (donutClass) {
        this.donut = new donutClass(this.jContainer.find(".donutContainer"));
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
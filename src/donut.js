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

    Donut.prototype.render = function () {
        this.renderDonut(90);
    };

    Donut.prototype.renderDonut = function (percent) {

        this.paper.clear();

        this.paper.path()
            .attr(Donut.NEGATIVE)
            .attr({arc: [100]});

        var
            rightSegment = this.paper.path()
                .attr(Donut.POSITIVE)
                .attr({arc: [50]})
                .animate({arc: [percent]}, 500, "ease-in-out"),
            notch1 = this.paper.path()
                .attr(Donut.NOTCH)
                .attr({notch: [0]}),
            notch2 = this.paper.path()
                .attr(Donut.NOTCH)
                .attr({notch: [50]})
                .animate({notch: [percent]}, 500, "ease-in-out");

        this.paper.set()
            .push(rightSegment, notch1, notch2)
            .attr({turn: [50, Donut.LEFT_ANGLE]})
            .animate({turn: [percent, Donut.LEFT_ANGLE]}, 500, "ease-in-out");

    };

    Donut.LEFT_ANGLE = 270;
    Donut.RIGHT_ANGLE = 90;
    Donut.POSITIVE = {stroke: "#3A7D00", "stroke-width": 18};
    Donut.NEGATIVE = {stroke: "#0D3D00", "stroke-width": 18};
    Donut.NOTCH = {stroke: "#fff", "stroke-width": 5};

    guardian.ui.Donut = Donut;

})(window.jQuery);
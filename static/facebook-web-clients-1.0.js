/* Facebook Web Clients 1.0 */

/** @namespace */
guardian = guardian || {};
/** @namespace */
guardian.facebook = {};
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
                rads = alpha * Math.PI / 180,
                dx = width * Math.cos(rads),
                dy = width * Math.sin(rads),
                path;
            console.log("Notch alpha: " + alpha, dx, dy);
            path = [
                ["M", centerX, centerY],
                ["l", -dx, dy]
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
        this.paper.clear();

       this.paper.path()
            .attr(Donut.POSITIVE)
            .attr({arc: [25]})
            .attr({turn: [25, 90]});

        this.paper.path()
            .attr(Donut.NEGATIVE)
            .attr({arc: [75]})
            .attr({turn: [75, 270]});

        this.paper.path()
            .attr(Donut.NOTCH)
            .attr({notch: [0]})
            .attr({turn: [75, 270]});

        this.paper.path()
            .attr(Donut.NOTCH)
            .attr({notch: [75]})
            .attr({turn: [75, 270]});

    };

    Donut.NEGATIVE = {stroke: "#3A7D00", "stroke-width": 24};
    Donut.POSITIVE = {stroke: "#0D3D00", "stroke-width": 24};
    Donut.NOTCH = {stroke: "#fff", "stroke-width": 6};

    guardian.facebook.Donut = Donut;

})(window.jQuery);
(function() {

    function VoteComponent() {

    }

    guardian.facebook.VoteComponent = VoteComponent;

})();
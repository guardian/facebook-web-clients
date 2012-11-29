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
            halfWidth = width / 2,
            R = width / 2;

        this.paper = new window.Raphael(this.jContainer[0], width, height);
        this.paper.customAttributes.arc = function (value, total) {
            var alpha = 360 / total * value,
                a = (90 - alpha) * Math.PI / 180,
                x = halfWidth + R * Math.cos(a),
                y = halfWidth - R * Math.sin(a),
                path;
            if (total == value) {
                path = [
                    ["M", halfWidth, halfWidth - R],
                    ["A", R, R, 0, 1, 1, halfWidth - 0.01, halfWidth - R]
                ];
            } else {
                path = [
                    ["M", halfWidth, halfWidth - R],
                    ["A", R, R, 0, +(alpha > 180), 1, x, y]
                ];
            }
            return {path: path};
        };
    };

    Donut.prototype.render = function () {
        this.paper.clear();
        this.paper.path()
            .attr(Donut.NEGATIVE)
            .attr({arc: [30, 60]});
        this.paper.path()
            .attr(Donut.POSITIVE)
            .attr({arc: [30, 60]});
    };

    Donut.NEGATIVE = {stroke: "#f00", "stroke-width": 30};
    Donut.POSITIVE = {stroke: "#0f0", "stroke-width": 30};

    guardian.facebook.Donut = Donut;

})(window.jQuery);
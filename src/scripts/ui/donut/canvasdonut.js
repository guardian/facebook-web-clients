(function (jQuery) {

    ensurePackage("guardian.ui");

    function CanvasDonut(container) {
        this.jContainer = jQuery(container);
        this.currentDp = 50;
        this.initialise();
    }

    CanvasDonut.prototype.jContainer = null;
    CanvasDonut.prototype.ctx = null;
    CanvasDonut.prototype.currentDp = null;

    CanvasDonut.prototype.getCanvas = function () {

        var canvas = document.createElement("canvas");
        canvas.width = this.jContainer.width() || 160;
        canvas.height = this.jContainer.height() || 160;
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
        this.getCSSColours();
    };

    CanvasDonut.prototype.getCSSColours = function () {
        var agreeColour = jQuery(".agree .count").css("background-color"),
            disagreeColour = jQuery(".disagree .count").css("background-color");
        if (agreeColour == "rgba(0, 0, 0, 0)") {
            window.setTimeout(this.getCSSColours.bind(this), 50);
        } else {
            CanvasDonut.POSITIVE.stroke = agreeColour;
            CanvasDonut.NEGATIVE.stroke = disagreeColour;
            this.render();
        }
    };

    CanvasDonut.prototype.setPercent = function (dp) {
        if (window.webkitRequestAnimationFrame) {
            // smooth animation (currently only on Chrome)
            this.targetDp = dp;
            this.animate();
        } else {
            // skip straight to the right position
            this.currentDp = dp;
            this.render();
        }
    };

    CanvasDonut.prototype.animate = function () {
        var delta = (this.targetDp - this.currentDp);
        this.currentDp += delta * 0.1;
        this.render();
        if (Math.abs(delta) > 0.1) {
            window.webkitRequestAnimationFrame(this.animate.bind(this));
        }
    };

    CanvasDonut.prototype.render = function () {

        var dp = this.currentDp,
            ctx = this.ctx,
            width = this.jContainer.width(),
            height = this.jContainer.height(),
            cx = width / 2,
            cy = height / 2,
            R = (Math.min(width, height) - 24) / 2,
            dr = (Math.PI * 2) * ((100 - dp) / 100),
            hdr = (dr / 2),
            dx = (R * 2) * Math.cos(hdr),
            dy = (R * 2) * Math.sin(hdr);

        ctx.clearRect(0, 0, width, height);

        // draw the disagree arc as a full circle
        this.setStroke(dp == 100 ? CanvasDonut.POSITIVE : CanvasDonut.NEGATIVE);
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2, true);
        ctx.stroke();

        if (dp > 0) {

            // draw the agree arc on top
            this.setStroke(CanvasDonut.POSITIVE);
            ctx.beginPath();
            ctx.arc(cx, cy, R, -hdr, +hdr, true);
            ctx.stroke();

        }

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

    CanvasDonut.prototype.setStroke = function (settings) {
        this.ctx.lineWidth = settings["stroke-width"];
        this.ctx.strokeStyle = settings["stroke"];
    };

    CanvasDonut.POSITIVE = {stroke: "#666666", "stroke-width": 18};
    CanvasDonut.NEGATIVE = {stroke: "#333333", "stroke-width": 18};
    CanvasDonut.NOTCH = {stroke: "#fff", "stroke-width": 1};

    guardian.ui.CanvasDonut = CanvasDonut;

})(window.jQuery);
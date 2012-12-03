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

    function VoteController(model) {
        this.model = model;
    }

    VoteController.prototype.model = null;

    VoteController.prototype.initialise = function(url) {
        jQuery.ajax({
            url: url
        }).then(this.handleLoadedData.bind(this));
    };

    VoteController.prototype.handleLoadedData = function(json) {
        console.log("Got data: " + json);
        this.model.setAllData(json.questions[0]);
    };

    guardian.facebook.VoteController = VoteController;

})();
(function () {

    // Additional JS functions here
    window.fbAsyncInit = function () {

        document.getElementById("loginButton").onclick = authUser;

        FB.init({
            appId: '289251094430759',
            channelUrl: '//olly.guardian.co.uk:8080/channel.html', // TODO: Change this
            status: true, // check login status
            cookie: true, // enable cookies to allow the server to access the session
            xfbml: true  // parse XFBML
        });

        // Check if the current user is logged in and has authorized the app
        FB.getLoginStatus(checkLoginStatus);

        // Login in the current user via Facebook and ask for email permission
        function authUser() {
            FB.login(checkLoginStatus, {scope: 'email'});
        }

        // Check the result of the user status and display login button if necessary
        function checkLoginStatus(response) {
            if (response && response.status == 'connected') {

                // Hide the login button
                document.getElementById('loginButton').style.display = 'none';

                var
                    model = new guardian.facebook.VoteModel(),
                    view = new guardian.facebook.VoteComponent(".voteComponent", model, guardian.ui.CanvasDonut),
                    controller = new guardian.facebook.VoteController(model);

                controller.initialise("test.json");

            } else {

                // Display the login button
                document.getElementById('loginButton').style.display = 'block';
            }
        }

    };

    guardian.facebook.loader = function (d) {
        var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement('script');
        js.id = id;
        js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";
        ref.parentNode.insertBefore(js, ref);
    };

})();


/**
 * @class
 */
var Subscribable = (function () {

    "use strict";

    /**
     * The Subscribable class is the underlying component in a pub/sub application providing the ability
     * to "fire" events and bind handlers using "on" and remove them again with "un"
     *
     * @constructor
     * @name Subscribable
     */
    function Subscribable() {
    }

    /**
     *
     * @param {Object} subscribable
     */
    Subscribable.prepareInstance = function(subscribable) {
        subscribable.__events = {};
        subscribable.__handlers = [];
        subscribable.on = Subscribable.on;
        subscribable.un = Subscribable.un;
        subscribable.fire = Subscribable.fire;
        subscribable.hasListener = Subscribable.hasListener;
    };

    /**
     * The events object stores the names of the events that have listeners and the numeric IDs of the handlers
     * that are listening to the events.
     * @type {Object[]}
     */
    Subscribable.prototype.__events = null;

    /**
     * The handlers object is an array of handlers that will respond to the events being fired.
     * @type {Object[]}
     */
    Subscribable.prototype.__handlers = null;

    /**
     *
     */
    Subscribable.prototype.on = function() {
        Subscribable.prepareInstance(this);
        return this.on.apply(this, arguments);
    };

    /**
     *
     */
    Subscribable.prototype.un = function() {
        return this;
    };

    /**
     *
     */
    Subscribable.prototype.fire = function() {
        return true;
    };

    /**
     * Checks for whether there are any listeners for the supplied event type, where the event type can either be the
     * string name of an event or an event constructor.
     *
     * When the eventType parameter is omitted, the method will check for a handler against any event type.
     *
     * @param {String|Function} [eventType]
     */
    Subscribable.prototype.hasListener = function(eventType) {
        return false;
    };

    /**
     * Fires the named event with any arguments used as the call to fire.
     *
     * @param {String} eventName
     */
    Subscribable.fire = function(eventName) {
        var i, l,
            returnValue,
            args,
            handler,
            handlerIds;

        if(typeof eventName == 'object') {
            args = [eventName];
            eventName = eventName.constructor.toString();
        }

        handlerIds = Subscribable._getHandlersList(this, eventName, false);

        if(handlerIds && handlerIds.length) {
            args = args || Array.prototype.slice.call(arguments, 1);
            for(returnValue, i = 0, l = handlerIds.length; i < l && returnValue !== false; i++) {
                if(handler = this.__handlers[handlerIds[i]]) {
                    returnValue = handler[0].apply(handler[1], args);
                }
            }
            return returnValue !== false;
        }

        return true;
    };

    /**
     * Gets the list of handler IDs for the supplied event name in the Subscribable instance. When
     * the create parameter is set to true and the event has not yet been set up in the Subscribable
     * it will be created.
     *
     * @param {Subscribable} instance
     * @param {String} eventName
     * @param {Boolean} create
     * @return {Number[]}
     */
    Subscribable._getHandlersList = function(instance, eventName, create) {
        eventName = ('' + eventName).toLowerCase();
        if(!instance.__events[eventName] && create) {
            instance.__events[eventName] = [];
        }
        return instance.__events[eventName];
    };

    /**
     * Attaches the supplied handler/scope as a listener in the supplied event list.
     *
     * @param {Function} handler
     * @param {Object} scope
     * @param {Number[]} eventList
     */
    Subscribable._saveHandler = function(instance, handler, scope, eventList) {
        var handlerId = instance.__handlers.length;
        instance.__handlers.push( [handler, scope, handlerId] );
        eventList.push(handlerId);

        return handlerId;
    };

    /**
     * Attaches the supplied handler and scope as a listener for the supplied event name. The return value is
     * the numerical ID of the handler that has been added to allow for removal of a single event handler in the
     * "un" method.
     *
     * @param {String} eventName
     * @param {Function} handler
     * @param {Object} scope
     * @return {Number}
     */
    Subscribable.on = function(eventName, handler, scope) {
        return Subscribable._saveHandler(this, handler, scope, Subscribable._getHandlersList(this, eventName, true));
    };

    /**
     * Remove handlers for the specified selector - the selector type can either be a number (which is the ID of a single
     * handler and is the result of using the .on method), a string event name (which is the same string used as the event
     * name in the .on method), the Function constructor of an event object (that has a .toString method to return the
     * name of the associated event) or an object that is the scope of a handler (in which case, any handler for any
     * event that uses that object as the scope will be removed).
     *
     * @param {Object|String|Number|Function} un
     * @param {Object} [scopeCheck]
     */
    Subscribable.un = function(un, scopeCheck) {
        var typeofRemoval = typeof un;
        switch(typeofRemoval) {
            case 'number':
                Subscribable.removeSingleEvent(this, un, scopeCheck);
                break;

            case 'string':
            case 'function':
                un = ('' + un).toLowerCase();
                Subscribable.removeMultipleEvents(this,
                    Subscribable._getHandlersList(this, un, false), scopeCheck);
                if(scopeCheck) {
                    Subscribable.consolidateEvents(this, un);
                }
                break;

            default:
                if(un) {
                    Subscribable.removeMultipleHandlers(this, this.__handlers, un || null);
                    Subscribable.consolidateEvents(this);
                }
                else {
                    this.__handlers = [];
                    this.__events = {};
                }
                break;
        }
    };

    /**
     * Consolidates the handler IDs registered for the supplied named event; when the event name is not specified
     * all event containers will be consolidated.
     *
     * @param {String} [eventName]
     */
    Subscribable.consolidateEvents = function(instance, eventName) {
        if(!arguments.length) {
            for(var eventName in instance.__events) {
                Subscribable.consolidateEvents(eventName);
            }
        }

        var handlerList = instance.__events[eventName];

        if(handlerList && handlerList.length) {
            for(var i = handlerList.length - 1; i >= 0; i--) {
                if(!instance.__handlers[handlerList[i]]) {
                    handlerList.splice(i,1);
                }
            }
        }

        if(handlerList && !handlerList.length) {
            delete instance.__events[eventName];
        }
    };

    /**
     * Attempts to nullify the handler with the supplied list of handler IDs in the Subscribable instance. If the
     * optional scopeCheck parameter is supplied, each handler will only be nullified when the scope it was attached
     * with is the same entity as the scopeCheck.
     *
     * @param {Subscribable} instance
     * @param {Number[]} handlerList
     * @param {Object} [scopeCheck]
     */
    Subscribable.removeMultipleEvents = function(instance, handlerList, scopeCheck) {
        for(var i = 0, l = handlerList.length; i < l; i++) {
            Subscribable.removeSingleEvent(instance, handlerList[i], scopeCheck);
        }
    };

    /**
     * Attempts to nullify the supplied handlers (note that in this case the handler array is the list of actual handlers
     * rather than their handler ID values). If the optional scopeCheck parameter is supplied, each handler will only be
     * nullified when the scope it was attached with the same entity as the scopeCheck.
     *
     * @param {Subscribable} instance
     * @param {Object[]} handlers
     * @param {Object} [scopeCheck]
     */
    Subscribable.removeMultipleHandlers = function(instance, handlers, scopeCheck) {
        var handler;
        for(var i = 0, l = handlers.length; i < l; i++) {
            if(handler = handlers[i]) {
                Subscribable.removeSingleEvent(instance, handler[2], scopeCheck);
            }
        }
    };

    /**
     * Attempts to nullify the handler with the supplied handler ID in the Subscribable instance. If the optional
     * scopeCheck parameter is supplied, the handler will only be nullified when the scope it was attached with is
     * the same entity as the scopeCheck.
     *
     * @param {Subscribable} instance
     * @param {Number} handlerId
     * @param {Object} [scopeCheck]
     */
    Subscribable.removeSingleEvent = function(instance, handlerId, scopeCheck) {
        if(instance.__handlers[handlerId]) {
            if(!scopeCheck || instance.__handlers[handlerId][1] === scopeCheck) {
                instance.__handlers[handlerId] = null;
            }
        }
    };

    /**
     *
     * @param {String|Function} [eventType]
     */
    Subscribable.hasListener = function(eventType) {
        var handlers, handlerIds, i, l;

        if(eventType === undefined) {
            handlers = this.__handlers;
            for(i = 0, l = handlers.length; i < l; i++) {
                if(!!handlers[i]) {
                    return true;
                }
            }
        }

        else if(handlerIds = this.__events[('' + eventType).toLowerCase()]) {
            for(var i = 0, l = handlerIds.length; i < l; i++) {
                if(this.__handlers[handlerIds[i]]) {
                    return true;
                }
            }
        }

        return false;
    };

    return Subscribable;

}());

/*
 * If this is being used in a browser as a requireJs or commonJs module, or is being used as part of a NodeJS
 * app, externalise the Subscribable constructor as module.exports
 */
if(typeof module !== 'undefined') {
    module.exports = Subscribable;
}
(function () {

    function VoteModel() {
        this.choice = undefined;
    }

    VoteModel.prototype = Object.create(Subscribable.prototype);

    VoteModel.prototype.questionId = null;
    VoteModel.prototype.options = null;
    VoteModel.prototype.choice = null;

    VoteModel.prototype.setAllData = function (data) {
        this.questionId = data.id;
        this.answers = data.answers;
        this.fire("dataChanged");
    };

    VoteModel.prototype.getAgree = function () {
        return this.answers[0].count;
    };

    VoteModel.prototype.getDisagree = function () {
        return this.answers[1].count;
    };

    VoteModel.prototype.getTotal = function () {
        return this.getAgree() + this.getDisagree();
    };

    VoteModel.prototype.getAnswerById = function (answerId) {
        return this.answers.filter(function (answer) {
            return answer.id == answerId;
        })[0];
    };

    VoteModel.prototype.registerVote = function (answerId) {
        var answer = this.getAnswerById(answerId);
        if (answer) {
            answer.count++;
            this.choice = answerId;
        }
    };

    VoteModel.prototype.getSummaryText = function () {
        if (this.choice) {
            return "You said that this rumour is " + this.getAnswerById(this.choice).label;
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
            return (this.getAgree() / total) * 100;
        } else {
            return VoteModel.EVEN;
        }
    };

    VoteModel.prototype.destroy = function() {
        this.un();
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
        this.model.on("dataChanged", this.render, this);
        this.donut = new donutClass(this.jContainer.find(".donutContainer"));
        this.jContainer.delegate(".btn", "click.voteComponent", this.handleButtonClick.bind(this));
    };

    VoteComponent.prototype.render = function () {
        this.donut.render(this.model.getAgreePercent());

        var answers = this.model.answers;
        this.jContainer.find(".btn").each(function(index, element) {

            var answer = answers[index];
            jQuery(element).attr("data-action", answer.id);
            jQuery(element).find(".count").html(answer.count);
            jQuery(element).find(".label").html(answer.label);

        });

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
        this.model.un(null, this);
        this.jContainer.undelegate(".voteComponent");
    };

    guardian.facebook.VoteComponent = VoteComponent;

})();
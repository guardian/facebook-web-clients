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

    CanvasDonut.POSITIVE = {stroke: "#3A7D00", "stroke-width": 18};
    CanvasDonut.NEGATIVE = {stroke: "#0D3D00", "stroke-width": 18};
    CanvasDonut.NOTCH = {stroke: "#fff", "stroke-width": 2};

    guardian.ui.CanvasDonut = CanvasDonut;

})(window.jQuery);
(function () {

    function VoteController(model, view, authorizer) {
        this.model = model;
        this.view = view;
        this.authorizer = authorizer;
    }

    VoteController.prototype.model = null;
    VoteController.prototype.view = null;
    VoteController.prototype.authorizer = null;

    VoteController.prototype.initialise = function () {
        this.authorizer.on("connected", this.checkExistingVote, this);
        this.authorizer.on("notAuthorized", this.handleNotAuthorized, this);
        this.view.on("voted", this.submitVote, this);
        jQuery.ajax({
            url: "/vote",
            data: {
                article: this.getArticleId()
            }
        }).then(this.handleLoadedData.bind(this));
    };

    VoteController.prototype.handleLoadedData = function (json) {
        this.model.setAllData(json.questions[0]);
    };

    VoteController.prototype.getArticleId = function () {
        return jQuery("meta[property='og:url']").attr("content");
    };

    VoteController.prototype.checkExistingVote = function () {

        console.log("Controller: Checking for existing votes  on user " + this.authorizer.userId);

        jQuery.ajax({
            url: "/user",
            type: "GET",
            data: {
                article: this.getArticleId(),
                user: this.authorizer.userId
            }
        }).then(this.handleUserExistingVote.bind(this));

    };

    VoteController.prototype.handleNotAuthorized = function () {
        console.log("Controller: User is not authorized to use app, but showing buttons");
        this.model.setAllowedToVote(true);
    };

    VoteController.prototype.handleUserExistingVote = function (user) {

        if (user.choice) {
            console.log("Controller: User has already voted for " + user.choice);
            this.model.registerVote(user.choice, false);
        } else {
            console.log("Controller: User has not voted yet");
            this.model.setAllowedToVote(true);
        }
    };

    VoteController.prototype.submitVote = function (choice) {
        this.authorizer.authUser().then(function () {

            jQuery.ajax({
                url: "/vote",
                type: "POST",
                data: {
                    article: this.getArticleId(),
                    access_token: this.authorizer.accessToken,
                    user: this.authorizer.userId,
                    action: choice
                }
            }).then(this.handlePostResponse.bind(this, choice));

        }.bind(this));
    };

    VoteController.prototype.handlePostResponse = function (choice, response) {
        if (response.error) {
            if (response.error.message.indexOf(VoteController.ERROR_CODES.ALREADY_VOTED) > -1) {
                console.log("Controller: User has already voted for " + choice);
                this.model.registerVote(choice, false);
            } else {
                console.error("Controller: Sorry - could not register your vote: " + response.error);
            }
        } else {
            console.log("Controller: Posted response to Facebook OK. Voted for " + choice);
            this.model.registerVote(choice, true);
        }
    };

    VoteController.prototype.destroy = function () {
        this.model.un(null, this);
    };

    VoteController.ERROR_CODES = {
        "ALREADY_VOTED": "#3501"
    };

    VoteController.APP_NAMESPACE = "theguardian-spike";

    guardian.facebook.VoteController = VoteController;

})();
(function () {

    function LoginButtonView(selector, authorizer) {
        this.jContainer = jQuery(selector);
        this.authorizer = authorizer;
        this.authorizer.authorize().then(this.showLoggedIn.bind(this));
        this.authorizer.on("notLoggedIn", this.showLoginButton, this);
        this.authorizer.on("notAuthorized", this.showAuthorizeButton, this);
        this.authorizer.on("gotUserDetails", this.showLoggedIn, this);
        this.jContainer.delegate(".login", "click.voteComponent", this.handleLoginClick.bind(this));
    }

    LoginButtonView.prototype.showLoggedIn = function (userDetails) {
        if (userDetails && userDetails.name) {
            this.jContainer.find(".userDetails").html("<span class='login'>Logged in as " + userDetails.name + "</span>");
        } else {
            this.jContainer.find(".userDetails").html("<span class='login'>Logged in</span>");
        }
    };

    LoginButtonView.prototype.showLoginButton = function () {
        if (this.jContainer.find("a.login").length) {
            this.handleLoginClick();
            return;
        }
        this.jContainer.find(".userDetails").html("<a class='login' href='http://www.facebook.com/'>Log in to Facebook</a>")
    };

    LoginButtonView.prototype.showAuthorizeButton = function () {
        console.log("Showing authorize button");
        if (this.jContainer.find(".login").length) {
            this.handleLoginClick();
            return;
        }
        this.jContainer.find(".userDetails").html("<a class='login' href='http://www.facebook.com/'>Use the Guardian Facebook App</a>")
    };

    LoginButtonView.prototype.handleLoginClick = function () {
        this.jContainer.find(".userDetails").empty();
        this.authorizer.authUser();
        return false;
    };

    guardian.facebook.LoginButtonView = LoginButtonView;

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
        this.allowedToVote = false;
    }

    VoteModel.prototype = Object.create(Subscribable.prototype);

    VoteModel.prototype.questionId = null;
    VoteModel.prototype.options = null;
    VoteModel.prototype.choice = null;
    VoteModel.prototype.allowedToVote = null;

    VoteModel.prototype.setAllData = function (data) {
        this.questionId = data.id;
        this.answers = data.answers;
        this.fire("dataChanged");
    };

    VoteModel.prototype.setAllowedToVote = function(allowedToVote) {
        this.allowedToVote =  allowedToVote;
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

    VoteModel.prototype.registerVote = function (answerId, changeCounts) {

        var answer = this.getAnswerById(answerId);
        if (answer) {
            if (changeCounts === undefined || changeCounts === true) {
                console.log("Model: Registering new vote: " + answerId);
                answer.count++;
            } else {
                console.log("Model: Noticing existing vote: " + answerId);
            }
            this.choice = answerId;
            this.fire("dataChanged");
        } else {
            console.log("Unrecognised vote: " + answerId)
        }
    };

    VoteModel.prototype.getSummaryText = function () {
        if (this.choice) {
            return "Your response was: " + this.getAnswerById(this.choice).label;
        } else {
            return "Your vote will be counted and shared on Facebook";
        }
    };

    VoteModel.prototype.canVote = function () {
        return !this.choice && this.allowedToVote;
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

    VoteComponent.prototype = Object.create(Subscribable.prototype);

    VoteComponent.prototype.jContainer = null;
    VoteComponent.prototype.donut = null;
    VoteComponent.prototype.model = null;

    VoteComponent.prototype.initialise = function (donutClass) {
        this.model.on("dataChanged", this.render, this);
        this.donut = new donutClass(this.jContainer.find(".donutContainer"));
        this.jContainer.delegate(".btn", "click.voteComponent", this.handleButtonClick.bind(this));
    };

    VoteComponent.prototype.setVotingInProgress = function() {
        this.jContainer.find(".socialSummary .text").html("Sending your vote to Facebook...");
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
        this.jContainer.find(".socialSummary .text").html(this.model.getSummaryText());
    };

    VoteComponent.prototype.handleButtonClick = function (jEvent) {
        var jTarget = jQuery(jEvent.currentTarget),
            action = jTarget.data("action");
        this.jContainer.find(".btn").removeClass("btn");
        this.fire("voted", action);
    };

    VoteComponent.prototype.destroy = function () {
        this.model.un(null, this);
        this.jContainer.undelegate(".voteComponent");
    };

    guardian.facebook.VoteComponent = VoteComponent;

})();
(function () {

    var permissions = {scope: 'email,publish_actions,publish_stream'};

    function Authorizer() {
        this.authDeferred = jQuery.Deferred();
    }

    Authorizer.prototype = Object.create(Subscribable.prototype);

    Authorizer.accessToken = null;
    Authorizer.userId = null;

    Authorizer.prototype.getPromise = function () {
        return this.authDeferred.promise();
    };

    Authorizer.prototype.getAppId = function () {
        return jQuery("meta[property='fb:app_id']").attr("content");
    };

    Authorizer.prototype.scriptLoaded = function () {

        FB.init({
            appId: this.getAppId(),
            channelUrl: '//' + document.location.host + ':' + document.location.port + '/channel.html',
            status: true, // check login status
            cookie: true, // enable cookies to allow the server to access the session
            xfbml: true  // parse XFBML
        });

        this.getLoginStatus();

    };

    Authorizer.prototype.authUser = function () {
        FB.login(this.handleGotLoginStatus.bind(this), permissions);
        return this.getPromise();
    };

    Authorizer.prototype.getLoginStatus = function () {
        // Check if the current user is logged in and has authorized the app
        FB.getLoginStatus(this.handleGotLoginStatus.bind(this), permissions);
        return this.getPromise();
    };

    Authorizer.prototype.handleGotLoginStatus = function (response) {

        console.log("Authorizer: Got Login Status: " + response.status);

        switch (response.status) {
            case 'connected':
                this.accessToken = response.authResponse.accessToken;
                this.userId = response.authResponse.userID;
                console.log("Authorizer: Access token: " + this.accessToken);
                this.fire("connected");
                this.getUserData();
                this.authDeferred.resolve();
                break;
            case 'not_authorized':
                this.getUserData();
                this.fire("notAuthorized");
                break;
            default:
                this.fire("notLoggedIn");
        }

    };

    Authorizer.prototype.getUserData = function () {
        console.log("Authorizer: Getting user data");
        FB.api("/me", function (data) {
            if (!data.error) {
                this.fire("gotUserDetails", data);
            }
        }.bind(this));
    };

    Authorizer.prototype.authorize = function () {
        var js, id = 'facebook-jssdk', ref = document.getElementsByTagName('script')[0];
        if (!document.getElementById(id)) {
            js = document.createElement('script');
            js.id = id;
            js.async = true;
            js.src = "//connect.facebook.net/en_US/all.js";
            js.onload = this.scriptLoaded.bind(this);
            ref.parentNode.insertBefore(js, ref);
        }
        return this.getPromise();
    };

    guardian.facebook.Authorizer = Authorizer;

})();


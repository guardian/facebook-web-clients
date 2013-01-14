/* Facebook Web Clients 1.0 */

var guardian = window.guardian || {};
guardian.facebook = guardian.facebook || {};

// In case we forget to take out console statements. IE becomes very unhappy when we forget. Let's not make IE unhappy
if (typeof(console) === 'undefined') {
    var console = {};
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function () {
    };
}

/**
 * EventEmitter v4.0.3 - git.io/ee
 * Oliver Caldwell
 * MIT license
 */

;(function(exports) {
    // JSHint config - http://www.jshint.com/
    /*jshint laxcomma:true*/
    /*global define:true*/

    // Place the script in strict mode
    'use strict';

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class Manages event registering and emitting.
     */
    function EventEmitter(){}

    // Shortcuts to improve speed and size

    // Easy access to the prototype
    var proto = EventEmitter.prototype

    // Existence of a native indexOf
        , nativeIndexOf = Array.prototype.indexOf ? true : false;

    /**
     * Finds the index of the listener for the event in it's storage array
     *
     * @param {Function} listener Method to look for.
     * @param {Function[]} listeners Array of listeners to search through.
     * @return {Number} Index of the specified listener, -1 if not found
     */
    function indexOfListener(listener, listeners) {
        // Return the index via the native method if possible
        if(nativeIndexOf) {
            return listeners.indexOf(listener);
        }

        // There is no native method
        // Use a manual loop to find the index
        var i = listeners.length;
        while(i--) {
            // If the listener matches, return it's index
            if(listeners[i] === listener) {
                return i;
            }
        }

        // Default to returning -1
        return -1;
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     *
     * @param {String} evt Name of the event to return the listeners from.
     * @return {Function[]} All listener functions for the event.
     * @doc
     */
    proto.getListeners = function(evt) {
        // Create a shortcut to the storage object
        // Initialise it if it does not exists yet
        var events = this._events || (this._events = {});

        // Return the listener array
        // Initialise it if it does not exist
        return events[evt] || (events[evt] = []);
    };

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     *
     * @param {String} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     * @doc
     */
    proto.addListener = function(evt, listener) {
        // Fetch the listeners
        var listeners = this.getListeners(evt);

        // Push the listener into the array if it is not already there
        if(indexOfListener(listener, listeners) === -1) {
            listeners.push(listener);
        }

        // Return the instance of EventEmitter to allow chaining
        return this;
    };

    /**
     * Alias of addListener
     * @doc
     */
    proto.on = proto.addListener;

    /**
     * Removes a listener function from the specified event.
     *
     * @param {String} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     * @doc
     */
    proto.removeListener = function(evt, listener) {
        // Fetch the listeners
        // And get the index of the listener in the array
        var listeners = this.getListeners(evt)
            , index = indexOfListener(listener, listeners);

        // If the listener was found then remove it
        if(index !== -1) {
            listeners.splice(index, 1);

            // If there are no more listeners in this array then remove it
            if(listeners.length === 0) {
                this._events[evt] = null;
            }
        }

        // Return the instance of EventEmitter to allow chaining
        return this;
    };

    /**
     * Alias of removeListener
     * @doc
     */
    proto.off = proto.removeListener;

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added.
     *
     * @param {String|Object} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     * @doc
     */
    proto.addListeners = function(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     *
     * @param {String|Object} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     * @doc
     */
    proto.removeListeners = function(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     * @doc
     */
    proto.manipulateListeners = function(remove, evt, listeners) {
        // Initialise any required variables
        var i
            , value
            , single = remove ? this.removeListener : this.addListener
            , multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of it's properties to this method
        if(typeof evt === 'object') {
            for(i in evt) {
                if(evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if(typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while(i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        // Return the instance of EventEmitter to allow chaining
        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     *
     * @param {String} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     * @doc
     */
    proto.removeEvent = function(evt) {
        // Remove different things depending on the state of evt
        if(evt) {
            // Remove all listeners for the specified event
            this._events[evt] = null;
        }
        else {
            // Remove all listeners in all events
            this._events = null;
        }

        // Return the instance of EventEmitter to allow chaining
        return this;
    };

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     *
     * @param {String} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each argument.
     * @return {Object} Current instance of EventEmitter for chaining.
     * @doc
     */
    proto.emitEvent = function(evt, args) {
        // Get the listeners for the event
        // Also initialise any other required variables
        var listeners = this.getListeners(evt)
            , i = listeners.length
            , response;

        // Loop over all listeners assigned to the event
        // Apply the arguments array to each listener function
        while(i--) {
            // If the listener returns true then it shall be removed from the event
            // The function is executed either with a basic call or an apply if there is an args array
            response = args ? listeners[i].apply(null, args) : listeners[i]();
            if(response === true) {
                this.removeListener(evt, listeners[i]);
            }
        }

        // Return the instance of EventEmitter to allow chaining
        return this;
    };

    /**
     * Alias of emitEvent
     * @doc
     */
    proto.trigger = proto.emitEvent;

    exports.EventEmitter = EventEmitter;

}(this));
(function () {

    /**
     * Abbreviates the given numeric such that they never exceed four characters.
     * Small numbers (<1000) are returned as-is
     * Numbers like 3000 are rendered as 3.5K
     * Numbers beyond 5 digits are rendered like 20K, 21K, 500K
     * Numbers in millions are rendered as 1.5M, 10M, 20M.
     * @param {Number} value The value to abbreviate
     * @return {String} The formatted value
     */
    function BigNumberFormatter(value) {

        var i, l, multiplier, newValue;

        for (i = 0, l = multipliers.length; i < l; i++) {
            multiplier = multipliers[i];
            if (value >= multiplier.n) {
                newValue = value / multiplier.n;
                return newValue.toFixed(newValue < 10 ? 1 : 0) + multiplier.abbr;
            }
        }

        return value;
    }

    var multipliers = [
        {abbr: 'M', n: 1000000},
        {abbr: 'K', n: 1000}
    ];

    guardian.facebook.BigNumberFormatter = BigNumberFormatter;

})();
(function () {

    function VoteController(model, view, authorizer) {
        this.model = model;
        this.view = view;
        this.authorizer = authorizer;
    }

    VoteController.prototype.baseURI = null;
    VoteController.prototype.model = null;
    VoteController.prototype.view = null;
    VoteController.prototype.authorizer = null;

    /**
     * Initialises callbacks and makes a call to get the poll data from the server.
     * @param {String} baseURI The base URI for this and all subsequent XHR requests
     */
    VoteController.prototype.initialise = function (baseURI) {
        this.baseURI = baseURI;

        this.authorizer.onNotAuthorized.then(this.handleNotAuthorized.bind(this));
        this.authorizer.onConnected.then(this.checkExistingVote.bind(this));
        this.authorizer.onConnected.then(this.submitVoteWhenLoggedIn.bind(this));

        this.view.on("voted", this.submitVote.bind(this));
        jQuery.ajax({
            url: this.baseURI + "/poll?type=" + this.model.type,
            dataType: 'jsonp',
            jsonpCallback: 'votecontroller',
            data: {
                article: this.getArticleId()
            }
        }).then(handleResponse(this.handleLoadedData.bind(this)));
    };

    VoteController.prototype.handleNotAuthorized = function () {
        this.model.setAllowedToVote(true);
    };

    VoteController.prototype.handleLoadedData = function (json) {
        this.model.setAllData(json.questions[0]);
    };

    VoteController.prototype.getArticleId = function () {
        return jQuery("meta[property='og:url']").attr("content");
    };

    VoteController.prototype.checkExistingVote = function () {

        jQuery.ajax({
            url: this.baseURI + "/user",
            type: "GET",
            dataType: 'jsonp',
            jsonpCallback: 'votecontroller',
            data: {
                article: this.getArticleId(),
                user: this.authorizer.userId
            }
        }).then(handleResponse(this.handleUserExistingVote.bind(this)));

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
        this.choice = choice;
        this.authorizer.login().then(this.submitVoteWhenLoggedIn.bind(this));
    };

    VoteController.prototype.submitVoteWhenLoggedIn = function () {
        if (this.choice) {
            jQuery.ajax({
                url: this.baseURI + "/vote",
                dataType: 'jsonp',
                jsonpCallback: 'votecontroller',
                data: {
                    article: this.getArticleId(),
                    access_token: this.authorizer.accessToken,
                    user: this.authorizer.userId,
                    action: this.choice
                }
            }).then(handleResponse(this.handlePostResponse.bind(this, this.choice)));
        }
        this.choice = null;
    };

    VoteController.prototype.handlePostResponse = function (choice, response) {
        console.log("Controller: Posted response to Facebook OK. Voted for " + choice);
        this.model.registerVote(choice, true);
    };

    function handleResponse(successFunction) {
        return (function (response) {
            if (response.error) {
                console.error(response.error.message);
            } else {
                successFunction(response.data)
            }
        });
    }

    guardian.facebook.VoteController = VoteController;

})();
(function () {

    function LoginButtonView(selector, authorizer, model) {
        this.jContainer = jQuery(selector);

        if (!this.jContainer.length) {
            throw new Error("Login button view has no element: " + selector);
        }

        this.authorizer = authorizer;
        this.model = model;

        this.render();

        this.model.on(guardian.facebook.VoteModel.DATA_CHANGED, this.render.bind(this));
        this.authorizer.getLoginStatus().then(this.render.bind(this));
        this.authorizer.onUserDataLoaded.then(this.render.bind(this));

        this.jContainer.delegate("a", "click.loginbutton", this.handleLoginClick.bind(this));
    }

    LoginButtonView.prototype.model = null;
    LoginButtonView.prototype.authorizer = null;
    LoginButtonView.prototype.jContainer = null;

    LoginButtonView.prototype.render = function () {

        var userData = this.authorizer.userData;

        if (userData) {

            var txt = userData.first_name,
                voteLabel = this.model.getVotelabel();

            if (voteLabel) {
                txt += ", your vote '" + voteLabel + "' was counted";
            } else {
                txt += ", share your opinion with your friends on Facebook";
            }

            this.jContainer.find(".message").html(txt);

            if (userData.username) {
                this.jContainer.find(".avatar")
                    .removeClass("initially-off")
                    .attr("src", "http://graph.facebook.com/" + userData.username + "/picture")
            }

        } else {
            this.jContainer.find(".message")
                .html("<a>Share your opinion with your friends on Facebook</a>")
        }
    };

    LoginButtonView.prototype.handleLoginClick = function () {
        console.log("Auth'ing user");
        this.authorizer.login();
        return false;
    };

    guardian.facebook.LoginButtonView = LoginButtonView;

})();
(function () {

    function TitleView(selector, model) {
        this.jContainer = jQuery(selector);

        if (!this.jContainer.length) {
            throw new Error("Title view has no element: " + selector);
        }

        this.model = model;
        this.render();
    }

    TitleView.prototype.model = null;
    TitleView.prototype.jContainer = null;

    TitleView.getAuthors = function () {
        return jQuery("a.contributor").map(function () {
            return jQuery(this).text();
        }).get();
    };

    TitleView.prototype.render = function () {
        var title = "";
        switch (this.model.type) {
            case guardian.facebook.VoteModel.AGREE_WITH_OPINION:
                title = "Do you agree with " + TitleView.getAuthors().join(" and ") + "?";
                break;
            case guardian.facebook.VoteModel.AGREE_WITH_HEADLINE:
                title = "Do you agree?";
                break;
        }
        this.jContainer.html(title);
    };

    guardian.facebook.TitleView = TitleView;

})();
(function () {

    /**
     * @constructor
     * @param {String} type The type of poll, eg "agree_with_opinion"
     */
    function VoteModel(type) {
        this.type = type;
        this.choice = undefined;
        this.allowedToVote = true;
        this.dataDeferred = jQuery.Deferred();
    }

    VoteModel.prototype = Object.create(EventEmitter.prototype);

    VoteModel.prototype.type = null;
    VoteModel.prototype.questionId = null;
    VoteModel.prototype.options = null;
    VoteModel.prototype.choice = null;
    VoteModel.prototype.allowedToVote = null;

    VoteModel.prototype.setAllData = function (data) {
        this.answers = data.answers;
        this.trigger(VoteModel.DATA_CHANGED);
        this.dataDeferred.resolve();
    };

    VoteModel.prototype.whenDataIsSet = function () {
        return this.dataDeferred.promise();
    };

    VoteModel.prototype.setAllowedToVote = function (allowedToVote) {
        this.allowedToVote = allowedToVote;
        this.trigger(VoteModel.DATA_CHANGED);
    };

    VoteModel.prototype.getAgree = function () {
        return this.answers && this.answers[0].count;
    };

    VoteModel.prototype.getDisagree = function () {
        return this.answers && this.answers[1].count;
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

        this.whenDataIsSet().then(function () {
            var answer = this.getAnswerById(answerId);
            if (answer) {
                if (changeCounts === undefined || changeCounts === true) {
                    console.log("Model: Registering new vote: " + answerId);
                    answer.count++;
                } else {
                    console.log("Model: Noticing existing vote: " + answerId);
                }
                this.choice = answerId;
                this.trigger(VoteModel.DATA_CHANGED);
            } else {
                console.log("Unrecognised vote: " + answerId)
            }
        }.bind(this));

    };

    VoteModel.prototype.getVotelabel = function () {
        if (this.choice) {
            return this.getAnswerById(this.choice).label;
        } else {
            return undefined;
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

    VoteModel.prototype.destroy = function () {
        this.removeEvent(); // remove all events
    };

    /**
     * @event
     */
    VoteModel.DATA_CHANGED = "dataChanged";

    VoteModel.EVEN = 50;

    /**
     * Type of vote when the user is asked to agree with the opinion of the author on a topic
     * @type {string}
     */
    VoteModel.AGREE_WITH_OPINION = "agree_with_opinion";

    /**
     * Type of vote when the user is asked to agree with the headline of the article (not the author's opinion on the matter)
     * @type {string}
     */
    VoteModel.AGREE_WITH_HEADLINE = "agree_with_headline";

    /**
     * Type of vote when the user is asked to consider whether the proposal is likely or not
     * @type {string}
     */
    VoteModel.THINK_LIKELY = "think_headline_likely";

    guardian.facebook.VoteModel = VoteModel;

})();
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
            jTarget.find(".label").text("Voting...");
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
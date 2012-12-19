var guardian = guardian || {};
guardian.r2 = guardian.r2 || {};
guardian.r2.identity = guardian.r2.identity || {};

var identity = identity || {};
identity.facebook = {  };
identity.httpsRoot = 'https://id.gucode.co.uk';

jQ('<style>.identity-fb-notice {\n    border-top: 1px solid #bdbdbd;\n    float: left;\n    font-size: 14px;\n    height: 86px;\n    position: relative;\n    width: 100%;\n}\n\n.identity-fb-notice p {\n    padding-top: 23px;\n    width: 490px;\n}\n\n.identity-fb-notice .button {\n    background-color: #f3f3f3;\n    background-image: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#f9f9f9), to(#ededed));\n    background-image: -webkit-linear-gradient(top, #f9f9f9, #ededed);\n    background-image:    -moz-linear-gradient(top, #f9f9f9, #ededed);\n    background-image:     -ms-linear-gradient(top, #f9f9f9, #ededed);\n    background-image:      -o-linear-gradient(top, #f9f9f9, #ededed);\n    border: 1px solid #cbcbcb;\n    border-radius: 5px;\n    color: #315786;\n    display: inline-block;\n    text-align: center;\n    width: 100%;\n}\n\n.identity-fb-notice .button:hover {\n    box-shadow: 0 0 5px #bdbdbd;\n    text-decoration: none;\n}\n\n.identity-fb-notice .button span {\n    background: transparent url(http:\/\/id.gucode.co.uk\/static\/3\/cs\/images\/fb_icon_30.png) 8px 4px no-repeat;\n    display: block;\n    padding: 10px;\n}\n\n.identity-fb-notice .hide-bar {\n    background: transparent url(http:\/\/id.gucode.co.uk\/static\/3\/cs\/images\/close.png) top left no-repeat;\n    cursor: pointer;\n    display: block;\n    height: 32px;\n    overflow: hidden;\n    position: absolute;\n    top: 0; right: 0;\n    text-indent: 100%;\n    white-space: nowrap;\n    width: 32px;\n}\n\n.identity-fb-notice .facepile {\n    border: none;\n    height: 86px;\n    overflow: hidden;\n    position: absolute;\n    top: 10px; right: 32px;\n    width: 380px;\n}</style>').appendTo('head');


guardian.r2.identity.facebookBanner = (function () {
    /**
     * Get the current values from the tracking cookie.
     *
     *    Format: "[0-4]<hidden>|[true|false]<notified>"
     */
    var getFBCookie = function () {
        var c = jQ.cookie('gu_facebookbar') || '';
        var v = c.split('|');

        return {
            hidden: parseInt(v[0], 10) || 0,
            notified: (v[1] === 'true') || false
        };
    };

    /**
     * Set new values to the tracking cookie.
     *
     * @param {Int} hidden
     * @param {Boolean} notified
     * @param {Int} signedInTime (UNIX timestamp)
     */
    var setFBCookie = function (hidden, notified) {
        hidden = hidden || 0;
        notified = notified || false;
        var value = hidden + '|' + notified;

        jQ.ajax({
            url: identity.httpsRoot + '/jsapi/dropcookie',
            cache: false,
            crossDomain: true,
            dataType: 'jsonp',
            data: {
                name: 'gu_facebookbar',
                value: value,
                maxage: 60 * 60 * 24 * 365 // 1 year
            }
        });
    };

    /**
     * There is a one day grace period after this user signs out. During this time the user will not be auto-signed in.
     * Essentially, a user will only be upsold at most once per day.
     *
     * @return {Boolean}
     */
    var hasUserSignedOutInLast24Hours = function () {
        return (Math.round((new Date()).getTime() / 1000) < parseInt(jQ.cookie('GU_SO')) + 86400);
    };

    /**
     * User is logged into Facebook but hasn't authed the app.
     */
    var notAuthed = function () {
        var text = 'Sign into the Guardian using your Facebook account';
        show('notAuthed', text, 'signin');
    };

    /**
     * User has authed the app but not supplied an email address.
     *
     * @param {String} name
     */
    var noEmail = function (name) {
        var text = 'Welcome ' + name + ', sign into the Guardian with Facebook';
        show('noEmail', text, 'signin');
    };

    /**
     * User has authed and supplied email.
     *
     * @param {String} name
     * @param {String} user
     */
    var signedIn = function (name, user) {
        // Populate the top nav bar to show logged in status.
        jQ('.id-hide-when-signed-in').hide();
        jQ('.id-populate-with-user-email').html(user.primaryEmailAddress);
        jQ('.id-show-when-signed-in').show();

        // Show the post-autosignin Discussion bar if applicable.
        jQ('.discussion .toolbar').each(function () {
            var toolbar = jQ(this);
            if (toolbar.hasClass('autosignedin')) {
                toolbar.html(toolbar.html().replace('{name}', name)).show();
            }
            else {
                toolbar.hide();
            }
        });

        var text = 'Welcome ' + name + ', you\'re signed into the Guardian using Facebook.';

        if (!getFBCookie().notified) {
            show('signedIn', text, 'signout');
            setFBCookie(0, true);
        } else {
            var cookieValues = getFBCookie();
            setFBCookie(cookieValues.hidden, cookieValues.notified);
        }
    };

    /**
     * Autosignup using identity rest endpoint
     *
     * @param {Object} authResponse
     * @param {Function} callback
     */
    var autoSignup = function (authResponse, callback) {
        jQ.ajax({
            url: identity.httpsRoot + '/jsapi/facebook/autosignup',
            cache: false,
            crossDomain: true,
            dataType: 'jsonp',
            data: {
                signedRequest: authResponse.signedRequest,
                accessToken: authResponse.accessToken
            }
        }).done(callback);
    };


    /**
     * Show the bar with the appropriate content.
     *
     * @param {String} identifier
     * @param {String} text
     * @param {String} action
     */
    var show = function (identifier, text, action) {
        var bar = '<div class="identity-fb-notice" data-identifier="' +
            identifier + '"><p>';
        var href = "";

        if ('signin' === action) {
            href = identity.httpsRoot + "/facebook/signin?upsell=1&returnUrl="
                + encodeURIComponent(window.location.href.split('#')[0]);
            bar += '<a class="button" href="' + href + '"><span>' + text +
                '</span></a>';
        }
        else if ('signout' === action) {
            var idSignoutUrl = identity.httpsRoot + "/signout?returnUrl=" +
                encodeURIComponent(window.location.href.split('#')[0]);
            href = 'https://www.facebook.com/logout.php?access_token=' +
                FB.getAuthResponse().accessToken + '&confirm=1&next=' +
                encodeURIComponent(idSignoutUrl);

            bar += text + '<br><a href="' + href + '">Click here to sign out</a>.';
        }

        var fp_href = 'http://www.facebook.com/plugins/facepile.php?' +
            'app_id=' + identity.facebook.appId;

        bar += '</p><span class="hide-bar">Hide</span>'

        if ('notAuthed' !== identifier) {
            bar += '<iframe class="facepile" src="' + fp_href + '" ' +
                'scrolling="no" frameborder="0" allowTransparency="true">' +
                '</iframe>';
        }

        bar += '</div>';

        bar = jQ(bar).delegate('.hide-bar', 'click', hide);

        jQ('.identity-fb-notice').remove();

        jQ('.top-navigation').after(bar);
    };

    /**
     * Hide the bar and update the tracking cookie.
     */
    var hide = function () {
        jQ('.identity-fb-notice').animate({
            opacity: 0,
            height: 0
        }, 300, function () {
            jQ(this).remove();
        });

        var identifier = jQ(this).parent().attr('data-identifier');
        if ('notAuthed' === identifier || 'noEmail' === identifier) {
            setFBCookie(getFBCookie().hidden + 1);
        }
    };

    return {
        notAuthed: notAuthed,
        noEmail: noEmail,
        signedIn: signedIn,
        autoSignup: autoSignup,
        hasUserSignedOutInLast24Hours: hasUserSignedOutInLast24Hours,
        cookie: getFBCookie
    };
})();


identity.facebook.pageDomain = (/^.*?\/\/([^/]*)/g).exec(document.location)[1];


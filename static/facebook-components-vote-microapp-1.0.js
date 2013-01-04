/* Facebook Web Clients 1.0 */

(function () {

    var baseURI = window.baseURI || "http://facebook-web-clients.appspot.com",
        apiURI = window.baseAPI || "http://gu-facebook-actions.appspot.com",
        cssFile = baseURI + "/static/facebook-components-vote-1.0.css";

    (document.createStyleSheet) ? document.createStyleSheet(cssFile) : jQuery('<link rel="stylesheet" type="text/css" href="' + cssFile + '" />').appendTo('head');

    require([
        baseURI + "/static/facebook-authorizer-1.0.js",
        baseURI + "/static/facebook-ui-donut-1.0.js",
        baseURI + "/static/facebook-components-vote-1.0.js"
    ], function () {

        var MICROAPPS = [
            {
                selector: ".ma-placeholder-facebook-agree-disagree-with-opinion-component",
                type: guardian.facebook.VoteController.AGREE_WITH_OPINION
            },
            {
                selector: ".ma-placeholder-facebook-agree-disagree-with-headline-component",
                type: guardian.facebook.VoteController.AGREE_WITH_HEADLINE
            },
            {
                selector:".facebook-think-headline-likely-unlikely-component",
                type: guardian.facebook.VoteController.THINK_LIKELY
            }
        ];

        function getMicroAppDefinition() {
            for (var i = 0, l = MICROAPPS.length; i < l; i++) {
                if (jQuery(MICROAPPS[i].selector).length) {
                    return MICROAPPS[i];
                }
            }
            throw new Error("No suitable component found on page for Facebook component")
        }

        var
            authorizer = guardian.facebook.Authorizer.getInstance(),
            microapp = getMicroAppDefinition(),
            model = new guardian.facebook.VoteModel(),
            loginButtonView = new guardian.facebook.LoginButtonView(".social-summary", authorizer, model),
            view = new guardian.facebook.VoteComponent(
                microapp.selector,
                model,
                guardian.ui.CanvasDonut,
                guardian.facebook.BigNumberFormatter);

        controller = new guardian.facebook.VoteController(model, view, authorizer);

        controller.initialise(apiURI, microapp.type);

    });
})();
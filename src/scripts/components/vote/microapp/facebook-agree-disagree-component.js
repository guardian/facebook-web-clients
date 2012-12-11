(function () {

    var baseURI = window.baseURI || "http://facebook-web-clients.appspot.com",
        cssFile = baseURI + "/static/facebook-components-vote-1.0.css";

    (document.createStyleSheet) ? document.createStyleSheet(cssFile) : jQuery('<link rel="stylesheet" type="text/css" href="' + cssFile + '" />').appendTo('head');

    require([
        baseURI + "/static/facebook-authorizer-1.0.js",
        baseURI + "/static/facebook-ui-donut-1.0.js",
        baseURI + "/static/facebook-components-vote-1.0.js"
    ],
        function () {

            var
                authorizer = new guardian.facebook.Authorizer(document),

                model = new guardian.facebook.VoteModel(),

                view = new guardian.facebook.VoteComponent(
                    ".ma-placeholder-facebook-agree-disagree-component",
                    model,
                    guardian.ui.CanvasDonut,
                    guardian.facebook.BigNumberFormatter),

                loginButtonView = new guardian.facebook.LoginButtonView(".social-summary", authorizer, model),

                controller = new guardian.facebook.VoteController(model, view, authorizer);

            controller.initialise(baseURI);

        });
})();
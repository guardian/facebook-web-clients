(function() {

    var baseURI = "http://facebook-web-clients.appspot.com",
        cssFile = baseURI + "/static/votecomponent.css";

    (document.createStyleSheet) ? document.createStyleSheet(cssFile) : jQuery('<link rel="stylesheet" type="text/css" href="' + cssFile + '" />').appendTo('head');

    require([baseURI + "/static/facebook-web-clients-1.0.js"], function () {

        var
            authorizer = new guardian.facebook.Authorizer(document),
            model = new guardian.facebook.VoteModel(),
            view = new guardian.facebook.VoteComponent(".ma-placeholder-facebook-agree-disagree-component", model, guardian.ui.CanvasDonut, authorizer),
            loginButtonView = new guardian.facebook.LoginButtonView(".facebook-auth-status", authorizer),
            controller = new guardian.facebook.VoteController(model, view, authorizer);

        controller.initialise(baseURI);

    });
})();
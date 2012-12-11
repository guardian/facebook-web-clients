(function () {

    function LoginButtonView(selector, authorizer, model) {
        this.jContainer = jQuery(selector);
        this.authorizer = authorizer;
        this.model = model;

        this.render();
        this.authorizer.getLoginStatus().then(this.render.bind(this));
        this.model.on(guardian.facebook.VoteModel.DATA_CHANGED, this.render.bind(this));
        this.authorizer.on(guardian.facebook.Authorizer.GOT_USER_DETAILS, this.render.bind(this));
        this.authorizer.on(guardian.facebook.Authorizer.NOT_LOGGED_IN, this.showAuthorizeButton.bind(this));
        this.authorizer.on(guardian.facebook.Authorizer.NOT_AUTHORIZED, this.showAuthorizeButton.bind(this));
        this.jContainer.delegate("a.authRequired", "click.loginbutton", this.handleLoginClick.bind(this));
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
                txt += ", your vote '" + voteLabel + "' was counted and shared on Facebook";
            } else {
                txt += ", your vote will be counted and shared on Facebook";
            }

            this.jContainer.find("a")
                .html(txt)
                .removeClass("authRequired");

            this.jContainer.find(".avatar")
                .attr("src", "http://graph.facebook.com/" + userData.username + "/picture")
        } else {
            this.jContainer.find("a")
                .html("Your vote will be counted and shared on Facebook")
                .addClass("authRequired")
        }
    };

    LoginButtonView.prototype.showAuthorizeButton = function () {
        if (this.shouldLogInNow) {
            this.handleLoginClick();
            return;
        }
        this.shouldLogInNow = true;
    };

    LoginButtonView.prototype.handleLoginClick = function () {
        console.log("Auth'ing user");
        this.authorizer.authUser();
        return false;
    };

    guardian.facebook.LoginButtonView = LoginButtonView;

})();
(function () {

    function LoginButtonView(selector, authorizer) {
        this.jContainer = jQuery(selector);
        this.authorizer = authorizer;
        this.render();
        this.authorizer.getLoginStatus().then(this.render.bind(this));
        this.authorizer.on(guardian.facebook.Authorizer.GOT_USER_DETAILS, this.render.bind(this));
        this.authorizer.on(guardian.facebook.Authorizer.NOT_LOGGED_IN, this.showAuthorizeButton.bind(this));
        this.authorizer.on(guardian.facebook.Authorizer.NOT_AUTHORIZED, this.showAuthorizeButton.bind(this));
        this.jContainer.delegate("a.authRequired", "click.loginbutton", this.handleLoginClick.bind(this));
    }

    LoginButtonView.prototype.render = function (userDetails) {
        console.log(userDetails);
        if (userDetails && userDetails.first_name) {
            this.jContainer.find("a")
                .html(userDetails.first_name + ", your vote will be counted and shared on Facebook")
                .removeClass("authRequired");
            this.jContainer.find(".avatar")
                .attr("src", "http://graph.facebook.com/" + userDetails.username + "/picture")
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
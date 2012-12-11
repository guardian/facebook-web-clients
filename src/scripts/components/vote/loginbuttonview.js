(function () {

    function LoginButtonView(selector, authorizer) {
        this.jContainer = jQuery(selector);
        this.authorizer = authorizer;
        this.jContainer.find("a").html("Your vote will be counted and shared on Facebook");
        this.authorizer.getLoginStatus().then(this.showLoggedIn.bind(this));
        this.authorizer.on(guardian.facebook.Authorizer.GOT_USER_DETAILS, this.showLoggedIn.bind(this));
        this.authorizer.on(guardian.facebook.Authorizer.NOT_LOGGED_IN, this.showAuthorizeButton.bind(this));
        this.authorizer.on(guardian.facebook.Authorizer.NOT_AUTHORIZED, this.showAuthorizeButton.bind(this));
        this.jContainer.delegate(".login", "click.loginbutton", this.handleLoginClick.bind(this));
    }

    LoginButtonView.prototype.showLoggedIn = function (userDetails) {
        console.log(userDetails);
        if (userDetails && userDetails.first_name) {
            this.jContainer.find("a").html(userDetails.first_name + ", your vote will be counted and shared on Facebook");
        } else {
            this.jContainer.find("a").html("Your vote will be counted and shared on Facebook");
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
        this.authorizer.authUser();
        return false;
    };

    guardian.facebook.LoginButtonView = LoginButtonView;

})();
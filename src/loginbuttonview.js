(function() {

    function LoginButtonView(selector, authorizer) {
        this.jContainer = jQuery(selector);
        this.authorizer = authorizer;
        this.authorizer.authorize().then(this.showLoggedIn.bind(this));
        this.authorizer.on("notLoggedIn", this.showLoginButton, this);
        this.authorizer.on("notAuthorized", this.showAuthorizeButton, this);
        this.jContainer.delegate(".login", "click.voteComponent", this.handleLoginClick.bind(this));
    }

    LoginButtonView.prototype.showLoggedIn = function () {
        this.jContainer.find(".userDetails").html("Logged in OK");
    };

    LoginButtonView.prototype.showLoginButton = function () {
        if (this.jContainer.find(".login").length) {
            this.handleLoginClick();
            return;
        }
        this.jContainer.find(".userDetails").html("<a class='login' href='http://www.facebook.com/'>Log in to Facebook</a>")
    };

    LoginButtonView.prototype.showAuthorizeButton = function () {
        if (this.jContainer.find(".login").length) {
            this.handleLoginClick();
            return;
        }
        this.jContainer.find(".userDetails").html("<a class='login' href='http://www.facebook.com/'>Use the Guardian Facebook App</a>")
    };

    LoginButtonView.prototype.handleLoginClick = function () {
        this.jContainer.find("userDetails").empty();
        this.authorizer.authUser();
        return false;
    };

    guardian.facebook.LoginButtonView = LoginButtonView;

})();
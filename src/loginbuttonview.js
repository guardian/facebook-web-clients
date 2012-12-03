(function() {

    function LoginButtonView(selector, authorizer) {
        this.jContainer = jQuery(selector);
        this.authorizer = authorizer;
        this.authorizer.authorize();
        this.authorizer.on("authRequired", this.showLoginButton, this);
        this.authorizer.on("authOK", this.showLoggedIn, this);
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
        this.jContainer.find(".userDetails").html("<a class='login' href='http://www.facebook.com/'>Log in to Facebook</button>")
    };

    LoginButtonView.prototype.handleLoginClick = function () {
        this.jContainer.find("userDetails").empty();
        this.authorizer.authUser();
        return false;
    };

    guardian.facebook.LoginButtonView = LoginButtonView;

})();
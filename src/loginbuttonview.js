(function() {

    function LoginButtonView(selector, authorizer) {
        this.jContainer = jQuery(selector);
        this.authorizer = authorizer;
        this.authorizer.on("authRequired", this.showLoginButton, this);
        this.jContainer.delegate("button", "click.voteComponent", this.handleLoginClick.bind(this));
    }

    LoginButtonView.prototype.showLoginButton = function () {
        this.jContainer.append("<button>Log in to Facebook</button>")
    };

    LoginButtonView.prototype.handleLoginClick = function () {
        this.jContainer.find("button").remove();
        this.authorizer.authUser();
    };

    guardian.facebook.LoginButtonView = LoginButtonView;

})();
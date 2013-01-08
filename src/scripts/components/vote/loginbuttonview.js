(function () {

    function LoginButtonView(selector, authorizer, model) {
        this.jContainer = jQuery(selector);

        if (!this.jContainer.length) {
            throw new Error("Login button view has no element: " + selector);
        }

        this.authorizer = authorizer;
        this.model = model;

        this.render();

        this.model.on(guardian.facebook.VoteModel.DATA_CHANGED, this.render.bind(this));
        this.authorizer.getLoginStatus().then(this.render.bind(this));
        this.authorizer.onUserDataLoaded.then(this.render.bind(this));

        this.jContainer.delegate("a", "click.loginbutton", this.handleLoginClick.bind(this));
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
                txt += ", your vote '" + voteLabel + "' was counted";
            } else {
                txt += ", share your opinion with your friends on Facebook";
            }

            this.jContainer.find(".message").html(txt);

            if (userData.username) {
                this.jContainer.find(".avatar")
                    .removeClass("initially-off")
                    .attr("src", "http://graph.facebook.com/" + userData.username + "/picture")
            }

        } else {
            this.jContainer.find(".message")
                .html("<a>Share your opinion with your friends on Facebook</a>")
        }
    };

    LoginButtonView.prototype.handleLoginClick = function () {
        console.log("Auth'ing user");
        this.authorizer.login();
        return false;
    };

    guardian.facebook.LoginButtonView = LoginButtonView;

})();
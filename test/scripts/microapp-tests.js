(function () {

    module("Login Button", {
        setup: function () {
            jQuery("body").append('' +
                '<div class="social-summary">' +
                '<div class="avatar"></div>' +
                '<div class="message"></div>' +
                '</div>'
            );
            authorizer = guardian.facebook.Authorizer.getInstance();
            sinon.spy(authorizer, "login");
            authorizer._loadFacebookScript = sinon.stub();
            model = new EventEmitter();
            model.getVotelabel = sinon.stub();
        },
        teardown: function () {
            authorizer.destroy();
            jQuery(".social-summary").remove();
        }
    });

    var authorizer, view, model;

    test("Error if not found", function () {
        given(placeholder("ma-placeholder-facebook-agree-disagree-with-opinion-component"));
        throws(
            function() {
                when(newView())
            },
            "The login button view should throw an error if the container isn't there"
        )
    });

})();
(function () {

    module("Authorizer", {
        setup: function () {
            authorizer = new guardian.facebook.Authorizer();
        },
        teardown: function () {
            jQuery("meta").remove();
        }
    });

    var authorizer;

    test("Gets Facebook App Id from the page", function () {

        given(jQuery("head").append('<meta property="fb:app_id" content="289251094430759">'));

        equal(authorizer.getAppId(), "289251094430759");

    });

})();
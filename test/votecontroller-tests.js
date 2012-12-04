(function () {

    module("Vote Controller", {
        setup: function () {
            jQuery.ajax = sinon.stub(jQuery, "ajax");
            jQuery.ajax.returns({
                then: function (fn) {
                    fn(json);
                }
            });
            window.FB = {
                api: sinon.stub()
            };
            model = sinon.stub(new guardian.facebook.VoteModel());
            authorizer = sinon.stub(Object.create(guardian.facebook.Authorizer.prototype));
            authorizer.authorize.returns({
                then: function (fn) {
                    fn();
                }
            });
            authorizer.getLoginStatus.returns({
                then: function (fn) {
                    fn();
                }
            });
            authorizer.authUser.returns({
                then: function (fn) {
                    fn();
                }
            });
            view = new Subscribable();
            controller = new guardian.facebook.VoteController(model, view, authorizer)
        },
        teardown: function() {
            jQuery.ajax.restore()
        }
    });

    var model, controller, authorizer, json = {
        "pollId": "400303938",
        "questions": [
            {
                "id": 7694,
                "count": 1627,
                "answers": [
                    {
                        "question": 7694,
                        "id": "Agree",
                        "count": 1421
                    },
                    {
                        "question": 7694,
                        "id": "Disagree",
                        "count": 206
                    }
                ]
            }
        ]
    };

    test("Updates the model with JSON", function () {
        when(controller.initialise("/some_url"));
        thenThe(model.setAllData).shouldHaveBeen(calledOnce);
    });

    test("Posts the custom action to facebook", function () {
        when(controller.initialise("/some_url"));
        when(view.fire("voted", "Disagree"));
        thenThe(authorizer.authUser).shouldHaveBeen(calledOnce);
        thenThe(FB.api)
            .shouldHaveBeen(calledOnce)
            .and(calledWith("/me/theguardian-spike:Disagree", "post"))
    })

})();
(function () {

    module("Vote Controller", {
        setup: function () {
            jQuery.ajax = sinon.stub(jQuery, "ajax");
            jQuery.ajax.returns({
                then: function (fn) {
                    fn(json);
                }
            });
            model = sinon.stub(new guardian.facebook.VoteModel());
            authorizer = sinon.stub(Object.create(guardian.facebook.Authorizer.prototype));
            authorizer.authorize.returns({
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
                        "id": 14281,
                        "count": 1421
                    },
                    {
                        "question": 7694,
                        "id": 14282,
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

    test("Auths the user", function () {
        when(controller.initialise("/some_url"));
        when(view.fire("voted", 123));
        thenThe(authorizer.authorize).shouldHaveBeen(calledOnce);
    })

})();
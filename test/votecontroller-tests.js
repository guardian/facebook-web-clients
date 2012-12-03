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
            authorizer = sinon.stub(new guardian.facebook.Authorizer());
            authorizer.authorize.returns({
                then: function (fn) {
                    fn(json);
                }
            });
            view = Object.create(Subscribable.prototype);
            controller = new guardian.facebook.VoteController(model, view)
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

    test("Auths the app", function () {
        when(view.fire("voted"));
        thenThe(authorizer.authorize).shouldHaveBeen(calledOnce);
    })

})();
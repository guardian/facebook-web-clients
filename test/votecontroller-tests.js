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
            controller = new guardian.facebook.VoteController(model)
        },
        teardown: function() {
            jQuery.ajax.restore()
        }
    });

    var model, controller, json = {
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

    test("Present", function () {
        when(controller.initialise("/some_url"));
        thenThe(model.setAllData).shouldHaveBeen(calledOnce);
    })

})();
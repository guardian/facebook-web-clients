var fakePromise = {
    then: function (fn) {
        fn();
    }
};

function fakeAuthorizer() {
    authorizer = guardian.facebook.Authorizer.getInstance();

    sinon.stub(authorizer, "_loadFacebookAPI");
    sinon.stub(authorizer, "getLoginStatus");
    sinon.stub(authorizer, "login");

    authorizer._loadFacebookAPI.returns(fakePromise);
    authorizer.getLoginStatus.returns(fakePromise);
    authorizer.login.returns(fakePromise);
    authorizer.onNotAuthorized = fakePromise;
    return authorizer;
}

function fakeModel() {
    var eventBus = {},
        model = sinon.stub(new guardian.facebook.VoteModel());
    model.on = function (event, fn) {
        eventBus[event] = fn;
    };
    model.trigger = function (event, args) {
        eventBus[event].apply(null, args);
    };
    deferred = jQuery.Deferred();
    model.whenDataIsSet.returns(deferred.promise());
    return model;
}

function fakeView() {
    var view = new EventEmitter();
    view.render = sinon.stub();
    return view;
}
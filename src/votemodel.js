(function () {

    function VoteModel() {
        this.agree = 1;
        this.disagree =3;
    }

    VoteModel.prototype.getTotal = function () {
        return this.agree + this.disagree;
    };

    VoteModel.prototype.getAgreePercent = function () {
        var total = this.getTotal();
        if (total) {
            return (this.agree / total) * 100;
        } else {
            return VoteModel.EVEN;
        }
    };

    VoteModel.EVEN = 50;

    guardian.facebook.VoteModel = VoteModel;

})();
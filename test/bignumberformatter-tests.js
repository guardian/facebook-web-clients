(function () {

    module("Big Number Formatter");

    test("Small Numbers", function () {
        equal(format(0), "0");
        equal(format(30), "30");
        equal(format(99), "99");
        equal(format(999), "999");
    });

    test("Thousands rendered to one decimal place", function () {
        equal(format(1000), "1.0K");
        equal(format(2500), "2.5K");
        equal(format(2501), "2.5K");
        equal(format(9999), "9.9K");
    });

    test("Ten thousands", function () {
        equal(format(10000), "10K");
        equal(format(55321), "55K");
        equal(format(99300), "99K");
    });

    test("Hundred thousands", function () {
        equal(format(100000), "100K");
        equal(format(532121), "532K");
        equal(format(650001), "650K");
    });

    test("Millions", function () {
        equal(format(100000000), "1.0M");
        equal(format(160000000), "1.6M");
        equal(format(163213211), "1.6M");
    });

    /* End of Tests */

    function format(v) {
        return guardian.facebook.BigNumberFormatter(v);
    }

})();
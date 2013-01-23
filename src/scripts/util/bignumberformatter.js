(function () {

    /**
     * Abbreviates the given numeric such that they never exceed four characters.
     * Small numbers (<1000) are returned as-is
     * Numbers like 3000 are rendered as 3.5K
     * Numbers beyond 5 digits are rendered like 20K, 21K, 500K
     * Numbers in millions are rendered as 1.5M, 10M, 20M.
     * @param {Number} value The value to abbreviate
     * @return {String} The formatted value
     */
    function BigNumberFormatter(value) {

        var i, l, multiplier, newValue;

        for (i = 0, l = multipliers.length; i < l; i++) {
            multiplier = multipliers[i];
            if (value >= multiplier.n) {
                newValue = value / multiplier.n;
                return newValue.toFixed(newValue < 10 ? 1 : 0) + multiplier.abbr;
            }
        }

        return value;
    }

    var multipliers = [
        {abbr: 'M', n: 1000000},
        {abbr: 'K', n: 1000}
    ];

    guardian.facebook.BigNumberFormatter = BigNumberFormatter;

})();
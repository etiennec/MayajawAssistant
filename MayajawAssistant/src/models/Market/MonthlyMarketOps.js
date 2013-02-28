function MonthlyMarketOps(month, year) {
    this.year = typeof year !== 'undefined' ? year : "NA";
    this.month = typeof month !== 'undefined' ? month : "NA";
    this.ops = [];

    // Add the operation. Merge it with existing operation with same WHO and WHAT if any.
    this.mergeOp = function (marketOp) {
        var ops = this.ops;
        for (var i = 0; i < ops.length; i++) {
            var op = ops[i];
            if (op.who === marketOp.who && op.what === marketOp.what) {
                op.howmuch += marketOp.howmuch;
                return;
            }
        }
        ops.push(marketOp)
    };

    this.toString = function () {
        var string = this.getDateAsString()
        for (var i = 0; i < this.ops.length; i++) {
            var op = this.ops[i];
            string += "\n" + op.toString();
        }

        return string;
    };

    this.getDateAsString = function () {
        return  "Année:" + this.year + " Mois:" + this.month;
    };

};

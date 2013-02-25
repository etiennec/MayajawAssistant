var MonthlyMarketOps = Backbone.Model.extend({
    initialize: function () {
        this.set("ops", [])
    },
    default: {
        year: "NA",
        month: "NA",
        ops: []
    },
    // Add the operation. Merge it with existing operation with same WHO and WHAT if any.
    mergeOp: function (marketOp) {
        var ops = this.get("ops");
        for (var i = 0; i < ops.length; i++) {
            var op = ops[i];
            if (op.get("who") === marketOp.get("who") && op.get("what") === marketOp.get("what")) {
                op.set("howmuch", op.get("howmuch") + marketOp.get("howmuch"));
                return;
            }
        }
        ops.push(marketOp)
    },

    toString: function () {
        var string = this.getDateAsString()
        for (var i = 0; i < this.get("ops").length; i++) {
            var op = this.get("ops")[i];
            string += "\n" + op.toString();
        }

        return string;
    },
    getDateAsString: function () {
        return  "Année:" + this.get("year") + " Mois:" + this.get("month");
    }

});

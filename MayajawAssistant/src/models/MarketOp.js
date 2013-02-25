var MarketOp = Backbone.Model.extend({
    default: {
        what: "NA",
        who: "NA",
        howmuch: 0
    },

    toString: function() {
        return this.get("who")+ (+this.get("howmuch") > 0 ?  " sold " : " bought ")+this.get("howmuch")+ " "+this.get("what")
    }
});

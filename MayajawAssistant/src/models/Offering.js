var Offering = Backbone.Model.extend({
    default: {
        from: "NA",
        to: "NA",
        of: 0
    },
    toString: function() {
        return this.get("from")+ " offered "+this.get("of")+ " to "+this.get("to")
    }
});

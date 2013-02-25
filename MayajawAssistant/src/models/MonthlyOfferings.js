var MonthlyOfferings = Backbone.Model.extend({
    initialize: function () {
        this.set("offerings", [])
    },
    default: {
        year: "NA",
        month: "NA",
        offerings: []
    },
    addOffering: function (offering) {
        this.get("offerings").push(offering)
    },
    toString: function () {
        var string = this.getDateAsString()
        for (var i = 0; i < this.get("offerings").length; i++) {
            var offering = this.get("offerings")[i]
            string += "\n" + offering.toString()
        }

        return string
    },
    getDateAsString: function () {
        return  "Année:" + this.get("year") + " Mois:" + this.get("month")
    }

});

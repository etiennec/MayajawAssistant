function MonthlyOfferings(month, year) {

    this.year = typeof year !== 'undefined' ? year : "NA";
    this.month = typeof month !== 'undefined' ? month : "NA";
    this.offerings = [];

    this.addOffering = function (offering) {
        this.offerings.push(offering)
    };

    this.toString = function () {
        var string = this.getDateAsString()
        for (var i = 0; i < this.offerings.length; i++) {
            var offering = this.offerings[i];
            string += "\n" + offering.toString();
        }

        return string;
    };

    this.getDateAsString = function () {
        return  "Année:" + this.year + " Mois:" + this.month;
    }

};

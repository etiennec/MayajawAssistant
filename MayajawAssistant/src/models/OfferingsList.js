function OfferingsList() {
    this.monthlyOfferings = []; // Array of monthly offerings

    this.toString = function () {
        var string = "Total count:" + this.monthlyOfferings.length;
        for (var i = 0; i < this.monthlyOfferings.length; i++) {
            var monthlyOffering = this.monthlyOfferings[i];
            string += "\n" + monthlyOffering.toString();
        }

        return string;
    };

    this.toObject = function () {
        return {
            Offerers: this.getOfferersList(null),
            Offerees: this.getOffereesList(null)
        }
    };

    this.getOfferersList = function (offereeFilterName) {

        var offerersSet = [];
        var offerersTotal = {};
        var offerings = this.getOfferingsList(null, null);

        for (var i = 0; i < offerings.length; i++) {
            var offering = offerings[i];
            var to = offering.to;
            if (offereeFilterName != null && to != offereeFilterName) {
                continue;
            }

            var from = offering.from;
            var of = offering.of;
            if (offerersSet.indexOf(from) == -1) {
                // New offerer
                offerersSet.push(from);
                offerersTotal[from] = of;
            } else {
                // Existing offerer
                offerersTotal[from] += of;
            }
        }

        var offerersList = [];
        for (var i = 0; i < offerersSet.length; i++) {
            var name = offerersSet[i];
            offerersList.push({Name: name, Value: offerersTotal[name]});
        }

        // We sort the array from the biggest contributor to the smallest
        offerersList.sort(function (a, b) {
            return b.Value - a.Value;
        })

        return offerersList;
    };

    this.getOffereesList = function (offererFilterName) {

        var offereesSet = [];
        var offereesTotal = {};
        var offerings = this.getOfferingsList(null, null);

        for (var i = 0; i < offerings.length; i++) {
            var offering = offerings[i];
            var from = offering.from;
            if (offererFilterName != null && from != offererFilterName) {
                continue;
            }

            var to = offering.to;
            var of = offering.of;
            if (offereesSet.indexOf(to) == -1) {
                // New offerer
                offereesSet.push(to);
                offereesTotal[to] = of;
            } else {
                // Existing offerer
                offereesTotal[to] += of;
            }
        }

        var offereesList = [];
        for (var i = 0; i < offereesSet.length; i++) {
            var name = offereesSet[i];
            offereesList.push({Name: name, Value: offereesTotal[name]});
        }

        // We sort the array from the biggest contributor to the smallest
        offereesList.sort(function (a, b) {
            return b.Value - a.Value;
        })

        return offereesList;
    };

    // Return the list of all offerings. Can pass optional year and/or month to filter data returned.
    this.getOfferingsList = function (year, month) {
        var offerings = [];

        for (var i = 0; i < this.monthlyOfferings.length; i++) {
            var monthlyOffering = this.monthlyOfferings[i];
            if (year != null && monthlyOffering.year != year) {
                continue;
            }
            if (month != null && monthlyOffering.month != month) {
                continue;
            }

            for (var j = 0; j < monthlyOffering.offerings.length; j++) {
                offerings.push((monthlyOffering.offerings[j]));
            }
        }

        return offerings;
    };

    // Return the contents ready for use in a stacked Area chart or a stacked columns chart.
    this.getAsStackedData = function () {
        var categories = [];
        // This var will contain arrays of series with offerer as index.
        var tmpSeries = {};

        for (var i = 0; i < this.monthlyOfferings.length; i++) {
            var monthlyOffering = this.monthlyOfferings[i];
            categories.push(monthlyOffering.getDateAsString());
            for (var j = 0; j < monthlyOffering.offerings.length; j++) {
                var offering = monthlyOffering.offerings[j];
                var offerer = offering.from;
                if (tmpSeries[offerer] === undefined) {
                    tmpSeries[offerer] = [];
                }
                if (tmpSeries[offerer][i] === undefined) {
                    tmpSeries[offerer][i] = 0;
                }
                tmpSeries[offerer][i] += offering.of;
            }
        }

        // now we convert the temporary series to the real series object
        var series = [];

        for (var key in tmpSeries) {
            var serieWithoutMissingValues = tmpSeries[key];

            for (var i = 0; i < categories.length; i++) {
                if (serieWithoutMissingValues[i] === undefined) {
                    serieWithoutMissingValues[i] = 0;
                }
            }

            series.push({name: key, data: serieWithoutMissingValues, color: ChartsUtils.getColor(key)});
        }

        return {
            categories: categories,
            series: series
        }

    };
};

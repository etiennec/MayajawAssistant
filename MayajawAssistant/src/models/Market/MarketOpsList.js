function MarketOpsList() {
    this.monthlyOps = [];

    this.toString = function () {
        var string = "Total count:" + this.monthlyOps.length;
        for (var i = 0; i < this.monthlyOps.length; i++) {
            var monthlyMarketOp = this.monthlyOps[i];
            string += "\n" + monthlyMarketOp.toString();
        }

        return string;
    };

    // Returns a DataSource object that can be used to render all sold or bought items with checkboxes.
    // If a noble name is passed, only select items included in operations by this noble.
    // "isSelected" is true if a noble name is passed, false if not.
    this.getItems = function(nobleName) {

        // We first build a set of items used in operations.
        var usedItemsSet = [];

        for (var i = 0; i < this.monthlyOps.length; i++) {
            var monthlyMarketOp = this.monthlyOps[i];
            var ops = monthlyMarketOp.ops;
            ;
            for (var j = 0; j < ops.length; j++) {
                var itemName = ops[j].what;
                if (nobleName != null) {
                    if (nobleName !== ops[j].who) {
                        continue;
                    }
                }
                MAUtils.addToSet(itemName, usedItemsSet);
            }
        }

        // We sort items by name so that the names are order in the list view
        usedItemsSet.sort();

        // We now create a structure with category as key, as well as a category set
        var categoriesMap = {};
        var categoriesSet = [];
        for (var i = 0; i < usedItemsSet.length; i++) {
            var itemName = usedItemsSet[i];
            var details = MarketItemsUtils.itemsMap[itemName];
            // Special hard-coded case for tablettes
            if (details == null && itemName.indexOf('tablette') == 0) {
                details = {category: "livres et tablettes"}
            }
            // Special hard-coded case for family amulets
            if (details == null && itemName.indexOf('Amulette') == 0) {
                details = {category: "bijoux"}
            }

            if (details != null) {
                // Known Item
                MAUtils.addToSet(details.category, categoriesSet);
                if (categoriesMap[details.category] == null) {
                    categoriesMap[details.category] = [];
                }
                categoriesMap[details.category].push({item: itemName, isSelected: nobleName != null});
            } else {
                // Unknown Item
                MAUtils.addToSet("autres", categoriesSet);
                if (categoriesMap["autres"] == null) {
                    categoriesMap["autres"] = [];
                }
                categoriesMap["autres"].push({item: itemName, isSelected: nobleName != null});
            }
        }

        // We now order the categoriesSet to insert categories in alphabetical order in ListView
        categoriesSet.sort();

        var itemsByCategory = [];

        for (var i = 0; i < categoriesSet.length; i++) {

            var category = categoriesSet[i];
            var categoryItems = {category: category, items: categoriesMap[category], isSelected: nobleName != null};

            itemsByCategory.push(categoryItems);
        }
        return itemsByCategory;
    };

    // returns the list of all nobles with at least one transaction.
    this.getNobles = function () {
        // We first build a set of items used in operations.
        var noblesSet = [];

        for (var i = 0; i < this.monthlyOps.length; i++) {
            var monthlyMarketOp = this.monthlyOps[i];
            var ops = monthlyMarketOp.ops;

            for (var j = 0; j < ops.length; j++) {
                var nobleName = ops[j].who;
                MAUtils.addToSet(nobleName, noblesSet);
            }
        }

        // We sort nobles by name so that the names are order in the list view
        noblesSet.sort();

        var noblesDataSource = [];

        for (var i = 0; i < noblesSet.length; i++) {
            noblesDataSource.push({"Name": noblesSet[i]})
        }

        return noblesDataSource;
    };

    // returns as an object ready to use for charting:
    // {
    //   buys: {...}, // For stacked column chart
    //   sells: {...}, // For stacked column chart
    //   buyers: {...},     // For pie chart
    //   sellers: {...}     // For pie chart
    // }
    //  If a noble name is passed as parameter, we only retrieve info for her.
    // If not, we retrieve info for all nobles.
    this.getChartData = function (marketItems, nobleName) {

        // Map using players or items as key, and total ops amount as value
        var BuysAndSales = {}

        for (var i = 0; i < this.monthlyOps.length; i++) {
            var monthlyMarketOp = this.monthlyOps[i];
            var ops = monthlyMarketOp.ops;
            for (var j = 0; j < ops.length; j++) {
                var op = ops[j]
                if ($.inArray(op.what, marketItems) >= 0) {
                    // If looking at a specific player, we only keep his transactions.
                    if (nobleName != null && op.who !== nobleName) {
                        continue;
                    }
                    var stuffName = nobleName != null ? op.what : op.who;
                    if (BuysAndSales[stuffName] == null) {
                        BuysAndSales[stuffName] = op.howmuch;
                    } else {
                        BuysAndSales[stuffName] += op.howmuch;
                    }
                }
            }
        }

        var buysData = [];
        var salesData = [];

        for (var key in BuysAndSales) {
            var amount = BuysAndSales[key];
            if (amount > 0) {
                salesData.push({Name: key, Value: amount});
            } else if (amount < 0) {
                buysData.push({Name: key, Value: (amount * -1)});
            }
        }

        // We sort from the biggest to the smallest so that pie charts looks good.
        buysData.sort(function (a, b) {
            return b.Value - a.Value
        })
        salesData.sort(function (a, b) {
            return b.Value - a.Value
        })

        return {
            buys: this.getAsStackedData(marketItems, nobleName, function (op) {
                return op.howmuch < 0
            }),
            sells: this.getAsStackedData(marketItems, nobleName, function (op) {
                return op.howmuch > 0
            }),
            buyers: buysData,
            sellers: salesData
        }
    };

    // Return the contents ready for use in a stacked Area chart or a stacked columns chart.
    this.getAsStackedData = function (marketItems, nobleName, opSelector) {
        var categories = [];
        // This var will contain arrays of series with player name or item name as index.
        var tmpSeries = {};

        for (var i = 0; i < this.monthlyOps.length; i++) {
            var monthlyMarketOps = this.monthlyOps[i];
            categories.push(monthlyMarketOps.getDateAsString());
            for (var j = 0; j < monthlyMarketOps.ops.length; j++) {
                var op = monthlyMarketOps.ops[j];
                if ($.inArray(op.what, marketItems) >= 0 && opSelector(op)) {
                    // If looking at a specific player, we only keep his transactions.
                    if (nobleName != null && op.who !== nobleName) {
                        continue;
                    }
                    var stuff = nobleName != null ? op.what : op.who;
                    if (tmpSeries[stuff] === undefined) {
                        tmpSeries[stuff] = [];
                    }
                    if (tmpSeries[stuff][i] === undefined) {
                        tmpSeries[stuff][i] = 0;
                    }
                    tmpSeries[stuff][i] += Math.abs(op.howmuch);
                }
            }
        }

        // now we convert the temporary series to the real series object
        var series = [];

        for (var key in tmpSeries) {
            var serieWithoutMissingValues = tmpSeries[key];

            // We insert zeros where there is not data
            for (var i = 0; i < categories.length; i++) {
                if (serieWithoutMissingValues[i] === undefined) {
                    serieWithoutMissingValues[i] = 0;
                    ;
                }
            }

            series.push({name: key, data: serieWithoutMissingValues, color: ChartsUtils.getColor(key)});
        }

        return {
            categories: categories,
            series: series
        };
    };

};
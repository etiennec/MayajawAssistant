ParseUtils = {};

ParseUtils.yearMonthLineMatcher = /Ann.e (\d+) - Mois (\d+)/

// Cenote
ParseUtils.offeringLineMatcher = /(.+) a donn. (\d+)\s?. ([^\(\n]+)/
ParseUtils.prayerLineMatcher = /Les pri.res de (.+) ont honor. (.+) : \+(\d+)/

// Market
ParseUtils.sellLineMatcher = /(.+) a vendu (\d+) (.+)/
ParseUtils.buyLineMatcher = /(.+) a achet. (\d+) (.+)/


// Parse a line into a header line, i.e. year/month line.
// Returns a new MonthlyOfferings if parsed successfully, null else.
ParseUtils.parseHeaderOfferingLine = function (line) {

    var headerMatch = ParseUtils.yearMonthLineMatcher.exec(line)

    if (headerMatch === null) {
        return null
    } else {
        return  new MonthlyOfferings({year: parseInt(headerMatch[1]), month: parseInt(headerMatch[2])})
    }

}

// Parse a line into a header line, i.e. year/month line.
// Returns a new MonthlyMarketOps if parsed successfully, null else.
ParseUtils.parseHeaderMarketOpsLine = function (line) {

    var headerMatch = ParseUtils.yearMonthLineMatcher.exec(line)

    if (headerMatch === null) {
        return null
    } else {
        return  new MonthlyMarketOps({year: parseInt(headerMatch[1]), month: parseInt(headerMatch[2])})
    }

}

// Parse an offering line into an Offering object or null if not matching.
ParseUtils.parseOfferingLine = function (line) {

    var offeringMatch = ParseUtils.offeringLineMatcher.exec(line)

    var offering = null

    if (offeringMatch === null) {
        var prayerMatch = ParseUtils.prayerLineMatcher.exec(line)
        if (prayerMatch !== null) {
            var offering = new Offering({from: $.trim(prayerMatch[1]), of: parseInt(prayerMatch[3]), to: (prayerMatch[2]).trim()})
        }
    } else {
        var offering = new Offering({from: $.trim(offeringMatch[1]), of: parseInt(offeringMatch[2]), to: (offeringMatch[3]).trim()})
    }

    return offering

}


// Parse a market operation line into a MarketOp object or null if not matching.
ParseUtils.parseMarketOpLine = function (line) {

    var opMatch = ParseUtils.sellLineMatcher.exec(line);
    var seller = true;

    var op = null

    if (opMatch === null) {
        seller = false;
        opMatch = ParseUtils.buyLineMatcher.exec(line);
    }
    if (opMatch != null) {
        op = new MarketOp({who: $.trim(opMatch[1]), howmuch: (seller ? parseInt(opMatch[2]) : parseInt(opMatch[2]) * -1), what: $.trim(MarketItemsUtils.normalizeMarketItem(opMatch[3]))});
    }

    return op;

}


ParseUtils.parseCenoteInput = function (rawText) {

    var offeringsList = new OfferingsList

    var currentMonthOfferings = null

    var lines = rawText.split('\n')

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i]
        if (line.trim().length != 0) {
            // First, check if this is a year/month line.
            var tempMonthOffering = ParseUtils.parseHeaderOfferingLine(line)

            if (tempMonthOffering === null) {
                // Normal line : New Offering in Offerings
                var offering = ParseUtils.parseOfferingLine(line)
                if (offering !== null) {
                    // We have a new offering to add for the current month
                    if (currentMonthOfferings !== null) {
                        currentMonthOfferings.addOffering(offering)
                    } else {
                        currentMonthOfferings = new MonthlyOfferings
                        currentMonthOfferings.addOffering(offering)
                        offeringsList.add(currentMonthOfferings)
                    }
                }
            } else {
                // Header line : New Offerings in OfferingsList
                currentMonthOfferings = tempMonthOffering
                offeringsList.add(currentMonthOfferings)
            }
        }
    }

    ParseUtils.sortMonthlyCollection(offeringsList)

    return offeringsList;
}


ParseUtils.parseMarketInput = function (rawText) {

    var marketOpsList = new MarketOpsList

    var currentMonthOps = null

    var lines = rawText.split('\n')

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i]
        if (line.trim().length != 0) {
            // First, check if this is a year/month line.
            var tempMonthOps = ParseUtils.parseHeaderMarketOpsLine(line)

            if (tempMonthOps === null) {
                // Normal line : New MarketOp in MarketOps
                var marketOp = ParseUtils.parseMarketOpLine(line)
                if (marketOp !== null) {
                    // We have a new offering to add for the current month
                    if (currentMonthOps !== null) {
                        currentMonthOps.mergeOp(marketOp)
                    } else {
                        currentMonthOps = new MonthlyMarketOps
                        currentMonthOps.mergeOp(marketOp)
                        marketOpsList.add(currentMonthOps)
                    }
                }
            } else {
                // Header line : New Offerings in OfferingsList
                currentMonthOps = tempMonthOps
                marketOpsList.add(currentMonthOps)
            }
        }
    }

    ParseUtils.sortMonthlyCollection(marketOpsList)

    return marketOpsList;
}

ParseUtils.sortMonthlyCollection = function (monthlyCollection) {
    monthlyCollection.models.sort(function (a, b) {
        if (a.get("year") !== b.get("year")) {
            return a.get("year") - b.get("year");
        }

        return  a.get("month") - b.get("month");
    })
}
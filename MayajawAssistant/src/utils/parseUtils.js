ParseUtils = {};

ParseUtils.yearMonthLineMatcher = /Ann.e (\d+) - Mois (\d+)/;

// Cenote
ParseUtils.offeringLineMatcher = /(.+) a donn. (\d+)\s?. ([^\(\n]+)/;
ParseUtils.prayerLineMatcher = /Les pri.res de (.+) ont honor. (.+) : \+(\d+)/;

// Market
ParseUtils.sellLineMatcher = /(.+) a vendu (\d+) (.+)/;
ParseUtils.buyLineMatcher = /(.+) a achet. (\d+) (.+)/;

//ParseUtils.domainBuildingInfoMatcher = /<hr style='margin-bottom:0;color:#.+<table>(.+)<\/table>/g;
ParseUtils.domainBuildingInfoMatcher = /<hr style='margin-bottom:0;color:#[\s\S]+?<table>([\s\S]+?)<\/table>/g;
ParseUtils.buildingNameMatcher = /<b>([^<]*?)<\/b>( : (.*))?<div class='rapports'>/;

// Parse a line into a header line, i.e. year/month line.
// Returns a new MonthlyOfferings if parsed successfully, null else.
ParseUtils.parseHeaderOfferingLine = function (line) {

    var headerMatch = ParseUtils.yearMonthLineMatcher.exec(line)

    if (headerMatch === null) {
        return null;
    } else {
        return  new MonthlyOfferings(parseInt(headerMatch[2]), parseInt(headerMatch[1]));
    }

}

// Parse a line into a header line, i.e. year/month line.
// Returns a new MonthlyMarketOps if parsed successfully, null else.
ParseUtils.parseHeaderMarketOpsLine = function (line) {

    var headerMatch = ParseUtils.yearMonthLineMatcher.exec(line);

    if (headerMatch === null) {
        return null;
    } else {
        return  new MonthlyMarketOps(parseInt(headerMatch[2]), parseInt(headerMatch[1]));
    }

}

// Parse an offering line into an Offering object or null if not matching.
ParseUtils.parseOfferingLine = function (line) {

    var offeringMatch = ParseUtils.offeringLineMatcher.exec(line);

    var offering = null;

    if (offeringMatch === null) {
        var prayerMatch = ParseUtils.prayerLineMatcher.exec(line);
        if (prayerMatch !== null) {
            var offering = new Offering((prayerMatch[1]).trim(), (prayerMatch[2]).trim(), parseInt(prayerMatch[3]));
        }
    } else {
        var offering = new Offering((offeringMatch[1]).trim(), (offeringMatch[3]).trim(), parseInt(offeringMatch[2]));
    }

    return offering;

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
        op = new MarketOp($.trim(opMatch[1]), $.trim(MarketItemsUtils.normalizeMarketItem(opMatch[3])), (seller ? parseInt(opMatch[2]) : parseInt(opMatch[2]) * -1));
    }

    return op;

}


ParseUtils.parseCenoteInput = function (rawText) {

    var offeringsList = new OfferingsList;

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
                        offeringsList.monthlyOfferings.push(currentMonthOfferings)
                    }
                }
            } else {
                // Header line : New Offerings in OfferingsList
                currentMonthOfferings = tempMonthOffering
                offeringsList.monthlyOfferings.push(currentMonthOfferings)
            }
        }
    }

    ParseUtils.sortMonthlyCollection(offeringsList.monthlyOfferings)

    return offeringsList;
}


ParseUtils.parseMarketInput = function (rawText) {

    var marketOpsList = new MarketOpsList;
    var currentMonthOps = null;
    var lines = rawText.split('\n');

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line.trim().length != 0) {
            // First, check if this is a year/month line.
            var tempMonthOps = ParseUtils.parseHeaderMarketOpsLine(line);

            if (tempMonthOps === null) {
                // Normal line : New MarketOp in MarketOps
                var marketOp = ParseUtils.parseMarketOpLine(line);
                if (marketOp !== null) {
                    // We have a new offering to add for the current month
                    if (currentMonthOps !== null) {
                        currentMonthOps.mergeOp(marketOp);
                    } else {
                        currentMonthOps = new MonthlyMarketOps();
                        currentMonthOps.mergeOp(marketOp);
                        marketOpsList.monthlyOps.push(currentMonthOps);
                    }
                }
            } else {
                // Header line : New Offerings in OfferingsList
                currentMonthOps = tempMonthOps;
                marketOpsList.monthlyOps.push(currentMonthOps);
            }
        }
    }

    ParseUtils.sortMonthlyCollection(marketOpsList.monthlyOps);

    return marketOpsList;
}

ParseUtils.sortMonthlyCollection = function (monthlyCollection) {
    monthlyCollection.sort(function (a, b) {
        if (a.year !== b.year) {
            return a.year - b.year;
        }

        return  a.month - b.month;
    })
}

ParseUtils.getMockDomainInput = function () {

    var mockSlave1 = new Slave(1, "Yam Kuux", new Competences(2, 4, 8, 10, 3, 1));
    var mockSlave2 = new Slave(2, "Ich Xel", new Competences(5, 3, 9, 8, 4, 4));
    var mockSlave3 = new Slave(3, "Boyon Lokte", new Competences(10, 2, 2, 4, 1, 1));

    var mockBuilding1 = new Building(1, "mine 1", new Type("mine"), 2, new Activity("Extraction de calcaire", new Competences(0.5, 0.15, 0.35, 0, 0, 0)));
    var mockBuilding2 = new Building(2, "manu 1", new Type("manufacture"), 1, new Activity("Fabrication de cordes", new Competences(0, 0.4, 0.1, 0.4, 0.1, 0)));
    var mockBuilding3 = new Building(3, "manu 2", new Type("manufacture"), 1, new Activity("Fabrication de sacs", new Competences(0, 0.4, 0.1, 0.4, 0.1, 0)));
    var mockBuilding4 = new Building(4, "sel", new Type("baraque de cueilleurs"), 1, new Activity("Ramassage de sel", new Competences(0.3, 0, 0.7, 0, 0, 0)));

    var assignments = {
        1: 1, // Slave 1 is in building 1
        2: 3, // Slave 2 is in building 2
        3: null // Slave 3 is in no building (likley in manoir at that time).
    };

    return {
        slaves: [mockSlave1, mockSlave2, mockSlave3],
        buildings: [mockBuilding1, mockBuilding2, mockBuilding3, mockBuilding4],
        assignments: assignments
    }
}

ParseUtils.parseBuildingInfo = function (domainItemStr) {
    var building = new Building();

    var nameMatch = ParseUtils.buildingNameMatcher.exec(domainItemStr);
    if (nameMatch != null) {
        // There are bullets after the name if level > 1.
        var level = 0;
        var name = nameMatch[1].trim();
        while (name.indexOf('&bull;', name.length - '&bull;'.length) !== -1) {
            name = name.substr(0, name.length - '&bull;'.length);
            level++;
        }

        building.name = name.trim();
        building.level = level === 0 ? 1 : level;

        if (nameMatch[3] !== undefined) {
            var activity = new Activity(nameMatch[3]);
            // TODO comp
            building.activity = activity;
        }

    }

    return building;
}


ParseUtils.parseSlavesInfo = function (domainItemStr) {
    var slaves = [];

    slaves.push(new Slave());

    return slaves;
}

ParseUtils.parseDomainInput = function (domainHtmlSource) {
    var domain = {slaves: [],
        buildings: [],
        assignments: {}
    }

    var matches;
    var slaveIndex = 0;
    var buildingIndex = 0;

    while (matches = ParseUtils.domainBuildingInfoMatcher.exec(domainHtmlSource)) {
        var domainItemStr = matches[1];
        var building = ParseUtils.parseBuildingInfo(domainItemStr);
        building.id = buildingIndex;

        // There can be zero, 1 or more slaves per building
        var slaves = ParseUtils.parseSlavesInfo(domainItemStr);

        for (var i = 0; i < slaves.length; i++) {
            var slave = slaves[i];
            slave.id = slaveIndex;
            domain.assignments[slaveIndex] = buildingIndex;
            domain.slaves.push(slave);
            slaveIndex++;
        }

        domain.buildings.push(building);

        buildingIndex++;
    }

    return domain;
}
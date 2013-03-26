ParseUtils = {};

ParseUtils.yearMonthLineMatcher = /Ann.e (\d+) - Mois (\d+)/;

// Cenote
ParseUtils.offeringLineMatcher = /(.+) a donn. (\d+)\s?. ([^\(\n]+)/;
ParseUtils.prayerLineMatcher = /Les pri.res de (.+) ont honor. (.+) : \+(\d+)/;

// Market
ParseUtils.sellLineMatcher = /(.+) a vendu (\d+) (.+)/;
ParseUtils.buyLineMatcher = /(.+) a achet. (\d+) (.+)/;

//ParseUtils.domainBuildingInfoMatcher = /<hr style='margin-bottom:0;color:#.+<table>(.+)<\/table>/g;
ParseUtils.domainBuildingInfoMatcher = /<hr style='margin-bottom:0;color:#[\s\S]+?<table>[\s\S]+?<td style='vertical-align:top;'>([\s\S]+?)<\/table>/g;
//ParseUtils.buildingNameMatcher = /<b>([^<]*?)(<b>&ndash;<\/b>)?<\/b>(<i>.+<\/i><b><\/b>)?( : (.*))?<div class='rapports'>/;
ParseUtils.buildingNameLineMatcher = /[^']<b>(.*?)<(\/)?div/;
ParseUtils.buildingNameLevelMatcher = /(&bull;)+/;
ParseUtils.buildingName5LevelMatcher = /<b>&ndash;<\/b>/;
ParseUtils.buildingNameMatcher = /(.*?)(<b>&ndash;<\/b>)?(&bull;)*<\/b>/;
ParseUtils.buildingActivityNameMatcher = / : ([^<]*)/;


ParseUtils.domainSlaveMatcher = /m\('<img width=55 height=68  style=\\'float:left\\' src=\\'i\/avatars[^\)]*?#......;width:([^p]*)px[^\)]*?#......;width:([^p]*)px[^\)]*?#......;width:([^p]*)px[^\)]*?#......;width:([^p]*)px[^\)]*?#......;width:([^p]*)px[^\)]*?#......;width:([^p]*)px[^\)]*?<\/div><b>(.*?)<\/b>[^\)]*\)/g;

ParseUtils.buildingActivityMatcher = /<div onmouseover='m\("<img src=i\/struct\/info1.png>","Cette barre indique les caractéristiques prises en compte(.*)?<div id='gomarche/;
ParseUtils.buildingActivityDetailMatcher = /width:(\d+)px;height:8px;background-color:#(......);/g;

ParseUtils.colorToCompMap = {
    // There are 3 color themes, so 3 different colors for each comp.
    'FFD78A': 'FOR',
    'FFA800': 'FOR',
    'CD7D00': 'FOR',
    'F6F289': 'DEX',
    'FFFF00': 'DEX',
    'CDC717': 'DEX',
    'EC8B8B': 'END',
    'FF0000': 'END',
    'B00202': 'END',
    'C0D1EC': 'INT',
    '3787FF': 'INT',
    '0A549A': 'INT',
    'B3F1B2': 'PER',
    '00FF00': 'PER',
    '3E8108': 'PER',
    'E8CFE8': 'CHA',
    'FF00FF': 'CHA',
    '670073': 'CHA'
};

// Parse a line into a header line, i.e. year/month line.
// Returns a new MonthlyOfferings if parsed successfully, null else.
ParseUtils.parseHeaderOfferingLine = function (line) {

    var headerMatch = ParseUtils.yearMonthLineMatcher.exec(line);

    if (headerMatch === null) {
        return null;
    } else {
        return  new MonthlyOfferings(parseInt(headerMatch[2]), parseInt(headerMatch[1]));
    }

};

// Parse a line into a header line, i.e. year/month line.
// Returns a new MonthlyMarketOps if parsed successfully, null else.
ParseUtils.parseHeaderMarketOpsLine = function (line) {

    var headerMatch = ParseUtils.yearMonthLineMatcher.exec(line);

    if (headerMatch === null) {
        return null;
    } else {
        return  new MonthlyMarketOps(parseInt(headerMatch[2]), parseInt(headerMatch[1]));
    }

};

// Parse an offering line into an Offering object or null if not matching.
ParseUtils.parseOfferingLine = function (line) {

    var offering = null;
    var offeringMatch = ParseUtils.offeringLineMatcher.exec(line);

    if (offeringMatch === null) {
        var prayerMatch = ParseUtils.prayerLineMatcher.exec(line);
        if (prayerMatch !== null) {
            offering = new Offering((prayerMatch[1]).trim(), (prayerMatch[2]).trim(), parseInt(prayerMatch[3]));
        }
    } else {
        offering = new Offering((offeringMatch[1]).trim(), (offeringMatch[3]).trim(), parseInt(offeringMatch[2]));
    }

    return offering;

};


// Parse a market operation line into a MarketOp object or null if not matching.
ParseUtils.parseMarketOpLine = function (line) {

    var opMatch = ParseUtils.sellLineMatcher.exec(line);
    var seller = true;

    var op = null;

    if (opMatch === null) {
        seller = false;
        opMatch = ParseUtils.buyLineMatcher.exec(line);
    }
    if (opMatch != null) {
        op = new MarketOp($.trim(opMatch[1]), $.trim(MarketItemsUtils.normalizeMarketItem(opMatch[3])), (seller ? parseInt(opMatch[2]) : parseInt(opMatch[2]) * -1));
    }

    return op;

};


ParseUtils.parseCenoteInput = function (rawText) {

    var offeringsList = new OfferingsList;

    var currentMonthOfferings = null;

    var lines = rawText.split('\n');

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line.trim().length != 0) {
            // First, check if this is a year/month line.
            var tempMonthOffering = ParseUtils.parseHeaderOfferingLine(line);

            if (tempMonthOffering === null) {
                // Normal line : New Offering in Offerings
                var offering = ParseUtils.parseOfferingLine(line);
                if (offering !== null) {
                    // We have a new offering to add for the current month
                    if (currentMonthOfferings !== null) {
                        currentMonthOfferings.addOffering(offering)
                    } else {
                        currentMonthOfferings = new MonthlyOfferings;
                        currentMonthOfferings.addOffering(offering);
                        offeringsList.monthlyOfferings.push(currentMonthOfferings);
                    }
                }
            } else {
                // Header line : New Offerings in OfferingsList
                currentMonthOfferings = tempMonthOffering;
                offeringsList.monthlyOfferings.push(currentMonthOfferings);
            }
        }
    }

    ParseUtils.sortMonthlyCollection(offeringsList.monthlyOfferings);

    return offeringsList;
};


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
};

ParseUtils.sortMonthlyCollection = function (monthlyCollection) {
    monthlyCollection.sort(function (a, b) {
        if (a.year !== b.year) {
            return a.year - b.year;
        }

        return  a.month - b.month;
    })
};

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
};

ParseUtils.parseBuildingInfo = function (domainItemStr) {
    var building = new Building();

    var nameMatch = ParseUtils.buildingNameLineMatcher.exec(domainItemStr);
    if (nameMatch != null) {

        var nameLine = nameMatch[1].trim();
        console.log(nameLine);

        var buildingName = ParseUtils.buildingNameMatcher.exec(nameLine);
        if (buildingName != null) {
            building.name = buildingName[1].trim();
            // We need some bullet removing as the regex can get a bit too hungry.
            while (ParseUtils.endsWith(building.name, '&bull;')) {
                building.name = building.name.substr(0, building.name.length - '&bull;'.length);
            }

        } else {
            building.name = "NA";
        }

        // Reading level from number of bullets
        var level = 0;
        var levelMatch = ParseUtils.buildingNameLevelMatcher.exec(nameLine);
        if (levelMatch != null) {
            var bullStr = levelMatch[0].trim();

            while (ParseUtils.endsWith(bullStr, '&bull;')) {
                bullStr = bullStr.substr(0, bullStr.length - '&bull;'.length);
                level++;
            }
        }
        // One dash = 5 levels.
        if (ParseUtils.buildingName5LevelMatcher.exec(nameLine)) {
            level += 5;
        }

        building.level = level === 0 ? 1 : level;

        var activity = new Activity();

        var activityName = ParseUtils.buildingActivityNameMatcher.exec(nameLine);

        if (activityName != null) {
            activity.name = activityName[1].trim();
        }

        activity.comps = ParseUtils.parseBuildingActivity(domainItemStr);
        building.activity = activity;
    }

    return building;
};

ParseUtils.parseBuildingActivity = function (domainItemStr) {

    var comps = new Competences();
    var compSum = 0;
    var activityDetailMatch;
    var nameMatch = ParseUtils.buildingActivityMatcher.exec(domainItemStr);

    if (nameMatch == null) {
        return comps;
    }

    while (activityDetailMatch = ParseUtils.buildingActivityDetailMatcher.exec(nameMatch[1])) {
        var score = parseInt(activityDetailMatch[1]) + 2;
        var color = activityDetailMatch[2];

        comps[ParseUtils.colorToCompMap[color]] = score;
        compSum += score;
    }

    // We need to normalize all comps so that their total is 1.
    comps.FOR /= compSum;
    comps.DEX /= compSum;
    comps.END /= compSum;
    comps.INT /= compSum;
    comps.PER /= compSum;
    comps.CHA /= compSum;

    return comps;

};


ParseUtils.parseSlavesInfo = function (domainItemStr) {
    var slaves = [];
    var slaveMatch;

    while (slaveMatch = ParseUtils.domainSlaveMatcher.exec(domainItemStr)) {

        // We skip children (infants or bigger)
        if (slaveMatch[0].indexOf('Enfant &nbsp;&nbsp;&nbsp;') != -1) {
            continue;
        }

        var slave = new Slave();
        slave.comps.FOR = getCompFromPixels(slaveMatch[1]);
        slave.comps.DEX = getCompFromPixels(slaveMatch[2]);
        slave.comps.END = getCompFromPixels(slaveMatch[3]);
        slave.comps.INT = getCompFromPixels(slaveMatch[4]);
        slave.comps.PER = getCompFromPixels(slaveMatch[5]);
        slave.comps.CHA = getCompFromPixels(slaveMatch[6]);
        slave.name = cleanNameSuffix(slaveMatch[7]);
        slaves.push(slave);
    }

    function getCompFromPixels(pixelsStr) {
        return (parseFloat(pixelsStr) + 2) / 1.5;
    }

    function cleanNameSuffix(name) {
        name = ParseUtils.removeSuffix(name, ' de Kaminaljuyù');
        name = ParseUtils.removeSuffix(name, ' de Takalik');
        name = ParseUtils.removeSuffix(name, ' d\'Iximché');
        name = ParseUtils.removeSuffix(name, ' d\'Izapa');
        return name;
    }

    return slaves;
};

ParseUtils.parseDomainInput = function (domainHtmlSource) {
    var domain = {slaves: [],
        buildings: [],
        assignments: {}
    };

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
};


ParseUtils.endsWith = function (string, suffix) {
    return string.indexOf(suffix, string.length - suffix.length) !== -1;
};

ParseUtils.removeSuffix = function (string, suffix) {
    while (ParseUtils.endsWith(string, suffix)) {
        string = string.substr(0, string.length - suffix.length);
    }
    return string;
};
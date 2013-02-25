MarketItemsUtils = {};

MarketItemsUtils.wordsEndingWithSorX = ["gros", "grès", "bois", "tas", "branchages", "coquillages", "manacas", "légumes", "crabes", "fruits", "salés", "maïs", "baies", "épices", "d'épices", "encens", "d'encens", "os", "d'os", "d'os", "ficus", "roseaux", "silex", "latex", "codex"];

MarketItemsUtils.itemsMap = {
    "aiguillon de raie": {plural: "aiguillons de raies", category: "objets"},
    "autel": {plural: "autels", category: "objets"},
    "autel Chac-Mool": {plural: "autels Chac-Mool", category: "objets"},
    "bague": {plural: "bagues", category: "bijoux"},
    "bague de métal": {plural: "bagues de métal", category: "bijoux"},
    "balle": {plural: "balles", category: "objets"},
    "barge": {plural: "barges", category: "objets"},
    "barque": {plural: "barques", category: "objets"},
    "bâton": {plural: "bâtons", category: "objets"},
    "bloc de calcaire": {plural: "blocs de calcaire", category: "matérieux de construction"},
    "bloc de cuivre": {plural: "blocs de cuivre", category: "matières premières"},
    "bloc de grès": {plural: "blocs de grès", category: "matières premières"},
    "bloc de jade": {plural: "blocs de jade", category: "matières premières"},
    "bloc de marbre": {plural: "blocs de marbre", category: "matières premières"},
    "bloc de silex": {plural: "blocs de silex", category: "matières premières"},
    "bloc d'hématite": {plural: "blocs d'hématite", category: "matières premières"},
    "bloc d'obsidienne": {plural: "blocs d'obsidienne", category: "matières premières"},
    "botte de chaume": {plural: "bottes de chaume", category: "matérieux de construction"},
    "botte de feuilles de palmier": {plural: "bottes de feuilles de palmier", category: "matérieux de construction"},
    "botte de maguey": {plural: "bottes de maguey", category: "matières premières"},
    "botte de roseaux": {plural: "bottes de roseaux", category: "matières premières"},
    "bouclier": {plural: "boucliers", category: "armes"},
    "bouquet de plumes d'aigle": {plural: "bouquets de plumes d'aigle", category: "matières premières"},
    "bouquet de plumes d'ara": {plural: "bouquets de plumes de ara", category: "matières premières"},
    "bouquet de plumes de quetzal": {plural: "bouquets de plumes de quetzal", category: "matières premières"},
    "bracelet": {plural: "bracelets", category: "bijoux"},
    "bracelet de coquillages": {plural: "bracelets de coquillages", category: "bijoux"},
    "bracelet de perles": {plural: "bracelets de perles", category: "bijoux"},
    "burin": {plural: "burins", category: "outils"},
    "cage": {plural: "cages", category: "objets"},
    "calumet": {plural: "calumets", category: "objets"},
    "canne à pêche": {plural: "cannes à pêche", category: "outils"},
    "canoë": {plural: "canoës", category: "objets"},
    "cape": {plural: "capes", category: "vêtements"},
    "cape de crocodile": {plural: "capes de crocodile", category: "vêtements"},
    "cape de jaguar": {plural: "capes de jaguar", category: "vêtements"},
    "cape de puma": {plural: "capes de puma", category: "vêtements"},
    "carapace de tortue": {plural: "carapaces de tortue", category: "matières premières"},
    "ceinture de protection": {plural: "ceintures de protection", category: "objets"},
    "cerf": {plural: "cerfs", category: "animaux"},
    "chien": {plural: "chiens", category: "animaux"},
    "clochette": {plural: "clochettes", category: "objets"},
    "clystère": {plural: "clystères", category: "objets"},
    "codex de comédie": {plural: "codex de comédie", category: "livres et tablettes"},
    "codex de comptabilité": {plural: "codex de comptabilité", category: "livres et tablettes"},
    "codex de savoir": {plural: "codex de savoir", category: "livres et tablettes"},
    "codex d'invocation": {plural: "codex d'invocation", category: "livres et tablettes"},
    "codex vierge": {plural: "codex vierges", category: "livres et tablettes"},
    "coiffe": {plural: "coiffes", category: "vêtements"},
    "collet": {plural: "collets", category: "outils"},
    "collier de coquillages": {plural: "colliers de coquillages", category: "bijoux"},
    "collier de dents de jaguar": {plural: "colliers de dents de jaguar", category: "bijoux"},
    "collier de dents de requin": {plural: "colliers de dents de requin", category: "bijoux"},
    "collier de perles": {plural: "colliers de perles", category: "bijoux"},
    "collier d'os": {plural: "colliers d'os", category: "bijoux"},
    "corde": {plural: "cordes", category: "objets"},
    "cordelette": {plural: "cordelettes", category: "objets"},
    "couteau de rituel": {plural: "couteaux de rituel", category: "objets"},
    "coutelas": {plural: "coutelas", category: "armes"},
    "couvre-chef": {plural: "couvre-chefs", category: "vêtements"},
    "crocodile": {plural: "crocodiles", category: "animaux"},
    "cruche": {plural: "cruches", category: "objets"},
    "cruche d'alcool de manioc": {plural: "cruches d'alcool de manioc", category: "aliments fins"},
    "cruche de balche": {plural: "cruches de balche", category: "aliments"},
    "cruche de latex": {plural: "cruches de latex", category: "matières premières"},
    "cruche de vin de maïs": {plural: "cruches de vin de maïs", category: "aliments fins"},
    "dent de jaguar": {plural: "dents de jaguar", category: "matières premières"},
    "encensoir": {plural: "encensoirs", category: "objets"},
    "encensoir de jade": {plural: "encensoirs de jade", category: "objets"},
    "épine de maguey": {plural: "épines de maguey", category: "objets"},
    "figurine": {plural: "figurines", category: "objets"},
    "filet": {plural: "filets", category: "outils"},
    "glaive": {plural: "glaives", category: "armes"},
    "grande coiffe": {plural: "grandes coiffes", category: "vêtements"},
    "gros rondin": {plural: "gros rondins", category: "matérieux de construction"},
    "habit de cuir": {plural: "habits de cuir", category: "vêtements"},
    "hache": {plural: "haches", category: "outils"},
    "harpon": {plural: "harpons", category: "outils"},
    "houe": {plural: "houes", category: "outils"},
    "jaguar": {plural: "jaguars", category: "animaux"},
    "javeline": {plural: "javelines", category: "armes"},
    "kit division": {plural: "kits division", category: "objets"},
    "lance": {plural: "lances", category: "armes"},
    "lapin": {plural: "lapins", category: "animaux"},
    "machette": {plural: "machettes", category: "outils"},
    "manacas": {plural: "manacas", category: "armes"},
    "marteau": {plural: "marteaux", category: "objets"},
    "masque": {plural: "masques", category: "bijoux"},
    "masque de jade": {plural: "masques de jade", category: "bijoux"},
    "massue": {plural: "massues", category: "armes"},
    "morceau d'écorce de ficus": {plural: "morceaux d'écorce de ficus", category: "matières premières"},
    "morceau de papier": {plural: "morceaux de papier", category: "matières premières"},
    "outils de guérisseur": {plural: "outils de guérisseur", category: "objets"},
    "outils d'enluminure": {plural: "outils d'enluminure", category: "objets"},
    "pagne": {plural: "pagnes", category: "vêtements"},
    "paire de jambières": {plural: "paires de jambières", category: "armes"},
    "paire de sandales": {plural: "paires de sandales", category: "vêtements"},
    "panier": {plural: "paniers", category: "objets"},
    "panier de baies": {plural: "paniers de baies", category: "aliments"},
    "panier de champignons": {plural: "paniers de champignons", category: "aliments"},
    "panier de champignons halu": {plural: "paniers de champignons halu", category: "aliments"},
    "panier de champignons hallu": {plural: "paniers de champignons hallu", category: "aliments"},
    "panier de crabes": {plural: "paniers de crabes", category: "aliments"},
    "panier de fruits": {plural: "paniers de fruits", category: "aliments"},
    "panier de légumes": {plural: "paniers de légumes", category: "aliments"},
    "peau de grenouille": {plural: "peaux de grenouilles", category: "matières premières"},
    "peau de bête": {plural: "peaux de bête", category: "matières premières"},
    "peau de puma": {plural: "peaux de puma", category: "matières premières"},
    "peau humaine": {plural: "peaux humaines", category: "objets"},
    "pécari": {plural: "pécaris", category: "animaux"},
    "pectoral": {plural: "pectoreaux", category: "vêtements"},
    "pectoral de jade": {plural: "pectoreaux de jade", category: "vêtements"},
    "pendentif de jade": {plural: "pendentifs de jade", category: "bijoux"},
    "pendentif d'hématite": {plural: "pendentifs d'hématite", category: "bijoux"},
    "pendentif d'obsidienne": {plural: "pendentifs d'obsidienne", category: "bijoux"},
    "perroquet": {plural: "perroquets", category: "animaux"},
    "pic": {plural: "pics", category: "outils"},
    "piège": {plural: "pièges", category: "outils"},
    "plastron": {plural: "plastrons", category: "armes"},
    "plat en cuivre": {plural: "plats en cuivre", category: "objets"},
    "pot": {plural: "pots", category: "objets"},
    "pot d'épices": {plural: "pots de cacao", category: "aliments fins"},
    "pot d'encens": {plural: "pots d'épices", category: "objets"},
    "pot de cacao": {plural: "pots de cacao", category: "aliments fins"},
    "pot de pot de gelée royale": {plural: "pots de pot de gelée royale", category: "aliments fins"},
    "pot de vanille": {plural: "pots de vanille", category: "aliments fins"},
    "propulseur": {plural: "propulseurs", category: "armes"},
    "puma": {plural: "pumas", category: "animaux"},
    "quartier de poisson": {plural: "quartiers de poisson", category: "aliments"},
    "quartier de poisson salés": {plural: "quartiers de poisson salés", category: "aliments"},
    "quartier de viande": {plural: "quartiers de viande", category: "aliments"},
    "quartier de viande salée": {plural: "quartiers de viande salés", category: "aliments"},
    "quetzal": {plural: "quetzals", category: "animaux"},
    "robe": {plural: "robes", category: "vêtements"},
    "robe de prêtre": {plural: "robes de prêtre", category: "objets"},
    "rondin de bois": {plural: "rondins de bois", category: "matérieux de construction"},
    "rondin de grande qualité": {plural: "rondins de grande qualité", category: "matières premières"},
    "sac": {plural: "sacs", category: "objets"},
    "sac d'argile": {plural: "sacs d'argile", category: "matières premières"},
    "sac d'indigo": {plural: "sacs d'indigo", category: "matières premières"},
    "sac d'os": {plural: "sacs d'os", category: "matières premières"},
    "sac de coquillages": {plural: "sacs de coquillages", category: "matières premières"},
    "sac de coton": {plural: "sacs de coton", category: "matières premières"},
    "sac de limon": {plural: "sacs de limon", category: "matières premières"},
    "sac de maïs": {plural: "sacs de maïs", category: "aliments"},
    "sac de manioc": {plural: "sacs de manioc", category: "aliments"},
    "sac de sel": {plural: "sacs de sel", category: "aliments fins"},
    "sac de stuc blanc": {plural: "sacs de stuc blanc", category: "matérieux de construction"},
    "sac de stuc bleu": {plural: "sacs de stuc bleu", category: "matérieux de construction"},
    "sac de stuc rouge": {plural: "sacs de stuc rouge", category: "matérieux de construction"},
    "sac de tabac": {plural: "sacs de tabac", category: "aliments fins"},
    "sarbacane": {plural: "sarbacanes", category: "armes"},
    "singe": {plural: "singes", category: "animaux"},
    "tablette gravée": {plural: "tablettes gravée", category: "livres et tablettes"},
    "tablette vierge": {plural: "tablettes vierges", category: "livres et tablettes"},
    "tapir": {plural: "tapirs", category: "animaux"},
    "tas de branchages": {plural: "tas de branchages", category: "matérieux de construction"},
    "trimaran": {plural: "trimarans", category: "objets"},
    "trompette": {plural: "trompettes", category: "objets"},
    "trophée": {plural: "trophées", category: "objets"},
    "trophée inter-cités": {plural: "trophées inter-cités", category: "objets"}
};

MarketItemsUtils.itemsSingular = [];

MarketItemsUtils.itemsPluraReverseLookuplMap = {};

// Builds items sets and reverse lookups
MarketItemsUtils._init = function () {
    for (var key in MarketItemsUtils.itemsMap) {
        MarketItemsUtils.itemsSingular.push(key);
        MarketItemsUtils.itemsPluraReverseLookuplMap[MarketItemsUtils.itemsMap[key].plural] = key;
    }

}

MarketItemsUtils._init();

// Normalize names not to be in the plural forms.
MarketItemsUtils.normalizeMarketItem = function (name) {

    // Special case for tablettes to handle all of them.
    if (name.indexOf('tablette') == 0) {
        return depluralize(name);
    }

    // Known name in singular form
    if ($.inArray(name, MarketItemsUtils.itemsSingular) >= 0) {
        return name;
    }

    // Known name in plural form
    var singleKnownForm = MarketItemsUtils.itemsPluraReverseLookuplMap[name];
    if (singleKnownForm != null) {
        return singleKnownForm;
        ;
    }

    function depluralize(title) {
        // Unknown item: we normalize to the best we can.
        var words = title.split(' ');
        // We remove final "s" and "x" for all words not in the safe list.
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            if ((word.match(/s$/) != null || word.match(/x$/) != null) && $.inArray(word, MarketItemsUtils.wordsEndingWithSorX) < 0) {
                words[i] = word.substr(0, word.length - 1);
            }
        }
        return words.join(" ");
    }

    return depluralize(name);
}

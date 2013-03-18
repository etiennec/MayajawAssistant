this.MAUtils = {};

var randomQuotes = [
    "PARCE QUE !",
    "par preuve d'amour inconditionnel envers Yul notre bienfaiteur à tous, béni soit-il jusqu'à la fin des temps",
    "pour pouvoir couiner auprès des bonnes personnes",
    "parce que y'a pas de raison que ce soit toujours Yul qui s'y colle",
    "pour que les nobles qui ne jouent que pour leurs fesses puisse être balancés au cénote sans autre forme de procès",
    "juste par plaisir",
    "afin de montrer à Yul qu'il est facile de faire une action sur une page Web sans avoir à tout recharger parce que bon c'est quand même un poil lourdingue quand on a une connexion hyper lente",
    "en souvenir de toutes ces pauvres bottes de Maguey innocentes qui auraient voulu finir en cordes ou en paniers mais qui ont fini au fond du cénote",
    "entre deux vérifications des nouveaux messages sur le forum Mayajaw",
    "entre deux chouinages auprès de Yul à propos du fait que les dieux ils sont trop méchants et que les esclaves ils font rien qu'à manger tout le temps",
    "afin de démontrer qu'à Kaminaljuyu, les nobles savent faire autre chose que se plaindre et ignorer les dieux",
    "pour démontrer à ceusses de Takalik que les nobles de Kaminaljuyu veulent aider leur prochain, donc s'il vous plait ne nous attaquez pas, merci d'votre bon coeur.",
    "en signe de pénitence pour avoir paradé dans Kaminaljuyu avec juste une plume d'ara dans le cul",
    "afin d'apaiser la colère de Yul contre les branquignols de Kaminaljuyu qui font rien qu'à chouiner tout le temps, surtout ce gros boulet de Kamaxi"
];


MAUtils.getRandomQuote = function () {
    return randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
}

MAUtils.addToSet = function (value, arraySet) {
    if ($.inArray(value, arraySet) < 0) {
        arraySet.push(value)
    }
}



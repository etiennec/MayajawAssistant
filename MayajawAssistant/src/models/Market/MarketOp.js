function MarketOp(who, what, howmuch) {
    this.who = typeof who !== 'undefined' ? who : "NA";
    this.what = typeof what !== 'undefined' ? what : "NA";
    this.howmuch = typeof howmuch !== 'undefined' ? howmuch : 0;

    this.toString = function () {
        return this.who + (+this.howmuch > 0 ? " sold " : " bought ") + this.howmuch + " " + this.what;
    }
};

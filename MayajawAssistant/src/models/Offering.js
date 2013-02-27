function Offering(from, to, of) {
    this.from = typeof from !== 'undefined' ? from : "NA";
    this.to = typeof to !== 'undefined' ? to : "NA";
    this.of = typeof of !== 'undefined' ? of : 0;

    this.toString = function () {
        return this.from + " offered " + this.of + " to " + this.to;
    }
};
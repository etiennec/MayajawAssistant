// Type is the building type: mine, baraque de cueilleurs, ferme, etc.
function Type(name) {
    this.name = typeof name !== 'undefined' ? name : "NA";

    this.toString = function () {
        return this.name;
    }
};
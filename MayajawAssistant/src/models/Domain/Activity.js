// Activity is the job currently taking place in a building, including the competences needed for it.
function Activity(name, comps) {
    this.name = typeof name !== 'undefined' ? name : "NA";
    this.comps = typeof comps !== 'undefined' ? comps : new Competences();

    this.toString = function () {
        return this.name + " - " + this.comps.toString();
    }
};
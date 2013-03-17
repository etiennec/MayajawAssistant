function Slave(id, name, comps) {
    this.id = typeof id !== 'undefined' ? id : -1;
    this.name = typeof name !== 'undefined' ? name : "NA";
    this.comps = typeof comps !== 'undefined' ? comps : new Competences();

    this.toString = function () {
        return this.id + "-" + this.name + " : " + this.comps.toString();
    }
};
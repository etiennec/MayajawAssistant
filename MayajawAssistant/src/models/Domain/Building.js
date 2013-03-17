function Building(id, name, type, level, activity) {
    this.id = typeof id !== 'undefined' ? id : -1;
    this.name = typeof name !== 'undefined' ? name : "NA";
    this.type = typeof type !== 'undefined' ? type : new Type();
    this.level = typeof level !== 'undefined' ? level : 1;
    this.activity = typeof activity !== 'undefined' ? activity : new Activity();

    this.toString = function () {
        return this.id + "-" + this.name + " (" + this.type.toString() + ":" + this.level + ") : " + this.activity.toString();
    }

    // Returns an array of boolean values representing the level of occupancy of the building according to its level and the passed assignments.
    // True means a slave is there, false means there's an empty room.
    this.getOccupancyArray = function(assignments) {

        var occupants = 0;
        var occupancy = [];

        for (var key in assignments) {
            if (assignments.hasOwnProperty(key)) {
                if (assignments[key] === this.id) {
                    occupants++;
                }
            }
        }

        for (var i = 0 ; i < this.level ; i++) {
            if (occupants > 0) {
                occupancy[i] = true;
                occupants--;
            } else {
                occupancy[i] = false;
            }
        }

        return occupancy;
    }
};
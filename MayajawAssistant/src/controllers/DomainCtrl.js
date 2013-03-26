function DomainCtrl($scope, sharedDataService) {

    $scope.initDomain = function () {
        // We need to make a deep copy of the object so that domain data from service don't get modified.
        $scope.data = jQuery.extend(true, {}, sharedDataService.getDomainData());
        $scope.requiredMoves = [];
        $scope.lockedBuildings = {};
        $scope.lockedSlaves = {};

        // Pre-processing buildings
        for (var i = 0; i < $scope.data.buildings.length; i++) {
            var building = $scope.data.buildings[i];

            // We remove all buildings that have no activity comp score, and set their slaves as not assigned.
            if (building.name.charAt(0) === '-') {
                $scope.deleteBuilding(building.id);
                i--;
                continue;
            }

            // We initialize building lock status
            if (building.name.charAt(0) === '_') {
                $scope.lockedBuildings[building.id] = true;
            } else {
                $scope.lockedBuildings[building.id] = false;
            }
        }

        // Pre-processing slaves
        for (var i = 0; i < $scope.data.slaves.length; i++) {

            var slave = $scope.data.slaves[i];

            if (slave.name.charAt(0) === '-') {
                $scope.deleteSlave(slave.id);
                i--;
                continue;
            }

            if (slave.name.charAt(0) === '_') {
                $scope.lockedSlaves[slave.id] = true;
            } else {
                $scope.lockedSlaves[slave.id] = false;
            }
        }

        // delete or lock slaves & buildings based on first character


        $scope.originalAssignments = jQuery.extend(true, {}, $scope.data.assignments);

    }

    $scope.computeScore = function (slaveComp, activityComp) {
        return Math.floor(
            slaveComp.FOR * activityComp.FOR
                + slaveComp.DEX * activityComp.DEX
                + slaveComp.END * activityComp.END
                + slaveComp.INT * activityComp.INT
                + slaveComp.PER * activityComp.PER
                + slaveComp.CHA * activityComp.CHA
        ) * 5;
    }

    $scope.formatScore = function (score) {
        if (score == 0) {
            return "-";
        }
        return score;
    }

    $scope.computeBuildingTotalScore = function (buildingId) {
        var building = getBuilding(buildingId);
        var totalScore = 0;
        var assignments = $scope.data.assignments;
        for (var key in assignments) {
            if (assignments.hasOwnProperty(key)) {
                if (assignments[key] === buildingId) {
                    totalScore += $scope.computeScore(getSlave(key).comps, building.activity.comps);
                }
            }
        }
        return totalScore;
    }

    $scope.computeDomainTotalScore = function () {
        var totalDomainScore = 0;
        for (var i = 0; i < $scope.data.buildings.length; i++) {
            totalDomainScore += $scope.computeBuildingTotalScore($scope.data.buildings[i].id);
        }

        return totalDomainScore;
    }

    // Sort the slaves list from the stronger to weaker for this building.
    // TODO add extra comps to add extra search criterias in case of equality.
    $scope.sortSlavesByActivityComp = function (activityComps) {

        // We add some pre-sort index to all slaves in order to implement a stable sorting.
        // Array sorting is unstable in some browsers, and this creates unfriendly behavior
        // when clicking many times on a building
        for (var i = 0; i < $scope.data.slaves.length; i++) {
            $scope.data.slaves[i].preSortIndex = i;
        }

        $scope.data.slaves.sort(function (a, b) {
            var scoreA = $scope.computeScore(a.comps, activityComps);
            var scoreB = $scope.computeScore(b.comps, activityComps);

            if (scoreA == scoreB) {
                // We sort by order if scores are the same to enforce stable sorting.
                return a.preSortIndex - b.preSortIndex;
            } else {
                return scoreB - scoreA;
            }
        });
    }

    function getBuilding(id) {

        if (id == null) {
            return null;
        }

        for (var i = 0; i < $scope.data.buildings.length; i++) {
            if ($scope.data.buildings[i].id === id) {
                return $scope.data.buildings[i];
            }
        }

        return null;
    }

    function getSlave(id) {
        for (var i = 0; i < $scope.data.slaves.length; i++) {
            if ($scope.data.slaves[i].id == id) {
                return $scope.data.slaves[i];
            }
        }

        return null;
    }

    $scope.getValueBoxTooltip = function (slaveId, targetBuildingId) {

        var slave = getSlave(slaveId);
        var targetBuilding = getBuilding(targetBuildingId);
        var currentBuildingId = $scope.data.assignments[slaveId];

        var originBuildingLocked = currentBuildingId == null ? false : $scope.lockedBuildings[currentBuildingId];
        var destinationBuildingLocked = $scope.lockedBuildings[targetBuildingId];
        var slaveLocked = $scope.lockedSlaves[slaveId];
        var buildingFull = $scope.isBuildingFull(targetBuildingId);

        var cannotMoveSlave = originBuildingLocked || destinationBuildingLocked || slaveLocked || (buildingFull && currentBuildingId != targetBuildingId);

        var possibleOrNotStr = cannotMoveSlave ? "<span class='error'>Impossible</span> de " : "";
        var moveTypeStr = "Déplacer ";
        var directionWordStr = "vers ";

        var notPossibleReason = "";

        var currentPositionStr = null;

        if (currentBuildingId == targetBuildingId) {
            // Slave already in this building
            moveTypeStr = "Enlever ";
            directionWordStr = "de ";
            currentPositionStr = "(Il y est actuellement assigné)";
            if (cannotMoveSlave) {
                possibleOrNotStr = "<span class='error'>Impossible</span> d'"
            }
            if (originBuildingLocked && destinationBuildingLocked) {
                // We need only one error message about the locked building, not two.
                destinationBuildingLocked = false;
            }
        }
        if (currentBuildingId == null) {
            // This slave is currently free
            currentPositionStr = "(Actuellement Libre)";
        } else {
            // Slave is busy in another building
            currentPositionStr = "(Actuellement dans " + getBuilding(currentBuildingId).name + ")";
        }

        if (cannotMoveSlave) {
            if (originBuildingLocked) {
                notPossibleReason += "<span class='error'>Le bâtiment où se trouve l'esclave (" + getBuilding(currentBuildingId).name + ") est vérouillé</span><br>";
            }
            if (destinationBuildingLocked) {
                notPossibleReason += "<span class='error'>Le bâtiment de destination (" + targetBuilding.name + ") est vérouillé</span><br>";
            }
            if (slaveLocked) {
                notPossibleReason += "<span class='error'>L'esclave est vérouillé</span><br>";
            }
            if (buildingFull) {
                notPossibleReason += "<span class='error'>Le bâtiment est plein</span><br>";
            }
        }

        return possibleOrNotStr + moveTypeStr + "<br><b>" + slave.name + "</b><br>" + directionWordStr + "<br><b>"
            + targetBuilding.name + "</b><br>" + notPossibleReason + "<i>" + currentPositionStr + "</i>";

    }

    $scope.isBuildingFull = function (buildingId) {
        var building = getBuilding(buildingId);

        if (building == null) {
            console.log("Couldn't retrieve building with ID " + buildingId + " to check if it is full.");
            return false;
        }

        var occupancy = building.getOccupancyArray($scope.data.assignments);

        var lastNonLockedindex = building.level - building.lockedRooms;
        if (lastNonLockedindex == 0) {
            // all rooms locked: building full
            return true;
        }

        // Building is full if the last non locked space is not free.
        return (occupancy[lastNonLockedindex - 1] === 1);
    }

    // Return the status for the given slave and building:
    // 'free': slave is not in the building, you can assign the slave to the building
    // 'full': slave is not in the building, you cannot assign the slave to the building (building full)
    // 'occupying': slave is in the building
    $scope.getSlaveBuildingStatus = function (slaveId, buildingId) {
        if ($scope.data.assignments[slaveId] === buildingId) {
            return 'occupying';
        }

        // Slave is not in this building. Is there some room in the building?
        // Let's check the last occupancy value: if true (i.e. full), then there's no more room.
        var building = getBuilding(buildingId);


        if ($scope.isBuildingFull(buildingId)) {
            return 'full';
        }

        return 'free';
    }

    $scope.reassign = function (slaveId, buildingId) {

        // We can't assign a locked slave.
        if ($scope.lockedSlaves[slaveId] == true) {
            return;
        }

        if (buildingId === null) {
            $scope.data.assignments[slaveId] = null;
            return;
        }

        // We can't assign a slave to a building already full.
        if ($scope.getSlaveBuildingStatus(slaveId, buildingId) === 'full') {
            return;
        }

        // We can't assign to a locked building.
        if ($scope.lockedBuildings[buildingId] == true) {
            return;
        }

        // We can't assign from a locked building
        if ($scope.data.assignments[slaveId] != null && $scope.lockedBuildings[$scope.data.assignments[slaveId]] == true) {
            return;
        }

        if ($scope.data.assignments[slaveId] === buildingId) {
            $scope.data.assignments[slaveId] = null;
        } else {
            $scope.data.assignments[slaveId] = buildingId;
        }
    }

    $scope.removeAllAssignments = function () {
        for (var slaveId in $scope.data.assignments) {
            if ($scope.data.assignments.hasOwnProperty(slaveId)) {
                // Skipping locked slaves
                var slave = getSlave(slaveId);
                if ($scope.lockedSlaves[slaveId]) {
                    continue;
                }
                // skipping locked buildings
                var buildingId = $scope.data.assignments[slaveId];
                if (buildingId != null && $scope.lockedBuildings[buildingId]) {
                    continue;
                }

                $scope.data.assignments[slaveId] = null;
            }
        }
    }

    function getRequiredMoves() {

        var moves = [];

        for (var slaveId in $scope.originalAssignments) {
            if ($scope.originalAssignments.hasOwnProperty(slaveId)) {

                if (getSlave(slaveId) == null) {
                    // We don't include this slave if it has been deleted.
                    continue;
                }

                var fromId = $scope.originalAssignments[slaveId];
                var toId = $scope.data.assignments[slaveId];
                if (fromId != toId) {
                    moves.push({
                        who: getSlave(slaveId).name,
                        from: fromId == null ? null :
                            (getBuilding(fromId) == null ? null : getBuilding(fromId).name),
                        to: toId == null ? null :
                            (getBuilding(toId) == null ? null : getBuilding(toId).name),
                        checked: false
                    });
                }
            }
        }

        return moves;
    }

    $scope.deleteBuilding = function (buildingId) {
        // First we de-assign any slave in this building
        for (var key in $scope.data.assignments) {
            if ($scope.data.assignments.hasOwnProperty(key)) {
                if ($scope.data.assignments[key] === buildingId) {
                    $scope.data.assignments[key] = null;
                }
            }
        }

        // Then we remove the building from the list.
        for (var i = 0; i < $scope.data.buildings.length; i++) {
            if ($scope.data.buildings[i].id == buildingId) {
                $scope.data.buildings.splice(i, 1);
                // There can be only one.
                break;
            }
        }
    }

    $scope.deleteSlave = function (slaveId) {
        // First we delete this slave from the assignments
        delete $scope.data.assignments[slaveId];

        // Then we delete it from the list of slaves.
        for (var i = 0; i < $scope.data.slaves.length; i++) {
            if ($scope.data.slaves[i].id == slaveId) {
                $scope.data.slaves.splice(i, 1);
                // There can be only one.
                break;
            }
        }
    }

    $scope.toggleSlaveLock = function (slaveId) {
        $scope.lockedSlaves[slaveId] = !$scope.lockedSlaves[slaveId];
    }

    $scope.toggleBuildingLock = function (buildingId) {
        $scope.lockedBuildings[buildingId] = !$scope.lockedBuildings[buildingId];
    }


    $scope.autoAssign = function () {
        // First, we clean all assignments, except when buildings or slaves are locked.
        $scope.removeAllAssignments();

        // We need to save pre-autoAssign order in order to restore it after autoAssign finishes.
        for (var i = 0; i < $scope.data.slaves.length; i++) {
            $scope.data.slaves[i].preAutoAssignIndex = i;
        }

        // Then, we loop through each unlock building in the order and assign the best available slave, until there's no more room or no more slave.
        var allBuildingsFull = false;
        var allSlavesTaken = false;
        while (!allBuildingsFull && !allSlavesTaken) {

            allBuildingsFull = true;

            for (var i = 0; i < $scope.data.buildings.length; i++) {

                var building = $scope.data.buildings[i];

                if ($scope.lockedBuildings[building.id]) {
                    // We don't mess with locked buildings.
                    continue;
                }

                // We find the best Slave for the job
                var slave = getBestAvailableSlaveForActivity(building.activity.comps)

                if (slave == null) {
                    // No more available slave !
                    allSlavesTaken = true;
                    break;
                }

                if ($scope.computeScore(slave.comps, building.activity.comps) === 0) {
                    // We ignore buildings for which the best slave score is zero.
                    continue;
                }

                $scope.reassign(slave.id, building.id);

                if (!$scope.isBuildingFull(building.id)) {
                    allBuildingsFull = false;
                }
            }
        }


        // We finally restore the order of the slaves to what it was before autoAssign.
        $scope.data.slaves.sort(function (a, b) {
            return a.preAutoAssignIndex - b.preAutoAssignIndex;
        });

        // Finished !
        return;

        function getBestAvailableSlaveForActivity(comps) {

            // First, we sort from best to worst
            $scope.sortSlavesByActivityComp(comps);

            // Then we pick the best guy for the job.
            for (var i = 0; i < $scope.data.slaves.length; i++) {
                var slaveId = $scope.data.slaves[i].id;
                // Is slave free?
                if ($scope.data.assignments[slaveId] == null) {
                    var slave = getSlave(slaveId)
                    if (!$scope.lockedSlaves[slaveId]) {
                        return slave;
                    }
                }
            }

            // No free slave found.
            return null;
        }
    }

    $scope.toggleBuildingOccupancy = function(building, isOccupied) {
        switch(isOccupied) {
            case 0: // room is not occupied: lock it !
                building.lockedRooms += 1;
                break;
            case 'x': // Room is locked: unlock a room in the building
                building.lockedRooms -= 1;
                break;
            default:
            // room is occupied: do nothing.
        }
    }

    $scope.formatOccupancy = function(occupancy) {
        return {0: 'O', 1: 'Ø', 'x': 'X'}[occupancy];
    }


    $scope.$watch('data.assignments', function () {
        $scope.requiredMoves = getRequiredMoves();
    }, true);

    // Initialization of controller
    $scope.initDomain();
}

function DomainCtrl($scope, sharedDataService) {

    $scope.initDomain = function () {
        // We need to make a deep copy of the object so that domain data from service don't get modified.
        $scope.data = jQuery.extend(true, {}, sharedDataService.getDomainData());
        $scope.originalAssignments = jQuery.extend(true, {}, $scope.data.assignments);
        $scope.requiredMoves = [];
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

    $scope.computeTotalScore = function (buildingId) {
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

    // Sort the slaves list from the stronger to weaker for this building.
    $scope.sortSlavesByBuilding = function (id) {
        var building = getBuilding(id);

        var activityComp = building.activity.comps;

        // We add some pre-sort index to all slaves in order to implement a stable sorting.
        // Array sorting is unstable in some browsers, and this creates unfriendly behavior
        // when clicking many times on a building
        for (var i = 0; i < $scope.data.slaves.length; i++) {
            $scope.data.slaves[i].preSortIndex = i;
        }

        $scope.data.slaves.sort(function (a, b) {
            var scoreA = $scope.computeScore(a.comps, activityComp);
            var scoreB = $scope.computeScore(b.comps, activityComp);

            if (scoreA == scoreB) {
                // We sort by order if scores are the same to enforce stable sorting.
                return a.preSortIndex - b.preSortIndex;
            } else {
                return scoreB - scoreA;
            }
        });
    }

    function getBuilding(id) {
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

    $scope.isBuildingFull = function (buildingId) {
        var building = getBuilding(buildingId);

        var occupancy = building.getOccupancyArray($scope.data.assignments);

        // Building is full if the last space is occupied.
        return occupancy[occupancy.length - 1];
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

        if (buildingId === null) {
            $scope.data.assignments[slaveId] = null;
            return;
        }

        // We can't assign a slave to a building already full.
        if ($scope.getSlaveBuildingStatus(slaveId, buildingId) === 'full') {
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
                $scope.data.assignments[slaveId] = null;
            }
        }
    }

    function getRequiredMoves() {

        var moves = [];

        for (var slaveId in $scope.originalAssignments) {
            if ($scope.originalAssignments.hasOwnProperty(slaveId)) {
                var fromId = $scope.originalAssignments[slaveId];
                var toId = $scope.data.assignments[slaveId];
                if (fromId != toId) {
                    moves.push({
                        who: getSlave(slaveId).name,
                        from: getBuilding(fromId).name,
                        to: toId == null ? null : getBuilding(toId).name,
                        checked: false
                    });
                }
            }
        }

        return moves;
    }

    $scope.$watch('data.assignments', function () {
        $scope.requiredMoves = getRequiredMoves();
    }, true);

    // Initialization of controller
    $scope.initDomain();
}

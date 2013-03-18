function DomainCtrl($scope, sharedDataService) {
    $scope.data = sharedDataService.getDomainData();

    $scope.computeScore = function (slaveComp, activityComp) {
        return Math.round(
            slaveComp.FOR * activityComp.FOR
                + slaveComp.DEX * activityComp.DEX
                + slaveComp.END * activityComp.END
                + slaveComp.INT * activityComp.INT
                + slaveComp.PER * activityComp.PER
                + slaveComp.CHA * activityComp.CHA
        ) * 5;
    }

    // Sort the slaves list from the stronger to weaker for this building.
    $scope.sortSlavesByBuilding = function (id) {
        var building = getBuilding(id);

        var activityComp = building.activity.comps;

        $scope.data.slaves.sort(function (a, b) {
            return $scope.computeScore(b.comps, activityComp) - $scope.computeScore(a.comps, activityComp);
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

    $scope.isBuildingFull = function(buildingId) {
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

}

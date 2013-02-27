function CenoteCtrl($scope, sharedDataService) {
    $scope.data = sharedDataService.getCenoteData();
    $scope.nobles = $scope.data.getOfferersList(null);
    $scope.gods = $scope.data.getOffereesList(null);
    $scope.selectedNoble = '';
    $scope.selectedGod = '';

    $scope.renderOffererChart = function (nobleName) {
        if (nobleName == null) {
            ChartsUtils.createPieChart("Tous les nobles", "offerers-pie-chart", $scope.data.getOfferersList(null));
        } else {
            ChartsUtils.createPieChart(nobleName, "offerers-pie-chart", $scope.data.getOffereesList(nobleName));
        }
    };

    $scope.renderOffereeChart = function (godName) {
        if (godName == null) {
            ChartsUtils.createPieChart("Tous les dieux", "offerees-pie-chart", $scope.data.getOffereesList(null));
        } else {
            ChartsUtils.createPieChart(godName, "offerees-pie-chart", $scope.data.getOfferersList(godName));
        }
    };

    $scope.selectNoble = function (name) {
        $scope.selectedNoble = name;
    };

    $scope.selectGod = function (name) {
        $scope.selectedGod = name;
    };

    var stackedData = $scope.data.getAsStackedData();
    ChartsUtils.createStackedColumnsChart("Historique des prières et dons au Cénote", "dons", "mois", "main-overview-stacked-columns-chart", stackedData);
    ChartsUtils.createStackedAreaChart("Valeur cumulée des prières et dons au Cénote", "dons", "mois", "main-overview-stacked-area-chart", stackedData);
    $scope.renderOffererChart();
    $scope.renderOffereeChart();
}

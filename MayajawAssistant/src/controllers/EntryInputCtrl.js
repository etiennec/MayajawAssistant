function EntryInputCtrl($scope, $http, sharedDataService) {
    $scope.inputs = {
        cenote: "-== Copiez-collez ici le contenu du registre du Cénote ==-"+"\n\n"+"(ou cliquez sur le bouton \"Charger les données de test\")",
        market: "-== Copiez-collez ici le contenu du registre du Marché ==-"+"\n\n"+"(ou cliquez sur le bouton \"Charger les données de test\")"
    };

    $scope.cleanInput= function(inputName) {
        var promptStart = "-== Copiez-collez ici le contenu";
        if ($scope.inputs[inputName].substring(0, promptStart.length) === promptStart) {
            $scope.inputs[inputName] = "";
        }
    }

    $scope.loadSampleData = function(inputName) {
        $http.get("data/"+inputName+".txt").success(function (data) {
            $scope.inputs[inputName] = data;
        });
    };

    $scope.processCenoteInput = function() {
        sharedDataService.setCenoteData(ParseUtils.parseCenoteInput($scope.inputs.cenote));
    }

    $scope.processMarketInput = function() {
        sharedDataService.setMarketData(ParseUtils.parseMarketInput($scope.inputs.market));
    }

}

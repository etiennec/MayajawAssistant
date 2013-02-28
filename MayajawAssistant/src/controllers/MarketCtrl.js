function MarketCtrl($scope, sharedDataService) {
    var that = this;
    $scope.data = sharedDataService.getMarketData();
    $scope.nobles = $scope.data.getNobles();
    $scope.selectedNoble = null;
    $scope.itemsByCategory = $scope.data.getItems(null);
    $scope.allSelected = false;

    $scope.selectNoble = function (name) {
        $scope.allSelected = (name != null);
        $scope.selectedNoble = name;
        $scope.itemsByCategory = $scope.data.getItems(name);
    };

    $scope.toggleCategory = function (categoryName) {

        if (categoryName == null) {
            $scope.allSelected = !$scope.allSelected;
        }

        for (var i = 0; i < $scope.itemsByCategory.length; i++) {
            var cat = $scope.itemsByCategory[i];
            if (categoryName == null || categoryName === cat.category) {
                cat.isSelected = !cat.isSelected;
                for (var j = 0; j < cat.items.length; j++) {
                    cat.items[j].isSelected = categoryName != null ? cat.isSelected : $scope.allSelected;
                }
            }
        }
    };

    $scope.renderCharts = function () {
        var selectedItems = $scope.getSelectedItems();
        var chartsData = $scope.data.getChartData(selectedItems, $scope.selectedNoble);
        ChartsUtils.createPieChart("Ventes (Total)", "market-sellers-pie-chart", chartsData.sellers)
        ChartsUtils.createPieChart("Achats (Total)", "market-buyers-pie-chart", chartsData.buyers)
        ChartsUtils.createStackedColumnsChart("Historique des achats", "achats", "mois", "market-stacked-column-buys-chart", chartsData.buys)
        ChartsUtils.createStackedColumnsChart("Historique des ventes", "ventes", "mois", "market-stacked-column-sells-chart", chartsData.sells)
    };

    $scope.getSelectedItems = function () {
        var selectedItems = []

        for (var i = 0; i < $scope.itemsByCategory.length; i++) {
            var cat = $scope.itemsByCategory[i];
            for (var j = 0; j < cat.items.length; j++) {
                if (cat.items[j].isSelected) {
                    selectedItems.push(cat.items[j].item);
                }
            }
        }

        return selectedItems;
    };
}

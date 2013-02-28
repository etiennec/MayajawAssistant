angular.module('mjassistant', []).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when('/home', {templateUrl: 'src/templates/inputScreen.html', controller: EntryInputCtrl}).
            when('/cenote', {templateUrl: 'src/templates/cenoteAnalysis.html', controller: CenoteCtrl}).
            when('/market', {templateUrl: 'src/templates/marketAnalysis.html', controller: MarketCtrl}).
            otherwise({redirectTo: '/home'});
    }])
    .service('sharedDataService', function () {

        var cenoteData = {};
        var marketData = {};

        return {
            getCenoteData: function () {
                return cenoteData;
            },
            setCenoteData: function (value) {
                cenoteData = value;
            },
            getMarketData: function () {
                return marketData;
            },
            setMarketData: function (value) {
                marketData = value;
            }
        };
    });

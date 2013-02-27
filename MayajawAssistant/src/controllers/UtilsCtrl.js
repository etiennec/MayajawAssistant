
function UtilsCtrl($scope) {
    $scope.quotes = {
        randomQuote :  MAUtils.getRandomQuote()
    };
}
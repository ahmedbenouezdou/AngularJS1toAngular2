angular.module('angularJS1toAngular2BeeZen').controller('navCrt', function ($scope, OffreService) {

    $scope.$watch(function () {
            return OffreService.nombreProduit();
        },
        function(newVal) {
            $scope.panier = newVal;

        }, true);


});

var app=angular.module("angularJS1toAngular2BeeZen",['ngRoute','bookModule','ngCookies','panierModule']);


app.config(function ($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'app/book/book.html',
            controller: 'bookCrt'
        }). when('/panier', {
            templateUrl : 'app/panier/panier.html',
            controller:'panierCtrl'

        }).otherwise({
            redirectTo: '/'
        });
});

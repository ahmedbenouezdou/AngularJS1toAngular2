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

angular.module('bookModule', ['panierModule']);

angular.module('bookModule').controller('bookCrt', function ($scope,BooksListService,$cookieStore,OffreService) {


    function init() {
        BooksListService.initListBookServer();
        $scope.listBook = BooksListService.getList();
        $scope.panier = [];
        $scope.quantite = [];
        $scope.listBook.forEach(function(elementBook,indexBook){
            $scope.quantite[indexBook] = 0;
        });

        var listAddpanier = OffreService.nombreProduit();

        if (angular.isDefined(listAddpanier)) {
            if (!(listAddpanier.$isEmpty)) {
                $scope.panier=OffreService.nombreProduit();
                $scope.listBook.forEach(function(elementBook,indexBook){
                    $scope.panier.forEach(function(elementPanier){
                        if (angular.equals(elementPanier.book, elementBook)) {
                            $scope.quantite[indexBook] = elementPanier.quantiteBook;
                        }
                    })
                });
            }
        }
    }

    $scope.addPanier=function(index){
        //index par rapport a la liste des produits et pas par rapport a $rootscope
        if($scope.quantite[index]==0){
            alert("avant de rajouter dans le panier choisir la quantite");
        }else{
            var existe=true;
            var position=0;
            for(var j=0;j<$scope.panier.length;j++){
                if(angular.equals($scope.panier[j].book.isbn,BooksListService.getArticle(index).isbn)){
                    existe=false;
                    position=j;
                }
            }
            //si l'article n'existe pas on ajoute dans le panier
            if(existe){
                $scope.panier.push({
                    'book':BooksListService.getArticle(index),
                    'quantiteBook':$scope.quantite[index]
                });
                $cookieStore.put('listAddPanier',$scope.panier);
            }else{
                //sinon si l'article existe modifier quantite
                if(!angular.equals($scope.panier[position].quantiteBook,$scope.quantite[index])){
                    $scope.panier[position].quantiteBook=$scope.quantite[index];
                    $cookieStore.put('listAddPanier',$scope.panier);

                }
            }
        }
    }
    init();
});


angular.module('bookModule').service('BooksListService', function ($http) {

    var listBookServer= [];

    this.getList = function getList() {
        $http.get('listBook/').
            success(function (data, status, headers, config) {
                for (var i = 0; i < data.length; i++)
                    listBookServer.push(data[i]);
            }).error(function (data, status, headers, config) {
                console.log("error");
            });
        return listBookServer;


    };

    this.getArticle = function getArticle (index) {
        return  listBookServer[index];
    };

    this.initListBookServer= function initListBookServer(){
        listBookServer= [];
    }

});
angular.module('angularJS1toAngular2BeeZen').controller('navCrt', function ($scope, OffreService) {

    $scope.$watch(function () {
            return OffreService.nombreProduit();
        },
        function(newVal) {
            $scope.panier = newVal;

        }, true);


});

angular.module('panierModule', []);
angular.module('panierModule').controller('panierCtrl', function ($scope, BooksListService, $cookieStore, OffreService, lisOffreServer) {


    $scope.listOffre = {};

    function init() {
        $scope.total = 0;
        $scope.panier = OffreService.nombreProduit();
        if ($scope.panier.length > 0) {
            $scope.total = OffreService.calculTotal($scope.panier);
            listeOffres(lisOffreServer.getOffre(formeIsbn($scope.panier)));
        }
    }

//methode de supprimer les articles
    $scope.remove = function (index) {
        $scope.panier.splice(index, 1);
        $cookieStore.put('listAddPanier', $scope.panier);
        $scope.total = OffreService.calculTotal($scope.panier);
        listeOffres(lisOffreServer.getOffre(formeIsbn($scope.panier)));

    };
//methode de validation
    $scope.validCommande = function () {

    };
//fonction d'annuler commande
    $scope.annulerCommande = function () {
        $cookieStore.remove('listAddPanier');
        $scope.panier = $cookieStore.get('listAddPanier');
        $scope.total = 0;
        listeOffres(lisOffreServer.getOffre(formeIsbn($scope.panier)));
    };
//transforamtion des isbn en chaine
    function formeIsbn(liste) {
        var isbnOffre = "";
        for (var i = 0; i < liste.length; i++) {
            if (i == 0) isbnOffre = liste[i].book.isbn;
            else {
                if (i == liste.length - 1) isbnOffre = isbnOffre + "," + liste[i].book.isbn;
                else isbnOffre = isbnOffre + "," + liste[i].book.isbn;
            }

        }

        return isbnOffre;
    }

//methode de gestion des offres
    function listeOffres(resultatGet) {
        resultatGet.success(function (data) {

            var setDataKeyValues = function (key, value, sliceValue) {
                $scope.listOffre[key] = {
                    sliceValue: sliceValue,
                    value: value
                };
            };
            for (var i = 0; i < data.offers.length; i++) {
                setDataKeyValues(data.offers[i].type, data.offers[i].value, data.offers[i].sliceValue);
            }
            $scope.listOffre = OffreService.topOffre($scope.listOffre, $scope.total);

        }).error(function () {
            $scope.listOffre = {};
        });


    }


    init();
});



//constant pour affichage label réduction
angular.module('panierModule').constant("labelOffre", {
    percentage: {titre: 'Réduction', info: 'Vous avez une réduction de '},
    minus: {titre: 'Déduction en caisse', info: 'Vous avez une réduction'},
    slice: {titre: 'Remboursement', info: 'Vous avez une réduction de'}
});

angular.module('panierModule').factory('lisOffreServer', function ($http) {
    return {
        getOffre: function (idisbn) {
            return $http.get('listOffre/' + idisbn);
        }
    }

});

angular.module('panierModule').factory("calculRemise", function () {
    return {
        //méthode de calcule prix remise en pourcentage
        calculerPoucentage: function (total, valPercentage) {
            return total - (total * valPercentage) / 100;
        },
        //méthode de calcule remise en caisse
        calculerRemiseCaise: function (totol, somme) {
            return totol - somme;
        },
        //méthode calcule remise immadiate par remboursement
        calculerRembourcement: function (total, valRembourcement, valInterval) {
            if (total < valInterval)
                return 0;
            else {
                var pourcentageRem = Math.floor(total / valInterval);
                return total - (pourcentageRem * valRembourcement);
            }
        }
    }
});


//service gestion  offres
angular.module('panierModule').service('OffreService', function (calculRemise, labelOffre,$cookieStore) {
//methode calcule de la somme total
    this.calculTotal = function (produit) {
        var totalPanier = 0;
        for (var i = 0; i < produit.length; i++) {
            totalPanier = totalPanier + (produit[i].book.price * produit[i].quantiteBook)
        }
        return totalPanier;
    };
//methode de gestion
    this.topOffre = function (results, total) {
        var listOffre = {};
        var topPromo = new Array();
        //transformation d'offre
        var setDataOffreKeyValues = function (key, value, info, infoOffre) {
            listOffre[key] = {
                label: value,
                info: info,
                prix: key,
                infoOffre: infoOffre
            };

        };
        angular.forEach(labelOffre, function (value, key) {

            switch (key) {
                case "percentage":
                    /*traitement des donner reduction par percentage*/
                    if (!angular.isUndefined(results.percentage)) {
                        var soldePercentage = calculRemise.calculerPoucentage(total, results.percentage.value);
                        topPromo.push(soldePercentage);
                        setDataOffreKeyValues(soldePercentage, labelOffre.percentage.titre, labelOffre.percentage.info + results.percentage.value + '%', results.percentage);

                    }
                    break;
                case "minus":
                    /*traitement de l'offre reduction encaisse*/
                    if (!angular.isUndefined(results.minus)) {
                        var soldeMinus = calculRemise.calculerRemiseCaise(total, results.minus.value);
                        topPromo.push(soldeMinus);
                        setDataOffreKeyValues(soldeMinus, labelOffre.minus.titre, labelOffre.minus.info + soldeMinus + " en caisse", results.minus);
                    }

                    break;
                case "slice":
                    /*traitement de l'offre reduction par rembourement sur l'argent*/
                    if (!angular.isUndefined(results.slice)) {
                        var soldeSlice = calculRemise.calculerRembourcement(total, results.slice.value, results.slice.sliceValue)
                        topPromo.push(soldeSlice);
                        setDataOffreKeyValues(soldeSlice, labelOffre.slice.titre,
                            labelOffre.slice.info + results.slice.value + "€ sur chaque " + results.slice.sliceValue + "€", results.slice);
                    }
                    break;
            }
        });

        topPromo.sort();

        return listOffre[topPromo[0]];
    };

    this.nombreProduit =function nombreProduit(){
        var panier=[];
        if(angular.isDefined($cookieStore.get('listAddPanier'))){
            if (!$cookieStore.get('listAddPanier').$isEmpty) {
                panier = $cookieStore.get('listAddPanier');
            }
        }
        return panier;
    }
});
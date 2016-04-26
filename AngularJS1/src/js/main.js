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

angular.module('bookModule', []);

angular.module('bookModule').controller('bookCrt', function ($scope,BooksListService,$cookieStore,$rootScope) {


    function init() {
        $scope.listBook = BooksListService.getList();
        $rootScope.panier = [];
        $scope.quantite = [];
        for (var i = 0; i < $scope.listBook.length; i++) {
            $scope.quantite[i] = 0;
        }
        var listAddpanier = $cookieStore.get('listAddPanier');

        if (angular.isDefined(listAddpanier)) {
            if (!(listAddpanier.$isEmpty)) {
                $rootScope.panier = $cookieStore.get('listAddPanier');
                console.log($scope.listBook);
                for (var i = 0; i < $scope.listBook.length; i++) {

                    for (var j = 0; j < $rootScope.panier.length; j++) {
                        if (angular.equals($rootScope.panier[j].book, $scope.listBook[i])) {

                            $scope.quantite[i] = $rootScope.panier[j].quantiteBook;
                        }
                    }
                }
            }
        }
    };







    $scope.addPanier=function(index){
        //index par rapport a la liste des produits et pas par rapport a $rootscope
        if($scope.quantite[index]==0){
            alert("avant de rajouter dans le panier choisir la quantite");
        }else{
            var existe=true;
            var position=0;
            for(var j=0;j<$rootScope.panier.length;j++){
                if(angular.equals($rootScope.panier[j].book.isbn,BooksListService.getArticle(index).isbn)){
                    existe=false;
                    position=j;
                }
            }
            //si l'article n'existe pas on ajoute dans le panier
            if(existe){
                $rootScope.panier.push({
                    'book':BooksListService.getArticle(index),
                    'quantiteBook':$scope.quantite[index]
                });
                $cookieStore.put('listAddPanier',$rootScope.panier);
            }else{
                //sinon si l'article existe modifier quantite
                if(!angular.equals($rootScope.panier[position].quantiteBook,$scope.quantite[index])){
                    $rootScope.panier[position].quantiteBook=$scope.quantite[index];
                    $cookieStore.put('listAddPanier',$rootScope.panier);

                }
            }
        }
    }
    init();
});


angular.module('bookModule').service('BooksListService', function ($http) {

    var listBookServer= [];

    this.getList = function () {

        $http.get('listBook/').
            success(function (data, status, headers, config) {
                for (var i = 0; i < data.length; i++)
                    listBookServer.push(data[i]);
            }).error(function (data, status, headers, config) {
                console.log("error");
            });
        return listBookServer;


    };

    this.getArticle = function (index) {
        return  listBookServer[index];
    };

});
angular.module('panierModule', []);
angular.module('panierModule').controller('panierCtrl', function ($scope,BooksListService,$rootScope,$cookieStore,OffreService,lisOffreServer) {


    $scope.listOffre = {};
    $scope.total=0;
    if(angular.isDefined($cookieStore.get('listAddPanier'))){
        if (!$cookieStore.get('listAddPanier').$isEmpty) {
            $rootScope.panier = $cookieStore.get('listAddPanier');
            if ($rootScope.panier.length > 0) {
                $scope.total = OffreService.calculTotal($rootScope.panier);
                listeOffres(lisOffreServer.getOffre(formeIsbn($rootScope.panier)));
            }

        }
    }
//methode de supprimer les articles
    $scope.remove=function(index){
        $rootScope.panier.splice(index,1);
        $cookieStore.put('listAddPanier', $rootScope.panier);
        $scope.total=OffreService.calculTotal($rootScope.panier);
        listeOffres(lisOffreServer.getOffre(formeIsbn($rootScope.panier)));

    }
//methode de validation
    $scope.validCommande=function(){

    }
//fonction d'annuler commande
    $scope.annulerCommande=function(){
        console.log("annuler");
        $cookieStore.remove('listAddPanier');
        $rootScope.panier=$cookieStore.get('listAddPanier');
        $scope.total=0;
        listeOffres(lisOffreServer.getOffre(formeIsbn($rootScope.panier)));
    }
//transforamtion des isbn en chaine
    function formeIsbn(liste){
        var isbnOffre="";
        for(var i=0; i<liste.length;i++){
            if(i==0) isbnOffre= liste[i].book.isbn;
            else{
                if(i==liste.length-1) isbnOffre= isbnOffre+","+liste[i].book.isbn;
                else isbnOffre=isbnOffre+","+ liste[i].book.isbn;
            }

        }

        return isbnOffre;
    }
//methode de gestion des offres
    function listeOffres (resultatGet) {
        resultatGet.success(function(data){

            var setDataKeyValues= function (key, value, sliceValue) {
                $scope.listOffre[key] = {
                    sliceValue: sliceValue,
                    value: value
                };
            };
            for (var i = 0; i < data.offers.length; i++) {
                setDataKeyValues(data.offers[i].type, data.offers[i].value, data.offers[i].sliceValue);
            }
            $scope.listOffre = OffreService.topOffre($scope.listOffre,$scope.total);
            console.log("Offre");
            console.log($scope.listOffre);
        }).error(function () {
            console.log("error");
        });


    };


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

//constant pour affichage label réduction
angular.module('panierModule').constant("labelOffre", {
    percentage: {titre: 'Réduction', info: 'Vous avez une réduction de '},
    minus: {titre: 'Déduction en caisse', info: 'Vous avez une réduction'},
    slice: {titre: 'Remboursement', info: 'Vous avez une réduction de'}
});
//service gestion  offres
angular.module('panierModule').service('OffreService', function (calculRemise, labelOffre) {
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
                        console.log("percentage" + soldePercentage);
                        topPromo.push(soldePercentage);
                        setDataOffreKeyValues(soldePercentage, labelOffre.percentage.titre, labelOffre.percentage.info + results.percentage.value + '%', results.percentage);

                    }
                    break;
                case "minus":
                    /*traitement de l'offre reduction encaisse*/
                    if (!angular.isUndefined(results.minus)) {
                        var soldeMinus = calculRemise.calculerRemiseCaise(total, results.minus.value);
                        console.log("minus" + soldeMinus);
                        topPromo.push(soldeMinus);
                        setDataOffreKeyValues(soldeMinus, labelOffre.minus.titre, labelOffre.minus.info + soldeMinus + " en caisse", results.minus);
                    }

                    break;
                case "slice":
                    /*traitement de l'offre reduction par rembourement sur l'argent*/
                    if (!angular.isUndefined(results.slice)) {
                        var soldeSlice = calculRemise.calculerRembourcement(total, results.slice.value, results.slice.sliceValue)
                        console.log("slice" + soldeSlice);
                        topPromo.push(soldeSlice);
                        setDataOffreKeyValues(soldeSlice, labelOffre.slice.titre,
                            labelOffre.slice.info + results.slice.value + "€ sur chaque " + results.slice.sliceValue + "€", results.slice);
                    }
                    break;
            }
            ;
        });

        topPromo.sort();

        return listOffre[topPromo[0]];
    };
});
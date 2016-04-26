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



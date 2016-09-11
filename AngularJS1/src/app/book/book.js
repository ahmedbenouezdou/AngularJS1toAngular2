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
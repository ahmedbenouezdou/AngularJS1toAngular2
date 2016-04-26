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
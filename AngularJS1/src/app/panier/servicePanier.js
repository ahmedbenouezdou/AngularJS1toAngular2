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
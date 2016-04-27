import {Injectable} from 'angular2/core';
import {Http,Headers} from 'angular2/http';

import {BookModel} from '../common/book.model';

@Injectable()
export class PanierService {
    panier:BookModel[] = [];
    totalPanier:number;

    http:Http;

    constructor(http:Http) {
        this.http = http;
    }

    fetchPanier() {
        return this.panier;
    }

    fetchOffre(idisbn) {
        return this.http.get('http://localhost:8085/listOffre/' + idisbn)
            .map(res => res.json());
    }


    removeBook(index:number) {
        console.log("removeBook",index)
        this.panier.splice(index, 1);
    }

    panierNbElement() {
        console.log(this.panier.length);
    }

    addPanier(listBook:BookModel):void {
       this.panier.push(listBook);

    }

    calculTotal() {
        console.log(this.panier);

        this.totalPanier = 0;
        if(this.panier.length!=0){
            for (var i = 0; i < this.panier.length; i++) {
                this.totalPanier = this.totalPanier + ( this.panier[i].price * this.panier[i].quantiteBook)
            }
        }
        return this.totalPanier;
    }


    formeIsbn(liste) {
        let isbnOffre = "";
        for (var i = 0; i < this.panier.length; i++) {
            if (i == 0) isbnOffre = this.panier[i].isbn;
            else {
                if (i == this.panier.length - 1) isbnOffre = isbnOffre + "," + this.panier[i].isbn;
                else isbnOffre = isbnOffre + "," + this.panier[i].isbn;
            }

        }
        return isbnOffre;
    }


    topOffre(results, total) {
        var labelOffre = {
            percentage: {titre: 'R�duction', info: 'Vous avez une r�duction de '},
            minus: {titre: 'D�duction en caisse', info: 'Vous avez une r�duction'},
            slice: {titre: 'Remboursement', info: 'Vous avez une r�duction de'}
        };
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


        labelOffre.forEach((value, key) => {

            switch (key) {
                case "percentage":
                    /*traitement des donner reduction par percentage*/
                    if (!results.percentage) {
                        var soldePercentage = this.calculerPoucentage(total, results.percentage.value);
                        console.log("percentage" + soldePercentage);
                        topPromo.push(soldePercentage);
                        setDataOffreKeyValues(soldePercentage, labelOffre.percentage.titre, labelOffre.percentage.info + results.percentage.value + '%', results.percentage);

                    }
                    break;
                case "minus":
                    /*traitement de l'offre reduction encaisse*/
                    if (!results.minus) {
                        var soldeMinus = this.calculerRemiseCaise(total, results.minus.value);
                        console.log("minus" + soldeMinus);
                        topPromo.push(soldeMinus);
                        setDataOffreKeyValues(soldeMinus, labelOffre.minus.titre, labelOffre.minus.info + soldeMinus + " en caisse", results.minus);
                    }

                    break;
                case "slice":
                    /*traitement de l'offre reduction par rembourement sur l'argent*/
                    if (!results.slice) {
                        var soldeSlice = this.calculerRembourcement(total, results.slice.value, results.slice.sliceValue)
                        console.log("slice" + soldeSlice);
                        topPromo.push(soldeSlice);
                        setDataOffreKeyValues(soldeSlice, labelOffre.slice.titre,
                            labelOffre.slice.info + results.slice.value + "� sur chaque " + results.slice.sliceValue + "�", results.slice);
                    }
                    break;
            }
            ;
        });

        topPromo.sort();

        return listOffre[topPromo[0]];
    }

    calculerPoucentage(total, valPercentage) {
        return total - (total * valPercentage) / 100;
    }

    //m�thode de calcule remise en caisse
    calculerRemiseCaise(totol, somme) {
        return totol - somme;
    }

    //m�thode calcule remise immadiate par remboursement
    calculerRembourcement(total, valRembourcement, valInterval) {
        if (total < valInterval)
            return 0;
        else {
            var pourcentageRem = Math.floor(total / valInterval);
            return total - (pourcentageRem * valRembourcement);
        }
    }


}
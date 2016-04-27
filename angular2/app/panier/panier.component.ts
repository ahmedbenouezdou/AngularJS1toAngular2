import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {PanierService} from './panier.service';

import {BookModel} from '../common/book.model';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/interval';

@Component({
    selector: 'panier',
    templateUrl: 'app/panier/panier.html',
    directives:[ROUTER_DIRECTIVES]
})

export class PanierComponent {
    panierService: PanierService;
    panier:  BookModel[];
    listOffre:any;
    total:number;

    ngOnInit() {
       this.panier=this.panierService.fetchPanier();
        this.listOffre=[];
        this.getOffre();
    }

    constructor( panierService: PanierService) {
        this.panierService=panierService;
        this.total=this.panierService.calculTotal();
        this.getPanier();
    }

    getPanier(){
        this.panier= this.panierService.fetchPanier();
        console.log(this.panier)
    }

    getOffre(){
        if(this.panier.length!=0){
            console.log(this.panierService.formeIsbn(this.panier));

            this.panierService.fetchOffre( this.panierService.formeIsbn(this.panier)).subscribe((listOffre)=>{
                console.log(listOffre)
                this.panierService.topOffre(listOffre,this.total);
            });

        }

    }


    remove(index:number){
        console.log("je suis la");
       this.panierService.remove(index);

        this.panier.splice(index,1);
        console.log(this.panier);
    }


}
import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {PanierService} from './panier.service';

import {CounterComponent} from './counter.component';

import {BookModel} from '../common/book.model';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/interval';

@Component({
    selector: 'panier',
    templateUrl: 'app/panier/panier.html',
    directives:[ROUTER_DIRECTIVES,CounterComponent]
})

export class PanierComponent {
    panierService: PanierService;
    panier:  BookModel[];
    listOffre:any;
    total:number;

    constructor( panierService: PanierService) {
        this.panierService=panierService;

        this.getPanier();
        this.panier=this.panierService.fetchPanier();
        this.listOffre=[];
        this.getOffre();
        this.total=this.panierService.calculTotal();
    }

    getPanier(){
        this.panier= this.panierService.fetchPanier();
    }

    getOffre(){
        if(this.panier.length!=0){
            console.log(this.panierService.formeIsbn(this.panier));

            this.panierService.fetchOffre( this.panierService.formeIsbn(this.panier)).subscribe((listOffre)=>{
                console.log(listOffre)
               // this.panierService.topOffre(listOffre,this.total);
            });

        }

    }

    myValueChange($event) {
        this.total=$event.value;
    }



}
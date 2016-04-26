import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {PanierService} from './panier.service';

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
    panier:  any;
    listOffre:any;
    constructor( panierService: PanierService) {
        this.panier=[];
        this.listOffre=[];
        this.panierService=panierService;
        this.getPanier();
    }

    getPanier(){
        this.panierService.fetchPanier().subscribe((panier)=>{
            this.panier=panier;
        });
    }

}
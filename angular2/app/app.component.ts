import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {HomeComponent} from './home/home.component';

import {BookComponent} from './book/book.component';
import {BookService} from './book/book.service';

import {PanierComponent} from './panier/panier.component';
import {PanierService} from './panier/panier.service';

@Component({
    selector: 'app',
    templateUrl: 'app/app.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [BookService,PanierService]
})

@RouteConfig([
    { path: '/', redirectTo: ['/Book'] },
    {path: '/home', name: 'Home', component: HomeComponent},
    {path: '/Book', name: 'Book', component: BookComponent},
    {path: '/Panier', name: 'Panier', component: PanierComponent}
])

export class AppComponent {

    panierService:PanierService;
    nbPanier:number;
    constructor( panierService:PanierService) {
        this.panierService=panierService;
     //   this.nbPanier=this.panierElement();
    }

    panierElement(){
        return this.panierService.panierNbElement();
    }
}
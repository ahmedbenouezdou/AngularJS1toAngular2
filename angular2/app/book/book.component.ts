import {Component, EventEmitter} from 'angular2/core';
import {NgFor} from 'angular2/common';

import {BookService} from './book.service';
import {PanierService} from '../panier/panier.service';

import {PanierService} from './panier.service';

import {BookModel} from '../common/book.model';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/interval';

@Component({
    selector: 'book',
    templateUrl: 'app/book/book.html',
    directives: [NgFor]
})

export class BookComponent {

    bookService: BookService;
    listBook:BookModel;
    quantite:any;

    panierService: PanierService;


    constructor(bookService:BookService,panierService:PanierService) {
        this.quantite=[];
        this.bookService=bookService;
        this.panierService = panierService;
    }

    ngOnInit() {
        this.bookService.fetchBook().subscribe((listBook)=>{
            this.listBook=listBook;
            let panier=this.panierService.fetchPanier()
            if(panier==0){
                for(var j=0;j<this.listBook.length;j++){
                    this.quantite[j]=0;
                }
            }
        });
    }


    panierAdd(i:number){
        console.log(this.quantite[i]);
        let panier=this.panierService.fetchPanier()
        if(parseInt(this.quantite[i])===0){
            alert("avant de rajouter dans le panier choisir la quantite");
        }else{
            this.listBook[i].quantiteBook=this.quantite[i];
            var existe=true;
            var position=0;
            for(var j=0;j<panier;j++){
                if(this.listBook[i].isbn===panier[j].isbn){
                    existe=false;
                    position=j;
                }
            }
            //si l'article n'existe pas on ajoute dans le panier
            if(existe){
                console.log(this.listBook[i])
                this.panierService.addPanier( this.listBook[i]);
            }
        }
    }




}
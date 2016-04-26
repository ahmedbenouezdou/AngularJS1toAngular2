import {Component} from 'angular2/core';

import {BookService} from './book.service';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/interval';

@Component({
    selector: 'book',
    templateUrl: 'app/book/book.html'
})

export class BookComponent {

    bookService: BookService;
    listBook:any;
    quantite:any;

    constructor(bookService:BookService) {
        this.listBook = [];
        this.quantite=[];
        this.bookService=bookService;
        this.getBook();
    }

    getBook(){
        this.bookService.fetchBook().subscribe((listBook)=>{
            this.listBook=listBook;
        });
    }

    addPanier(i:number){
        console.log(this.listBook[i],this.quantite[i])
    }


}
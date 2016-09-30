import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {PanierService} from './panier.service';

import {FORM_DIRECTIVES} from 'angular2/common';

@Component({
    selector: 'counter',
    styles: [`
    .counter {
      position: relative;
    }
    .counter__input {
      border: 0;
      border-radius: 3px;
      height: 30px;
      max-width: 100px;
      text-align: center;
    }
    .counter__button {
      outline: 0;
      cursor: pointer;
      height: 30px;
      width: 30px;
      border: 0;
      border-radius: 3px;
      background: #0088cc;
      color: #fff;
    }
  `],
    templateUrl: 'app/panier/counter.html',
    directives:[FORM_DIRECTIVES],
    outputs: ['counterChange']
})
export class CounterComponent {
    @Input() counterValue = 0;
    @Input() id:number;

    public counterChange = new EventEmitter();


    panierService: PanierService;



    constructor( panierService: PanierService) {
        this.panierService=panierService;
    }

    remove(id) {

        this.panierService.removeBook(id);
        this.counterValue=this.panierService.calculTotal();
        console.log("totale:", this.counterValue);
        this.counterChange.emit({
            value: this.counterValue
        })
    }


}
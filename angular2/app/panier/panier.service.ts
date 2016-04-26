import {Injectable} from 'angular2/core';
import {Http,Headers} from 'angular2/http';

@Injectable()
export class PanierService {

    http:Http;
    constructor(http:Http) {
        this.http = http;
    }
    fetchPanier() {
        return this.http.get('http://localhost:8085/panier')
            .map(res => res.json());
    }
}
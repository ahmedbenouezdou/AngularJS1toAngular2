import {Injectable} from 'angular2/core';
import {Http,Headers} from 'angular2/http';


@Injectable()
export class BookService {

    http:Http;
    constructor(http:Http) {
        this.http = http;
    }
    fetchBook() {
        return this.http.get('http://localhost:8085/listBook')
            .map(res => res.json());
    }

}
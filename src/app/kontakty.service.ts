import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Car } from './car';
import 'rxjs/Rx';


@Injectable()
export class KontaktyService {

  constructor(private http: Http) { }

  getCarsSmall() {
    return this.http.get('cars.json')
      .toPromise()
      .then(res => <Car[]>res.json().data)
      .then(data => { return data; });
  }
}

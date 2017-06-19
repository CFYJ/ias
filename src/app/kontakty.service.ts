import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Car } from './car';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { GlobalVariable } from 'app/global';

@Injectable()
export class KontaktyService {

  constructor(private http: Http) { }

  getCarsSmall() {
    return this.http.get('cars.json')
      .toPromise()
      .then(res => <Car[]>res.json().data)
      .then(data => { return data; });
  }

  getJednostki() {
    let result = this.http.get(GlobalVariable.SERVICE_URL + 'Kontakties/GetJednostka')
      .map(this.extractData)
      .catch(this.handleError);
    return result;

    /*let jed: any;
    let result = this.http.get(GlobalVariable.SERVICE_URL + 'Kontakties/GetJednostka')
      .toPromise()
      .then(res => <string[]>res.json().data)
      .then(data => { return data; }).catch(this.handleError);
    //result.then(r => jed = r);
    //alert(jed);
    return result;*/
  }

  getStanowiska() {
    let result = this.http.get(GlobalVariable.SERVICE_URL + 'Kontakties/GetStanowisko')
      .map(this.extractData)
      .catch(this.handleError);
    return result;
  }
  getWydzialy() {
    let result = this.http.get(GlobalVariable.SERVICE_URL + 'Kontakties/GetWydzial')
      .map(this.extractData)
      .catch(this.handleError);
    return result;
  }
  getWydzialyPodlegle() {
    let result = this.http.get(GlobalVariable.SERVICE_URL + 'Kontakties/GetWydzialPodlegly')
      .map(this.extractData)
      .catch(this.handleError);
    return result;
  }
  getMiejscaPracy() {
    let result = this.http.get(GlobalVariable.SERVICE_URL + 'Kontakties/GetMiejscePracy')
      .map(this.extractData)
      .catch(this.handleError);
    return result;
  }
  getPiony() {
    let result = this.http.get(GlobalVariable.SERVICE_URL + 'Kontakties/GetPion')
      .map(this.extractData)
      .catch(this.handleError);
    return result;
  }

  private extractData(res: Response) {
    let body = res.json();
    //alert(body);
    return body;
  }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}

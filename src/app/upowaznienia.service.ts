import { SimpleGlobal } from 'ng2-simple-global';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Car } from './car';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UpowaznieniaService {

  constructor(private http: Http, private sg: SimpleGlobal) { }

  getJednostki() {
    const result = this.http.get(this.sg['SERVICE_URL'] + 'Upowaznienia/GetUpowaznieniaLista')
      .map(this.extractData)
      .catch(this.handleError);
    return result;
  }

  deleteFile(id: any) {
    // const result = this.http.get(this.sg['SERVICE_URL'] + 'Upowaznienia/GetUpowaznieniaLista')
    //   .map(this.extractData)
    //   .catch(this.handleError);
    // return result;
    alert("deleted"+id);
  }



  showmyarray(readValues: Boolean, tablica: any)
  {
    let rez=""
    if(readValues){
      for(let i in tablica){
        rez = rez+";"+tablica[i];
      }
    }
    else{
      for(let i in tablica){
        rez = rez+";"+i;
      }
    }
    alert(rez);
    return null;
  }

    private extractData(res: Response) {
      const body = res.json();
      // alert(body);
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

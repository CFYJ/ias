import { SimpleGlobal } from 'ng2-simple-global';
import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(@Inject(DOCUMENT) private document: any, private sg: SimpleGlobal) {
        const url: string = this.document.location.href;

        // if (url.startsWith('https')) {
        //   sg['HTTPS_SERVICE_URL'] = 'https://127.0.0.1:5001/api/'
        //   sg['SERVICE_URL'] = 'https://127.0.0.1:5001/api/'
        // } else if (url.startsWith('http')) {
        //   sg['HTTPS_SERVICE_URL'] = 'http://127.0.0.1:5001/api/'
        //   sg['SERVICE_URL'] = 'http://127.0.0.1:5001/api/'
        //  //sg['SERVICE_URL'] = 'http://localhost:5000/api/'
        // }



        if (url.startsWith('https')) {
          sg['HTTPS_SERVICE_URL'] = 'https://10.10.0.250:5001/api/'
          sg['SERVICE_URL'] = 'https://10.10.0.250:5001/api/'
        } else if (url.startsWith('http')) {
          sg['HTTPS_SERVICE_URL'] = 'http://10.10.0.250:5001/api/'
          sg['SERVICE_URL'] = 'http://10.10.0.250:5001/api/'
        }


        // if (url.startsWith('https')) {
        //   sg['HTTPS_SERVICE_URL'] = 'https://10.10.0.250:/api/'
        //   sg['SERVICE_URL'] = 'https://10.10.0.250:8080/api/'
        // } else if (url.startsWith('http')) {
        //   sg['HTTPS_SERVICE_URL'] = 'http://10.10.0.250:8080/api/'
        //   sg['SERVICE_URL'] = 'http://10.10.0.250:8080/api/'
        // }
    }
}

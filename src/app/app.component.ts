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

        if (url.startsWith('https')) {
          sg['HTTPS_SERVICE_URL'] = 'https://127.0.0.1:5000/api/'
          sg['SERVICE_URL'] = 'https://127.0.0.1:5000/api/'
        } else if (url.startsWith('http')) {
          sg['HTTPS_SERVICE_URL'] = 'http://127.0.0.1:5000/api/'
          sg['SERVICE_URL'] = 'http://127.0.0.1:5000/api/'
        }
        // if (url.startsWith('https')) {
        //   sg['HTTPS_SERVICE_URL'] = https://10.10.0.250/api/'
        //   sg['SERVICE_URL'] = 'https://10.10.0.250/api/'
        // } else if (url.startsWith('http')) {
        //   sg['HTTPS_SERVICE_URL'] = 'http://10.10.0.250/api/'
        //   sg['SERVICE_URL'] = 'http://10.10.0.250/api/'
        // }
    }
}

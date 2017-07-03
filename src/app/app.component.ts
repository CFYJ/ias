import { GlobalVariable } from './global';
import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(@Inject(DOCUMENT) private document: any) {
        const url: string = this.document.location.href;

        // if (url.startsWith('https')) {
        //   GlobalVariable.HTTPS_SERVICE_URL = 'https://10.10.0.250/api/'
        //   GlobalVariable.SERVICE_URL = 'https://10.10.0.250/api/'
        // } else if (url.startsWith('http')) {
        //   GlobalVariable.HTTPS_SERVICE_URL = 'http://10.10.0.250/api/'
        //   GlobalVariable.SERVICE_URL = 'http://10.10.0.250/api/'
        // }
        if (url.startsWith('https')) {
          GlobalVariable.HTTPS_SERVICE_URL = 'https://127.0.0.1:5000/api/'
          GlobalVariable.SERVICE_URL = 'https://127.0.0.1:5000/api/'
        } else if (url.startsWith('http')) {
          GlobalVariable.HTTPS_SERVICE_URL = 'http://127.0.0.1:5000/api/'
          GlobalVariable.SERVICE_URL = 'http://127.0.0.1:5000/api/'
        }
    }
}

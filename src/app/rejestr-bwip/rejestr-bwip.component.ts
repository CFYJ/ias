import { Component, OnInit } from '@angular/core';
import { SimpleGlobal } from 'ng2-simple-global';
import { HTTP_INTERCEPTORS, HttpClient,  } from '@angular/common/http';

@Component({
  selector: 'app-rejestr-bwip',
  templateUrl: './rejestr-bwip.component.html',
  styleUrls: ['./rejestr-bwip.component.scss']
})
export class RejestrBwipComponent implements OnInit {

  constructor( private sg: SimpleGlobal, public http: HttpClient,) { }

  odpowiedz: string='zzz';
  ngOnInit() {

   // this.loadData();

  }


  loadData(){

    this.http.get(this.sg['SERVICE_URL'] + 'RejestrBWIP/GetRows')
    .subscribe(
      data => {
        this.odpowiedz = data.toString();
      },
      err =>{
        alert("Błąd programu, skontaktuj się z administratorem. \n"+err);  
      } 
    );





    // $.ajax({
    //   cache: false,
    //   dataType: 'json',
    //   contentType: 'application/json',
    //   url: this.sg['SERVICE_URL'] + 'RejestrBWIP/GetRows/',
    //   type: 'GET',
    //   success: (data: any, status: any, xhr: any)=>{     
    //      this.odpowiedz = data;
    //     },
    //     error: function (jqXHR: any, textStatus: any, errorThrown: any) {
        
    //       alert(textStatus + ' - ' + errorThrown);
    //     }
    //   });
  }

}

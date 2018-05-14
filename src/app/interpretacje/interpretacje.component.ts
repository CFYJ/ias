import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy, AfterContentInit  } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient,  } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
//import { Http } from '@angular/http';
import { SimpleGlobal } from 'ng2-simple-global';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer} from '@angular/platform-browser';

import { jqxGridComponent } from 'jqwidgets-ts/angular_jqxgrid';
import { jqxWindowComponent } from 'jqwidgets-ts/angular_jqxwindow';

import { MessageService } from './../message.service';
import { AuthenticationService } from './../authentication.service';

import {Router} from "@angular/router";



@Component({
  selector: 'app-interpretacje',
  templateUrl: './interpretacje.component.html',
  styleUrls: ['./interpretacje.component.scss']
})
export class InterpretacjeComponent implements OnInit, AfterViewInit {

  
  @ViewChild('gridInterpretacjeReference') myGrid: jqxGridComponent;
  @ViewChild('jqxwindowFile') jqxwindowFile: jqxWindowComponent;


  constructor(public http: HttpClient, private authService: AuthenticationService,private messageService: MessageService,
    private sg: SimpleGlobal, private sanitizer: DomSanitizer, private router:Router) {
      // if(!authService.checkIfUserIsInRole('interpretacje'))      
      //   this.router.navigate(['/login']);
     }

  ngOnInit() {
    //this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  ngAfterViewInit(): void {
    this.myGrid.createComponent(this.options);
    this.jqxwindowFile.createWidget({
      width: 450, height: 530, theme: 'metro',
      resizable: false, isModal: true, autoOpen: false, modalOpacity: 0.5,
      
    });

    $(()=>{ $("#argInput").keydown((event)=>{ if(Number(event.keyCode)==13)
      this.findInterpretacje();})});

  }

  //#region skladniki grida
  source={
    datatype: 'json',

    // localdata:[{id:1, nazwa:'nazwa', tresc:'tresc', data:'2018-01-01', nipy:'nipy'},
    //           {id:2, nazwa:'nazwa', tresc:'tresc', data:'2018-01-01', nipy:'nipy'}],

    datafields:[
      {name: 'id'},
      {name: 'nazwa', type:'string'},
      {name: 'tresc', type:'string'},
      {name: 'data', type:'string'},
      {name: 'nipy', type:'string'},
    ],
    id:'id'
  };


  source2={
    datatype: 'json',
    datafields:[
      {name: 'id'},
      {name: 'nazwa', type:'string'},
      {name: 'tresc', type:'string'},
      {name: 'data', type:'string'},
      {name: 'nipy', type:'string'},
    ],
    id:'id',
    url: this.sg['SERVICE_URL']+'Interpretacje/GetRows',
    //headers:{'Authorization':'ddd'},
    root: 'rows', 
    beforeprocessing: function(data){
      this.totalrecords= data.totalRows;
    },

    filter: ()=>{
      // update the grid and send a request to the server.
      this.myGrid.updatebounddata(); 
    },

  }


  dataAdapter2 = new $.jqx.dataAdapter(this.source2,
    {beforeSend: function (jqXHR, settings) {
      jqXHR.setRequestHeader('Authorization','Bearer '+localStorage.getItem('user'));
    }},
    {
      formatData: function (data: any) {
        return data;
    }
  });

  dataAdapter = this.dataAdapter2;

  options: jqwidgets.GridOptions ={    
    localization: {
      pagergotopagestring: 'Idź do', pagerrangestring: ' z ',
      pagershowrowsstring: 'Liczba wierszy', loadtext: 'Wczytywanie...',
      sortascendingstring: 'Sortuj rosnąco', sortdescendingstring: 'Sortuj malejąco',
      sortremovestring: 'Wyczyść sortowanie', emptydatastring:'Brak danych'
    },
    width:'100%',
    columnsresize: true,
    filterable: false,
    autoshowfiltericon: true,
    filtermode: 'excel',
    showfilterrow: false,
    pagesize:10,
    autorowheight: true,
    autoheight: true,
    altrows: true,
    enabletooltips: false,
    columnsheight:30,
    theme: 'metro',
    pageable: true,
    selectionmode: 'multiplecellsadvanced',

    virtualmode: true,
    rendergridrows: function(data)
    {
        return data.data;
    },
  };

 
  columns: any[] =
  [
    { text: '', datafield: 'edycja', width: 100, 
    filterable: false,
    cellsrenderer:  (row, columnfield, value, defaulthtml, columnproperties, rowdata)=> {    
      // return '<span style="margin: 4px; float: left; "><a href="'+this.sg['SERVICE_URL'] + 'interpretacje/FileDownload/'+rowdata.id+'" target="_blank">Pobierz</a></span>';
     return '<span style="margin: 4px; float: left; ">Pokaż</span>';
     },
    },
    { text: 'Nazwa/sygnatura', datafield: 'nazwa',  width: 320},
    { text: 'Nip/pesel', datafield: 'nipy',  width: 200,
      cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {      
        return '<span style="margin: 4px; float: left; ">'+value.replace(';','; ')+'</span>';
      },
    },
    { text: 'Data dodania', datafield: 'data', width: 200,
      cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {      
        return '<span style="margin: 4px; float: left; ">'+value.substr(0,10)+'</span>';
      },
    },
    { text: 'Szukany fragment',  datafield: 'tresc', minwidth: 340},  
    
  ];




  fileUrl:any=null;//this.sanitizer.bypassSecurityTrustResourceUrl(this.sg['SERVICE_URL']+'interpretacje');

  editCellclick(event: any): void {
    if (event.args.datafield === 'edycja') {
      const datarow = event.args.row.bounddata;

      let basePlikiurl = this.sg['SERVICE_URL'] + 'Interpretacje/FileDownload/'+datarow.id;   

      var xhr = new XMLHttpRequest();      
      xhr.open('GET', basePlikiurl);
      xhr.setRequestHeader('Authorization','Bearer '+localStorage.getItem('user')); 
      xhr.onreadystatechange = ()=>{      
        if (xhr.readyState ==4) {         
          if (xhr.status === 200) {

            var file = new Blob([xhr.response], {type: "application/pdf"});
       
            if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveOrOpenBlob(file,datarow.nazwa+".pdf");
            } 
            else {
              // this.response is a Blob, because we set responseType above
              //var file = new Blob([xhr.response], {type: "application/pdf"});
              //this.fileUrl = URL.createObjectURL(file);      
              this.fileUrl =this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));  
              this.jqxwindowFile.title(datarow.nazwa);
              this.jqxwindowFile.open();
            }

          } else {
            console.error("Błąd: "+xhr);
          }
        }
        else if(xhr.readyState == 2) {    
          if(xhr.status == 200) {
            xhr.responseType = "blob";
          } else {
            xhr.responseType = "text";
          }
        }
      }
             
      xhr.send();

      // this.jqxwindowFile.title(datarow.nazwa);
      // this.jqxwindowFile.open();
    }
  }

  //#endregion

  typ: string="";
  typValues: any =[{key:"nipy", val:"nip/pesel"},{key:"tresc", val:"w treści"}, {key:"nazwa", val:"sygnatura"}];
  arg: string="";
  findInterpretacje(){    
    if(this.typ && this.arg){
      //this.myGrid.updating = true;
      this.myGrid.showloadelement();


      
      // $.ajax({
      //   cache: false,
      //   dataType: 'json',
      //   contentType: 'application/json',
      //   beforeSend: function(request) {
      //     request.setRequestHeader('Authorization','Bearer '+localStorage.getItem('user'));
      //   },
      //   url: this.sg['SERVICE_URL'] + 'Interpretacje/GetList/'+this.typ+'/'+this.arg,
      //   type: 'GET',
      //   success: (data: any, status: any, xhr: any) =>{           
      //     this.source['localdata']=data;
      //     this.dataAdapter = new $.jqx.dataAdapter(this.source);
      //     //this.myGrid.refresh();
      //     this.myGrid.hideloadelement();
      //   },
      //   error: function (jqXHR: any, textStatus: any, errorThrown: any) {
      //     alert(textStatus + ' - ' + errorThrown);  
      //     //this.myGrid.hideloadelement();
      //   }
      // });


      this.http.get(this.sg['SERVICE_URL'] + 'Interpretacje/GetList/'+this.typ+'/'+this.arg)
      .subscribe(
        data => {
          this.source['localdata']=data;
          this.dataAdapter = new $.jqx.dataAdapter(this.source);    
          this.myGrid.hideloadelement();
        },
        err =>{
          alert("Błąd programu, skontaktuj się z administratorem. \n"+err);  
        } 
      );



    }
  }

  clearSearch(){
    this.dataAdapter = this.dataAdapter2;
  }

  fileupload(){
    $.ajax({
      cache: false,
      dataType: 'json',
      contentType: 'application/json',
      url: this.sg['SERVICE_URL'] + 'Interpretacje/upload',
      type: 'GET',
      success: (data: any, status: any, xhr: any) =>{         
        console.log("youpii");        
      },
      error: function (jqXHR: any, textStatus: any, errorThrown: any) {
        alert(textStatus + ' - ' + errorThrown);
   
      }
    });
  }
}



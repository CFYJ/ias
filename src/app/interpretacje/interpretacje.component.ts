import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy, AfterContentInit  } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';
import { SimpleGlobal } from 'ng2-simple-global';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer} from '@angular/platform-browser';

import { jqxGridComponent } from 'jqwidgets-ts/angular_jqxgrid';
import { jqxWindowComponent } from 'jqwidgets-ts/angular_jqxwindow';

import { MessageService } from './../message.service';
import { AuthenticationService } from './../authentication.service';


@Component({
  selector: 'app-interpretacje',
  templateUrl: './interpretacje.component.html',
  styleUrls: ['./interpretacje.component.scss']
})
export class InterpretacjeComponent implements OnInit, AfterViewInit {

  
  @ViewChild('gridInterpretacjeReference') myGrid: jqxGridComponent;
  @ViewChild('jqxwindowFile') jqxwindowFile: jqxWindowComponent;


  constructor( private authService: AuthenticationService,private messageService: MessageService,
    private sg: SimpleGlobal, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  ngAfterViewInit(): void {
    this.myGrid.createComponent(this.options);
    this.jqxwindowFile.createWidget({
      width: 450, height: 530, theme: 'metro',
      resizable: false, isModal: true, autoOpen: false, modalOpacity: 0.5,
      
    });

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

  dataAdapter = new $.jqx.dataAdapter(this.source, {
    formatData: function (data: any) {
      return data;
    }
  });

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
  };

 
  columns: any[] =
  [
    { text: '', datafield: 'edycja', width: 100, 
    filterable: false,
    cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {    
      return '<span style="margin: 4px; float: left; ">Pokaż</span>';
     },
    },
    { text: 'Nazwa/sygnatura', datafield: 'nazwa',  width: 320},
    { text: 'Nip/pesel', datafield: 'nipy',  width: 200},
    { text: 'Data dodania', datafield: 'data', width: 200,
      cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {  
        console.log(value);  
        return '<span style="margin: 4px; float: left; ">'+value.substr(0,10)+'</span>';
      },
    },
    { text: 'Szukany fragment',  datafield: 'tresc', minwidth: 340},  
    
  ];


  fileUrl:any=this.sanitizer.bypassSecurityTrustResourceUrl(this.sg['SERVICE_URL']+'interpretacje');
  editCellclick(event: any): void {
    if (event.args.datafield === 'edycja') {
      const datarow = event.args.row.bounddata;

      let basePlikiurl = this.sg['SERVICE_URL'] + 'interpretacje/FileDownload/'+datarow.id;   

      this.fileUrl=this.sanitizer.bypassSecurityTrustResourceUrl(basePlikiurl);
      this.jqxwindowFile.title(datarow.nazwa);
      this.jqxwindowFile.open();
    }
  }

  //#endregion

  typ: string="";
  typValues: any =[{key:"nipy", val:"nip/pesel"},{key:"tresc", val:"w treści"}, {key:"nazwa", val:"sygnatura"}];
  arg: string="";
  findInterpretacje(){    
    if(this.typ && this.arg){
      this.myGrid.beginupdate();
      $.ajax({
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        url: this.sg['SERVICE_URL'] + 'Interpretacje/GetList/'+this.typ+'/'+this.arg,
        type: 'GET',
        success: (data: any, status: any, xhr: any) =>{           
          this.source['localdata']=data;
          this.dataAdapter = new $.jqx.dataAdapter(this.source);
          this.myGrid.refresh();
          this.myGrid.endupdate();
        },
        error: function (jqXHR: any, textStatus: any, errorThrown: any) {
          alert(textStatus + ' - ' + errorThrown);  
          this.myGrid.endupdate();
        }
      });
    }
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



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

import {Router} from "@angular/router";

@Component({
  selector: 'app-helpdesk',
  templateUrl: './helpdesk.component.html',
  styleUrls: ['./helpdesk.component.scss']
})
export class HelpdeskComponent implements OnInit, AfterViewInit {

  @ViewChild('listGrid') listGrid: jqxGridComponent;

  constructor(private authService: AuthenticationService,private messageService: MessageService,
    private sg: SimpleGlobal, private sanitizer: DomSanitizer, private router:Router) {
      // if(!authService.checkIfUserIsInRole('helpdesk'))      
      // this.router.navigate(['/login']);
     }



  ngOnInit() {
  }

  ngAfterViewInit(){
    this.listGrid.createComponent(this.options);
  }

  source={
    datatype: 'json',

    datafields:[
      {name: 'id'},
      {name: 'tresc', type:'string'},
      {name: 'zgloszenie', type:'string'},
      {name: 'data', type:'date'},

      {name: 'nr', type:'string'},
      {name: 'temat', type:'string'},
      {name: 'zglaszajacy', type:'string'},
      {name: 'datarejestracji', type:'string'},
      {name: 'status', type:'string'},

    ],
    id:'id',
    url: this.sg['SERVICE_URL']+'HelpDesk/GetRows',
    //headers:{'Authorization':'ddd'},
    root: 'rows', 
    beforeprocessing: function(data){
      this.totalrecords= data.totalRows;
    },

    filter: ()=>{
      // update the grid and send a request to the server.
      this.listGrid.updatebounddata();
      this.tresczgloszenia = ""; 
    },


  };

  dataAdapter = new $.jqx.dataAdapter(this.source,{
    beforeSend: function (jqXHR, settings) {
      jqXHR.setRequestHeader('Authorization','Bearer '+localStorage.getItem('user'));
  }
  });

  options: jqwidgets.GridOptions ={    
    localization: {
      pagergotopagestring: 'Idź do', pagerrangestring: ' z ',
      pagershowrowsstring: 'Liczba wierszy', loadtext: 'Wczytywanie...',
      sortascendingstring: 'Sortuj rosnąco', sortdescendingstring: 'Sortuj malejąco',
      sortremovestring: 'Wyczyść sortowanie', emptydatastring:'Brak danych',
      filtershowrowdatestring: "Pokaż rekordy gdzie data jest:",
      filtershowrowstring: "Pokaż rekordy spełniające warunek:",
      filterdatecomparisonoperators: ['równa', 'różna', 'mniejsza', 'mniejsza lub równa', 'większa', 'większa lub równa', 'null', 'not null'],
    },
    width:'100%',
    columnsresize: true,
    filterable: true,
    autoshowfiltericon: true,
    //filtermode: 'excel',
    showfilterrow: true,
    pagesize:5,
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
    // { text: 'Data dodania', datafield: 'data', width: 200, cellsformat: 'dd.MM.yyyy' , filtertype: 'date'
    //   // cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {      
    //   //   return '<span style="margin: 4px; float: left; ">'+value.substr(0,10)+'</span>';
    //   // },
    // },
    { text: 'Numer zgłoszenia',  datafield: 'nr', width: 140},  
    { text: 'Treść zgłoszenia',  datafield: 'zgloszenie', minwidth: 340},  

    
    { text: 'Temat',  datafield: 'temat', width: 250},  
    { text: 'Zgłaszający',  datafield: 'zglaszajacy', width: 140},  
    { text: 'Data zgłoszenia',  datafield: 'datarejestracji', width: 140},  
    { text: 'Status',  datafield: 'status', width: 140},  
    
  ];


  tresczgloszenia: string=""
  editCellclick(event: any){
    this.tresczgloszenia= event.args.row.bounddata['tresc']; 
  }

}

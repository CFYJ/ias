import { Component, OnInit , ViewChild,AfterViewInit} from '@angular/core';
import { SimpleGlobal } from 'ng2-simple-global';
import { HTTP_INTERCEPTORS, HttpClient,  } from '@angular/common/http';

import { jqxGridComponent } from 'jqwidgets-ts/angular_jqxgrid';
import { jqxWindowComponent } from 'jqwidgets-ts/angular_jqxwindow';


@Component({
  selector: 'app-rejestr-bwip',
  templateUrl: './rejestr-bwip.component.html',
  styleUrls: ['./rejestr-bwip.component.scss']
})
export class RejestrBwipComponent implements OnInit,AfterViewInit {

  @ViewChild('gridSprawyReference') gridSprawy: jqxGridComponent;
  @ViewChild('gridZdarzeniaReference') gridZdarzenia: jqxGridComponent;
  @ViewChild('windowSprawy') windowSprawy: jqxWindowComponent;

  obiektSprawy: any;
  sprawaZPliku: boolean=false;

  constructor( private sg: SimpleGlobal, public http: HttpClient,) { }

  odpowiedz: string='zzz';
  ngOnInit() {


  }

  
  ngAfterViewInit(): void {
    this.gridSprawy.createComponent(this.gridoptionsSprawy);
    this.gridZdarzenia.createComponent(this.gridoptionsZdarzenia);

    this.windowSprawy.createWidget({
      width: 550, height: 430, theme: 'metro',
      resizable: false, isModal: true, autoOpen: false, modalOpacity: 0.5,
      
    });
    
  }

  //#region grid_sprawy */

  selectedRowDataSprawy = null;

  sourceSprawy={
    datatype: 'json',

    datafields:[
      {name: 'id'},
      {name: 'nazwa', type:'string'},
      {name: 'identyfikator', type:'string'},
      {name: 'adres', type:'string'},
      {name: 'odKogo', type: 'string'},
      {name: 'doKogo', type: 'string'},
      {name: 'typ', type: 'string'},
      {name: 'rodzWniosku', type: 'string'},
      {name: 'nrBwip', type: 'string'},
      {name: 'nrSzd', type: 'string'},
      {name: 'rodzNaleznosci', type: 'string'},
      {name: 'calkowitaKwota', type: 'string'},
      {name: 'terminOdpowiedzi', type: 'string'},
      {name: 'sysdate', type: 'date'},
      // {name: '', type: ''},

    ],
    id:'id',
    url: this.sg['SERVICE_URL']+'RejestrBWIP/GetSprawy',

    root: 'rows', 
    beforeprocessing: function(data){
      this.totalrecords= data.totalRows;
    },

    filter: ()=>{
      // update the grid and send a request to the server.
      this.gridSprawy.updatebounddata();  
    },

    addrow: (rowid: any, rowdata: any, position: any, commit: any) => {
      console.log(rowdata)
      const t = JSON.stringify(rowdata);
      $.ajax({
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        url: this.sg['SERVICE_URL'] + 'RejestrBWIP/AddSprawy',
        data: t,
        type: 'POST',
        beforeSend: function(request) {request.setRequestHeader('Authorization','Bearer '+localStorage.getItem('user'));},
        success: function (data: any, status: any, xhr: any) {
          rowdata.id = data.id;
          commit(true);                  
        },
        error: function (jqXHR: any, textStatus: any, errorThrown: any) {
          alert(textStatus + ' - ' + errorThrown);
          commit(false);
        }
      })
    },
    updaterow: (rowid: any, rowdata: any, commit: any) => {
    
      const t = JSON.stringify(rowdata);
      $.ajax({
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        url: this.sg['SERVICE_URL'] + 'RejestrBWIP/UpdateSprawy/' + rowdata.id,
        data: t,
        type: 'PUT',
        beforeSend: function(request) {request.setRequestHeader('Authorization','Bearer '+localStorage.getItem('user'));},
        success:  (data: any, status: any, xhr: any)=> {  
          this.gridSprawyEdycja=false;         
          commit(true);           
        },
        error: function (jqXHR: any, textStatus: any, errorThrown: any) {
          alert(textStatus + ' - ' + errorThrown);
          commit(false);
        }
      });
    },

    // deleterow: (rowindex: any, commit: any) => {
    //   //const t = JSON.stringify(rowdata);

    //   $.ajax({
    //     cache: false,
    //     dataType: 'json',
    //     contentType: 'application/json',
    //     url: this.sg['SERVICE_URL'] + 'Upowaznienia/DelUpowaznienia/' + rowindex,
    //     //data: t,
    //     type: 'POST',
    //     beforeSend: function(request) {request.setRequestHeader('Authorization','Bearer '+localStorage.getItem('user'));},
    //     success: function (data: any, status: any, xhr: any) {      
    //       commit(true);     
    //     },
    //     error: function (jqXHR: any, textStatus: any, errorThrown: any) {
    //       alert(textStatus + ' - ' + errorThrown);
    //       commit(false);
    //     }
    //   });
    // },


  };

  dataAdapterSprawy = new $.jqx.dataAdapter(this.sourceSprawy,
    {beforeSend: function (jqXHR, settings) {jqXHR.setRequestHeader('Authorization','Bearer '+localStorage.getItem('user'));},
    formatData: function (data: any) {
      return data;
    }
    }, 
  );


  gridoptionsSprawy: jqwidgets.GridOptions ={    
    localization: {
      pagergotopagestring: 'Idź do', pagerrangestring: ' z ',
      pagershowrowsstring: 'Liczba wierszy', loadtext: 'Wczytywanie...',
      sortascendingstring: 'Sortuj rosnąco', sortdescendingstring: 'Sortuj malejąco',
      sortremovestring: 'Wyczyść sortowanie'
    },

    columnsresize: true,
    
    filterable: true,
    autoshowfiltericon: true,
    filtermode: 'excel',
    showfilterrow: true,
    pagesize:10,

    autorowheight: true,
    autoheight: true,
    altrows: true,
    enabletooltips: false,
    
    columnsheight:30,
    theme: 'metro',

    source: this.dataAdapterSprawy,

    pageable: true,

    virtualmode: true,
    rendergridrows: function(data)
    {
        return data.data;
    },
  };

  
  columnsSprawy: any[] =
  [
   // { text: 'Data systemowa', datafield: 'sysdate',  width: 120},
    { text: 'Nazwa', datafield: 'nazwa',  width: 150},
    { text: 'Identyfikator', datafield: 'identyfikator',  width: 120},
    { text: 'Adres', datafield: 'adres',  },
    { text: 'Od kogo', datafield: 'odKogo',  },
    { text: 'Do kogo', datafield: 'doKogo',  },
    { text: 'Typ', datafield: 'typ',  },
    { text: 'Rodzaj wniosku', datafield: 'rodzWniosku',  },
    { text: 'Nr. BWIP', datafield: 'nrBwip',  },
    { text: 'Nr. SZD', datafield: 'nrSzd',  },
    { text: 'Rodzaj należności', datafield: 'rodzNaleznosci',  },
    { text: 'Całkowita kwota', datafield: 'calkowitaKwota',  },
    { text: 'Termin odpowiedzi', datafield: 'terminOdpowiedzi',  },

  ]


  gridSprawyCellClicked(event:any):void{
    this.selectedRowDataSprawy = event.args.row.bounddata;  
    this.createObiektSprawy(this.selectedRowDataSprawy);
  }
  //#endregion

  //#region sprawy

  showSprawyDitails:boolean=false;
  gridSprawySelected:any;

  dodaj_sprawe(){  
    this.createObiektSprawy();
    this.sprawaZPliku = false;
    this.showSprawyDitails = true;
    this.windowSprawy.title("Dodaj sprawę");
    this.windowSprawy.open();
  }

  dodaj_spraweZPliku(){
    this.createObiektSprawy()
    this.sprawaZPliku = true;
    this.showSprawyDitails = false;
    this.windowSprawy.title("Dodaj sprawę z pliku");
    this.windowSprawy.open();
  }

  edytuj_sprawe(){
   if(this.gridSprawy.getselectedcell().rowindex){
      this.createObiektSprawy(this.gridSprawy.getrowdata(this.gridSprawy.getselectedcell().rowindex))
      this.gridSprawyEdycja = true;
      this.sprawaZPliku = false;
      this.showSprawyDitails = true;
      this.windowSprawy.title("Edytuj sprawę");
      this.windowSprawy.open();
    }
  }

  createObiektSprawy(row?:any){
    this.obiektSprawy={
      id:row?row.id:0,
      nazwa:row?row.nazwa:"",
      identyfikator:row?row.identyfikator:"",
      adres:row?row.adres:"",
      odKogo:row?row.odKogo:"",
      doKogo:row?row.doKogo:"",
      typ:row?row.typ:"",
      rodzWniosku:row?row.rodzWniosku:"",
      nrBwip:row?row.nrBwpi:"",
      nrSzd:row?row.nrSzd:"",
      rodzNaleznosci:row?row.rodzNaleznosci:"",
      calkowitaKwota:row?row.calkowitaKwota:"",
      terminOdpowiedzi:row?row.terminOdpowiedzi:"",
      sysdate:row?row.sysdate:"",
    }
  }

  windowSprawyCancel(){
    this.windowSprawy.close();
    this.createObiektSprawy();
    this.showSprawyDitails = false;
    this.sprawaZPliku = false;
    this.gridSprawyEdycja = false;
  }

  gridSprawyEdycja: boolean = false;

  windowSprawyOK(){    
    if(this.gridSprawyEdycja)
      this.gridSprawy.updaterow(this.gridSprawy.getrowid(this.gridSprawy.getselectedcell().rowindex), this.obiektSprawy);      
    else
      this.gridSprawy.addrow(0,this.obiektSprawy,'top');  

    this.windowSprawy.close();
    this.showSprawyDitails = false;
    this.sprawaZPliku = false;
    this.gridSprawyEdycja = false;
  }
  //#endregion



    //#region grid_zdarzenia */
    sourceZdarzenia={
      datatype: 'json',
  
      datafields:[
        {name: 'id'},
        {name: 'idSprawy', type:'string'},
        {name: 'dataWejscia', type:'string'},
        {name: 'dataWyjscia', type:'string'},
        {name: 'odpowiedz', type: 'string'},
        {name: 'sysdate', type: 'date'},
   
        // {name: '', type: ''},
  
      ],
      id:'id',
      url: this.sg['SERVICE_URL']+'RejestrBWIP/GetZdarzenia',

      root: 'rows', 
      beforeprocessing: function(data){
        this.totalrecords= data.totalRows;
      
      },
    };
  
    dataAdapterZdarzenia = new $.jqx.dataAdapter(this.sourceZdarzenia,
      {beforeSend: function (jqXHR, settings) {jqXHR.setRequestHeader('Authorization','Bearer '+localStorage.getItem('user'));}}, 
    );
  
  
    gridoptionsZdarzenia: jqwidgets.GridOptions ={    
      localization: {
        pagergotopagestring: 'Idź do', pagerrangestring: ' z ',
        pagershowrowsstring: 'Liczba wierszy', loadtext: 'Wczytywanie...',
        sortascendingstring: 'Sortuj rosnąco', sortdescendingstring: 'Sortuj malejąco',
        sortremovestring: 'Wyczyść sortowanie', emptydatastring:'Brak danych',
        filtershowrowdatestring: "Pokaż rekordy gdzie data jest:",
        filtershowrowstring: "Pokaż rekordy spełniające warunek:",
        filterdatecomparisonoperators: ['równa', 'różna', 'mniejsza', 'mniejsza lub równa', 'większa', 'większa lub równa', 'null', 'not null'],
      },
  
      columnsresize: true,
      
      filterable: true,
      autoshowfiltericon: true,
      filtermode: 'excel',
      showfilterrow: true,
      pagesize:10,
  
      autorowheight: true,
      autoheight: true,
      altrows: true,
      enabletooltips: false,
      
      columnsheight:30,
      theme: 'metro',
  
      source: this.dataAdapterZdarzenia,
      pageable: true,

      virtualmode: true,
      rendergridrows: function(data)
      {
          return data.data;
      },
    };
  
    
    columnsZdarzenia: any[] =
    [
      { text: 'Data odebrania', datafield: 'dataWejscia',  width: 120},
      { text: 'Data wysłania', datafield: 'dataWyjscia',  width: 150},
      { text: 'Odpowiedź', datafield: 'odpowiedz',  width: 120},
  
    ]
  
    //#endregion

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

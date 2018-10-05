import { Component, OnInit , ViewChild,AfterViewInit} from '@angular/core';
import { SimpleGlobal } from 'ng2-simple-global';
import { HTTP_INTERCEPTORS, HttpClient,  } from '@angular/common/http';

import { jqxGridComponent } from 'jqwidgets-ts/angular_jqxgrid';
import { jqxWindowComponent } from 'jqwidgets-ts/angular_jqxwindow';


import * as Xml from 'xml2js';

@Component({
  selector: 'app-rejestr-bwip',
  templateUrl: './rejestr-bwip.component.html',
  styleUrls: ['./rejestr-bwip.component.scss']
})
export class RejestrBwipComponent implements OnInit,AfterViewInit {

  @ViewChild('gridSprawyReference') gridSprawy: jqxGridComponent;
  @ViewChild('gridZdarzeniaReference') gridZdarzenia: jqxGridComponent;
  @ViewChild('gridPlikiReference') gridPliki: jqxGridComponent;
  @ViewChild('windowSprawy') windowSprawy: jqxWindowComponent;
  @ViewChild('windowZdarzenia') windowZdarzenia: jqxWindowComponent;

  @ViewChild('questionWindow') questionWindow: jqxWindowComponent;

  obiektSprawy: any;
  obiektZdarzenia: any;
  obiektPliki: any;
  sprawaZPliku: boolean=false;

  constructor( private sg: SimpleGlobal, public http: HttpClient,) { }

  ngOnInit() {
  }

  
  ngAfterViewInit(): void {
    this.gridSprawy.createComponent(this.gridoptionsSprawy);
    this.gridZdarzenia.createComponent(this.gridoptionsZdarzenia);
    this.gridPliki.createComponent(this.gridoptionsPliki);

    this.windowSprawy.createWidget({
      width: 500, height: 430, theme: 'metro',
      resizable: false, isModal: true, autoOpen: false, modalOpacity: 0.5,
      
    });

    
    this.windowZdarzenia.createWidget({
      width: 500, height: 230, theme: 'metro',
      resizable: false, isModal: true, autoOpen: false, modalOpacity: 0.5,
      
    });

    this. questionWindow.createWidget({
      width: 350, height: 330, theme: 'metro',
      resizable: false, isModal: true, autoOpen: false, modalOpacity: 0.5,
      
    });
    
  }

  //#region sprawy

  //#region grid_sprawy */

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
      {name: 'calkowitaKwota', type: 'number'},
      {name: 'terminOdpowiedzi', type: 'date'},
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

    sort: ()=>{
      this.gridSprawy.updatebounddata();  
    },  

    addrow: (rowid: any, rowdata: any, position: any, commit: any) => {   
      const t = JSON.stringify(rowdata);
      $.ajax({
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        url: this.sg['SERVICE_URL'] + 'RejestrBWIP/AddSprawy',
        data: t,
        type: 'POST',
        beforeSend: function(request) {request.setRequestHeader('Authorization','Bearer '+localStorage.getItem('user'));},
        success:  (data: any, status: any, xhr: any)=> {
          rowdata.id = data.id;
       
          if(this.tmpfile)         
          {
            this.createObiektZdarzenia();
            this.obiektZdarzenia.idSprawy = data.id;  
            this.obiektZdarzenia.odpowiedz="test";
            $.ajax({
              cache: false,
              dataType: 'json',
              contentType: 'application/json',
              url: this.sg['SERVICE_URL'] + 'RejestrBWIP/AddZdarzenia',
              data:JSON.stringify(this.obiektZdarzenia),
              type: 'POST',
              beforeSend: function(request) {request.setRequestHeader('Authorization','Bearer '+localStorage.getItem('user'));},
              success:  (data: any, status: any, xhr: any)=>{
                
                
                this.tmpfile.idZdarzenia = data.id;
                // console.log(data.id);
                // console.log(this.tmpfile);
                 let xx = JSON.stringify(this.tmpfile);
                $.ajax({
                  cache: false,
                  dataType: 'json',
                  contentType: 'application/json',
                  url: this.sg['SERVICE_URL'] + 'RejestrBWIP/UpdatePliki/'+this.tmpfile.id,
                  data:xx,
                  type: 'PUT',
                  beforeSend: function(request) {request.setRequestHeader('Authorization','Bearer '+localStorage.getItem('user'));},
                  success:  (data: any, status: any, xhr: any)=>{
                    this.tmpfile = null;
                                          
                  },
                  error: (jqXHR: any, textStatus: any, errorThrown: any)=> {
                    alert(textStatus + ' - ' + errorThrown);
                    this.tmpfile = null;
                  }
                })

                                  
              },
              error: (jqXHR: any, textStatus: any, errorThrown: any) =>{
                alert(textStatus + ' - ' + errorThrown);
                this.tmpfile = null;
              }
            })

          }            
          
          commit(true);                  
        },
        error:(jqXHR: any, textStatus: any, errorThrown: any)=> {
          alert(textStatus + ' - ' + errorThrown);
          this.tmpfile = null;
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

    deleterow: (rowindex: any, commit: any) => {
      $.ajax({
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        url: this.sg['SERVICE_URL'] + 'RejestrBWIP/DeleteSprawy/' + rowindex,
        //data: t,
        type: 'POST',
        beforeSend: function(request) {request.setRequestHeader('Authorization','Bearer '+localStorage.getItem('user'));},
        success: function (data: any, status: any, xhr: any) {              
          commit(true);     
            
        },
        error: function (jqXHR: any, textStatus: any, errorThrown: any) {
          alert(textStatus + ' - ' + errorThrown);
          commit(false);
        }
      });
    },


  };

  dataAdapterSprawy = new $.jqx.dataAdapter(this.sourceSprawy,
    {beforeSend: function (jqXHR, settings) {jqXHR.setRequestHeader('Authorization','Bearer '+localStorage.getItem('user'));},
    // formatData: function (data: any) {
    //   return data;
    // }
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
    sortable: true,
    autorowheight: true,
    autoheight: true,
    altrows: true,
    enabletooltips: false,
    theme: 'metro',

    source: this.dataAdapterSprawy,
    pageable: true,
    virtualmode: true,
    rendergridrows: function(data)
    {
        return data.data;
    },
  };

  
  rodzajeWniosku=[{a:'cło',
  b:'podatek od wartości dodanej VAT',
  c:'podatek akcyzowy',
  d:'podatek od dochodu lub kapitału',
  e:'podatek od składek ubezpieczeniowych',
  f:'podatek od spadków i darowizn',
  g:'krajowe podatki i należności od nieruchomości, inne niż wymienione powyżej',
  h:'krajowe podatki i należności związane z użytkowaniem lub własnością środków transportu',
  i:'inne podatki i należności pobierane przez (wnioskujące) państwo lub w jego imieniu',
  j:'podatki i należności pobierane przez jednostki podziału terytorialnego lub administracyjnego (wnioskującego) państwa lub w ich imieniu, z wyjątkiem podatków i należności pobieranych przez organy lokalne',
  k:'podatki i należności pobierane przez organy lokalne lub w ich imieniu',
  l:'inne wierzytelności podatkowe',
  m:'opłaty rolne (kwoty objęte art 2 ust. 1 lit. b) i c) dyrektywy 2010/24/UE)'}]

  rodzawnioskucellsrenderer = (row: number, columnfield: string, value: string , defaulthtml: string, columnproperties: any, rowdata: any): string => {
 
    let content:string="";
    value.split(',').forEach(el=>{
      if(el.trim().toLowerCase().length>0)
        content +=el.trim().toLowerCase()+" - "+this.rodzajeWniosku[0][el.trim().toLowerCase()]+'<br>';
    })

    return '<div class="jqx-grid-cell-left-align" style="margin-top: 6px;">'+content+'</div>';
    
  };

  columnsSprawy: any[] =
  [
    { text: 'Id', datafield: 'id',  width: 120},
    { text: 'Nazwa', datafield: 'nazwa',  width: 150},
    { text: 'Identyfikator', datafield: 'identyfikator',  width: 120},
    { text: 'Adres', datafield: 'adres', width:200 },
    { text: 'Od kogo', datafield: 'odKogo',  },
    { text: 'Do kogo', datafield: 'doKogo',  },
    { text: 'Typ', datafield: 'typ',  },
    { text: 'Rodzaj wniosku', datafield: 'rodzWniosku', cellsrenderer: this.rodzawnioskucellsrenderer },
    { text: 'Nr BWIP', datafield: 'nrBwip',  },
    { text: 'Nr SZD', datafield: 'nrSzd',  },
    { text: 'Rodzaj należności', datafield: 'rodzNaleznosci',  },
    { text: 'Całkowita kwota', datafield: 'calkowitaKwota',  },
    { text: 'Termin odpowiedzi', datafield: 'terminOdpowiedzi', cellsformat:'yyyy-MM-dd', filtertype: 'date' },

  ]

  gridSprawyCellClicked(event:any):void{
    //  this.selectedRowDataSprawy = event.args.row.bounddata;  
    //  this.createObiektSprawy(this.selectedRowDataSprawy);
     this.createObiektSprawy(event.args.row.bounddata)
  }
  //#endregion

  displayFiltry: boolean =false;

  showFiltry(){
    this.displayFiltry = !this.displayFiltry;
  }

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
    this.showSprawyDitails = true;
    this.windowSprawy.title("Dodaj sprawę z pliku");
    this.windowSprawy.open();
  }

  edytuj_sprawe(){
   if(this.gridSprawy.getselectedcell()){
      this.createObiektSprawy(this.gridSprawy.getrowdata(this.gridSprawy.getselectedcell().rowindex))
      this.gridSprawyEdycja = true;
      this.sprawaZPliku = false;
      this.showSprawyDitails = true;
      this.windowSprawy.title("Edytuj sprawę");
      this.windowSprawy.open();
    }
  }

  usun_sprawe(){
    if(this.gridSprawy.getselectedcell()){
      let msg = "<b>Czy napewno chcesz usunąć sprawę </b><br>" + 
      "<b>podmiot: </b>"+this.gridSprawy.getrowdata(this.gridSprawy.getselectedcell().rowindex)['nazwa']+
      "<br><b>identyfikator: </b>"+this.gridSprawy.getrowdata(this.gridSprawy.getselectedcell().rowindex)['identyfikator'];
      //"<br><b>numer: </b>"+this.gridSprawy.getrowdata(this.gridSprawy.getselectedcell().rowindex)['nazwa'];
      this.showquestionWindow(msg, true,"Tak",true,"Nie", "Kasowanie sprawy").then((result:any)=>{
        if(result.OK)
          this.gridSprawy.deleterow(this.gridSprawy.getrowdata(this.gridSprawy.getselectedcell().rowindex)['id']);
      });
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
    this.tmpfile = null;
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

  tmpfile: any =null;
  uploadFile(event) {
    let files = event.target.files;
    if (files.length > 0) {
    
      var formData = new FormData();

      $.each(files, function(key, value)
      {
         formData.append(key.toString(), value);

         //console.log(value)

        //  var fs = Xml.Parser();
        //  fs.readFile(value,)
      });


      if(files[0].name.toString().includes('xml')){
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
          var fs = Xml.Parser();
          fs.parseString(fileReader.result, (err, res)=>{
            
            this.obiektSprawy.nazwa=res.RequestForRecoveryV2Message.Body[0].FormData[0].Request[0].SectionInformationAboutPersonConcerned[0].IsNaturalPersonOrLegalEntity[0]['ns2:LegalEntity'][0]['ns2:CompanyName'][0];
            
            this.obiektSprawy.identyfikator=res.RequestForRecoveryV2Message.Body[0].FormData[0].Request[0].SectionInformationAboutPersonConcerned[0].IsNaturalPersonOrLegalEntity[0]['ns2:LegalEntity'][0]['ns2:TaxIdentificationNumberApplicantMs'][0];
            
            this.obiektSprawy.adres='ulica:'+res.RequestForRecoveryV2Message.Body[0].FormData[0].Request[0].SectionInformationAboutPersonConcerned[0].IsNaturalPersonOrLegalEntity[0]['ns2:LegalEntity'][0]['ns2:Address'][0]['ns2:StreetAndNumber'][0]+
              ', miasto:'+res.RequestForRecoveryV2Message.Body[0].FormData[0].Request[0].SectionInformationAboutPersonConcerned[0].IsNaturalPersonOrLegalEntity[0]['ns2:LegalEntity'][0]['ns2:Address'][0]['ns2:PostcodeAndTown'][0];

            this.obiektSprawy.odKogo=res.RequestForRecoveryV2Message.Body[0].FormData[0].CompetentAuthorities[0]['ns2:MSofApplicant'][0]['ns2:Identification'][0]['ns2:Country'][0]['ns2:ISOCode'][0];

            this.obiektSprawy.doKogo=res.RequestForRecoveryV2Message.Body[0].FormData[0].CompetentAuthorities[0]['ns2:MSofRequested'][0]['ns2:Identification'][0]['ns2:Country'][0]['ns2:ISOCode'][0];

            this.obiektSprawy.calkowitaKwota = Number(res.RequestForRecoveryV2Message.Body[0].FormData[0].Request[0].Claim[0].ClaimDescription[0]['ns2:PrincipalAmount'][0]['ns2:InitiallyDue'][0])+
              Number(res.RequestForRecoveryV2Message.Body[0].FormData[0].Request[0].Claim[0].ClaimDescription[0]['ns2:Interests'][0]['ns2:InitiallyDue'][0]);
          
            let typ = res.RequestForRecoveryV2Message.Body[0].MetaData[0].Reference[0].Reference[0].split('_');
            this.obiektSprawy.typ = typ[typ.length-1];
            // rodzaj wniosku
            var taxlist = ['a','b','c','d','e','f','g','h','i','j','k','l','m'];

            for(let a in taxlist)
              this.obiektSprawy.rodzWniosku += res.RequestForRecoveryV2Message.Body[0].FormData[0].FormHeader[0].TaxList[0]['ns2:'+taxlist[a]][0]=='true'?taxlist[a]+",":"";
    
            this.obiektSprawy.nrBwip = res.RequestForRecoveryV2Message.Body[0].FormData[0].CompetentAuthorities[0]['ns2:MSofRequested'][0]['ns2:Identification'][0]['ns2:FileReference'][0];
              
            
          })
          //console.log(fileReader.result);
        }
        fileReader.readAsText(files[0]);
      }


      $("#fileuploadprogress").html("");

      let z = true;
      if(z)
      $.ajax({
        context: this,
        url: this.sg['SERVICE_URL'] + 'RejestrBWIP/AddPliki',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,      
        cache: false,        
        dataType: 'json',
        beforeSend: function(request) {request.setRequestHeader('Authorization','Bearer '+localStorage.getItem('user'));},
        xhr: function() {
          var xhr = new XMLHttpRequest();
      
          xhr.upload.addEventListener("progress", function(evt) {
            if (evt.lengthComputable) {
              var percentComplete = evt.loaded / evt.total;             
              percentComplete = Math.trunc(percentComplete * 100);
         
              //console.log(percentComplete);
              $("#fileuploadprogress").html('<div style="width:'+percentComplete+'%; background-color:skyblue; color:white"><center>'+percentComplete+'</center></div>');

              if (percentComplete >= 100) {
                $("#fileuploadprogress").html("");
              }
      
            }
          }, false);
      
          return xhr;
        },

        success: function (data: any, status: any, xhr: any) {

            this.tmpfile = data;
              // let upid = this.selectedRowData['id']===0?0:this.selectedRowData['id']; 
              // var newplik = {"id":data.id,"id_upowaznienia":upid, "idPliku":data.idPliku , "nazwa":files[0].name};

              // if(this.pliki!=null)
              //   this.pliki.push(newplik); 
              // else 
              // {
              //   this.pliki = new Array();
              //   this.pliki.push(newplik);             
              // }

        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            alert('error ERRORS: ' + textStatus);
        }

      });
    }
  }
  //#endregion


  //#region zdarzenia 

  //#region grid_zdarzenia */
    sourceZdarzenia={
      datatype: 'json',
  
      datafields:[
        {name: 'id'},
        {name: 'idSprawy', type:'string'},
        {name: 'dataWejscia', type:'date'},
        {name: 'dataWyjscia', type:'date'},
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


      filter: ()=>{
        // update the grid and send a request to the server.
        this.gridZdarzenia.updatebounddata();  
      },
  
      sort: ()=>{
        this.gridZdarzenia.updatebounddata();  
      },  
  
      addrow: (rowid: any, rowdata: any, position: any, commit: any) => {   
        const t = JSON.stringify(rowdata);
        $.ajax({
          cache: false,
          dataType: 'json',
          contentType: 'application/json',
          url: this.sg['SERVICE_URL'] + 'RejestrBWIP/AddZdarzenia',
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
        console.log(t);
        $.ajax({
          cache: false,
          dataType: 'json',
          contentType: 'application/json',
          url: this.sg['SERVICE_URL'] + 'RejestrBWIP/UpdateZdarzenia/' + rowdata.id,
          data: t,
          type: 'PUT',
          beforeSend: function(request) {request.setRequestHeader('Authorization','Bearer '+localStorage.getItem('user'));},
          success:  (data: any, status: any, xhr: any)=> {              
            commit(true);           
          },
          error: function (jqXHR: any, textStatus: any, errorThrown: any) {
            alert(textStatus + ' - ' + errorThrown);
            commit(false);
          }
        });
      },
  
      deleterow: (rowindex: any, commit: any) => {
        $.ajax({
          cache: false,
          dataType: 'json',
          contentType: 'application/json',
          url: this.sg['SERVICE_URL'] + 'RejestrBWIP/DeleteZdarzenia/' + rowindex,
          //data: t,
          type: 'POST',
          beforeSend: function(request) {request.setRequestHeader('Authorization','Bearer '+localStorage.getItem('user'));},
          success: function (data: any, status: any, xhr: any) {              
            commit(true);     
              
          },
          error: function (jqXHR: any, textStatus: any, errorThrown: any) {
            alert(textStatus + ' - ' + errorThrown);
            commit(false);
          }
        });
      },
    };
  
    dataAdapterZdarzenia = new $.jqx.dataAdapter(this.sourceZdarzenia,
      {formatData: (data)=> {
        $.extend(data, {
          id: this.gridSprawy.getselectedcell()?this.gridSprawy.getrowdata(this.gridSprawy.getselectedcell().rowindex)['id']:0    
        });
        return data;
      },
        
        beforeSend: function (jqXHR, settings) {jqXHR.setRequestHeader('Authorization','Bearer '+localStorage.getItem('user'));}},     );
  
  
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
      autoheight: false,
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
      { text: 'Data odebrania', datafield: 'dataWejscia',  width: 120, type: 'date', cellsformat:'yyyy-MM-dd', filtertype: 'date'},
      { text: 'Data wysłania', datafield: 'dataWyjscia',  width: 120, type: 'date',cellsformat:'yyyy-MM-dd',filtertype: 'date'},
      { text: 'Odpowiedź', datafield: 'odpowiedz'},
  
    ]

  
    //#endregion

  

  dodaj_zdarzenie(){  
    if(this.gridSprawy.getselectedcell()){
      this.createObiektZdarzenia();
      this.obiektZdarzenia.idSprawy = this.gridSprawy.getrowdata(this.gridSprawy.getselectedcell().rowindex)['id'];
      this.windowZdarzenia.title("Dodaj zdarzenie");
      this.windowZdarzenia.open();
    }
  }

  edytuj_zdarzenie(){
    if(this.gridZdarzenia.getselectedcell()){
      this.createObiektZdarzenia(this.gridZdarzenia.getrowdata(this.gridZdarzenia.getselectedcell().rowindex))
      this.gridZdarzeniaEdycja = true;
      // this.sprawaZPliku = false;
      // this.showSprawyDitails = true;
      this.windowZdarzenia.title("Edytuj zdarzenie");
      this.windowZdarzenia.open();
    }
  }

  usun_zdarzenie(){
    if(this.gridZdarzenia.getselectedcell()){
      let msg = "<b>Czy napewno chcesz usunąć zdarzenie wraz z dołączonymi dokumentami?</b><br><br><br>" + 
      "<b>odpowiedź: </b>"+this.gridZdarzenia.getrowdata(this.gridZdarzenia.getselectedcell().rowindex)['odpowiedz'];
      this.showquestionWindow(msg, true,"Tak",true,"Nie", "Kasowanie zdarzenia").then((result:any)=>{
        if(result.OK)
          this.gridZdarzenia.deleterow(this.gridZdarzenia.getrowdata(this.gridZdarzenia.getselectedcell().rowindex)['id']);
      });
    }
  }

  createObiektZdarzenia(row?:any){
    this.obiektZdarzenia={
      id:row?row.id:0,
      idSprawy:row?row.idSprawy:null,
      dataWejscia:row?row.dataWejscia:null,
      dataWyjscia:row?row.dataWyjscia:null,
      odpowiedz:row?row.odpowiedz:null,
      sysdate:row?row.sysdate:null,
    }
  }

  gridZdarzeniaEdycja: boolean = false;

  windowZdarzeniaOK(){    
    if(this.gridZdarzeniaEdycja)
      this.gridZdarzenia.updaterow(this.gridZdarzenia.getrowid(this.gridZdarzenia.getselectedcell().rowindex), this.obiektZdarzenia);      
    else
      this.gridZdarzenia.addrow(0,this.obiektZdarzenia,'top');  

    this.windowZdarzenia.close();
    // this.showSprawyDitails = false;
    // this.sprawaZPliku = false;
    this.gridZdarzeniaEdycja = false;
  }

  windowZdarzeniaCancel(){
    this.windowZdarzenia.close();
    this.createObiektZdarzenia();
    // this.showSprawyDitails = false;
    // this.sprawaZPliku = false;
    this.gridZdarzeniaEdycja = false;
  }

  //#endregion

  //#region pliki
  //#region grid_pliki */

   sourcePliki={
    datatype: 'json',

    datafields:[
      {name: 'id'},     
      {name: 'nazwa', type:'string'},

    ],
    id:'id',
    url: this.sg['SERVICE_URL']+'RejestrBWIP/GetPliki',

    root: 'rows', 
    beforeprocessing: function(data){
      this.totalrecords= data.totalRows;    
    },
  };

  dataAdapterPliki = new $.jqx.dataAdapter(this.sourcePliki,
    {formatData: (data)=> {
      $.extend(data, {
        id: ()=>{try{ return parseInt(this.gridZdarzenia.getrowdata(this.gridZdarzenia.getselectedcell().rowindex)['id']);}catch(err){ return 0}}
      });
      return data;
    },
    beforeSend: function (jqXHR, settings) {jqXHR.setRequestHeader('Authorization','Bearer '+localStorage.getItem('user'));}
  });


  gridoptionsPliki: jqwidgets.GridOptions ={    
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
    autoheight: false,
    altrows: true,
    enabletooltips: false,
    
    columnsheight:30,
    theme: 'metro',

    source: this.dataAdapterPliki,
    pageable: true,

    virtualmode: true,
    rendergridrows: function(data)
    {
        return data.data;
    },
  };

  
  columnsPliki: any[] =
  [
    { text: 'Nazwa', datafield: 'nazwa'},
  ]

  //#endregion


  createObiektPliki(row?:any){
    this.obiektPliki={
      id:row?row.id:0,
      idZdarzenia:row?row.idZdarzenia:null,
      nazwa:row?row.nazwa:null,
      typ:row?row.typ:null,
      dane:row?row.dane:null,
      status:row?row.status:null,
      sysdate:row?row.sysdate:"",
    }
  }
  //#endregion

  questionWindowParams={'message':'', 'byes':true, 'byesval':'Tak', 'bno':true, 'bnoval':'Nie'};
  showquestionWindow(message: string='', byes:boolean=true, byesval:string='Tak', bno:boolean=true, bnoval:string='Nie', title:string="Pytanie" ){return new Promise((resolve, reject)=> {
      this.questionWindowParams = {'message':message, 'byes':byes, 'byesval':byesval, 'bno':bno, 'bnoval':bnoval};
      this.questionWindow.title(title);
      this.questionWindow.open();
      let sub = this.questionWindow.onClose.subscribe((event:any)=>{
        //console.log(event.args.dialogResult);
        //this.questionMessage = null;
        sub.unsubscribe();  
        resolve(event.args.dialogResult);
      })    
    });
  }


}

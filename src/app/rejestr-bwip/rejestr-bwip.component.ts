import { Component, OnInit , ViewChild,AfterViewInit} from '@angular/core';
import { SimpleGlobal } from 'ng2-simple-global';
import { HTTP_INTERCEPTORS, HttpClient,  } from '@angular/common/http';

import { jqxGridComponent } from 'jqwidgets-ts/angular_jqxgrid';
import { jqxWindowComponent } from 'jqwidgets-ts/angular_jqxwindow';

import { DomSanitizer} from '@angular/platform-browser';



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
  @ViewChild('jqxwindowPDF') jqxwindowPDF: jqxWindowComponent;
  @ViewChild('jqxwindowFileUpload') jqxwindowFileUpload: jqxWindowComponent;


  @ViewChild('questionWindow') questionWindow: jqxWindowComponent;

  obiektSprawy: any;
  obiektZdarzenia: any;
  obiektPliki: any;
  sprawaZPliku: boolean=false;
  fileUrl:any=null

  constructor( private sg: SimpleGlobal, public http: HttpClient,private sanitizer: DomSanitizer) { }

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

    this.questionWindow.createWidget({
      width: 350, height: 330, theme: 'metro',
      resizable: false, isModal: true, autoOpen: false, modalOpacity: 0.5,
      
    });

    this.jqxwindowFileUpload.createWidget({
      theme: 'metro', resizable: false, isModal: true, autoOpen: false, modalOpacity: 0.5,
      
    });

    this.jqxwindowPDF.createWidget({
      width: 450, height: 530, theme: 'metro',
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
        { text: 'Nr BWIP', datafield: 'nrBwip',  },
        { text: 'Id', datafield: 'id',  width: 120, hidden: true},
        { text: 'Nazwa', datafield: 'nazwa',  width: 150},
        { text: 'Identyfikator', datafield: 'identyfikator',  width: 120},
        { text: 'Adres', datafield: 'adres', width:200 },
        { text: 'Od kogo', datafield: 'odKogo',  },
        { text: 'Do kogo', datafield: 'doKogo',  },
        { text: 'Typ', datafield: 'typ',  },
        { text: 'Rodzaj wniosku', datafield: 'rodzWniosku', cellsrenderer: this.rodzawnioskucellsrenderer },       
        { text: 'Nr SZD', datafield: 'nrSzd',  },
        { text: 'Rodzaj należności', datafield: 'rodzNaleznosci',  },
        { text: 'Całkowita kwota', datafield: 'calkowitaKwota',  },
        { text: 'Termin odpowiedzi', datafield: 'terminOdpowiedzi', cellsformat:'yyyy-MM-dd', filtertype: 'date' },

        // { text: 'Data wplywu' },
        // { text: 'Od kogo', datafield: 'odKogo',  },
        // { text: 'Do kogo', datafield: 'doKogo',  },
        // { text: 'Urząd'  },
        // { text: 'Rodzaj wniosku', datafield: 'rodzWniosku', cellsrenderer: this.rodzawnioskucellsrenderer },   
        // { text: 'Nr BWIP', datafield: 'nrBwip',  },     
        // { text: 'Nr SZD', datafield: 'nrSzd',  },
        // { text: 'Id', datafield: 'id',  width: 120, hidden: true},
        // { text: 'Nazwa', datafield: 'nazwa',  width: 150},
        // { text: 'Rodzaj należności'  },       
        // { text: 'Całkowita kwota', datafield: 'calkowitaKwota',  },
        // { text: 'Termin odpowiedzi', datafield: 'terminOdpowiedzi', cellsformat:'yyyy-MM-dd', filtertype: 'date' },
        
  
     ,

   

      ]

      gridSprawyCellClicked(event:any):void{
        //  this.selectedRowDataSprawy = event.args.row.bounddata;  
        //  this.createObiektSprawy(this.selectedRowDataSprawy);
        this.createObiektSprawy(event.args.row.bounddata)
      };
    //#endregion

  displayFiltry: boolean =false;

  showFiltry(){
    this.displayFiltry = !this.displayFiltry;
  };

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
            if(res.RequestForRecoveryV2Message){
              res = res.RequestForRecoveryV2Message;
              //this.obiektSprawy.nazwa=res.RequestForRecoveryV2Message.Body[0].FormData[0].Request[0].SectionInformationAboutPersonConcerned[0].IsNaturalPersonOrLegalEntity[0]['ns2:LegalEntity'][0]['ns2:CompanyName'][0];
              this.obiektSprawy.nazwa=this.readXMLVal('Body;FormData;Request;SectionInformationAboutPersonConcerned;IsNaturalPersonOrLegalEntity;ns2:LegalEntity;ns2:CompanyName', res);
              
              //this.obiektSprawy.identyfikator=res.RequestForRecoveryV2Message.Body[0].FormData[0].Request[0].SectionInformationAboutPersonConcerned[0].IsNaturalPersonOrLegalEntity[0]['ns2:LegalEntity'][0]['ns2:TaxIdentificationNumberApplicantMs'][0];
              this.obiektSprawy.identyfikator=this.readXMLVal('Body;FormData;Request;SectionInformationAboutPersonConcerned;IsNaturalPersonOrLegalEntity;ns2:LegalEntity;ns2:TaxIdentificationNumberApplicantMs',res);
              
              // this.obiektSprawy.adres='ulica:'+res.RequestForRecoveryV2Message.Body[0].FormData[0].Request[0].SectionInformationAboutPersonConcerned[0].IsNaturalPersonOrLegalEntity[0]['ns2:LegalEntity'][0]['ns2:Address'][0]['ns2:StreetAndNumber'][0]+
              //   ', miasto:'+res.RequestForRecoveryV2Message.Body[0].FormData[0].Request[0].SectionInformationAboutPersonConcerned[0].IsNaturalPersonOrLegalEntity[0]['ns2:LegalEntity'][0]['ns2:Address'][0]['ns2:PostcodeAndTown'][0];
              this.obiektSprawy.adres='ulica:'+this.readXMLVal('Body;FormData;Request;SectionInformationAboutPersonConcerned;IsNaturalPersonOrLegalEntity;ns2:LegalEntity;ns2:Address;ns2:StreetAndNumber',res)+
              ', miasto:'+this.readXMLVal('Body;FormData;Request;SectionInformationAboutPersonConcerned;IsNaturalPersonOrLegalEntity;ns2:LegalEntity;ns2:Address;ns2:PostcodeAndTown',res);


              //this.obiektSprawy.odKogo=res.RequestForRecoveryV2Message.Body[0].FormData[0].CompetentAuthorities[0]['ns2:MSofApplicant'][0]['ns2:Identification'][0]['ns2:Country'][0]['ns2:ISOCode'][0];
              this.obiektSprawy.odKogo=this.readXMLVal('Body;FormData;CompetentAuthorities;ns2:MSofApplicant;ns2:Identification;ns2:Country;ns2:ISOCode',res);


              //this.obiektSprawy.doKogo=res.RequestForRecoveryV2Message.Body[0].FormData[0].CompetentAuthorities[0]['ns2:MSofRequested'][0]['ns2:Identification'][0]['ns2:Country'][0]['ns2:ISOCode'][0];
              this.obiektSprawy.doKogo=this.readXMLVal('Body;FormData;CompetentAuthorities;ns2:MSofRequested;ns2:Identification;ns2:Country;ns2:ISOCode',res);

              // this.obiektSprawy.calkowitaKwota = Number(res.RequestForRecoveryV2Message.Body[0].FormData[0].Request[0].Claim[0].ClaimDescription[0]['ns2:PrincipalAmount'][0]['ns2:InitiallyDue'][0])+
              //   Number(res.RequestForRecoveryV2Message.Body[0].FormData[0].Request[0].Claim[0].ClaimDescription[0]['ns2:Interests'][0]['ns2:InitiallyDue'][0]);
              this.obiektSprawy.calkowitaKwota = Number(this.readXMLVal('Body;FormData;Request;Claim;ClaimDescription;ns2:PrincipalAmount;ns2:InitiallyDue',res))+
                Number(this.readXMLVal('Body;FormData;Request;Claim;ClaimDescription;ns2:Interests;ns2:InitiallyDue',res));
            
              let typ = this.readXMLVal('Body;MetaData;Reference;Reference',res).split('_');
              this.obiektSprawy.typ =typ.length>1? typ[typ.length-1]:'';
              // rodzaj wniosku
              var taxlist = ['a','b','c','d','e','f','g','h','i','j','k','l','m'];

              if(this.readXMLVal('Body;FormData;FormHeader;TaxList',res)!=null)
              for(let a in taxlist)
                this.obiektSprawy.rodzWniosku += res.Body[0].FormData[0].FormHeader[0].TaxList[0]['ns2:'+taxlist[a]][0]=='true'?taxlist[a]+",":"";
      
              this.obiektSprawy.nrBwip = this.readXMLVal('Body;FormData;CompetentAuthorities;ns2:MSofRequested;ns2:Identification;ns2:FileReference',res);
              
            
            }
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

  readXMLVal(path: string, file: any){

    var node=file;
    var rez=null;
    try{
    path.split(';').forEach((leaf)=>{      
      node = node[leaf][0]; 
    });
    rez = node;
    }

    catch(ex){
      console.log('Błąd przetawrzania pliku xml');
      console.log(node);
      console.log('Otrzymany błąd systemu:')
      console.log(ex);
    }

    return rez;
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
  
      // { text: 'Data wejscia', datafield: 'dataWejscia',  width: 120, type: 'date', cellsformat:'yyyy-MM-dd', filtertype: 'date'},
      // { text: 'Data wyjscia', datafield: 'dataWyjscia',  width: 120, type: 'date',cellsformat:'yyyy-MM-dd',filtertype: 'date'},
      // { text: 'Kwota całkowita'},
      // { text: 'Informacje'},


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
      {name: 'idZdarzenia'},  
      {name: 'dane'},  
      {name: 'nazwa', type:'string'},
      {name: 'typ', type:'string'}

    ],
    id:'id',
    url: this.sg['SERVICE_URL']+'RejestrBWIP/GetPliki',

    deleterow: (rowindex: any, commit: any) => {
      $.ajax({
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        url: this.sg['SERVICE_URL'] + 'RejestrBWIP/DeletePliki/' + rowindex,
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
    
    filterable: false,
    
    autorowheight: true,
    autoheight: false,
    //altrows: true,
    enabletooltips: false,
    pageable:true,
    
    columnsheight:30,
    theme: 'metro',

    source: this.dataAdapterPliki,
  };

  
  columnsPliki: any[] =
  [
    { text: 'Nazwa', datafield: 'nazwa'},
    { text: 'Typ', datafield: 'typ'},
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

  dodaj_plik(){
    if(this.gridZdarzenia.getselectedcell()){

      this.jqxwindowFileUpload.title("Dodaj plik");
      this.jqxwindowFileUpload.open();
    
      this.createObiektPliki();
      this.obiektPliki.idZdarzenia = this.gridZdarzenia.getrowdata(this.gridZdarzenia.getselectedcell().rowindex)['id']

    }
  }

  usun_plik(){
    if(this.gridPliki.getselectedcell()){
      let msg = "<b>Czy napewno chcesz usunąć plik </b><br>" + 
 
      "<br><b>nazwa: </b>"+this.gridPliki.getrowdata(this.gridPliki.getselectedcell().rowindex)['nazwa'];
      this.showquestionWindow(msg, true,"Tak",true,"Nie", "Kasowanie pliku").then((result:any)=>{
        if(result.OK)
          this.gridPliki.deleterow(this.gridPliki.getrowdata(this.gridPliki.getselectedcell().rowindex)['id']);
      });
    }

  }

  pobierz_plik(){       
    if(this.gridPliki.getselectedcell()){
        const datarow = this.gridPliki.getrowdata(this.gridPliki.getselectedcell().rowindex);
  
        if(datarow==null)
          return;


        let basePlikiurl = this.sg['SERVICE_URL'] + 'RejestrBWIP/DownloadPliki/'+datarow.id;   
  
        var xhr = new XMLHttpRequest();      
        xhr.open('GET', basePlikiurl);
        xhr.setRequestHeader('Authorization','Bearer '+localStorage.getItem('user')); 
        xhr.onreadystatechange = ()=>{      
          if (xhr.readyState ==4) {         
            if (xhr.status === 200) {
  
              var file = new Blob([xhr.response], {type: "application/"+datarow.typ});
                      
              if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveOrOpenBlob(file,datarow.nazwa);
              } 
              else {   
                if(datarow.typ==='pdf'){
                  this.fileUrl =this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));  
                  this.jqxwindowPDF.title(datarow.nazwa);
                  this.jqxwindowPDF.open();         
                }
                else{
                  var link = document.createElement('a');
                  link.href = window.URL.createObjectURL(file);
                  link.download = datarow.nazwa;    
                  document.body.appendChild(link);    
                  link.click();    
                  document.body.removeChild(link);    
                }
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
    }
  }

  zaladuj_plik(event){
    let files = event.target.files;
    if (files.length > 0) {
    
      var formData = new FormData();

      $.each(files, function(key, value)
      {
         formData.append(key.toString(), value);
        //  var fs = Xml.Parser();
        //  fs.readFile(value,)
      });

     


      $("#fileuploadprogresspliki").html("");

      $.ajax({
        context: this,
        url: this.sg['SERVICE_URL'] + 'RejestrBWIP/UploadPliki/'+this.obiektPliki.idZdarzenia,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,      
        cache: false,        
        dataType: 'json',
        beforeSend: function(request) {request.setRequestHeader('Authorization','Bearer '+localStorage.getItem('user'));},
        xhr: () =>{
          var xhr = new XMLHttpRequest();
      
          xhr.upload.addEventListener("progress", (evt)=> {
            if (evt.lengthComputable) {
              var percentComplete = evt.loaded / evt.total;             
              percentComplete = Math.trunc(percentComplete * 100);

              $("#fileuploadprogresspliki").html('<div style="width:'+percentComplete+'%;height:20px; background-color:skyblue; color:white;text-align: center;font-size: 14px;">'+percentComplete+'</div>');

           
              this.gridPliki.updatebounddata();
            }
          }, false);
      
          return xhr;
        },

        success: function (data: any, status: any, xhr: any) {
          $("#fileuploadprogresspliki").html('<div style="width:100%;height:20px; background-color:#1bd462; color:white; text-align: center;font-size: 14px;">100</div>');          
          this.gridPliki.updatebounddata();
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            alert('error ERRORS: ' + textStatus);
        }

      });
    }
  }

  closezaladujPliki(){
    $('#file-fieldUpload').val('');
    $("#fileuploadprogresspliki").html("");
    this.jqxwindowFileUpload.close();    
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

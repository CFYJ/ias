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
  @ViewChild('questionWindow') questionWindow: jqxWindowComponent;

  obiektSprawy: any;
  sprawaZPliku: boolean=false;

  constructor( private sg: SimpleGlobal, public http: HttpClient,) { }

  odpowiedz: string='zzz';
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

    this. questionWindow.createWidget({
      width: 350, height: 330, theme: 'metro',
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
    sortable: true,
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
      { text: 'Data odebrania', datafield: 'dataWejscia',  width: 120},
      { text: 'Data wysłania', datafield: 'dataWyjscia',  width: 150},
      { text: 'Odpowiedź', datafield: 'odpowiedz'},
  
    ]

    gridZdarzeniaCellClicked(event:any):void{

      console.log(event.args.row.bounddata.id)
        this.selectedZdarzenieID =  event.args.row.bounddata.id;
        this.gridPliki.updatebounddata();
   
    }
  
    //#endregion

  //#region zdarzenia 


  //#endregion

  //#region grid_pliki */

   selectedZdarzenieID:any =0;

   sourcePliki={
    datatype: 'json',

    datafields:[
      {name: 'id'},     
      {name: 'nazwa', type:'string'},

    ],
    id:'id',
    url: this.sg['SERVICE_URL']+'RejestrBWIP/GetPliki',
    data:{
      id:this.selectedZdarzenieID
    },

    root: 'rows', 
    beforeprocessing: function(data){
      this.totalrecords= data.totalRows;    
    },
  };

  dataAdapterPliki = new $.jqx.dataAdapter(this.sourcePliki,
    {formatData: (data)=> {
      $.extend(data, {
        id: this.selectedZdarzenieID
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

  uploadFile(event) {
    let files = event.target.files;
    if (files.length > 0) {
    
      var formData = new FormData();

      // $.each(files, function(key, value)
      // {
      //   // formData.append(key.toString(), value);

      //   console.log(value)

      //    var fs = Xml.Parser();
      //    fs.readFile(value,)
      // });



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

          
        })
        //console.log(fileReader.result);
      }
      fileReader.readAsText(files[0]);



      $("#fileuploadprogress").html("");

      let z = false;
      if(z)
      $.ajax({
        context: this,
        url: this.sg['SERVICE_URL'] + 'RejestrBWIP/FileUpload',
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

              let upid = this.selectedRowData['id']===0?0:this.selectedRowData['id']; 
              var newplik = {"id":data.id,"id_upowaznienia":upid, "idPliku":data.idPliku , "nazwa":files[0].name};

              if(this.pliki!=null)
                this.pliki.push(newplik); 
              else 
              {
                this.pliki = new Array();
                this.pliki.push(newplik);             
              }

        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            alert('error ERRORS: ' + textStatus);
        }

      });
    }
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

//#region importy
import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy, AfterContentInit  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';
import { jqxGridComponent } from 'jqwidgets-ts/angular_jqxgrid';
import { SimpleGlobal } from 'ng2-simple-global';
import { UpowaznieniaService } from './../upowaznienia.service';
import { MessageService } from './../message.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService } from './../authentication.service';
import { jqxWindowComponent } from 'jqwidgets-ts/angular_jqxwindow';
import { jqxDateTimeInputComponent } from 'jqwidgets-ts/angular_jqxdatetimeinput';
import { jqxNotificationComponent } from 'jqwidgets-ts/angular_jqxnotification';
import { jqxButtonComponent } from 'jqwidgets-ts/angular_jqxbuttons';
import { jqxInputComponent } from 'jqwidgets-ts/angular_jqxinput';
import { jqxPanelComponent} from 'jqwidgets-ts/angular_jqxpanel';
import { jqxToolBarComponent} from 'jqwidgets-ts/angular_jqxtoolbar';
import { jqxFileUploadComponent} from 'jqwidgets-ts/angular_jqxfileupload';

import  'jqwidgets/styles/jqx.metro.css';
import  'jqwidgets/styles/jqx.darkblue.css';
import { validateConfig } from '@angular/router/src/config';

import { LinkyModule, LinkyPipe } from 'angular-linky';
//#endregion

@Component({
  selector: 'app-upowaznienia',
  templateUrl: './upowaznienia.component.html',
  styleUrls: ['./upowaznienia.component.scss'],

 
})


export class UpowaznieniaComponent implements OnInit, AfterViewInit, AfterContentInit {


  constructor(public upowaznieniaService: UpowaznieniaService,
    private authService: AuthenticationService,private messageService: MessageService,
    private sg: SimpleGlobal) 
    { 
      this.loadtelefony();
    }



  pliki: any;
  telefony: any[]=[{user:'', telefon:''}];
  message: any = 'message';
  subscription: Subscription;
  // jednostki: string[];
  initialLoad = true;
  isInsertOperation = false;

  selectedRow: any;

  basePlikiurl = this.sg['SERVICE_URL'] + 'Upowaznienia/FileDownload/';
  

  ngAfterContentInit(){
  }
  

  ngOnInit(){
    
  }

  ngAfterViewInit(): void {

    const wasl = this.upowaznieniaService;
    //this.authService.checkIfUserIsInRole("Admin_upowaznienia");
     const _self = this;
    this.myGrid.createComponent(this.options);
  

     const inputSettings: jqwidgets.InputOptions = { width: '300px', height: '25px', theme: 'darkblue' };

     
     this.editWindow.createWidget({
      width: 450, height: 530, theme: 'metro',
      resizable: false, isModal: true, autoOpen: false, modalOpacity: 0.5,
      
    });

    this.deleteWindow.createWidget({
      width: 450, height:130, theme: 'metro',
      resizable: false, isModal: true, autoOpen: false, modalOpacity: 0.5
    });


    const buttonOptions: jqwidgets.ButtonOptions = { theme: 'metro'};

    this.mySaveButton1.createComponent();
    this.myCancelButton1.createComponent();
    // this.myInsertButton1.createComponent();
    // this.myEditButton.createComponent();
   
    // this.myDelButton.createComponent();
    this.myDelYesButton.createComponent();
    this.myDelNoButton.createComponent();

    this.fDecyzja.createComponent(inputSettings);
    //this.panelMenu.createComponent();  
    if(this.authService.checkIfUserIsInRole('upowaznienia_admin') || this.authService.checkIfUserIsInRole('upowaznienia_opiekun'))
    {
      this.toolBar.createComponent();
      if(!this.authService.checkIfUserIsInRole('upowaznienia_admin'))
      {
        this.toolBar.destroyTool(0);
        this.toolBar.destroyTool(1);
        this.toolBar.disableTool(0,true);
      }
      
    }



  }


  source={
    //  datatype: 'xml',
    datatype: 'json',

    datafields:[
      {name: 'id'},
      {name: 'nazwa', type:'string'},
      {name: 'nazwa_skrocona', type:'string'},
      {name: 'wniosek_nadania_upr', type:'string'},
      {name: 'nadajacy_upr', type:'string'},
      {name: 'prowadzacy_rejestr_uzyt', type:'string'},
      {name: 'wniosek_odebrania_upr', type:'string'},
      {name: 'odbierajacy_upr', type:'string'},
      {name: 'opiekun', type:'string'},
      {name: 'adres_email', type:'string'},
      {name: 'decyzja', type:'string'},
      {name: 'uwagi', type:'string'},
      {name: 'upowaznieniaPliki', type: 'any'},
    ],
    id:'id',
    url: this.sg['SERVICE_URL']+'Upowaznienia/GetUpowaznieniaLista',

    //#region paging
    // url: this.sg['SERVICE_URL']+'Upowaznienia/GetUpowaznieniaListaPaged',
    // root: 'rows',
    // beforeprocessing: function(data)
    // {		
    //   //  var ss ="";
    //   // for(var z in data.rows.result[0])
    //   //   ss=ss+";"+z;
    //   // alert(ss);     

    //   // alert(data.rows.result[1].nazwa);

    //   this.totalrecords = data.totalRows;
    //   // this.totalrecords = data['TotalRows'];
    // },

    // filter: function () {
    //   // update the grid and send a request to the server.
    //   //$("#jqxgrid").jqxGrid('updatebounddata', 'filter');

    //   //this.myGrid.updatebounddata();
    // },

    //  sort: function () {
    //   // update the grid and send a request to the server.
    //   //$("#jqxgrid").jqxGrid('updatebounddata', 'filter');

    //   this.grid.updatebounddata();
    // },
    //#endregion

    addrow: (rowid: any, rowdata: any, position: any, commit: any) => {
      const t = JSON.stringify(rowdata);
      $.ajax({
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        url: this.sg['SERVICE_URL'] + 'Upowaznienia/AddUpowaznienia',
        data: t,
        type: 'POST',
        success: function (data: any, status: any, xhr: any) {
          //alert('Wstawiono nowy rekord - id: ' + data.id);
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

      if(this.isEditing)
      $.ajax({
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        url: this.sg['SERVICE_URL'] + 'Upowaznienia/UpdateUpowaznienia/' + rowdata.id,
        data: t,
        type: 'PUT',
        success:  (data: any, status: any, xhr: any)=> { 
          this.isEditing = false;               
          commit(true);           
        },
        error: function (jqXHR: any, textStatus: any, errorThrown: any) {
          alert(textStatus + ' - ' + errorThrown);
          commit(false);
        }
      });
    },

    deleterow: (rowindex: any, commit: any) => {
      //const t = JSON.stringify(rowdata);

      $.ajax({
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        url: this.sg['SERVICE_URL'] + 'Upowaznienia/DelUpowaznienia/' + rowindex,
        //data: t,
        type: 'POST',
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

  // dataAdapter: any = new $.jqx.dataAdapter(this.source);
  dataAdapter = new $.jqx.dataAdapter(this.source
    , {
        // formatData: function (data: any) {    
        // //alert('dataadapter formatdata');
        //   return data;      
        // },
        // beforeLoadComplete: function (records, org) {
        //   // var ss ="";
        //   // for(var z in org.rows)
        //   //   ss=ss+";"+z;
        //   // alert(ss);

         
        //    //alert(org.rows.result[0].nazwa);

        //   //return records;
        //   return org.rows.result;
        // },
        // beforeLoadComplete: (records, org) => {
        //   console.log('ddd');
        //   this.loadtelefony().then(()=>{return records;});
        // }

    }
 
  );

  
  options: jqwidgets.GridOptions ={    
    localization: {
      pagergotopagestring: 'Idź do', pagerrangestring: ' z ',
      pagershowrowsstring: 'Liczba wierszy', loadtext: 'Wczytywanie...',
      sortascendingstring: 'Sortuj rosnąco', sortdescendingstring: 'Sortuj malejąco',
      sortremovestring: 'Wyczyść sortowanie'
    },
    width:'100%',
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

    //source: this.dataAdapter,

    pageable: true,
    // virtualmode: true,    
    // rendergridrows: function(obj)
    // {
 
    //     //      var ss ="";
    //     // for(var z in obj.data[0])
    //     //   ss=ss+";"+z;
    //     // alert(ss+" "+obj.data.);

    //      //return  this.dataAdapter.records; 
    //     // alert('grid options');

    //     //this.showmyarray(true, obj.data);
   
    //   //this.testfunction();
    //   //.showmyarray(true,obj);
     
    //      return obj.data;     
    // },

  };

  //region viewchildy
  @ViewChild('gridReference') myGrid: jqxGridComponent;
  @ViewChild('jqxwindow1') editWindow: jqxWindowComponent;
  @ViewChild('jqxwindowDelete') deleteWindow: jqxWindowComponent;
  @ViewChild('decyzja') fDecyzja: jqxInputComponent;

  @ViewChild('buttonSaveReference') mySaveButton1: jqxButtonComponent;
  @ViewChild('buttonCancelReference') myCancelButton1: jqxButtonComponent;
  @ViewChild('buttonDelYesReference') myDelYesButton: jqxButtonComponent;
  @ViewChild('buttonDelNoReference') myDelNoButton: jqxButtonComponent;

  @ViewChild('upowaznieniaToolBar') toolBar: jqxToolBarComponent;

  //endregion

  tools: string ='toggleButton toggleButton toggleButton';
  initTools: any =  (type: string, index: number, tool: any, menuToolIninitialization): void => {
    // let icon = document.createElement('div');
    // if (type == "toggleButton") {
    //     icon.className = 'jqx-editor-toolbar-icon jqx-editor-toolbar-icon-arctic buttonIcon ';
    // }
    switch (index) {
      case 0:      
            tool.jqxToggleButton({ width: 120, toggled:false});
            tool.theme='darkblue';
            tool.text("Dodaj nowy");
            tool.on("click", ()=>{
              this.buttonAddClicked();

            });
            break;
      case 1:
              tool.jqxToggleButton({ width: 120, toggled:false });
              tool.text("Edytuj");
              tool.on("click", ()=>{
                this.editCellclick();
              });
              break;
      case 2:
              tool.jqxToggleButton({ width: 120, toggled:false});
              tool.text("Usuń");
              tool.on("click", ()=>{
                this.buttonDelClicked();
              });
              break;
    };
    
  };

isEditing: boolean = false;
  buttonSaveClicked(){
    // alert($('#nazwa').val());
    //console.log('wynik:'+this.editobject['nazwa']);
    let data = { id: null };
    let rowindex: number;
    if (!this.isInsertOperation) {
      rowindex =this.selectedRowId; //this.myGrid.getselectedcell().rowindex;  
      data =this.selectedRowData; //this.myGrid.getrowdata(rowindex);
    }
    const row = {
      id: data.id, 
      nazwa: this.editobject['nazwa'],//$('#nazwa').val(),
      // nazwa: this.fNazwa.val(),      
      // nazwa_skrocona: this.fNazwa_skrocona.val(),
      // wniosek_nadania_upr: this.fWniosek_nadania_upr.val(), nadajacy_upr: this.fNadajacy_upr.val(),
      // prowadzacy_rejestr_uzyt: this.fProwadzacy_rejstr_uzyt.val(), wniosek_odebrania_upr: this.fWniosek_odebrania_upr.val(),
      // odbierajacy_upr: this.fOdbierajacy_upr.val(), opiekun: this.fOpiekun.val(),
      // adres_email: this.fAdres_email.val(), decyzja: this.fDecyzja.val(), uwagi: this.fUwagi.val(), upowaznieniaPliki: this.pliki
      nazwa_skrocona: this.editobject['nazwa_skrocona'], // $('#nazwa_skrocona').val(),
      wniosek_nadania_upr:  this.editobject['wniosek_nadania_upr'],//$('#wniosek_nadania_upr').val()
      nadajacy_upr: this.editobject['nadajacy_upr'],// $('#nadajacy_upr').val(),
      prowadzacy_rejestr_uzyt: this.editobject['prowadzacy_rejestr_uzyt'],// $('#prowadzacy_rejestr_uzyt').val(),
       wniosek_odebrania_upr: this.editobject['wniosek_odebrania_upr'],// $('#wniosek_odebrania_upr').val(),
      odbierajacy_upr: this.editobject['odbierajacy_upr'],// $('#odbierajacy_upr').val(),
       opiekun: this.editobject['opiekun'],// $('#opiekun').val(),
      adres_email: this.editobject['adres_email'],// $('#adres_email').val(),
       decyzja: this.fDecyzja.val(),
        uwagi: this.editobject['uwagi'],// $('#uwagi').val(),
         upowaznieniaPliki: this.pliki
    };
 
    if (this.isInsertOperation) {
      row.id = 0;     
      this.myGrid.addrow(null, row, 'top');
    } else {   
      this.isEditing = true; 
      this.myGrid.updaterow(this.myGrid.getrowid(rowindex), row);
    }
    this.selectedRow = row;
    this.selectedRowData = row;
    //this.updateNonWidgets(this.selectedRow);
    this.isInsertOperation = false;
    $('#file-field').val('').clone(true);
    this.editWindow.close();


    this.pliki= new Array();

  }

  buttonCancelClicked() {

    if(this.isInsertOperation){
      for(let i in this.pliki)
      {
        this.deleteFile(this.pliki[i]);        
      }
      this.pliki = new Array();
    }

    this.isInsertOperation = false;
    $('#file-field').val('').clone(true);
    this.editWindow.close();
    this.pliki = new Array();

  }


  buttonAddClicked() {
    this.pliki = new Array();
    const datarow: any = {
      nazwa: '', nazwa_skrocona: '', wniosek_nadania_upr: '', nadajacy_upr: '', prowadzacy_rejestr_uzyt: '', wniosek_odebrania_upr: '',
      odbierajacy_upr: '', opiekun: '', adres_email: '', decyzja: '', uwagi: ''
    }
      ;
    // if (this.initialLoad) { this.loadDropDownValues(); }
    this.isInsertOperation = true;
    // this.myLogin.disabled(!this.authService.checkIfUserBelongsToITStaff());
    this.setEditValues(datarow);
    this.editWindow.title('Dodawanie');
    this.editWindow.open();
  }


  uploadFile(event) {
    let files = event.target.files;
    if (files.length > 0) {
    
      var formData = new FormData();
      


      $.each(files, function(key, value)
      {
        formData.append(key, value);
      });

      $.ajax({
        context: this,
        url: this.sg['SERVICE_URL'] + 'Upowaznienia/FileUpload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,      
        cache: false,        
        dataType: 'json',

        xhr: function() {
          var xhr = new XMLHttpRequest();
      
          xhr.upload.addEventListener("progress", function(evt) {
            if (evt.lengthComputable) {
              var percentComplete = evt.loaded / evt.total;
              //percentComplete = parseInt(percentComplete * 100);
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
                  
              //this.selectedRowData['upowaznieniaPliki'].push(newplik);
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
            // Handle errors here
            alert('error ERRORS: ' + textStatus);
            // STOP LOADING SPINNER
        }

      });
    }
  }

  downloadFile = function(id){
    var plikid = 1;



    var urlstring=this.sg['SERVICE_URL'] + 'Upowaznienia/FileDownload/'+plikid;

    // var link = document.createElement('iframe');
    // link.src = urlstring;    
    // document.body.appendChild(link);

 
  }

  deleteFile = function(plik: any){
    $.ajax({
      cache: false,
      dataType: 'json',
      contentType: 'application/json',
      url: this.sg['SERVICE_URL'] + 'Upowaznienia/DeleteFile/' + plik['id'],
      type: 'GET',
      success: function (data: any, status: any, xhr: any) {         
    
      },
      error: function (jqXHR: any, textStatus: any, errorThrown: any) {
        alert(textStatus + ' - ' + errorThrown);
   
      }
    });

    var index = this.pliki.indexOf(plik);
    if(index > -1)
    {
      this.pliki.splice(index, 1);
    }
  }

  editCellclick(): void {

      if(this.selectedRowId !=null){

        this.pliki = new Array();    
        if(typeof this.selectedRowData['upowaznieniaPliki'] !== 'undefined' && this.selectedRowData['upowaznieniaPliki']!== ""){    
          if(this.selectedRowData['upowaznieniaPliki'].length>0)  
           this.pliki = this.selectedRowData['upowaznieniaPliki'];


           const datarow=this.selectedRowData;
            //this.editobject = datarow;
            this.setEditValues(datarow);
            $('#file-field').val('').clone(true);
            this.editWindow.title('Edycja');
            this.editWindow.open();

           //console.log( this.editobject['nazwa']);
            
            }
      }

  }

  public selectedRowData = null;
  private selectedRowId = null;
  CellClicked(event: any): void {
      //alert( event.args.rowindex);
      this.selectedRowId = event.args.rowindex;
      this.selectedRowData = event.args.row.bounddata;   
      this.selectedRow = this.selectedRowData; 

      $('#file-field').val('').clone(true);
    
      //************* odkrywanie przyciskow tylko dla opiekuna i admina ********* */
      if(!this.authService.checkIfUserIsInRole('upowaznienia_admin') && this.authService.checkIfUserIsInRole('upowaznienia_opiekun'))
      {
        let user = this.authService.getUserData();
        
        let imie = (user['Imie']).toUpperCase();
        let nazwisko = (user['Nazwisko']).toUpperCase();

        if((this.selectedRow['opiekun']).toUpperCase().indexOf(imie+' '+nazwisko)>=0 ||
            (this.selectedRow['opiekun']).toUpperCase().indexOf(nazwisko+' '+imie)>=0)
          {
            this.toolBar.disableTool(0,false);
          }
        else
        this.toolBar.disableTool(0,true);
      }
  }


  buttonDelClicked() {
      //this.isInsertOperation = false;
      if(this.selectedRowId != null)
      {
        $('#questionTagWindow').html("Czy skasować "+this.selectedRowData.nazwa+"?");
        this.deleteWindow.title("Kasowanie rekordu");
        this.deleteWindow.open();
      }
  }
    
  buttondelnoClicked(){
      this.deleteWindow.close();
  }

  buttondelyesClicked(){
      this.myGrid.deleterow(this.selectedRowData.id);
      this.deleteWindow.close();

      this.selectedRowId = null;
      this.selectedRowData = null;

      this.selectedRow = null;
      //this.updateNonWidgets(null);
  }

  Pagechanged(){
    this.selectedRowId = null;
    this.selectedRowData = null;

    this.selectedRow = null;
  }

  plikirenderer = (row: number, column: any, value: any): string => {
    
    /*
        var basePlikiurl = this.sg['SERVICE_URL'] + 'Upowaznienia/FileDownload/';
        var urlstring= this.sg['SERVICE_URL'] + 'Upowaznienia/GetPliki/'+value;

      var f=3;
      if(f==2){
          $.post(urlstring, function(responseTxt,statusTxt,xhr)
          {  
          if(responseTxt!=null) {



            //alert(responseTxt[0]['idPliku']);
            var plikiHtml ="";
            for(var i in responseTxt)
            {

              plikiHtml=plikiHtml+'<p><a href="'+basePlikiurl+responseTxt[i]['idPliku']+'" target="_blank">'+responseTxt[i]['nazwa']+'</a></p>'

            }
            //  var rez='';
            // var t=responseTxt[0];
            // for (var i in t) {
            //   rez=rez+";"+t[i];
            // }
            //   alert(rez);

              $('#wasl_'+row).html(plikiHtml);
          }
          });
        }
      if(f==1){
        $.get(this.sg['SERVICE_URL'] + 'Upowaznienia/GetUpowaznieniaLista', function(responseTxt,statusTxt,xhr){
            var rez='';
            var t=responseTxt[0]['upowaznieniaPliki'];
            for (var i in t) {
              rez=rez+";"+i;
            }
              alert(rez);

        });

      }

      if(f==3){

      }
    */
    
    var plikiHtml='<div style=" overflow-y: auto;">';

    for(var i in value)
    {

      plikiHtml=plikiHtml+'<div style=";padding: 5px 25px;"><a href="'+this.basePlikiurl+value[i]['idPliku']+'" target="_blank" '+
      ' onMouseOver="this.style.backgroundColor=\'#4ca773\'" onMouseOut="this.style.backgroundColor=\'#2f5f44\'" '+      
      ' style="background-color: #2f5f44;color: white;padding: 5px;text-align: left;text-decoration: none;display: inline-block;min-width:100%; border-radius:5px; " >'+value[i]['nazwa']+'</a></div>'

    }

    
    return plikiHtml+"</div>";
  }

  cellsrenderer = (row: number, columnfield: string, value: string , defaulthtml: string, columnproperties: any, rowdata: any): string => {

      if( this.telefony.length>1){
  
        let res = this.getUsersTelefone(value);
        return '<div class="jqx-grid-cell-left-align" style="margin-top: 6px;">'+res+'</div>';
      }

      return '<div class="jqx-grid-cell-left-align" style="margin-top: 6px;">'+value+'</div>';
      
  };

  linkycellsrenderer = (row: number, columnfield: string, value: string , defaulthtml: string, columnproperties: any, rowdata: any): string => {
    var zz= new LinkyPipe();    
    return '<div class="jqx-grid-cell-left-align" style="margin-top: 6px;">'+zz.transform(value)+'</div>';
    
  };

  columns: any[] =
  [
    // {
    //   text: '', datafield: 'edycja', width: 50, columntype: 'button', filterable: false,
    //   cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
    //     return 'Edycja';
    //   },
    // },
    { text: 'Nazwa', datafield: 'nazwa',  width: 320},
    { text: 'Nazwa skrócona',  datafield: 'nazwa_skrocona', width: 140},
    { text: 'Opiekun', datafield: 'opiekun', 
     cellsrenderer: this.cellsrenderer,
      width: 200},
    { text: 'Adres email', datafield: 'adres_email', cellsrenderer: this.linkycellsrenderer, width: 200},
    { text: 'Decyzja', datafield: 'decyzja', cellsrenderer: this.linkycellsrenderer, minwidth: 160},         
  ];

  editobject: any;
  setEditValues(datarow: any): any{  
    //this.editobject = datarow;  
    this.editobject ={nazwa:datarow.nazwa,
       nazwa_skrocona:datarow.nazwa_skrocona, 
       wniosek_nadania_upr: datarow.wniosek_nadania_upr, 
       nadajacy_upr: datarow.nadajacy_upr,
       prowadzacy_rejestr_uzyt: datarow.prowadzacy_rejestr_uzyt,
       wniosek_odebrania_upr: datarow.wniosek_odebrania_upr,
       odbierajacy_upr: datarow.odbierajacy_upr,
       opiekun: datarow.opiekun,
       adres_email: datarow.adres_email,
       decyzja: datarow.decyzja,
       uwagi: datarow.uwagi};


    
    //this.fNazwa.val(datarow.nazwa);   
    // this.fNazwa_skrocona.val(datarow.nazwa_skrocona);
    // this.fWniosek_nadania_upr.val(datarow.wniosek_nadania_upr);
    // this.fNadajacy_upr.val(datarow.nadajacy_upr);
    // this.fProwadzacy_rejstr_uzyt.val(datarow.prowadzacy_rejestr_uzyt);
    // this.fWniosek_odebrania_upr.val(datarow.wniosek_odebrania_upr);
    // this.fOdbierajacy_upr.val(datarow.odbierajacy_upr);
    // this.fOpiekun.val(datarow.opiekun);
    // this.fAdres_email.val(datarow.adres_email);
    // this.fDecyzja.val(datarow.decyzja);
    // this.fUwagi.val(datarow.uwagi);
   
    // $('#nazwa').val(datarow.nazwa) ;
    // $('#nazwa_skrocona').val(datarow.nazwa_skrocona);
    // $('#wniosek_nadania_upr').val(datarow.wniosek_nadania_upr);
    // $('#nadajacy_upr').val(datarow.nadajacy_upr);
    // $('#prowadzacy_rejestr_uzyt').val(datarow.prowadzacy_rejestr_uzyt);
    // $('#wniosek_odebrania_upr').val(datarow.wniosek_odebrania_upr);
    // $('#odbierajacy_upr').val(datarow.odbierajacy_upr);
    // $('#opiekun').val(datarow.opiekun);
    // $('#adres_email').val(datarow.adres_email);
    this.fDecyzja.val(datarow.decyzja);
    // $('#uwagi').val(datarow.uwagi);
    // $('addedFiles').val(datarow.upowaznieniaPliki);
  }

  loadtelefony(){

      if(this.telefony.length>1)
        return;
 
      $.ajax({
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        url: this.sg['SERVICE_URL'] + 'Upowaznienia/GetTelefony' ,
        type: 'GET',
        success: (data: any, status: any, xhr: any)=>{
    
          this.telefony = data;   
          this.myGrid.source(this.dataAdapter); 
        },
        error: function (jqXHR: any, textStatus: any, errorThrown: any) {
          alert(textStatus + ' - ' + errorThrown);
        }
      });
  }
  
  getUsersTelefone(value: string){
    let res = '';
    if(value.indexOf(',')<1)
    {
      let tmp = this.telefony.filter(x=>x.user === value.trim())[0];
      if(tmp!= undefined)
        res=value+" "+tmp.telefon;
      else 
        res = value;
    }
    else{
      let ar = value.split(',');
      for(let i in ar){
        let tmp = this.telefony.filter(x=>x.user === ar[i].trim())[0];
        
        if(tmp!= undefined)
          res=res+ar[i]+" "+tmp.telefon+ ", ";  
        else
          res=res+ar[i]+", ";    
      }
    }
    if(res.endsWith(', '))
      res = res.substr(0, res.length-2);

    return res;
  }

  showarray(tablica: any){
    for(let i in  tablica)
      console.log(i+": "+tablica[i]);
  }

}


// zły download
/*
  downloadFile = function (name) {
  var urlstring=this.sg['SERVICE_URL'] + 'Upowaznienia/TestDownloadd';
  var contentT ="application/x-www-form-urlencoded;charset=ISO-8859-2";
  var filename ="f1.txt";
  if(name==="1"){
    urlstring=this.sg['SERVICE_URL'] + 'Upowaznienia/TestDownload'
    contentT="application/x-www-form-urlencoded;charset=ISO-8859-2";
    filename ="f2.txt";
    }

  $.ajax({
      method: 'GET',
      //dataType:"json", 
      url: urlstring,
      //this.sg['SERVICE_URL'] + 'Upowaznienia/TestDownload',
      contentType: contentT,
      //contentType: "text/plain; charset=UTF-8",
      params: { name: name },
      //responseType: 'arraybuffer'
      //arraybuffer
  }).success(function (data, status, headers) {
      //headers = headers();
      //alert(headers.getResponseHeader("content-type"));
      var rez='';

      var t =data;//['content'];
      // t=t['_content'];
      // t=t[2];
      for (var i in t) {
        rez=rez+";"+t[i];
        // rez=rez+(t[i]);
        // for(var j in i)
        // {           
        //   rez=rez+i[j];
        // }
      }
      alert(rez);
      //alert(contentType);
      //var filename = headers['x-filename'];
      //var contentType = headers['content-type'];
      //contentType= "text/plain; charset=UTF-8";
      //contentType ="text/plain";
      // "multipart/form-data
      var linkElement = document.createElement('a');
      try {
        //, { type: contentType }
      
          var blob = new Blob([data], { type: contentT });
          var url = window.URL.createObjectURL(blob);

          linkElement.setAttribute('href', url);
          linkElement.setAttribute("download", filename);

          var clickEvent = new MouseEvent("click", {
              "view": window,
              "bubbles": true,
              "cancelable": false
          });
          linkElement.dispatchEvent(clickEvent);
      } catch (ex) {
          console.log(ex);
      }
  }).error(function (data) {
      console.log(data);
  });
  };

*/

//niuedane próby pobrania pliku
/*
  var a=4;
  
  if(a==0)
    {let xhr = new XMLHttpRequest();
  
              xhr.open('GET', urlstring, true);
              xhr.setRequestHeader('Content-type', 'application/json');
              xhr.responseType='blob';
  
              xhr.onreadystatechange = function () {
                  if (xhr.readyState === 4) {
                      if (xhr.status === 200) {
  
                          var contentType = 'application/octet-stream';
                          var blob = new Blob([xhr.response], { type: contentType });
                          var link = document.createElement('a');
                          link.href = window.URL.createObjectURL(blob);
                          //link.href = window.URL.createObjectURL(data);
                          var plik = "plik.pdf";
                          link.download = plik;
                          link.click();
                          //observer.next(blob);
                          //observer.complete();
                      } else {
                          //observer.error(xhr.response);
                      }
                  }
              }
              xhr.send();

            } 

  if(a===2)
    $.ajax({
      url: urlstring,
      //contentType: 'application/json; charset="UTF-8"',
      contentType: 'application/octet-stream',
        //contentType: 'application/json; charset=UTF-8',
        //datatype: 'json',
        //datatype: 'binary',
        //responseType:'arraybuffer',
        //contentType: "application/x-www-form-urlencoded",
        //contentType:"multipart/form-data",
        //contentType: 'undefined',
        //dataType: 'binary',
        //contentType: 'application/download',
        processData: false,
  

        type: "GET",
        success: function(data, status, headers) {

        //console.log(data);
        //console.log(headers);
          //var rez='';
          // alert(data.charCodeAt(11));
                  // var t =data
                  // for (var i in t) {
                  //  // rez=rez+";"+t[i];
                  //  console.log(i);
                
                  // }
          //         alert(rez);

          var blob = new Blob([data]);
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          //link.href = window.URL.createObjectURL(data);
          var plik = plikid===1 ?"plik.pdf":"filename.txt";
          link.download = plik;
          link.click();
      }
        // success: function () {
        //    window.location = '@Url.Action("'+urlstring+'", "PostDetail", new { studentId = 123 })';
        //     //window.location = '@Url.Action("DownloadAttachment", "PostDetail", new { studentId = 123 })';
        //     // var url = window.URL.createObjectURL(urlstring);
        //     // var linkElement = document.createElement('a');
        //     //            linkElement.setAttribute('href', url);
        //     //            linkElement.setAttribute("download", "zzz.txt");
            
        //     //            var clickEvent = new MouseEvent("click", {
        //     //                "view": window,
        //     //                "bubbles": true,
        //     //                "cancelable": false
        //     //            });
        //     //            linkElement.dispatchEvent(clickEvent);
        // }
    });


    if(a===3)
    $.ajax({
        url: urlstring,
        contentType: 'application/octet-stream',
          processData: false,
    
  
          type: "GET",
          success: function(data, status, headers) {
  
          //console.log(data);
          //console.log(headers);
            //var rez='';
            // alert(data.charCodeAt(11));
                    // var t =data
                    // for (var i in t) {
                    //  // rez=rez+";"+t[i];
                    //  console.log(i);
                  
                    // }
            //         alert(rez);
  
            var blob = new Blob([data]);
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            //link.href = window.URL.createObjectURL(data);
            var plik = plikid===1 ?"plik.pdf":"filename.txt";
            link.download = plik;
            link.click();
        }
    
      });
*/
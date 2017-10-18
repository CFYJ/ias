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

@Component({
  selector: 'app-upowaznienia',
  templateUrl: './upowaznienia.component.html',
  styleUrls: ['./upowaznienia.component.scss'],

 
})

// export class PlikUpowaznien{

//   id: number;
//   id_upowaznienia: number;
//   id_pliku: string;
//   nazwa: string;

// }


  export class UpowaznieniaComponent implements OnInit, AfterViewInit, AfterContentInit {



  constructor(public upowaznieniaService: UpowaznieniaService,
    private authService: AuthenticationService,private messageService: MessageService,
    private sg: SimpleGlobal) 
    { 
     
    }

  pliki: any;
  //pliki: Array<PlikUpowaznien>;

  message: any = 'message';
  subscription: Subscription;
  // jednostki: string[];
  initialLoad = true;
  isInsertOperation = false;
  

  ngAfterContentInit(){
    //$('body').on('click','.deleteFileButton',function(){alert("ggg")});
  }
  
  ngOnInit() {

    
    //$('#testwasl').onClick(alert('ddd'));
   // $('body').on('click','#testwasl',function(){alert("ggg")});
    // const _self = this;
    // this.myGrid.createComponent(this.options);
  }


  options: jqwidgets.GridOptions =
  {
    localization: {
      pagergotopagestring: 'Idź do', pagerrangestring: 'z',
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
    pagesize:5,

    autorowheight: true,
    autoheight: true,
    altrows: true,
    enabletooltips: false,
    
    columnsheight:60,
    theme:'darkblue',
  };

  // fileuploadoptions: jqwidgets.FileUploadOptions={
  //   multipleFilesUpload: false;
    
  // }

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

    //this.panelMenu.createComponent();  
   //if(this.authService.checkIfUserIsInRole('Admin_upowaznienia'))
    {this.toolBar.createComponent();}    
    
  
    // this.fNazwa.createComponent(inputSettings);
    this.fNazwa_skrocona.createComponent(inputSettings);
    this.fWniosek_nadania_upr.createComponent(inputSettings);
    this.fNadajacy_upr.createComponent(inputSettings);
    this.fProwadzacy_rejstr_uzyt.createComponent(inputSettings);
    this.fWniosek_odebrania_upr.createComponent(inputSettings);
    this.fOdbierajacy_upr.createComponent(inputSettings);
    this.fOpiekun.createComponent(inputSettings);
    this.fAdres_email.createComponent(inputSettings);
    this.fDecyzja.createComponent(inputSettings);
    this.fUwagi.createComponent(inputSettings);
    // this.fileupload.createComponent({
    //   uploadUrl:this.sg['SERVICE_URL'] + 'Upowaznienia/FileUpload',
    // });


  }


  source=
  {
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
          
        // var rez="";  
        //       var tt = this.pliki;//rowdata;
        //       for (var i in tt) {
        //         rez=rez+";"+i;        
        //       }
        //       alert(rez);

        const t = JSON.stringify(rowdata);
        $.ajax({
          cache: false,
          dataType: 'json',
          contentType: 'application/json',
          url: this.sg['SERVICE_URL'] + 'Upowaznienia/UpdateUpowaznienia/' + rowdata.id,
          data: t,
          type: 'PUT',
          success: function (data: any, status: any, xhr: any) {            
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
  dataAdapter = new $.jqx.dataAdapter(this.source, {
    formatData: function (data: any) {            
      return data;      
    }
  });

  //region viewchildy
  @ViewChild('gridReference') myGrid: jqxGridComponent;
  @ViewChild('jqxwindow1') editWindow: jqxWindowComponent;
  @ViewChild('jqxwindowDelete') deleteWindow: jqxWindowComponent;
 // @ViewChild('nazwa') fNazwa:  jqxInputComponent;
  @ViewChild('nazwa_skrocona') fNazwa_skrocona: jqxInputComponent;
  @ViewChild('wniosek_nadania_upr') fWniosek_nadania_upr: jqxInputComponent;
  @ViewChild('nadajacy_upr') fNadajacy_upr: jqxInputComponent;
  @ViewChild('prowadzacy_rejestr_uzyt') fProwadzacy_rejstr_uzyt: jqxInputComponent;
  @ViewChild('wniosek_odebrania_upr') fWniosek_odebrania_upr: jqxInputComponent;
  @ViewChild('odbierajacy_upr') fOdbierajacy_upr: jqxInputComponent;
  @ViewChild('opiekun') fOpiekun: jqxInputComponent;
  @ViewChild('adres_email') fAdres_email: jqxInputComponent;
  @ViewChild('decyzja') fDecyzja: jqxInputComponent;
  @ViewChild('uwagi') fUwagi: jqxInputComponent;

  @ViewChild('buttonReference') mySaveButton1: jqxButtonComponent;
  @ViewChild('buttonReference1') myCancelButton1: jqxButtonComponent;
  // @ViewChild('buttonReference2') myInsertButton1: jqxButtonComponent;
  // @ViewChild('buttonReference3') myEditButton: jqxButtonComponent;
  
  // @ViewChild('buttonDelReference') myDelButton: jqxButtonComponent;
  @ViewChild('buttonDelYesReference') myDelYesButton: jqxButtonComponent;
  @ViewChild('buttonDelNoReference') myDelNoButton: jqxButtonComponent;

  //@ViewChild('upowaznieniaPanelMenu') panelMenu: jqxPanelComponent;  
  @ViewChild('upowaznieniaToolBar') toolBar: jqxPanelComponent;
  //@ViewChild('fileuploadbutton') fileupload: jqxFileUploadComponent;

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
                this.editCellclick(event);
              });
              break;
      case 2:
              tool.jqxToggleButton({ width: 120, toggled:false});
              tool.text("Usuń");
              tool.on("click", ()=>{
                this.buttonDelClicked();
              });
              break;
      // case 3:
      //         tool.jqxToggleButton({ width: 120, toggled:false});
      //         tool.text("FileContentResult");
      //         tool.on("click", ()=>{
      //           this.downloadFile("1");
      //         });
      //         break; 
    };
    
  };


  buttonSaveClicked(){
    // alert($('#nazwa').val());
    let data = { id: null };
    let rowindex: number;
    if (!this.isInsertOperation) {
      rowindex =this.selectedRowId; //this.myGrid.getselectedcell().rowindex;  
      data =this.selectedRowData; //this.myGrid.getrowdata(rowindex);
    }
    const row = {
      id: data.id, 
      nazwa: $('#nazwa').val(),
      // nazwa: this.fNazwa.val(),      
      nazwa_skrocona: this.fNazwa_skrocona.val(),
      wniosek_nadania_upr: this.fWniosek_nadania_upr.val(), nadajacy_upr: this.fNadajacy_upr.val(),
      prowadzacy_rejestr_uzyt: this.fProwadzacy_rejstr_uzyt.val(), wniosek_odebrania_upr: this.fWniosek_odebrania_upr.val(),
      odbierajacy_upr: this.fOdbierajacy_upr.val(), opiekun: this.fOpiekun.val(),
      adres_email: this.fAdres_email.val(), decyzja: this.fDecyzja.val(), uwagi: this.fUwagi.val(), upowaznieniaPliki: this.pliki
    };
    // this.myGrid.updaterow(this.myGrid.getrowid(this.myGrid.getselectedrowindex()), row);

    if (this.isInsertOperation) {
      row.id = 0;     
      this.myGrid.addrow(null, row, 'top');
    } else {    
      this.myGrid.updaterow(this.myGrid.getrowid(rowindex), row);
    }

    this.isInsertOperation = false;
    this.editWindow.close();
    $('#file-field').val('').clone(true);

  }

  buttonCancelClicked() {
    this.isInsertOperation = false;
    this.editWindow.close();
    this.pliki = new Array();
   $('#file-field').val('').clone(true);
  }


  buttonAddClicked() {
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
      var zz = this.pliki;


      $.each(files, function(key, value)
      {
        formData.append(key, value);
      });

      $.ajax({
        url: this.sg['SERVICE_URL'] + 'Upowaznienia/FileUpload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,      
        cache: false,        
        dataType: 'json',
        //contentType: 'multipart/form-data',
                //success: function(data, textStatus, jqXHR)
        success: function (data: any, status: any, xhr: any) {
          //alert( textStatus);
            // if(typeof data.error === 'undefined')
            // {
            
              // var rez="";  
              // var t = data;
              // for (var i in t) {
              //   rez=rez+";"+t[i];        
              // }
              // alert(rez);

              var newplik = {"id":data.id,"id_upowaznienia":0, "id_pliku":data.id_pliku , "nazwa":files[0].name};
              if(zz!=null)
                zz.push(newplik); 
              else 
              {
                zz = new Array();
                zz.push(newplik);             
              }


              // var rez="";  
              // var t = zz;
              // for (var i in t) {
              //   rez=rez+";"+i;        
              // }
              //alert(rez);


                // Success so call function to process the form
               // alert("sukces");
            // }
            // else
            // {
            //     // Handle errors here
            //     alert('success ERRORS: ' + data.error);
            // }
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

  deleteFile = function(id: any){
    alert("delete "+id['id']);

    var index = this.pliki.indexOf(id);
    if(index > -1)
    {
      this.pliki.splice(index, 1);
    }
  }



  editCellclick(event: any): void {

      if(this.selectedRowId !=null){
            const datarow=this.selectedRowData;
            this.setEditValues(datarow);
            this.editWindow.title('Edycja');
            this.editWindow.open();

            this.pliki = new Array();    
            if(typeof this.selectedRowData['upowaznieniaPliki'] !== 'undefined'){      
               this.pliki = this.selectedRowData['upowaznieniaPliki'];
            }
            
            // if( datarow['upowaznieniaPliki'].length>0){             
            //   this.pliki = datarow['upowaznieniaPliki'];
            // } 

      }

  }



private selectedRowData = null;
private selectedRowId = null;
Cellselect(event: any): void {
    //alert( event.args.rowindex);
    this.selectedRowId = event.args.rowindex;
    this.selectedRowData = event.args.row.bounddata;   
    
  
    // var rez="";  
    // var t = event.args.row.bounddata['UpowaznieniaPliki'];
    // for (var i in t) {
    //   rez=rez+";"+t[i];        
    // }
    // alert(rez);
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
  
buttondelnoClicked()
  {

    this.deleteWindow.close();
}

buttondelyesClicked()
  {
    this.myGrid.deleterow(this.selectedRowData.id);
    this.deleteWindow.close();
}

  // cellsrenderer = (row: number, columnfield: string, value: string | number, defaulthtml: string, columnproperties: any, rowdata: any): string => {
    //     if (value < 20) {
    //         return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; color: #ff0000;">' + value + '</span>';
    //     }
    //     else {
    //         return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; color: #008000;">' + value + '</span>';
    //     }
    // };

    // columns: any[] =
    // [
    //     { text: 'Product Name', columngroup: 'ProductDetails', datafield: 'ProductName', width: 250 },
    //     { text: 'Quantity per Unit', columngroup: 'ProductDetails', datafield: 'QuantityPerUnit', cellsalign: 'right', align: 'right' },
    //     { text: 'Unit Price', columngroup: 'ProductDetails', datafield: 'UnitPrice', align: 'right', cellsalign: 'right', cellsformat: 'c2' },
    //     { text: 'Units In Stock', datafield: 'UnitsInStock', cellsalign: 'right', cellsrenderer: this.cellsrenderer, width: 100 },
    //     { text: 'Discontinued', columntype: 'checkbox', datafield: 'Discontinued', align: 'center' }
    // ];  

    // columngroups: any[] =
    // [
    //     { text: 'Product Details', align: 'center', name: 'ProductDetails' }
    // ];

  plikirenderer = (row: number, column: any, value: any): string => {
    var basePlikiurl = this.sg['SERVICE_URL'] + 'Upowaznienia/FileDownload/';
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

      plikiHtml=plikiHtml+'<div style=";padding: 5px 25px;"><a href="'+basePlikiurl+value[i]['idPliku']+'" target="_blank" '+
      ' onMouseOver="this.style.backgroundColor=\'#4ca773\'" onMouseOut="this.style.backgroundColor=\'#2f5f44\'" '+      
     ' style="background-color: #2f5f44;color: white;padding: 5px;text-align: left;text-decoration: none;display: inline-block;min-width:100%; border-radius:5px; " >'+value[i]['nazwa']+'</a></div>'

    }

    
    return plikiHtml+"</div>";
  }

  columns: any[] =
  [

    // {
    //   text: '', datafield: 'edycja', width: 50, columntype: 'button', filterable: false,
    //   cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
    //     return 'Edycja';
    //   },
    // },
      { text: 'Pliki', datafield: 'upowaznieniaPliki',  minwidth: 200,cellsrenderer: this.plikirenderer },
      { text: 'Nazwa', datafield: 'nazwa', width: 160,  },
      { text: 'Nazwa skrócona',  datafield: 'nazwa_skrocona', width: 160},
      { text: 'Wniosek o nadanie<br> uprawnień', datafield: 'wniosek_nadania_upr', width: 160 },
      { text: 'Nadający uprawnienia', datafield: 'nadajacy_upr', width: 160 },
      { text: 'Prowadzący rejestr<br> użytkowników', datafield: 'prowadzacy_rejestr_uzyt', width: 160 },
      { text: 'Wniosek o odebranie<br> uprawnień', datafield: 'wniosek_odebrania_upr', width: 160 },
      { text: 'Odbierający<br>uprawnienia', datafield: 'odbierajacy_upr', width:160 },
      { text: 'Opiekun', datafield: 'opiekun', width: 160 },
      { text: 'Adres email', datafield: 'adres_email', width: 160 },
      { text: 'Decyzja', datafield: 'decyzja', width: 160  },
      { text: 'Uwagi', datafield: 'uwagi',  minwidth: 200 },
    
     
  ];




  setEditValues(datarow: any): any{
    //this.fNazwa.val(datarow.nazwa);
    $('#nazwa').val(datarow.nazwa) ;
    this.fNazwa_skrocona.val(datarow.nazwa_skrocona);
    this.fWniosek_nadania_upr.val(datarow.wniosek_nadania_upr);
    this.fNadajacy_upr.val(datarow.nadajacy_upr);
    this.fProwadzacy_rejstr_uzyt.val(datarow.prowadzacy_rejestr_uzyt);
    this.fWniosek_odebrania_upr.val(datarow.wniosek_odebrania_upr);
    this.fOdbierajacy_upr.val(datarow.odbierajacy_upr);
    this.fOpiekun.val(datarow.opiekun);
    this.fAdres_email.val(datarow.adres_email);
    this.fDecyzja.val(datarow.decyzja);
    this.fUwagi.val(datarow.uwagi);
    $('addedFiles').val(datarow.upowaznieniaPliki);


    
          // if( datarow['upowaznieniaPliki'].length>0){ 
            //   for(var i in  datarow['upowaznieniaPliki']){
            //     @ViewChild('deleteFileButton'+i) deleteFileButton: jqxButtonComponent;
            //     this.deleteFileButton.createComponent();
            //   }
              // //alert(datarow['upowaznieniaPliki'][0]['nazwa']);
              // var pliki = '<table style="width:100%">';            
              // for(var i in datarow['upowaznieniaPliki']){
              //   pliki = pliki+'<tr><td style="width:30px"><button class="deleteFileButton" (click)="wasl.deleteFile(1)" id="'+datarow['upowaznieniaPliki'][i]['id']+'">-</button></td><td>'+datarow['upowaznieniaPliki'][i]['nazwa']+'</td></tr>';
              //  // onClick="deleteFile(1);" 

              // }
              // pliki=pliki+'</table>';
              // $('#addedFiles').html(pliki);

              // // $('.deleteFileButton').click(function(event){
              // //     //alert(event.target.id);
              // //     this._self.deleteFile(event.target.id);     
                     
              // // });
            // } 

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
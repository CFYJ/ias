import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy  } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

@Component({
  selector: 'app-upowaznienia',
  templateUrl: './upowaznienia.component.html',
  styleUrls: ['./upowaznienia.component.scss'],

 
})

//export class UpowaznieniaComponent implements OnInit {
  export class UpowaznieniaComponent implements OnInit, AfterViewInit{

  constructor(private upowaznieniaService: UpowaznieniaService,
    private authService: AuthenticationService,private messageService: MessageService,
    private sg: SimpleGlobal) { }

    message: any = 'message';
    subscription: Subscription;
   // jednostki: string[];
    initialLoad = true;
    isInsertOperation = false;
  

  ngOnInit() {
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
    
 
  };

  ngAfterViewInit(): void {
     const _self = this;
     this.myGrid.createComponent(this.options);
     const inputSettings: jqwidgets.InputOptions = { width: '300px', height: '25px', theme: 'metro' };

     this.editWindow.createWidget({
      width: 450, height: 530, theme: 'metro',
      resizable: false, isModal: true, autoOpen: false, modalOpacity: 0.5
    });

    const buttonOptions: jqwidgets.ButtonOptions = { theme: 'metro' };
    this.mySaveButton1.createComponent(buttonOptions);
    this.myCancelButton1.createComponent(buttonOptions);
    this.myInsertButton1.createComponent(buttonOptions);

    this.fNazwa.createComponent(inputSettings);
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
  }


  source=
  {
    //  datatype: 'xml',
    datatype: 'json',
      // datafields: [
      //     { name: 'ProductName', type: 'string' },
      //     { name: 'QuantityPerUnit', type: 'int' },
      //     { name: 'UnitPrice', type: 'float' },
      //     { name: 'UnitsInStock', type: 'float' },
      //     { name: 'Discontinued', type: 'bool' }
      // ],
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
      ],
      id:'id',
      url: this.sg['SERVICE_URL']+'Upowaznienia/GetUpowaznieniaLista',
      // root: 'Products',
      // record: 'Product',
      // id: 'ProductID',
      // url: '../sampledata/products.xml'

      addrow: (rowid: any, rowdata: any, position: any, commit: any) => {
        const t = JSON.stringify(rowdata);
        $.ajax({
          cache: false,
          dataType: 'json',
          contentType: 'application/json',
          url: this.sg['SERVICE_URL'] + 'Upowaznienia/PostUpowaznienia',
          data: t,
          type: 'POST',
          success: function (data: any, status: any, xhr: any) {
            //alert('Wstawiono nowy rekord - id: ' + data.id);
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
          url: this.sg['SERVICE_URL'] + 'Upowaznienia/PutUpowaznienia/' + rowdata.id,
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
      }

  };

  // dataAdapter: any = new $.jqx.dataAdapter(this.source);
  dataAdapter = new $.jqx.dataAdapter(this.source, {
    formatData: function (data: any) {
      return data;
    }
  });

  @ViewChild('gridReference') myGrid: jqxGridComponent;
  @ViewChild('jqxwindow1') editWindow: jqxWindowComponent;
  @ViewChild('nazwa') fNazwa: jqxInputComponent;
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
  @ViewChild('buttonReference2') myInsertButton1: jqxButtonComponent;


  buttonSaveClicked(){
    let data = { id: null };
    let rowindex: number;
    if (!this.isInsertOperation) {
      rowindex = this.myGrid.getselectedcell().rowindex;  
      data = this.myGrid.getrowdata(rowindex);
    }
    const row = {
      id: data.id, nazwa: this.fNazwa.val(), nazw_skrocona: this.fNazwa_skrocona.val(),
      wniosek_nadania_upr: this.fWniosek_nadania_upr.val(), nadajacy_upr: this.fNadajacy_upr.val(),
      prowadzacy_rejestr_uzyt: this.fProwadzacy_rejstr_uzyt.val(), wniosek_odebrania_upr: this.fWniosek_odebrania_upr.val(),
      odbierajacy_upr: this.fOdbierajacy_upr.val(), opiekun: this.fOpiekun.val(),
      adres_email: this.fAdres_email.val(), decyzja: this.fDecyzja.val(), uwagi: this.fUwagi.val()
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

  }

  buttonCancelClicked() {
    this.isInsertOperation = false;
    this.editWindow.close();
  }

  button2Clicked() {
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

  editCellclick(event: any): void {
    if (event.args.datafield === 'edycja') {
      console.log('cell clicked: ' + event.args.rowindex + ': ' + event.args.datafield);
     // if (this.authService.loggedIn()) {
        const datarow = event.args.row.bounddata;
        //if (this.authService.checkIfUserHasPermissionToEdit(datarow)) {
          this.setEditValues(datarow);
          this.editWindow.title('Edycja');
          this.editWindow.open();
        // } else {
        //   $('#notificationContent').html('Możesz edytować jedynie swoje dane');
        //   this.msgNotification.open();
        // }
      // } else {
      //   $('#notificationContent').html('W celu edycji danych należy się zalogować');
      //   this.msgNotification.open();
      // }
    }
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

  columns: any[] =
  [

    {
      text: '', datafield: 'edycja', width: 50, columntype: 'button', filterable: false,
      cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
        return 'Edycja';
      },
    },
      { text: 'Nazwa', datafield: 'nazwa', width: 200,  },
      { text: 'Nazwa skrócona',  datafield: 'nazwa_skrocona', width: 100},
      { text: 'Wniosek o nadanie<br> uprawnień', datafield: 'wniosek_nadania_upr', width: 200 },
      { text: 'Nadający uprawnienia', datafield: 'nadajacy_upr', width: 200 },
      { text: 'Prowadzący rejestr użytkowników', datafield: 'prowadzacy_rejestr_uzyt', width: 200 },
      { text: 'Wniosek o odebranie uprawnień', datafield: 'wniosek_odebrania_upr', width: 200 },
      { text: 'Odbierający uprawnienia', datafield: 'odbierajacy_upr', width: 200 },
      { text: 'Opiekun', datafield: 'opiekun', width: 200 },
      { text: 'Adres email', datafield: 'adres_email', width: 200 },
      { text: 'Decyzja', datafield: 'decyzja', width: 200 },
      { text: 'Uwagi', datafield: 'uwagi', width: 200 },
     
  ];

  setEditValues(datarow: any): any{
    this.fNazwa.val(datarow.nazwa);
    this.fNazwa_skrocona.val(datarow.nazw_skrocona);
    this.fWniosek_nadania_upr.val(datarow.wniosek_nadania_upr);
    this.fNadajacy_upr.val(datarow.nadajacy_upr);
    this.fProwadzacy_rejstr_uzyt.val(datarow.prowadzacy_rejestr_uzyt);
    this.fWniosek_odebrania_upr.val(datarow.wniosek_odebrania_upr);
    this.fOdbierajacy_upr.val(datarow.odbierajacy_upr);
    this.fOpiekun.val(datarow.opiekun);
    this.fAdres_email.val(datarow.adres_email);
    this.fDecyzja.val(datarow.decyzja);
    this.fUwagi.val(datarow.uwagi);
  }



}

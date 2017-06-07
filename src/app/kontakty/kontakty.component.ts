import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { jqxInputComponent } from 'jqwidgets-ts/angular_jqxinput';
import { jqxComboBoxComponent } from 'jqwidgets-ts/angular_jqxcombobox';
import { jqxButtonComponent } from 'jqwidgets-ts/angular_jqxbuttons';
//import { DataTableModule, SharedModule } from 'primeng/primeng';
//import { Car } from '../car';
import { jqxGridComponent } from 'jqwidgets-ts/angular_jqxgrid';
import { jqxWindowComponent } from 'jqwidgets-ts/angular_jqxwindow';
import { jqxDateTimeInputComponent } from 'jqwidgets-ts/angular_jqxdatetimeinput';
import { jqxNotificationComponent } from 'jqwidgets-ts/angular_jqxnotification';
import { AuthenticationService } from './../authentication.service';
import { KontaktyService } from './../kontakty.service';
import { MessageService } from './../message.service';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-kontakty',
  templateUrl: './kontakty.component.html',
  styleUrls: ['./kontakty.component.scss']
})

export class KontaktyComponent implements AfterViewInit, OnDestroy, OnInit {
  message: any = 'message';
  subscription: Subscription;
  jednostki: string[];

  url = 'http://localhost:5000/api/Kontakties/GetKontakty';
  source =
  {
    datatype: 'json',
    datafields: [
      { name: 'id' },
      { name: 'imie', type: 'string' },
      { name: 'nazwisko', type: 'string' },
      { name: 'jednostka', type: 'string' },
      { name: 'wydzial', type: 'string' },
      { name: 'stanowisko', type: 'string' },
      { name: 'pokoj', type: 'string' },
      { name: 'email', type: 'string' },
      { name: 'telefon', type: 'string' },
      { name: 'komorka', type: 'string' },
      { name: 'login', type: 'string' },
      { name: 'wewnetrzny', type: 'string' }
    ],
    id: 'id',
    url: this.url,
    updaterow: function (rowid: any, rowdata: any, commit: any) {
      let url = 'http://localhost:5000/api/Kontakties/PutKontakty/' + rowdata.id;
      let t = JSON.stringify(rowdata);
      $.ajax({
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        url: url,
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
  dataAdapter = new $.jqx.dataAdapter(this.source, {
    formatData: function (data: any) {
      return data;
    }
  });
  filtergroup = new $.jqx.filter();
  options: jqwidgets.GridOptions =
  {
    localization: { pagergotopagestring: 'Idź do', pagerrangestring: 'z', pagershowrowsstring: 'Liczba wierszy' },
    autoheight: true,
    theme: 'metro',
    width: '100%',
    pageable: true,
    pagesize: 20,
    filterable: true,
    autoshowfiltericon: true,
    filtermode: 'excel',
    showfilterrow: true,
    editable: false,
    selectionmode: 'singlerow',
    sortable: true,
    source: this.dataAdapter,
    columnsresize: true,
    columns: [
      { text: 'Login', datafield: 'login', width: 100 },
      { text: 'Imię', datafield: 'imie', width: 100 },
      { text: 'Nazwisko', datafield: 'nazwisko', width: 100 },
      { text: 'Jednostka', datafield: 'jednostka', width: 150 },
      { text: 'Wydział', datafield: 'wydzial', width: 150 },
      { text: 'Pokój', datafield: 'pokoj' },
      { text: 'Stanowisko', datafield: 'stanowisko', width: 250 },
      { text: 'Email', datafield: 'email', width: 125 },
      { text: 'Telefon', datafield: 'telefon', width: 150 },
      { text: 'Wewnętrzny', datafield: 'wewnetrzny', width: 100 },
      { text: 'Komórka', datafield: 'komorka', width: 150 },
      {
        text: 'Edycja', datafield: 'edycja', width: 50, columntype: 'button',
        cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
          return 'Edycja';
        }
      }
    ]
  };

  @ViewChild('gridReference') myGrid: jqxGridComponent;
  @ViewChild('jqxwindow1') editWindow: jqxWindowComponent;
  @ViewChild('msgNotification') msgNotification: jqxNotificationComponent;
  @ViewChild('cbJednostka') myJednostka: jqxComboBoxComponent;
  @ViewChild('cbWydzial') myWydzial: jqxComboBoxComponent;
  @ViewChild('cbStanowisko') myStanowisko: jqxComboBoxComponent;
  @ViewChild('nazwisko') myNazwisko: jqxInputComponent;
  @ViewChild('imie') myImie: jqxInputComponent;
  @ViewChild('pokoj') myPokoj: jqxInputComponent;
  @ViewChild('email') myEmail: jqxInputComponent;
  @ViewChild('telefon') myTelefon: jqxInputComponent;
  @ViewChild('komorka') myKomorka: jqxInputComponent;
  @ViewChild('wewnetrzny') myWewnetrzny: jqxInputComponent;
  @ViewChild('login') myLogin: jqxInputComponent;
  @ViewChild('buttonReference') mySaveButton1: jqxButtonComponent;
  @ViewChild('buttonReference1') myCancelButton1: jqxButtonComponent;


  constructor(private kontaktyService: KontaktyService, private authSAervice: AuthenticationService,
    private messageService: MessageService) {
  }

  ngOnInit(): void {
  }

  getJednostki() {

  }

  buttonClicked() {
    let data = this.myGrid.getrowdata(this.myGrid.getselectedrowindex());

    let row = {
      id: data.id, imie: this.myImie.val(), nazwisko: this.myNazwisko.val(),
      jednostka: this.myJednostka.getSelectedItem().value, wydzial: this.myWydzial.getSelectedItem().value,
      stanowisko: this.myStanowisko.getSelectedItem().value,
      pokoj: this.myPokoj.val(), email: this.myEmail.val(), telefon: this.myTelefon.val(), komorka: this.myKomorka.val(),
      wewnetrzny: this.myWewnetrzny.val(), login: data.login
    };
    this.myGrid.updaterow(this.myGrid.getrowid(this.myGrid.getselectedrowindex()), row);
    this.editWindow.close();
  }
  button1Clicked() {
    this.editWindow.close();
  }
  ngAfterViewInit(): void {
    let _self = this;
    let inputSettings: jqwidgets.InputOptions = { width: '300px', height: '25px', theme: 'metro' };
    let disabledSettings: jqwidgets.InputOptions = { width: '300px', height: '25px', theme: 'metro', disabled: true };
    this.myGrid.createComponent(this.options);
    this.editWindow.createWidget({
      width: 400, height: 400, theme: 'metro',
      resizable: false, isModal: true, autoOpen: false, modalOpacity: 0.5
    });

    let buttonOptions: jqwidgets.ButtonOptions = { theme: 'metro' };
    //let mySaveButton: jqwidgets.jqxButton = jqwidgets.createInstance($('#Save'), 'jqxButton', buttonOptions);
    //let myCancelButton: jqwidgets.jqxButton = jqwidgets.createInstance($('#Cancel'), 'jqxButton', buttonOptions);

    this.kontaktyService.getJednostki().subscribe(jed => { this.myJednostka.createComponent({ source: jed, width: '300px' }); });
    this.kontaktyService.getStanowiska().subscribe(jed => { this.myStanowisko.createComponent({ source: jed, width: '300px' }); });
    this.kontaktyService.getWydzialy().subscribe(jed => { this.myWydzial.createComponent({ source: jed, width: '300px' }); });
    this.myNazwisko.createComponent(inputSettings);
    this.myImie.createComponent(inputSettings);
    this.myLogin.createComponent(disabledSettings);
    this.myTelefon.createComponent(inputSettings);
    this.myPokoj.createComponent(inputSettings);
    this.myWewnetrzny.createComponent(inputSettings);
    this.myKomorka.createComponent(inputSettings);
    this.myEmail.createComponent(inputSettings);

    this.mySaveButton1.createComponent(buttonOptions);
    this.myCancelButton1.createComponent(buttonOptions);
    this.msgNotification.createComponent();
  };

  ngOnDestroy() {
  }
  editCellclick(event: any): void {
    if (event.args.datafield === 'edycja') {
      console.log('cell clicked: ' + event.args.rowindex + ': ' + event.args.datafield);
      if (this.authSAervice.loggedIn()) {
        let datarow = event.args.row.bounddata;
        let user = this.authSAervice.getUser();
        if (datarow.login === user) {
          this.myImie.val(datarow.imie);
          this.myNazwisko.val(datarow.nazwisko);
          this.myJednostka.val(datarow.jednostka);
          this.myWydzial.val(datarow.wydzial);
          this.myStanowisko.val(datarow.stanowisko);
          this.myPokoj.val(datarow.pokoj);
          this.myEmail.val(datarow.email);
          this.myTelefon.val(datarow.telefon);
          this.myKomorka.val(datarow.komorka);
          this.myLogin.val(datarow.login);
          this.myWewnetrzny.val(datarow.wewnetrzny);

          this.editWindow.open();
        } else {
          $('#notificationContent').html('Możesz edytować jedynie swoje dane');
          this.msgNotification.open();
        }
      } else {
        $('#notificationContent').html('W celu edycji danych należy się zalogować');
        //this.message = 'W celu edycji danych należy się zalogować';
        this.msgNotification.open();
        //alert('W celu edycji danych należy się zalogować');
      }
      //let m = this.messageService.getMessage();
      //let w = m.subscribe();

      /*let lin = this.authSAervice.loggedIn();
      if (datarow.delegowany === 'SZEREJKO ANDRZEJ') {
        this.editWindow.open();
      } else if (lin) {
        //this.message = this.messageService.getMessage();
        //this.message.text = 'Nie masz uprawnień do edycji tego rekordu. Możesz edytować jedynie swoje dane.';
        this.msgNotification.open();
      } else {
        //this.message = 'Aby móc edytować dane należy się zalogować';
        this.msgNotification.open();
      }*/
      //+this.myGrid.getrowdata(this.myGrid.getselectedrowindex()));
    }
  }

}



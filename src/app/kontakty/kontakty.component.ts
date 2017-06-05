import { KontaktyService } from './../kontakty.service';
import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { jqxInputComponent } from 'jqwidgets-ts/angular_jqxinput';
import { jqxComboBoxComponent } from 'jqwidgets-ts/angular_jqxcombobox';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Car } from '../car';
import { jqxGridComponent } from 'jqwidgets-ts/angular_jqxgrid';
import { jqxWindowComponent } from 'jqwidgets-ts/angular_jqxwindow';
import { jqxDateTimeInputComponent } from 'jqwidgets-ts/angular_jqxdatetimeinput';
import { jqxNotificationComponent } from 'jqwidgets-ts/angular_jqxnotification';
import { AuthenticationService } from './../authentication.service';
import { MessageService } from './../message.service';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-kontakty',
  templateUrl: './kontakty.component.html',
  styleUrls: ['./kontakty.component.scss']
})

export class KontaktyComponent implements AfterViewInit, OnDestroy, OnInit {
  message: any;
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


  constructor(private kontaktyService: KontaktyService, private authSAervice: AuthenticationService,
    private messageService: MessageService) {


  }

  ngOnInit(): void {
    //this.getJednostki();


  }

  getJednostki() {

  }

  ngAfterViewInit(): void {
    let _self = this;

    let inputSettings: jqwidgets.InputOptions = { width: '300px', height: '25px', theme: 'metro' };
    let disabledSettings: jqwidgets.InputOptions = {
      width: '300px', height: '25px',
      theme: 'metro', disabled: true
    };
    this.myGrid.createComponent(this.options);
    this.editWindow.createWidget({
      width: 500, height: 400, theme: 'metro',
      resizable: false, isModal: true, autoOpen: false, cancelButton: $('#Cancel'), modalOpacity: 0.5
    });

    let buttonOptions: jqwidgets.ButtonOptions = { theme: 'metro' };
    let mySaveButton: jqwidgets.jqxButton = jqwidgets.createInstance($('#Save'), 'jqxButton', buttonOptions);
    let myCancelButton: jqwidgets.jqxButton = jqwidgets.createInstance($('#Cancel'), 'jqxButton', buttonOptions);

    this.kontaktyService.getJednostki().subscribe(jed => { this.myJednostka.createComponent({ source: jed, width: '300px' }); });
    this.kontaktyService.getStanowiska().subscribe(jed => { this.myStanowisko.createComponent({ source: jed, width: '300px' }); });
    this.kontaktyService.getWydzialy().subscribe(jed => { this.myWydzial.createComponent({ source: jed, width: '300px' }); });
    $('#login').jqxInput(disabledSettings);
    $('#imie').jqxInput(inputSettings);
    $('#nazwisko').jqxInput(inputSettings);
    $('#pokoj').jqxInput(inputSettings);
    $('#email').jqxInput(inputSettings);
    $('#telefon').jqxInput(inputSettings);
    $('#wewnetrzny').jqxInput(inputSettings);
    $('#komorka').jqxInput(inputSettings);



    mySaveButton.addEventHandler('click', (event: any) => {
      var data = this.myGrid.getrowdata(this.myGrid.getselectedrowindex());

      let row = {
        id: data.id, imie: $('#imie').val(), nazwisko: $('#nazwisko').val(),
        jednostka: this.myJednostka.getSelectedItem().value, wydzial: this.myWydzial.getSelectedItem().value,
        stanowisko: this.myStanowisko.getSelectedItem().value,
        pokoj: $('#pokoj').val(), email: $('#email').val(), telefon: $('#telefon').val(), komorka: $('#komorka').val(),
        wewnetrzny: $('#wewnetrzny').val(), login: data.login
      };
      this.myGrid.updaterow(this.myGrid.getrowid(this.myGrid.getselectedrowindex()), row);
      this.editWindow.close();
    });
  };

  ngOnDestroy() {

  }
  editCellclick(event: any): void {
    if (event.args.datafield === 'edycja') {
      console.log('cell clicked: ' + event.args.rowindex + ': ' + event.args.datafield);
      var datarow = event.args.row.bounddata;
      //$('#delegowany').jqxInput({theme: 'metro', width: 200});
      //this.delegowany.val(datarow.delegowany);
      //this.myDateInput.value(datarow.czasDo);
      $('#id').val(datarow.id);
      $('#imie').val(datarow.imie);
      $('#nazwisko').val(datarow.nazwisko);
      this.myJednostka.val(datarow.jednostka);
      this.myWydzial.val(datarow.wydzial);
      this.myStanowisko.val(datarow.stanowisko);
      $('#pokoj').val(datarow.pokoj);
      $('#email').val(datarow.email);
      $('#telefon').val(datarow.telefon);
      $('#komorka').val(datarow.komorka);
      $('#login').val(datarow.login);
      $('#wewnetrzny').val(datarow.wewnetrzny);

      this.editWindow.open();

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



import { SimpleGlobal } from 'ng2-simple-global';
import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { jqxInputComponent } from 'jqwidgets-ts/angular_jqxinput';
import { jqxComboBoxComponent } from 'jqwidgets-ts/angular_jqxcombobox';
import { jqxDropDownListComponent } from 'jqwidgets-ts/angular_jqxdropdownlist';
import { jqxButtonComponent } from 'jqwidgets-ts/angular_jqxbuttons';
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

export class KontaktyComponent implements AfterViewInit, OnDestroy {
  message: any = 'message';
  subscription: Subscription;
  jednostki: string[];
  initialLoad = true;
  isInsertOperation = false;

  source =
  {
    datatype: 'json',
    datafields: [
      { name: 'id' },
      { name: 'imie', type: 'string' },
      { name: 'nazwisko', type: 'string' },
      { name: 'jednostka', type: 'string' },
      { name: 'miejsce_pracy', type: 'string' },
      { name: 'pion', type: 'string' },
      { name: 'wydzial', type: 'string' },
      { name: 'wydzial_podlegly', type: 'string' },
      { name: 'stanowisko', type: 'string' },
      { name: 'pokoj', type: 'string' },
      { name: 'email', type: 'string' },
      { name: 'telefon', type: 'string' },
      { name: 'komorka', type: 'string' },
      { name: 'login', type: 'string' },
      { name: 'wewnetrzny', type: 'string' }
    ],
    id: 'id',
    url: this.sg['SERVICE_URL'] + 'Kontakties/GetKontakty',
    addrow: (rowid: any, rowdata: any, position: any, commit: any) => {
      const t = JSON.stringify(rowdata);
      $.ajax({
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        url: this.sg['SERVICE_URL'] + 'Kontakties/PostKontakty',
        data: t,
        type: 'POST',
        success: function (data: any, status: any, xhr: any) {
          alert('Wstawiono nowy rekord - id: ' + data.id);
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
        url: this.sg['SERVICE_URL'] + 'Kontakties/PutKontakty/' + rowdata.id,
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
  // hidden = !this.authService.checkIfUserBelongsToITStaff();
  columns = [{
    text: '', datafield: 'edycja', width: 50, columntype: 'button', filterable: false,
    cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
      return 'Edycja';
    },
  },
  { text: 'Login', datafield: 'login', width: 100, hidden: !this.authService.checkIfUserBelongsToITStaff() },
  { text: 'Nazwisko', datafield: 'nazwisko', width: 100 },
  { text: 'Imię', datafield: 'imie', width: 100 },
  { text: 'Telefon', datafield: 'telefon', width: 100 },
  { text: 'Wewn.', datafield: 'wewnetrzny', width: 50 },
  { text: 'Tel. kom.', datafield: 'komorka', width: 100 },
  { text: 'Email', datafield: 'email', width: 275 },
  { text: 'Stanowisko', datafield: 'stanowisko', width: 250 },
  { text: 'Jednostka', datafield: 'jednostka', width: 150 },
  { text: 'Miejsce pracy', datafield: 'miejsce_pracy', width: 150 },
  { text: 'Pion', datafield: 'pion', width: 150 },
  { text: 'Wydział', datafield: 'wydzial', width: 150 },
  { text: 'Wydział podległy', datafield: 'wydzial_podlegly', width: 150 },
  { text: 'Pokój', datafield: 'pokoj' }];
  filtergroup = new $.jqx.filter();
  options: jqwidgets.GridOptions =
  {
    localization: {
      pagergotopagestring: 'Idź do', pagerrangestring: 'z',
      pagershowrowsstring: 'Liczba wierszy', loadtext: 'Wczytywanie...',
      sortascendingstring: 'Sortuj rosnąco', sortdescendingstring: 'Sortuj malejąco',
      sortremovestring: 'Wyczyść sortowanie'
    },
    // enablebrowserselection: true,
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
    // showstatusbar: this.authService.checkIfUserBelongsToITStaff(),
    // renderstatusbar: this.createInsertButtonContainer,
    // selectionmode: 'singlerow',
    selectionmode: 'multiplecellsadvanced',
    sortable: true,
    source: this.dataAdapter,
    columnsresize: true,
    columns: this.columns
  };

  @ViewChild('gridReference') myGrid: jqxGridComponent;
  @ViewChild('jqxwindow1') editWindow: jqxWindowComponent;
  @ViewChild('msgNotification') msgNotification: jqxNotificationComponent;
  @ViewChild('cbJednostka') myJednostka: jqxDropDownListComponent; // jqxComboBoxComponent;
  @ViewChild('cbWydzial') myWydzial: jqxDropDownListComponent;
  @ViewChild('cbStanowisko') myStanowisko: jqxDropDownListComponent;
  @ViewChild('cbWydzialPodlegly') myWydzialPodlegly: jqxDropDownListComponent;
  @ViewChild('cbPion') myPion: jqxDropDownListComponent;
  @ViewChild('cbMiejscePracy') myMiejscePracy: jqxDropDownListComponent;
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
  @ViewChild('buttonReference2') myInsertButton1: jqxButtonComponent;


  constructor(private kontaktyService: KontaktyService, private authService: AuthenticationService,
    private messageService: MessageService, private sg: SimpleGlobal) {
  }

  // createInsertButtonContainer(statusbar: any): void {
  //   const buttonsContainer = document.createElement('div');
  //   buttonsContainer.style.cssText = 'overflow: hidden; position: relative; margin: 5px;';
  //   const addButtonContainer = document.createElement('div');
  //   addButtonContainer.id = 'buttonReference2';
  //   addButtonContainer.style.cssText = 'float: left; margin-left: 5px;';
  //   buttonsContainer.appendChild(addButtonContainer);
  //   statusbar[0].appendChild(buttonsContainer);
  // }



  buttonClicked() {
    let data = { id: null, login: null };
    let rowindex: number;
    if (!this.isInsertOperation) {
      rowindex = this.myGrid.getselectedcell().rowindex;
      // const data = this.myGrid.getrowdata(this.myGrid.getselectedrowindex());
      data = this.myGrid.getrowdata(rowindex);
    }
    const row = {
      id: data.id, imie: this.myImie.val(), nazwisko: this.myNazwisko.val(),
      jednostka: this.myJednostka.getSelectedItem().value, wydzial_podlegly: this.myWydzialPodlegly.getSelectedItem().value,
      pion: this.myPion.getSelectedItem().value, wydzial: this.myWydzial.getSelectedItem().value,
      stanowisko: this.myStanowisko.getSelectedItem().value, miejsce_pracy: this.myMiejscePracy.getSelectedItem().value,
      pokoj: this.myPokoj.val(), email: this.myEmail.val(), telefon: this.myTelefon.val(), komorka: this.myKomorka.val(),
      wewnetrzny: this.myWewnetrzny.val(), login: this.myLogin.val()
    };
    // this.myGrid.updaterow(this.myGrid.getrowid(this.myGrid.getselectedrowindex()), row);

    if (this.isInsertOperation) {
      row.id = 0;
      row.login = this.myLogin.val();
      this.myGrid.addrow(null, row, 'top');
    } else {
      this.myGrid.updaterow(this.myGrid.getrowid(rowindex), row);
    }

    this.isInsertOperation = false;
    this.editWindow.close();
  }

  button1Clicked() {
    this.isInsertOperation = false;
    this.editWindow.close();
  }

  button2Clicked() {
    const datarow: any = {
      jednostka: null, stanowisko: null, wydzial: '', wydzial_podlegly: '', pion: '', miejsce_pracy: null,
      imie: '', nazwisko: '', pokoj: '', telefon: '', komorka: '', wewnetrzny: '', login: '', email: ''
    }
      ;
    // if (this.initialLoad) { this.loadDropDownValues(); }
    this.isInsertOperation = true;
    // this.myLogin.disabled(!this.authService.checkIfUserBelongsToITStaff());
    this.setDropDownValues(datarow);
    this.editWindow.title('Dodawanie');
    this.editWindow.open();
  }


  ngAfterViewInit(): void {
    const _self = this;
    const inputSettings: jqwidgets.InputOptions = { width: '300px', height: '25px', theme: 'metro' };
    const disabledSettings: jqwidgets.InputOptions = {
      width: '300px', height: '25px', theme: 'metro' // , disabled: true
      // disabled: !this.authService.checkIfUserBelongsToITStaff()
    };
    this.myGrid.createComponent(this.options);
    this.editWindow.createWidget({
      width: 450, height: 530, theme: 'metro',
      resizable: false, isModal: true, autoOpen: false, modalOpacity: 0.5
    });

    const buttonOptions: jqwidgets.ButtonOptions = { theme: 'metro' };
    // let mySaveButton: jqwidgets.jqxButton = jqwidgets.createInstance($('#Save'), 'jqxButton', buttonOptions);
    // let myCancelButton: jqwidgets.jqxButton = jqwidgets.createInstance($('#Cancel'), 'jqxButton', buttonOptions);

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
    if (this.authService.checkIfUserBelongsToITStaff()) { this.myInsertButton1.createComponent(buttonOptions); }

    this.msgNotification.createComponent();

    if (this.initialLoad) { this.loadDropDownValues(); }
    // this.createInsertButton();
  };

  ngOnDestroy() {
  }
  editCellclick(event: any): void {
    if (event.args.datafield === 'edycja') {
      console.log('cell clicked: ' + event.args.rowindex + ': ' + event.args.datafield);
      if (this.authService.loggedIn()) {
        const datarow = event.args.row.bounddata;
        if (this.authService.checkIfUserHasPermissionToEdit(datarow)) {
          this.setDropDownValues(datarow);
          this.editWindow.title('Edycja');
          this.editWindow.open();
        } else {
          $('#notificationContent').html('Możesz edytować jedynie swoje dane');
          this.msgNotification.open();
        }
      } else {
        $('#notificationContent').html('W celu edycji danych należy się zalogować');
        this.msgNotification.open();
      }
    }
  }


  loadDropDownValues(): void {
    this.kontaktyService.getJednostki().subscribe(
      jed => {
        // jed.push('');
        this.myJednostka.createComponent({ source: jed, width: '300px', placeHolder: 'Wybierz wartość', selectedIndex: 0 });

      });
    this.kontaktyService.getStanowiska().subscribe(
      jed => {
        // jed.push('');
        this.myStanowisko.createComponent({ source: jed, width: '300px', placeHolder: 'Wybierz wartość', selectedIndex: 0 });

      });
    this.kontaktyService.getWydzialy().subscribe(
      jed => {
        // jed.push('');
        this.myWydzial.createComponent({ source: jed, width: '300px', placeHolder: 'Wybierz wartość', selectedIndex: 0 });

      });
    this.kontaktyService.getWydzialyPodlegle().subscribe(
      jed => {
        this.myWydzialPodlegly.createComponent({ source: jed, width: '300px', placeHolder: 'Wybierz wartość' });

      });
    this.kontaktyService.getPiony().subscribe(
      jed => {
        // jed.push('');
        this.myPion.createComponent({ source: jed, width: '300px', placeHolder: 'Wybierz wartość', selectedIndex: 0 });

      });
    this.kontaktyService.getMiejscaPracy().subscribe(
      jed => {
        // jed.push('');
        this.myMiejscePracy.createComponent({ source: jed, width: '300px', placeHolder: 'Wybierz wartość', selectedIndex: 16 });

      });
    this.initialLoad = false;

  }

  setDropDownValues(datarow: any): any {
    this.myJednostka.val(datarow.jednostka);
    this.myStanowisko.val(datarow.stanowisko);
    this.myWydzial.val(datarow.wydzial);
    this.myWydzialPodlegly.val(datarow.wydzial_podlegly);
    this.myPion.val(datarow.pion);
    this.myMiejscePracy.val(datarow.miejsce_pracy);

    this.myImie.val(datarow.imie);
    this.myNazwisko.val(datarow.nazwisko);
    this.myPokoj.val(datarow.pokoj);
    this.myEmail.val(datarow.email);
    this.myTelefon.val(datarow.telefon);
    this.myKomorka.val(datarow.komorka);
    this.myLogin.val(datarow.login);
    this.myWewnetrzny.val(datarow.wewnetrzny);
  }
}



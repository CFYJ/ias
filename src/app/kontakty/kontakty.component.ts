import { KontaktyService } from './../kontakty.service';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { jqxInputComponent } from 'jqwidgets-ts/angular_jqxinput';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Car } from '../car';
import { jqxGridComponent } from 'jqwidgets-ts/angular_jqxgrid';
import { jqxWindowComponent } from 'jqwidgets-ts/angular_jqxwindow';
import { jqxDateTimeInputComponent } from 'jqwidgets-ts/angular_jqxdatetimeinput';

@Component({
  selector: 'app-kontakty',
  templateUrl: './kontakty.component.html',
  styleUrls: ['./kontakty.component.scss']
})

export class KontaktyComponent implements AfterViewInit {
  cars: Car[];

  countries = new Array("Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Mongolia", "Morocco", "Monaco", "Mozambique", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Samoa", "San Marino", " Sao Tome", "Saudi Arabia", "Senegal", "Serbia and Montenegro", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe");
  ioptions: jqwidgets.InputOptions = {
    placeHolder: 'Wprowadź kraj',
    height: 25,
    width: 200,
    minLength: 1,
    source: this.countries,
    theme: 'metro'
  };

  url = 'http://localhost:5000/api/Delegacja';
  source =
  {
    datatype: 'json',
    datafields: [
      { name: 'id' },
      { name: 'idWystawcy' },
      { name: 'idDelegowanego' },
      { name: 'nr' },
      { name: 'czasOd', type: 'date' },
      { name: 'czasDo', type: 'date' },
      { name: 'miejscowosc' },
      { name: 'cel' },
      { name: 'srodek' },
      { name: 'dataWystawienia', type: 'date' },
      { name: 'wystawil' },
      { name: 'delegowany' },
      { name: 'wydzial' }
    ],
    id: 'id',
    url: this.url,
    updaterow: function (rowid: any, rowdata: any, commit: any) {
      let url = 'http://localhost:5000/api/Delegacja/' + rowdata.id;
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
      { text: 'Nr', datafield: 'nr', width: 100 },
      { text: 'Data od', datafield: 'czasOd', width: 100, columntype: 'date', cellsformat: 'yyyy-MM-dd' },
      { text: 'Data do', datafield: 'czasDo', width: 100, cellsformat: 'yyyy-MM-dd' },
      { text: 'Miejscowość', datafield: 'miejscowosc', width: 250 },
      { text: 'Cel', datafield: 'cel', width: 250 },
      { text: 'Środek', datafield: 'srodek' },
      { text: 'Data wystawienia', datafield: 'dataWystawienia', width: 125, cellsformat: 'yyyy-MM-dd' },
      { text: 'Wystawił', datafield: 'wystawil', width: 250, hidden: true },
      { text: 'Delegowany', datafield: 'delegowany', width: 250 },
      { text: 'Wydział', datafield: 'wydzial', width: 100 },
      {
        text: 'Edycja', datafield: 'edycja', width: 50, columntype: 'button',
        cellsrenderer: function () { return 'Edycja'; }
      }
    ]
  };

  @ViewChild('gridReference') myGrid: jqxGridComponent;
  @ViewChild('jqxwindow1') editWindow: jqxWindowComponent;
  @ViewChild('jqxdelegowany1') jqxdelegowany: jqxInputComponent;
  @ViewChild('dateInput') myDateInput: jqxDateTimeInputComponent;

  constructor(private kontaktyService: KontaktyService) { }

  ngAfterViewInit(): void {
    let dateInputSettings: jqwidgets.DateTimeInputOptions = { width: '300px', height: '25px', theme: 'metro' };
    let inputSettings: jqwidgets.InputOptions = { width: '300px', height: '25px', theme: 'metro' };


    let myInput: jqwidgets.jqxInput = jqwidgets.createInstance($('#input'), 'jqxInput', this.ioptions);
    this.kontaktyService.getCarsSmall().then(cars => this.cars = cars);

    this.myGrid.createComponent(this.options);
    this.editWindow.createWidget({
      width: 500, height: 400, theme: 'metro',
      resizable: false, isModal: true, autoOpen: false, cancelButton: $('#Cancel'), modalOpacity: 0.5
    });
    this.myDateInput.createComponent(dateInputSettings);
    let t: jqwidgets.jqxInput = jqwidgets.createInstance($('#delegowany'), 'jqxInput', inputSettings);

    //this.jqxdelegowany.createComponent({theme: 'metro'});
    let buttonOptions: jqwidgets.ButtonOptions = { theme: 'metro' };

    let mySaveButton: jqwidgets.jqxButton = jqwidgets.createInstance($('#Save'), 'jqxButton', buttonOptions);
    let myCancelButton: jqwidgets.jqxButton = jqwidgets.createInstance($('#Cancel'), 'jqxButton', buttonOptions);

    mySaveButton.addEventHandler('click', (event: any) => {
      var data = this.myGrid.getrowdata(this.myGrid.getselectedrowindex());
      //data.miejscowosc = $('#miejscowosc').val();

      var czasOd: Date = new Date($('#czasOd').val());
      var czasDo: Date = new Date($('#czasDo').val());

      var row = {
        id: data.id, idWystawcy: data.idWystawcy, idDelegowanego: data.idDelegowanego,
        nr: data.nr, czasOd: czasOd, czasDo: czasDo,
        miejscowosc: $('#miejscowosc').val(),
        cel: $('#cel').val(), srodek: $('#srodek').val(), dataWystawienia: data.dataWystawienia,
        wystawil: '', delegowany: $('#delegowany').val(), wydzial: data.wydzial
        //            quantity: parseInt($("#quantity").jqxNumberInput('decimal')),
        //price: parseFloat($("#price").jqxNumberInput('decimal'))
      };
      //var t = JSON.stringify(row);
      this.myGrid.updaterow(this.myGrid.getrowid(this.myGrid.getselectedrowindex()), row);
      this.editWindow.close();
      //alert('saved! ' + $('#miejscowosc').val());
    });
  };

  editCellclick(event: any): void {
    if (event.args.datafield === 'edycja') {
      console.log('cell clicked: ' + event.args.rowindex + ': ' + event.args.datafield);
      var datarow = event.args.row.bounddata;
      //$('#delegowany').jqxInput({theme: 'metro', width: 200});
      //this.delegowany.val(datarow.delegowany);
      //this.myDateInput.value(datarow.czasDo);
      $('#id').val(datarow.id);
      $('#nr').val(datarow.nr);
      $('#czasOd').val(datarow.czasOd);
      $('#czasDo').val(datarow.czasDo);
      $('#miejscowosc').val(datarow.miejscowosc);
      $('#cel').val(datarow.cel);
      $('#srodek').val(datarow.srodek);
      $('#dataWystawienia').val(datarow.dataWystawienia);
      $('#delegowany').val(datarow.delegowany);
      this.editWindow.open();
      //+this.myGrid.getrowdata(this.myGrid.getselectedrowindex()));
    }
  }

}



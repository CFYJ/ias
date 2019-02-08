import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy, AfterContentInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';
import { SimpleGlobal } from 'ng2-simple-global';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer } from '@angular/platform-browser';

import { jqxGridComponent } from 'jqwidgets-ts/angular_jqxgrid';
import { jqxWindowComponent } from 'jqwidgets-ts/angular_jqxwindow';

import { MessageService } from './../message.service';
import { AuthenticationService } from './../authentication.service';

import { Router } from "@angular/router";

@Component({
  selector: 'app-amortyzacja',
  templateUrl: './amortyzacja.component.html',
  styleUrls: ['./amortyzacja.component.scss']
})
export class AmortyzacjaComponent implements OnInit, AfterViewInit {

  /*amortyzacja: Amortyzacja[] = [
    {
    id: 1,
    nip: "0791919",
    nazwa: "Economic gmbh",
    kodPocztowy: "13-100",
    miejscowosc: "Grunewald",
    ulica: "Zjednoczenia",
    nrBudynku: "4a",
    nrLokalu: "4b",
    nrProjektu: "RPAM.1999.10.120.2019",
    tytul:  "Innowacyjne usługi",
    nazwaProgOper: "program operacyjny",
    dataRealizacjiOd: "2017-01-01",
    dataRealizacjiDo: "2017-10-20",
    kwotaWydKwal: 1039245.59,
    kwotaDofinansowania: 100.01
  },
  {
    id: 2,
    nip: "571100200",
    nazwa: "Firma ABC gmbh",
    kodPocztowy: "09-555",
    miejscowosc: "Grunewald",
    ulica: "Zjednoczenia",
    nrBudynku: "4a",
    nrLokalu: "4b",
    nrProjektu: "RPAM.1999.10.120.2019",
    tytul: "Superusługi",
    nazwaProgOper: "program operacyjny",
    dataRealizacjiOd: "2017-01-01",
    dataRealizacjiDo: "2017-10-20",
    kwotaWydKwal: 19245.59,
    kwotaDofinansowania: 1020.01
  },
  {
    id: 3,
    nip: "5991100200",
    nazwa: "Korporacja Beta",
    kodPocztowy: "17890",
    miejscowosc: "Wrocław",
    ulica: "Niska",
    nrBudynku: "40",
    nrLokalu: "8b",
    nrProjektu: "RPAM.1999.10.120.2019",
    tytul: "Superusługi",
    nazwaProgOper: "program operacyjny",
    dataRealizacjiOd: "2019-01-01",
    dataRealizacjiDo: "2019-01-20",
    kwotaWydKwal: 9245.59,
    kwotaDofinansowania: 1020.01
  }

]*/



  @ViewChild('listGrid') listGrid: jqxGridComponent;

  constructor(private authService: AuthenticationService, private messageService: MessageService,
    private sg: SimpleGlobal, private sanitizer: DomSanitizer, private router: Router) {
    // if(!authService.checkIfUserIsInRole('helpdesk'))      
    // this.router.navigate(['/login']);
  }



  ngOnInit() {

  }

  ngAfterViewInit() {
    this.listGrid.createComponent(this.options);
  }

  source = {
    datatype: 'json',

    datafields: [
      { name: 'a', type: 'string' },
      { name: 'b', type: 'string' },
      { name: 'c', type: 'string' },
      { name: 'd', type: 'string' },
      { name: 'e', type: 'string' },
      { name: 'f', type: 'string' },
      { name: 'g', type: 'string' },
      { name: 'h', type: 'string' },
      { name: 'i', type: 'string' },
      { name: 'j', type: 'string' },
      { name: 'k', type: 'string' },
      { name: 'l', type: 'string' },
      { name: 'm', type: 'string' },
      { name: 'n', type: 'string' },
    ],
    //id: 'a',
    url: this.sg['SERVICE_URL'] + 'Amortyzacja/GetRows',
    //headers:{'Authorization':'ddd'},
    //localdata:this.amortyzacja,
    root: 'rows',
    beforeprocessing: function (data) {
      this.totalrecords = data.totalRows;
    },

    filter: () => {
      // update the grid and send a request to the server.
      this.listGrid.updatebounddata();
      this.tresczgloszenia = "";
    },


  };

  dataAdapter = new $.jqx.dataAdapter(this.source, {
    beforeSend: function (jqXHR, settings) {
      jqXHR.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('user'));
    }
  });

  options: jqwidgets.GridOptions = {
    localization: {
      pagergotopagestring: 'Idź do', pagerrangestring: ' z ',
      pagershowrowsstring: 'Liczba wierszy', loadtext: 'Wczytywanie...',
      sortascendingstring: 'Sortuj rosnąco', sortdescendingstring: 'Sortuj malejąco',
      sortremovestring: 'Wyczyść sortowanie', emptydatastring: 'Brak danych',
      filtershowrowdatestring: "Pokaż rekordy gdzie data jest:",
      filtershowrowstring: "Pokaż rekordy spełniające warunek:",
      filterdatecomparisonoperators: ['równa', 'różna', 'mniejsza', 'mniejsza lub równa', 'większa', 'większa lub równa', 'null', 'not null'],
    },
    width: '100%',
    columnsresize: true,
    filterable: true,
    autoshowfiltericon: true,
    //filtermode: 'excel',
    showfilterrow: true,
    pagesize: 5,
    autorowheight: true,
    autoheight: true,
    altrows: true,
    enabletooltips: false,
    columnsheight: 30,
    theme: 'metro',
    pageable: true,
    selectionmode: 'multiplecellsadvanced',
    virtualmode: true,
    rendergridrows: function (data) {
      return data.data;
    },
  };


  columns: any[] =
    [
      { text: 'Beneficjent NIP', datafield: 'a', width: 110 },
      { text: 'Beneficjent Nazwa', datafield: 'b', minwidth: 140 },
      { text: 'B. kod pocztowy', datafield: 'c', minwidth: 40 },
      { text: 'Miejscowość', datafield: 'd', minwidth: 100 },
      { text: 'Ulica', datafield: 'e', minwidth: 140 },
      { text: 'Nr bud.', datafield: 'f', minwidth: 35 },
      { text: 'Nr lok.', datafield: 'g', minwidth: 35 },
      { text: 'Nr proj.', datafield: 'h', minwidth: 140 },
      { text: 'Tytuł projektu', datafield: 'i', minwidth: 140 },
      { text: 'Nazwa prog. oper.', datafield: 'j', minwidth: 140 },
      { text: 'Data real. od', datafield: 'k', minwidth: 140 },
      { text: 'Data real. do', datafield: 'l', minwidth: 140 },
      { text: 'Kwota wyd. kwal.', datafield: 'm', minwidth: 140 },
      { text: 'Kwota Dof.', datafield: 'n', minwidth: 140 }
    ];


  tresczgloszenia: string = ""
  editCellclick(event: any) {
    this.tresczgloszenia = event.args.row.bounddata['tresc'];
  }

}

export interface Amortyzacja {
  a?: string,
  b?: string,
  c?: string,
  d?: string,
  e?: string,
  f?: string,
  g?: string,
  h?: string,
  i?: string,
  j?: string,
  k?: string,
  l?: string,
  m?: string,
  n?: string,
  o?: string
}

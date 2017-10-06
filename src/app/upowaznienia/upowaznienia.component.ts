import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { jqxGridComponent } from 'jqwidgets-ts/angular_jqxgrid';
import { SimpleGlobal } from 'ng2-simple-global';
import { UpowaznieniaService } from './../upowaznienia.service';
import { MessageService } from './../message.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService } from './../authentication.service';

@Component({
  selector: 'app-upowaznienia',
  templateUrl: './upowaznienia.component.html',
  styleUrls: ['./upowaznienia.component.scss'],

 
})

//export class UpowaznieniaComponent implements OnInit {
  export class UpowaznieniaComponent implements OnInit{

  constructor(private upowaznieniaService: UpowaznieniaService,
    private authService: AuthenticationService,private messageService: MessageService,
    private sg: SimpleGlobal) { }

    message: any = 'message';
    subscription: Subscription;
   // jednostki: string[];
    initialLoad = true;
    isInsertOperation = false;
  

  ngOnInit() {
    const _self = this;
    this.myGrid.createComponent(this.options);
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
    // const _self = this;
    // this.myGrid.createComponent(this.options);

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
  };

  // dataAdapter: any = new $.jqx.dataAdapter(this.source);
  dataAdapter = new $.jqx.dataAdapter(this.source, {
    formatData: function (data: any) {
      return data;
    }
  });

  @ViewChild('gridReference') myGrid: jqxGridComponent;



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


}

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
import { AgmCoreModule, GoogleMapsAPIWrapper, MapsAPILoader, AgmMap  } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { jqxTreeComponent} from 'jqwidgets-ts/angular_jqxtree';
import { jqxSplitterComponent} from 'jqwidgets-ts/angular_jqxsplitter';
import { jqxListBoxComponent} from 'jqwidgets-ts/angular_jqxlistbox';
import { jqxTabsComponent} from 'jqwidgets-ts/angular_jqxtabs';

declare var google: any;

@Component({
  selector: 'app-kontakty',
  templateUrl: './kontakty.component.html',
  styleUrls: ['./kontakty.component.scss'],
  
})

export class KontaktyComponent implements AfterViewInit, OnDestroy, OnInit {


  
  constructor(private kontaktyService: KontaktyService, private auth: AuthenticationService,
    private messageService: MessageService, private sg: SimpleGlobal, private _mapsAPILoader: MapsAPILoader) {

    this.authService = auth;
   
  }



  message: any = 'message';
  subscription: Subscription;
  jednostki: string[];
  initialLoad = true;
  isInsertOperation = false;

  lat: number = 53.370220573956786;
  lng: number = 20.4290771484375;
  mapZoom: number = 8;  
  @ViewChild(AgmMap)
  public agmMap: AgmMap

  authService: any;

  //#region ************* geocodowanie adresow z pliku, najlepiej w paczkach max 200 adresow ***************** */
  lines: any;
  licznik=1;
  tmplines: string[]=[];
  obrot= 1;
  uploadFile(event) {    
    var files = event.target.files; // FileList object
    
    var f = files[0];

    var reader = new FileReader();

    reader.onload = ((theFile)=> {
              return async (e)=> {
                
                  var fileContent=e.target.result;

                  var addressContainer: any;
                  
                  var lines = "";//fileContent.split("\n");
                  this.lines = fileContent.split("\n");
                  this.geocodeAddress();

                  var l= false;
                  if(l){
                    for(var i =1; i<lines.length;i++){
                      var line = lines[i].split(";");

                          await this.sleep(2000);
                          console.log(i);

      
                      this.getLatLan(line[8], String(i)).then(data => {
                            //console.log("wynik geodecodera: "+data);
                            
                            var res = "";
                            for(let k in data)
                              res=res+data[k];


                            //#region zapis do pliku
                            if(data!==null && data!=="")
                              $.ajax({                                  
                                url: this.sg['SERVICE_URL'] + 'Kontakties/AddAddress?linia='+ lines[res.split(';')[2]]+";"+res.split(';')[0]+";"+res.split(';')[1],                                  
                                type: 'POST',    
                                success: function (data: any, status: any, xhr: any) {                               
                                },
                                error: function (jqXHR: any, textStatus: any, errorThrown: any) {
                                  //alert(textStatus + ' - ' + errorThrown);
                            
                                }
                              });
                            
                            //#endregion
                          }).catch(error => { console.log(error);});                          
                    }
                    console.log('koniec');
                  }
              };
            })(f);
      
            // Read in the image file as a data URL.
            console.log("w2: "+reader.readAsText(f));
    
  }

  getLatLan(address: string, licznik: string) {
    //console.log('Getting Address - ', address);
    return new Promise((resolve, reject) => {
    let geocoder = new google.maps.Geocoder();

    geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              //console.log("wynik:"+results[0].geometry.location);
              resolve( results[0].geometry.location.lat()+";"+results[0].geometry.location.lng()+";"+licznik);
              //return results[0].geometry.location.lat()+";"+results[0].geometry.location.lng();

            } else {
                reject( console.log('Error - ', results, ' & Status - ', status));
                //console.log('Error - ', results, ' & Status - ', status);
    
            }
    })

    })
  }

  async geocodeAddress() {   
    let geocoder = new google.maps.Geocoder();
    let address = this.lines[this.licznik].split(";")[8];


    geocoder.geocode( { 'address': address},async (results, status)=> {
            if (status == google.maps.GeocoderStatus.OK) {           
              //return results[0].geometry.location.lat()+";"+results[0].geometry.location.lng();
              var res=results[0].geometry.location;

              
              //#region zapis do pliku
              $.ajax({                                  
                url: this.sg['SERVICE_URL'] + 'Kontakties/AddAddress?linia='+this.lines[this.licznik]+";"+res.lat()+";"+res.lng(),                                  
                type: 'POST',    
                success: function (data: any, status: any, xhr: any) {                               
                },
                error: function (jqXHR: any, textStatus: any, errorThrown: any) {
                  //alert(textStatus + ' - ' + errorThrown);       
                }
              });          
              //#endregion

              
              // this.markers.push({
              //   lat: res.lat(),
              //   lng: res.lng(),
              //   label: String(this.licznik),
              //   draggable: false,
              //   address: ''
              // })                 

            } else {   
              if(status.indexOf('QUERY_LIMIT')!=-1){
                this.tmplines.push(this.lines[this.licznik]);
                //await this.sleep(10000);
              }
              console.log('Error - ', results, ' & Status - ', status);
  
            }

            await this.sleep(2000);
            console.log(this.licznik);
            this.licznik++;
            if(this.licznik<this.lines.length){    
              this.geocodeAddress();
            }
            else{
            this.obrot++;
            console.log(this.obrot);
            if(this.tmplines.length>0){
                this.lines = this.tmplines;
                this.tmplines=[];
                this.licznik = 0;
                await this.sleep(10000);
                this.geocodeAddress();
            }
            else
              console.log("koniec");  

            }
    });

  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  //#endregion ******************************************************************************************************************* */


  markers: marker[]=[];
  //mclusterers: mclusterer[]=[];//new Array(16);
  //zmiana koloru markera przez podanie ponizszego linka z kolorem na koncu
  iconurl = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|0080FF";
  
  mapLoaded: boolean=false;
  loadMap(){
    try{
      this.mapLoaded = true; 
       this.prepareMap(); 
      // this.agmMap.triggerResize();
      //console.log('dfd');
    }catch(error){};
  }

  prepareMap(){

    this._mapsAPILoader.load().then(() => {
      //.then(()=>{console.log('wczytano mape');}).catch((error)=>{console.log('inny blad mapy:'+error);});
     try{
      this.agmMap.triggerResize();
      //this.refreshMap();
      this.agmMap.zoom =8;
     }catch(error){};
    });

  }


  mapClick(event){ 
    var obj = event['coords'];
    for(var i in obj)
     console.log(i+": "+obj[i]);
  }

  loadMarkers(){

    //this.markerclusterers = new Array<markerclusterer>();

    var wojarray=['dolnośląskie','kujawsko-pomorskie','lubelskie',
    'lubuskie','łódzkie','małopolskie','mazowieckie','opolskie',
    'podkarpackie','podlaskie','pomorskie','śląskie','świętokrzyskie',
    'warmińsko-mazurskie','wielkopolskie','zachodniopomorskie'];

    
    // for(let i=0; i<16; i++){
    //   let tmp: marker[]=[];
    //   this.mclusterers.push(new mclusterer(tmp));
    // }


      // this.mclusterers[0].m.push({
      // lat: Number(0),
      // lng: Number(0),
      // label: "",
      // draggable: false,
      // address: ""    
      // });
    
      $.ajax({
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        url: this.sg['SERVICE_URL'] + 'Kontakties/GetJednostkiKas' ,
        type: 'POST',
        success: (data: any, status: any, xhr: any)=>{

          for(var marker in data){
            var markerobj ={
              lat: Number(data[marker].lat),
              lng: Number(data[marker].lng),
              label: data[marker].typ+" "+ data[marker].kodJednostki,
              draggable: true,
              typ: data[marker].typ,
              wojewodztwo: data[marker].wojewodztwo,
              kod: data[marker].kodJednostki,
              nazwa: data[marker].nazwaUrzedu,
              miasto: data[marker].kodPocztowy+" "+ data[marker].miasto,
              ulica: data[marker].ulica+" "+data[marker].nrLokalu,
              poczta: data[marker].poczta,
              telefon: data[marker].telefon,
              fax: data[marker].fax,
              email: data[marker].email,
            };

            //this.mclusterers[wojarray.indexOf(data[marker].wojewodztwo)].m.push(markerobj);

             this.markers.push(markerobj);
          }

          this.generateTreeSource();

        },
        error: function (jqXHR: any, textStatus: any, errorThrown: any) {
          alert(textStatus + ' - ' + errorThrown);
        }
      });
  }

  treeSource: any[]=[ ];
  generateTreeSource(){

    var wojarray=['dolnośląskie','kujawsko-pomorskie','lubelskie',
    'lubuskie','łódzkie','małopolskie','mazowieckie','opolskie',
    'podkarpackie','podlaskie','pomorskie','śląskie','świętokrzyskie',
    'warmińsko-mazurskie','wielkopolskie','zachodniopomorskie'];
    //icon:"/images/folder.png",
    for(let i in wojarray){
      this.treeSource.push({ label: wojarray[i], items: []=[]});
    
      var ias = (this.markers.filter(x=>x.typ=="IAS")).filter(x=>x.wojewodztwo == wojarray[i]);
      this.treeSource[i].items.push({ label: ias[0].kod+" "+ ias[0].nazwa.replace('Izba Administracji Skarbowej', 'IAS'), items: []=[]});
      var usy = (this.markers.filter(x=>x.typ==="US" || x.typ==="WUS")).filter(x=>x.wojewodztwo == wojarray[i]);
      for(let us in usy){
        this.treeSource[i].items[0].items.push({ label: usy[us].kod+" "+ usy[us].nazwa.replace('Urząd Skarbowy', 'US')})
      }

      var ucs = (this.markers.filter(x=>x.typ=="UCS")).filter(x=>x.wojewodztwo == wojarray[i]);
      this.treeSource[i].items.push({ label: ucs[0].kod+" "+ ucs[0].nazwa.replace('Urząd Celno-Skarbowy', 'UCS'), items: []=[]});
      var ocsy = (this.markers.filter(x=>x.typ==="OC" || x.typ==="DUCS")).filter(x=>x.wojewodztwo == wojarray[i]);
      for(let oc in ocsy){
        this.treeSource[i].items[1].items.push({ label: ocsy[oc].kod+" "+ocsy[oc].nazwa.replace('Oddział Celny', 'OC')})
      }


      
    }
    this.myTree.source(this.treeSource);
  }

  myTreeOnSelect(event : any): void{
    let args = event.args;
    let item = this.myTree.getItem(args.element);
    let kod = item.label.split(' ')[0];

    this.mapSearch.val(null);
    this.ListBoxSource= [];
    try{
      if(Number(kod)>0){
        let obj = this.markers.filter(x=>x.kod===kod);
      
        this.setUnitInfo(obj[0]);      
      }
    }catch(ex){}

  }

  setUnitInfo(obj: marker){
    $("#unitInfo").html(
      "<strong>kod: </strong>"+obj.kod+"<br>"+
      "<strong>miasto: </strong>"+obj.miasto+"<br>"+
      "<strong>ulica: </strong>"+obj.ulica+"<br>"+
      "<strong>poczta: </strong>"+obj.poczta+"<br>"+
      "<strong>telefon: </strong>"+obj.telefon+"<br>"+
      "<strong>fax: </strong>"+obj.fax+"<br>"+
      "<strong>email: </strong>"+obj.email+"<br>"
    );

    this.lat = obj.lat;
    this.lng = obj.lng;
    this.mapZoom = 15;
  }


  ListBoxSource: Array<string>=[];
  mapSearchChange(event: any){
    var text = this.mapSearch.val();
    if(Number(event.keyCode)==8){
      text = text.substring(0, text.length-1);}
    else{
      if(48<=event.keyCode && event.keyCode<=90)
        text=text+String.fromCharCode(event.keyCode);
      }

    this.ListBoxSource = [];
    if(text.length>=2){
      
      if(Number(text)>0){
      
        let lista = this.markers.filter(x=>x.kod.startsWith(text));   
        for(let i in lista){
          this.ListBoxSource.push(lista[i].kod+" "+lista[i].nazwa);
        }
      }
      else{     
        let lista = this.markers.filter(x=>x.nazwa.toUpperCase().includes(text.toUpperCase()));   
        for(let i in lista){
          this.ListBoxSource.push(lista[i].kod+" "+lista[i].nazwa);
        }
      }
    }
  }

  ListBoxSelect(event: any){
    // for(let i in event.args.item)
    //   console.log(i+": "+event.args.item[i]);
    let obj = this.markers.filter(x=>x.kod === (event.args.item.value.split(" ")[0]))[0];
    this.setUnitInfo(obj);
  }

  
  // Tabclick(event: any){
  //   //console.log(this.mapLoaded);
  //   if(Number(event.args.item)==1 && !this.mapLoaded)   
  //    {   
  //     //this.mapLoaded = true; 
  //     //this.prepareMap();    
  //    }
  //   //  else
  //   //   this.mapLoaded = false;
  // }

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
      if(this.saveEdited)
      $.ajax({
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        url: this.sg['SERVICE_URL'] + 'Kontakties/PutKontakty/' + rowdata.id,
        data: t,
        type: 'PUT',
        success:  (data: any, status: any, xhr: any) =>{
          this.saveEdited = false;
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
  columns = 
  [{
      text: '', datafield: 'edycja', width: 50, 
      //columntype: 'button'
      //, 
      filterable: false,
      cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
        return 'Edycja';
      },
    },
    { text: 'Login', datafield: 'login', width: 100, hidden: true},//hidden: !this.authService.checkIfUserIsInRole('kontakty_administrator') 
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
    { text: 'Pokój', datafield: 'pokoj'}];

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
    width:'100%',
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

  //#region chiledviews
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
  @ViewChild('myTree') myTree: jqxTreeComponent;
  @ViewChild('mySplitter') mySplitter: jqxSplitterComponent;
  @ViewChild('mySplitter2') mySplitter2: jqxSplitterComponent;
  @ViewChild('myListBox') myListBox: jqxListBoxComponent;
  @ViewChild('mapSearch') mapSearch: jqxInputComponent;
  @ViewChild('tabsReference') tabsReference: jqxTabsComponent;
  //#endregion

  // constructor(private kontaktyService: KontaktyService, private auth: AuthenticationService,
  //   private messageService: MessageService, private sg: SimpleGlobal, private _mapsAPILoader: MapsAPILoader) {
  //     this.authService = auth;
  // }

  // createInsertButtonContainer(statusbar: any): void {
  //   const buttonsContainer = document.createElement('div');
  //   buttonsContainer.style.cssText = 'overflow: hidden; position: relative; margin: 5px;';
  //   const addButtonContainer = document.createElement('div');
  //   addButtonContainer.id = 'buttonReference2';
  //   addButtonContainer.style.cssText = 'float: left; margin-left: 5px;';
  //   buttonsContainer.appendChild(addButtonContainer);
  //   statusbar[0].appendChild(buttonsContainer);
  // }


  saveEdited : boolean=false;
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
      this.saveEdited = true;
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

  ngOnInit():void {
    
    this.loadMarkers();

   this.columns[1]['hidden'] = !this.authService.checkIfUserIsInRole('kontakty_administrator');
  }

  ngAfterViewInit(): void {
   
    $(()=>{ $("#mapSearch").keydown((event)=>{this.mapSearchChange(event);})});
    
   

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
    if (this.authService.checkIfUserIsInRole('kontakty_administrator')) { this.myInsertButton1.createComponent(buttonOptions); }

    this.msgNotification.createComponent();
    this.myTree.createComponent();
    this.mySplitter.createComponent();
    this.mySplitter2.createComponent();
    this.myListBox.createComponent();
    this.mapSearch.createComponent();
    this.tabsReference.createComponent();

    if (this.initialLoad) { this.loadDropDownValues(); }
    // this.createInsertButton();
  };

  ngOnDestroy() {
  }
  editCellclick(event: any): void {
    if (event.args.datafield === 'edycja') {
      //console.log('cell clicked: ' + event.args.rowindex + ': ' + event.args.datafield);
      if (this.authService.loggedIn()) {
        const datarow = event.args.row.bounddata;
        // if (this.authService.checkIfUserHasPermissionToEdit(datarow)) {
        //   this.setDropDownValues(datarow);
        //   this.editWindow.title('Edycja');
        //   this.editWindow.open();
        // } 

        //console.log(datarow.wydzial+' '+this.authService.getUserData().Login);

        if (this.authService.checkIfUserIsInRole('kontakty_administrator') || 
        (this.authService.checkIfUserIsInRole('kontakty_kierownik') && this.authService.getUserData().Wydzial==datarow.wydzial && this.authService.getUserData().Pion==datarow.pion) ||
        (this.authService.getUserData().Login==datarow.login)) {
          this.setDropDownValues(datarow);
          this.editWindow.title('Edycja');
          this.editWindow.open();
        } 
        else {
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



interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
  //address: string;
  wojewodztwo: string,
  typ: string,
  kod: string,
  nazwa: string;
  miasto: string;
  ulica: string;
  poczta: string;
  telefon: string;
  fax: string;
  email: string;

}

export class mclusterer {
  public m: marker[]=[];
  constructor(m: marker[]) {this.m = m;}
}




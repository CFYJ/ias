import { SimpleGlobal } from 'ng2-simple-global';
import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy  } from '@angular/core';
import { jqxTabsComponent} from 'jqwidgets-ts/angular_jqxtabs';
import { jqxButtonComponent } from 'jqwidgets-ts/angular_jqxbuttons';
import { jqxGridComponent } from 'jqwidgets-ts/angular_jqxgrid';
import { jqxToolBarComponent} from 'jqwidgets-ts/angular_jqxtoolbar';
import { AuthenticationService } from './../authentication.service';
import { forEach } from '@angular/router/src/utils/collection';
import { jqxWindowComponent } from 'jqwidgets-ts/angular_jqxwindow';
import { NoConflictStyleCompatibilityMode } from '@angular/material/typings/core/compatibility/compatibility';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

import {Router} from "@angular/router";
//import { jqxDragDropComponent} from 'jqwidgets-ts/angular_jqxdragdrop';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements AfterViewInit,OnInit  {


  selectedRoleRole: any=0;
  selectedUserUser: any=0;

  @ViewChild('tabsControll') tabsControll: jqxTabsComponent;
  @ViewChild('securityToolBar') securityToolBar:jqxToolBarComponent;

  @ViewChild('jqxwindowRole') windowEditRole:jqxWindowComponent;
  @ViewChild('buttonSaveReference') mySaveButton1: jqxButtonComponent;
  @ViewChild('buttonCancelReference') myCancelButton1: jqxButtonComponent;
  
  @ViewChild('jqxwindowDelete') deleteWindow: jqxWindowComponent;
  @ViewChild('buttonDelYesReference') myDelYesButton: jqxButtonComponent;
  @ViewChild('buttonDelNoReference') myDelNoButton: jqxButtonComponent;

  @ViewChild('gridRoleRole') gridRoleRole: jqxGridComponent;
  @ViewChild('gridallusersRole') gridallusersRole: jqxGridComponent;
  @ViewChild('gridusersinroleRole') gridusersinroleRole: jqxGridComponent;

  @ViewChild('gridusersusers') gridusersusers: jqxGridComponent;
  @ViewChild('gridusersrolerusers') gridusersrolerusers : jqxGridComponent;
  @ViewChild('gridallrolerusers') gridallrolerusers: jqxGridComponent;

  @ViewChild('jqxwindowUserInfo') historyWindow: jqxWindowComponent;



  constructor(private sg: SimpleGlobal, private authService: AuthenticationService, private router:Router) {
    if(!authService.checkIfUserIsInRole('system_admin'))      
      this.router.navigate(['/login']);
   }

  ngOnInit() {
  }

  ngAfterViewInit(){

    this.tabsControll.createComponent();
    this.securityToolBar.createComponent();

    this.windowEditRole.createWidget({ width: 390, height: 250, theme: 'metro',
    resizable: false, isModal: true, autoOpen: false, modalOpacity: 0.5,})
    this.mySaveButton1.createComponent();
    this.myCancelButton1.createComponent();

    this.deleteWindow.createWidget({
      width: 450, height:130, theme: 'metro',
      resizable: false, isModal: true, autoOpen: false, modalOpacity: 0.5
    });
    this.myDelYesButton.createComponent();
    this.myDelNoButton.createComponent();

    
    this.gridRoleRole.createComponent(this.rolerolegridoptions);
    this.gridallusersRole.createComponent(this.allusersrolegridoptions);
    this.gridusersinroleRole.createComponent(this.usersinrolerolegridoptions);

    this.gridusersusers.createComponent(this.usersusersgridoptions);
    this.gridusersrolerusers.createComponent(this.usersrolerusersgridoptions);
    this.gridallrolerusers.createComponent(this.allroleusersgridoptions);

    this.historyWindow.createComponent({width: 650, height:430, theme: 'metro',
    resizable: false, isModal: true, autoOpen: false, modalOpacity: 0.5});

  }

  //#region zakladka role

    tools: string ='toggleButton toggleButton toggleButton';
    initTools: any =  (type: string, index: number, tool: any, menuToolIninitialization): void => {
      switch (index) {
        case 0:      
              tool.jqxToggleButton({ width: 90, toggled:false});
              tool.theme='darkblue';
              tool.text("Nowa rola");
              tool.on("click", ()=>{
                this.buttonAddClicked();

              });
              break;
        case 1:
                tool.jqxToggleButton({ width: 90, toggled:false });
                tool.text("Edytuj");
                tool.on("click", ()=>{
                  this.editCellclick();
                });
                break;
        case 2:
                tool.jqxToggleButton({ width: 90, toggled:false});
                tool.text("Usuń");
                tool.on("click", ()=>{
                  this.buttonDelClicked();
                });
                break;
      };
      
    };

    //#region toolbar buttons

    isInsertOperation: any=false;
    editobject: any;
    selectedrole: any;
    selectedRowId: any;
    buttonAddClicked(){
      const datarow: any = {
        rola: '', modul: '', opis: ''
      }
        ;
      // if (this.initialLoad) { this.loadDropDownValues(); }
      this.isInsertOperation = true;
      // this.myLogin.disabled(!this.authService.checkIfUserBelongsToITStaff());
      //this.setEditValues(datarow);
      this.editobject = datarow
      this.windowEditRole.title('Dodawanie');
      this.windowEditRole.open();
    }

    editCellclick(){
      if(this.selectedrole != null){
        const datarow: any = {
          rola: this.selectedrole.rola, modul: this.selectedrole.modul, opis: this.selectedrole.opis
        }
        this.editobject = this.selectedrole;
        this.isInsertOperation = false;
        this.windowEditRole.title('Edycja');
        this.windowEditRole.open();
      }
    }

    cancelEditClick(){
      this.windowEditRole.close();
    }

    buttonSaveClicked(){
      // alert($('#nazwa').val());
      //console.log('wynik:'+this.editobject['nazwa']);
      let data = { id: null };
      let rowindex: number;
      if (!this.isInsertOperation) {
        rowindex =this.selectedRowId;
        data =this.editobject;
      }
      const row = {
        id: data.id, 
        rola: this.editobject['rola'],
        modul: this.editobject['modul'], 
        opis:  this.editobject['opis'],
      };
   
      if (this.isInsertOperation) {
        row.id = 0;     
        this.gridRoleRole.addrow(null, row, 'top');
      } else {    
        this.gridRoleRole.updaterow(this.gridRoleRole.getrowid(rowindex), row);
      }

      this.isInsertOperation = false;
      this.windowEditRole.close();
    }

    
    buttonDelClicked() { 
      //if(this.editobject.id != null)
      {
        $('#questionTagWindow').html("Czy skasować "+this.editobject.rola+"?");
        this.deleteWindow.title("Kasowanie rekordu");
        this.deleteWindow.open();
      }
    }
  
    buttondelnoClicked(){
        this.deleteWindow.close();
    }

    buttondelyesClicked(){
      console.log('ffff'+this.editobject.id);
        this.gridRoleRole.deleterow(this.editobject.id);
        this.deleteWindow.close();

        this.selectedRowId = null;
        this.editobject = null;
        this.selectedrole = null;

        //this.selectedRow = null;
     
    }

    //#endregion

    //#region gridRoleRole

    roleroleCellClicked(event: any){

      this.selectedrole = this.editobject = event.args.row.bounddata;     
      this.selectedRoleRole = event.args.row.bounddata['uid'];      
      this.selectedRowId = event.args.rowindex;
      this.gridallusersRole.updatebounddata();
      this.gridusersinroleRole.updatebounddata();
    }

    rolerolesource=
    {
      datatype: 'json',

        datafields:[  
          {name: 'id'},   
          {name: 'rola', type:'string'},   
          {name: 'modul', type:'string'},   
          {name: 'opis', type:'string'},   
        ],
        id:'id',
        url: this.sg['SERVICE_URL']+'ADAuthentication/GetRole',

        addrow: (rowid: any, rowdata: any, position: any, commit: any) => {
          const t = JSON.stringify(rowdata);
          $.ajax({
            cache: false,
            dataType: 'json',
            contentType: 'application/json',
            url: this.sg['SERVICE_URL'] + 'ADAuthentication/AddRole',
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
          $.ajax({
            cache: false,
            dataType: 'json',
            contentType: 'application/json',
            url: this.sg['SERVICE_URL'] + 'ADAuthentication/UpdateRole/' + rowdata.id,
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
          console.log('hh'+rowindex);
          $.ajax({
            cache: false,
            dataType: 'json',
            contentType: 'application/json',
            url: this.sg['SERVICE_URL'] + 'ADAuthentication/DelRole/' + rowindex,
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

    roleroledataAdapter = new $.jqx.dataAdapter(this.rolerolesource);

    
    rolerolegridoptions: jqwidgets.GridOptions ={    
      localization: {
        pagergotopagestring: 'Idź do', pagerrangestring: ' z ',
        pagershowrowsstring: 'Liczba wierszy', loadtext: 'Wczytywanie...',
        sortascendingstring: 'Sortuj rosnąco', sortdescendingstring: 'Sortuj malejąco',
        sortremovestring: 'Wyczyść sortowanie'
      },
    
      //height:'100%',
      columnsresize: true,
      
      filterable: true,
      autoshowfiltericon: true,
      filtermode: 'excel',
      showfilterrow: true,
      //pagesize:10,

      autorowheight: true,
      autoheight: true,
      altrows: true,
      enabletooltips: false,
      
      columnsheight:30,
      theme: 'metro',

      source: this.roleroledataAdapter,

      //pageable: true,

    };

    
    rolerolecolumns: any[] =
    [

      { text: 'Rola', datafield: 'rola',  width: 150},
      { text: 'Moduł', datafield: 'modul',  width: 120},
      { text: 'Opis', datafield: 'opis',  },
    ]
    //#endregion

    //#region gridusersinroleRole


      usersinrolerolesource={
          datatype: 'json',
          totalrecords: 10,
          unboundmode: true,
    
          datafields:[     
            {name: 'nazwa', type:'string'},  
            {name: 'login', type:'string'},
            {name: 'wydzial', type:'string'} 
          ],
          id:'id',
          url: this.sg['SERVICE_URL']+'ADAuthentication/GetUsersInRole',
          data: {
            id: this.selectedRoleRole
          },
          addrow: (rowid: any, rowdata: any, position: any, commit: any) => {
            const t = JSON.stringify(rowdata);  
            $.ajax({
              cache: false,
              dataType: 'json',
              contentType: 'application/json',
              url: this.sg['SERVICE_URL'] + 'ADAuthentication/AddUserRole',
              data: t,
              type: 'POST',
              success: function (data: any, status: any, xhr: any) {
                //alert('Wstawiono nowy rekord - id: ' + data.id);
                rowdata.id = data.id;
                rowdata.nazwa = data.imie+" "+data.nazwisko;
                rowdata.wydzial = data.wydzial;
                rowdata.login = data.login;
                // for(let i in data)
                // console.log(i+" "+data[i]);

                commit(true);                  
              },
              error: function (jqXHR: any, textStatus: any, errorThrown: any) {
                alert(textStatus + ' - ' + errorThrown);
                commit(false);
              }
            })
          },
          deleterow: (rowdata: any, commit: any) => {
            commit(true);
          },
      
      };
    
      usersinroleroledataAdapter = new $.jqx.dataAdapter(this.usersinrolerolesource,
        
        {formatData: (data)=> {
          $.extend(data, {
            id: this.selectedRoleRole
          });
          return data;
        }
      }
      
      );

      usersinrolerolegridoptions: jqwidgets.GridOptions ={    
        localization: {
          pagergotopagestring: 'Idź do', pagerrangestring: ' z ',
          pagershowrowsstring: 'Liczba wierszy', loadtext: 'Wczytywanie...',
          sortascendingstring: 'Sortuj rosnąco', sortdescendingstring: 'Sortuj malejąco',
          sortremovestring: 'Wyczyść sortowanie'
        },
      
        //height:'100%',
        columnsresize: true,
        
        filterable: true,
        autoshowfiltericon: true,
        filtermode: 'excel',
        showfilterrow: true,
        pagesize:20,
    
        autorowheight: true,
        //autoheight: true,
        altrows: true,
        enabletooltips: false,
        
        columnsheight:30,
        theme: 'metro',
    
        source: this.usersinroleroledataAdapter,
    
        pageable: true,
    
      };
    
    
      //#endregion

    //#region gridallusersRole


    allusersrolesource=
    {
      datatype: 'json',

        datafields:[     
          {name: 'nazwa', type:'string'},  
          {name: 'login', type:'string'},
          {name: 'wydzial', type:'string'} 
        ],
        id:'id',
        url: this.sg['SERVICE_URL']+'ADAuthentication/GetUsersNotInRole',
        data: {
          id: this.selectedRoleRole
        },

        addrow: (rowid: any, rowdata: any, position: any, commit: any) => {
          const t = JSON.stringify(rowdata);            
          $.ajax({
            cache: false,
            dataType: 'json',
            contentType: 'application/json',
            url: this.sg['SERVICE_URL'] + 'ADAuthentication/RemoveUserRole',
            data: t,
            type: 'POST',
            success: function (data: any, status: any, xhr: any) { 
            
                rowdata.id = data.id;
                rowdata.nazwa = data.imie+" "+data.nazwisko;
                rowdata.wydzial = data.wydzial;
                rowdata.login = data.login;
        
              //this.gridallusersRole.addrow(null, row, top);
              commit(true);     
            },
            error: function (jqXHR: any, textStatus: any, errorThrown: any) {
              alert(textStatus + ' - ' + errorThrown);
              commit(false);
            }
          });
        },


        deleterow: (rowindex: any, commit: any) => {        
          commit(true);
          
        }

      
    };

    allusersroledataAdapter = new $.jqx.dataAdapter(this.allusersrolesource,
    
      {formatData: (data)=> {
        $.extend(data, {
          id: this.selectedRoleRole
        });
        return data;
      }
    });

    
    allusersrolegridoptions: jqwidgets.GridOptions ={    
      localization: {
        pagergotopagestring: 'Idź do', pagerrangestring: ' z ',
        pagershowrowsstring: 'Liczba wierszy', loadtext: 'Wczytywanie...',
        sortascendingstring: 'Sortuj rosnąco', sortdescendingstring: 'Sortuj malejąco',
        sortremovestring: 'Wyczyść sortowanie'
      },       
      //height:'100%',
      columnsresize: true,
      
      filterable: true,
      autoshowfiltericon: true,
      filtermode: 'excel',
      showfilterrow: true,
      pagesize:20,

      autorowheight: true,
      //autoheight: true,
      altrows: true,
      enabletooltips: false,
      
      columnsheight:30,
      theme: 'metro',

      source: this.allusersroledataAdapter,

      pageable: true,
    

    };

    
    allusersrolecolumns: any[] =
    [
      { text: 'Nazwa', datafield: 'nazwa'},
      { text: 'Wydział', datafield: 'wydzial'},
      { text: 'Login', datafield: 'login'},
    ]



    rendered = (type: any): void => {
      // Initialize the DragDrop plug-in. Set it's drop target to the second Grid.
    
      let options = {
          revert: true,
          dragZIndex: 99999,
          appendTo: 'body',
          dropAction: 'none',
          initFeedback: (feedback: any): void => {
              feedback.height(25);
          }
      };

      //let uglyGridDragDropCells = jqwidgets.createInstance('.jqx-grid-cell', 'jqxDragDrop', options);   
      //.jqx-item
      let uglyGridDragDropCells = jqwidgets.createInstance('.jqx-grid-cell.jqx-item', 'jqxDragDrop', options);
      let flattenGridDragDropCells = flatten(uglyGridDragDropCells);

      function flatten(arr: any[]): any[] {
          return arr.reduce((flat: any[], toFlatten: any[]): any[] => {
              return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
          }, []);
      }

      // Add Event Handlers
      if(this.gridRoleRole.getselectedrowindexes().length>0)
      for (let i = 0; i < flattenGridDragDropCells.length; i++) {
          // Disable revert when the dragged cell is over the second Grid.
          flattenGridDragDropCells[i].addEventHandler('dropTargetEnter', (): void => {
              flattenGridDragDropCells[i].revert = false;
          });

          // Enable revert when the dragged cell is outside the second Grid.
          flattenGridDragDropCells[i].addEventHandler('dropTargetLeave', (): void => {
              flattenGridDragDropCells[i].revert = true;
          });

          // initialize the dragged object.
          flattenGridDragDropCells[i].addEventHandler('dragStart', (event: any): void => {
              let value = event.target.innerHTML;
              let position = jqx.position(event.args);
              let cell = this.gridallusersRole.getcellatposition(position.left, position.top);          
              flattenGridDragDropCells[i].data = { value: value };
          });

          // Set the new cell value when the dragged cell is dropped over the second Grid.      
          flattenGridDragDropCells[i].addEventHandler('dragEnd', (event: any): void => {          
              let value = event.target.innerHTML;
              value = value.slice(0, 37) + value.slice(62);
              let position = jqx.position(event.args);
      console.log('end');

            if(this.gridusersinroleRole.getdisplayrows().length<=0)
              this.gridusersinroleRole.addrow(-1,{});

              let cell = this.gridusersinroleRole.getcellatposition(position.left, position.top);
        
              if (typeof cell !== 'boolean') {
            
                  //this.gridusersinroleRole.setcellvalue(cell.row, (cell.column).toString(), value);

                  const row = {
                    id: 0,
                    // idRoli: this.gridRoleRole.getrowid(this.gridRoleRole.getselectedrowindex()),
                    // idUzytkownika: this.gridallusersRole.getrowid(this.gridallusersRole.getselectedrowindex())
                    idRoli: this.gridRoleRole.getrowid(this.gridRoleRole.getselectedrowindex()),
                    idUzytkownika: this.gridallusersRole.getrowid(this.gridallusersRole.getselectedcell().rowindex)
                  };

                  //console.log(row.id+" "+row.idRoli+" "+row.idUzytkownika)
                  this.gridusersinroleRole.addrow(null, row, top);
              }
          });
      }
      
    
    }; 

    //#endregion

    addUserToRole(){
      if(this.gridallusersRole.getselectedrowindexes().length>0 && this.gridRoleRole.getselectedrowindex()>=0){          
        let rows =[]=[]; 
        let tmp = this.gridallusersRole.getselectedrowindexes();

        for(let i in tmp){
          rows[i] = this.gridallusersRole.getrowid(tmp[i].valueOf());
        }

        for(let i in rows){
          const row = {
            id: 0,
            idRoli: this.gridRoleRole.getrowid(this.gridRoleRole.getselectedrowindex()),
            //idUzytkownika: this.gridallusersRole.getrowid(this.gridallusersRole.getselectedcell().rowindex)    
            idUzytkownika: rows[i].valueOf(),
            nadal: this.authService.getUser()
          };

          this.gridusersinroleRole.addrow(null, row, top);
          this.gridallusersRole.deleterow(rows[i].valueOf());
        }
      
      }  
    }

    removeUserFromRole(){
      if(this.gridusersinroleRole.getselectedrowindexes().length>0){          
        let rows =[]=[]; 
        let tmp = this.gridusersinroleRole.getselectedrowindexes();

        for(let i in tmp){
          rows[i] = this.gridusersinroleRole.getrowid(tmp[i].valueOf());
        }

        for(let i in rows){
          const row = {
            id: 0,
            idRoli: this.gridRoleRole.getrowid(this.gridRoleRole.getselectedrowindex()), 
            idUzytkownika: rows[i].valueOf(),  
            odebral: this.authService.getUser()       
          };

        this.gridallusersRole.addrow(null, row, top);
          this.gridusersinroleRole.deleterow(rows[i].valueOf());
        }
      
      }  
    }

  //#endregion

  //#region zakladka uzytkownicy

    useruserRowClicked(event:any  ){

      this.selectedUserUser = event.args.row.bounddata['uid']; 
      this.gridusersrolerusers.updatebounddata();
      this.gridallrolerusers.updatebounddata();
    }

    //#region gridusersusers

      usersusersCellClicked(event: any){        
          this.selectedUserUser = event.args.row.bounddata['uid']; 
          this.gridusersrolerusers.updatebounddata();
          this.gridallrolerusers.updatebounddata();
      }
      
      usersuserssource=
      {
        datatype: 'json',
    
          datafields:[     
            {name: 'id'},
            {name: 'nazwa', type:'string'},   
            {name: 'wydzial', type: 'string'},
            {name: 'login', type:'string'}
          ],
          id:'id',
          url: this.sg['SERVICE_URL']+'ADAuthentication/GetAllUsers',    
      };
    
      usersusersdataAdapter = new $.jqx.dataAdapter(this.usersuserssource);
    
      
      usersusersgridoptions: jqwidgets.GridOptions ={    
        localization: {
          pagergotopagestring: 'Idź do', pagerrangestring: ' z ',
          pagershowrowsstring: 'Liczba wierszy', loadtext: 'Wczytywanie...',
          sortascendingstring: 'Sortuj rosnąco', sortdescendingstring: 'Sortuj malejąco',
          sortremovestring: 'Wyczyść sortowanie'
        },
        
        //height:'100%',
        columnsresize: true,
        
        filterable: true,
        autoshowfiltericon: true,
        filtermode: 'excel',
        showfilterrow: true,
        pagesize:20,
    
        autorowheight: true,
        autoheight: true,
        altrows: true,
        enabletooltips: false,
        
        columnsheight:30,
        theme: 'metro',
    
        source: this.usersusersdataAdapter,
    
        pageable: true,
    
      };
    
      
      usersuserscolumns: any[] =
      [
    
        { text: 'Nazwa', datafield: 'nazwa',  width: 150},
        { text: 'Wydział', datafield: 'wydzial',  width: 270},
        { text: 'Login', datafield: 'login',  width: 100},
        { text: 'Historia', datafield: 'usershistory', width: 'auto',    
          filterable: false, cellsalign: 'right',
          cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
            return "<div style='text-align: center;margin-top:5px;'><button "+
            "style='background-color: skyblue; border: none; color: white;padding: 5px; text-align: center; text-decoration: none;"+
            "display: inline-block;font-size: 16px;  border-radius: 50%; margin-left:auto; margin-right:auto'>"+            
            "&nbsp;?&nbsp;</button></div>";
          },     
        },
      ]

    userhistory: any;
    editGridCellClick(event: any): void {
      if (event.args.datafield === 'usershistory'){
        $.ajax({
          cache: false,
          dataType: 'json',
          contentType: 'application/json',
          url: this.sg['SERVICE_URL'] + 'ADAuthentication/GetUsersHistory/'+ event.args.row.bounddata.id,
          type: 'GET',
          success: (data: any, status: any, xhr: any)=>{     
            this.userhistory=data; 
            this.historyWindow.title("Historia uprawnień użytkownika");
            this.historyWindow.open();
          },
          error: function (jqXHR: any, textStatus: any, errorThrown: any) {
            alert(textStatus + ' - ' + errorThrown);
          }
        });
        
       // console.log(event.args.row.bounddata.id);
        
      }
    }

    //#endregion

    //#region gridusersrolerusers

      
      usersroleruserssource={
        datatype: 'json',
        totalrecords: 10,
        unboundmode: true,

        datafields:[     
          {name: 'rola', type:'string'},    

        ],
        id:'id',
        url: this.sg['SERVICE_URL']+'ADAuthentication/GetUsersRoles',
        data: {
          id: this.selectedUserUser
        },
        addrow: (rowid: any, rowdata: any, position: any, commit: any) => {
          const t = JSON.stringify(rowdata);  
          $.ajax({
            cache: false,
            dataType: 'json',
            contentType: 'application/json',
            url: this.sg['SERVICE_URL'] + 'ADAuthentication/AddRoleToUser',
            data: t,
            type: 'POST',
            success: function (data: any, status: any, xhr: any) {
              //alert('Wstawiono nowy rekord - id: ' + data.id);
              rowdata.id = data.id;
              rowdata.rola = data.rola;

              // for(let i in data)
              // console.log(i+" "+data[i]);

              commit(true);                  
            },
            error: function (jqXHR: any, textStatus: any, errorThrown: any) {
              alert(textStatus + ' - ' + errorThrown);
              commit(false);
            }
          })
        },
        deleterow: (rowdata: any, commit: any) => {
          commit(true);
        },

      };

      usersrolerusersdataAdapter = new $.jqx.dataAdapter(this.usersroleruserssource,
        
        {formatData: (data)=> {
          $.extend(data, {
            id: this.selectedUserUser
          });
          return data;
        }
      });

      usersrolerusersgridoptions: jqwidgets.GridOptions ={    
        localization: {
          pagergotopagestring: 'Idź do', pagerrangestring: ' z ',
          pagershowrowsstring: 'Liczba wierszy', loadtext: 'Wczytywanie...',
          sortascendingstring: 'Sortuj rosnąco', sortdescendingstring: 'Sortuj malejąco',
          sortremovestring: 'Wyczyść sortowanie'
        },
      
        //height:'100%',
        columnsresize: true,
        
        filterable: true,
        autoshowfiltericon: true,
        filtermode: 'excel',
        showfilterrow: true,
        pagesize:20,

        autorowheight: true,
        //autoheight: true,
        altrows: true,
        enabletooltips: false,
        
        columnsheight:30,
        theme: 'metro',

        source: this.usersrolerusersdataAdapter,

        pageable: true,

      };

      
      usersroleruserscolumns: any[] =
      [
    
        { text: 'Rola', datafield: 'rola'},
      ]
    //#endregion 

    //#region gridallroleusers
      allroleuserssource=
      {
        datatype: 'json',

          datafields:[     
            {name: 'rola', type:'string'},   
                ],
          id:'id',
          url: this.sg['SERVICE_URL']+'ADAuthentication/GetRoleOffUser',
          data: {
            id: this.selectedRoleRole
          },

          addrow: (rowid: any, rowdata: any, position: any, commit: any) => {
            const t = JSON.stringify(rowdata);            
            $.ajax({
              cache: false,
              dataType: 'json',
              contentType: 'application/json',
              url: this.sg['SERVICE_URL'] + 'ADAuthentication/RemoveRoleFromUser',
              data: t,
              type: 'POST',
              success: function (data: any, status: any, xhr: any) { 
              
                rowdata.id = data.id;
                rowdata.rola = data.rola;
           
          
                //this.gridallusersRole.addrow(null, row, top);
                commit(true);     
              },
              error: function (jqXHR: any, textStatus: any, errorThrown: any) {
                alert(textStatus + ' - ' + errorThrown);
                commit(false);
              }
            });
          },


          deleterow: (rowindex: any, commit: any) => {        
            commit(true);
            
          }

        
      };

      allroleusersdataAdapter = new $.jqx.dataAdapter(this.allroleuserssource,
      
        {formatData: (data)=> {
          $.extend(data, {
            id: this.selectedUserUser
          });
          return data;
        }
      });

      
      allroleusersgridoptions: jqwidgets.GridOptions ={    
        localization: {
          pagergotopagestring: 'Idź do', pagerrangestring: ' z ',
          pagershowrowsstring: 'Liczba wierszy', loadtext: 'Wczytywanie...',
          sortascendingstring: 'Sortuj rosnąco', sortdescendingstring: 'Sortuj malejąco',
          sortremovestring: 'Wyczyść sortowanie'
        },       
        //height:'100%',
        columnsresize: true,
        
        filterable: true,
        autoshowfiltericon: true,
        filtermode: 'excel',
        showfilterrow: true,
        pagesize:20,

        autorowheight: true,
        //autoheight: true,
        altrows: true,
        enabletooltips: false,
        
        columnsheight:30,
        theme: 'metro',

        source: this.allroleusersdataAdapter,

        pageable: true,
      

      };

      
      allroleuserscolumns: any[] =
      [    
        { text: 'Rola', datafield: 'rola'},
      ]

    //#endregion


    addRoleToUser(){
      if(this.gridusersusers.getselectedrowindexes().length>0 && this.gridallrolerusers.getselectedrowindex()>=0){          
        let rows =[]=[]; 
        let tmp = this.gridallrolerusers.getselectedrowindexes();

        for(let i in tmp){
          rows[i] = this.gridallrolerusers.getrowid(tmp[i].valueOf());
        }

        for(let i in rows){
          const row = {
            id: 0,  
            idRoli: rows[i].valueOf(),
            idUzytkownika: this.gridusersusers.getrowid(this.gridusersusers.getselectedrowindex()),
            nadal: this.authService.getUser()
          };

          this.gridusersrolerusers.addrow(null, row, top);
          this.gridallrolerusers.deleterow(rows[i].valueOf());
        }
      
      }  
    }

    removeRoleFromUser(){
      if(this.gridusersrolerusers.getselectedrowindexes().length>0){          
        let rows =[]=[]; 
        let tmp = this.gridusersrolerusers.getselectedrowindexes();

        for(let i in tmp){
          rows[i] = this.gridusersrolerusers.getrowid(tmp[i].valueOf());
        }

        for(let i in rows){
          const row = {
            id: 0,
            idRoli: rows[i].valueOf(),
            idUzytkownika: this.gridusersusers.getrowid(this.gridusersusers.getselectedrowindex()),               
            odebral: this.authService.getUser()       
          };

          this.gridallrolerusers.addrow(null, row, top);
          this.gridusersrolerusers.deleterow(rows[i].valueOf());          
        }
      
      }  
    }

  //#endregion

}

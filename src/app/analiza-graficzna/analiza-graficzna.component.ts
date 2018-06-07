import {ViewChild, Component, OnInit, AfterViewInit } from '@angular/core';

import { AuthenticationService } from './../authentication.service';
import { SimpleGlobal } from 'ng2-simple-global';
import { CommonModule, NgStyle } from '@angular/common'


import { jqxSplitterComponent} from 'jqwidgets-ts/angular_jqxsplitter';
import { jqxDropDownButtonComponent } from 'jqwidgets-ts/angular_jqxdropdownbutton';
import { jqxTreeComponent} from 'jqwidgets-ts/angular_jqxtree';
import { jqxWindowComponent } from 'jqwidgets-ts/angular_jqxwindow';
import { jqxGridComponent } from 'jqwidgets-ts/angular_jqxgrid';

import { TEMPLATE_DRIVEN_DIRECTIVES } from '@angular/forms/src/directives';
import { shallowEqual } from '@angular/router/src/utils/collection';

import * as Xml from 'xml2js';
import { HtmlTagDefinition } from '@angular/compiler';
import { element } from 'protractor';
import { reverse } from 'dns';
import { select } from 'snapsvg';

// { parseString, Builder }
declare var Snap: any;
declare var mina: any;
declare function unescape(s:string): string;
declare function escape(s:string): string;

@Component({
  selector: 'app-analiza-graficzna',
  templateUrl: './analiza-graficzna.component.html',
  styleUrls: ['./analiza-graficzna.component.scss']
})
export class AnalizaGraficznaComponent implements OnInit, AfterViewInit {

  
  s :any;
  svg: any;
  svgObjects: any []=[];
  gObjects: GObjectContainerClass = new GObjectContainerClass(this);
  orgVBwidth:number;
  orgVBheight:number;

  selectedGObject:any;

  questionWindowParams={'message':'', 'byes':true, 'byesval':'Tak', 'bno':true, 'bnoval':'Nie'};


  @ViewChild('grafySceletonSplitter') grafySceletonSplitter: jqxSplitterComponent;
  @ViewChild('grafyTableSplitter') grafyTableSplitter: jqxSplitterComponent;
  @ViewChild('backgroundColor') backgroundColor: jqxDropDownButtonComponent;
  @ViewChild('fontColor') fontColor: jqxDropDownButtonComponent;
  @ViewChild('canvasColor') canvasColor: jqxDropDownButtonComponent;
  @ViewChild('myTree') myTree: jqxTreeComponent;
  @ViewChild('windowNewGraf') windowNewGraf: jqxWindowComponent;  
  @ViewChild('questionWindow') questionWindow: jqxWindowComponent;
  @ViewChild('shareWindow') shareWindow: jqxWindowComponent;
  @ViewChild('sharedusersGrid') sharedusersGrid: jqxGridComponent;
  @ViewChild('allusersGrid') allusersGrid: jqxGridComponent;
  @ViewChild('sharesGrid') sharesGrid: jqxGridComponent;

  @ViewChild('fileWindow') fileWindow: jqxWindowComponent;
  @ViewChild('fileGrid') fileGrid: jqxGridComponent;

  constructor(public auth: AuthenticationService,
    private sg: SimpleGlobal) { }



  ngOnInit() {

    this.s = Snap("#svgCanvas");
    this.svg = document.getElementById('svgCanvas');
    this.orgVBwidth = $("#svgCanvas").width();
    this.orgVBheight=$("#svgCanvas").height();     
    this.s.attr({viewBox:0+","+0+","+this.orgVBwidth+","+this.orgVBheight});   
  }

  ngAfterViewInit(): void{
  
    this.grafySceletonSplitter.createComponent();
    let panels=  this.grafySceletonSplitter.panels();      
    if(!this.auth.loggedIn())
    {
      panels[0].collapsible = true; 
      panels[0].size="0px";
      this.grafySceletonSplitter.panels(panels);
      this.grafySceletonSplitter.collapse();
    }

    this.grafyTableSplitter.createComponent();
    this.myTree.createComponent();
    this.backgroundColor.createComponent(); 
    this.backgroundColor.setContent(this.getTextElementByColor({ hex: "FFAABB" }));
    this.canvasColor.createComponent();
    this.canvasColor.setContent(this.getTextElementByColor({ hex: "FFFFFF" }));
    this.fontColor.createComponent();
    this.fontColor.setContent(this.getTextElementByColor({ hex: "000000" }));

    this.sharedusersGrid.createComponent(this.gridoptions);
    this.allusersGrid.createComponent(this.gridoptions);

    this.sharesGrid.createComponent(this.gridoptions);

    this.fileGrid.createComponent(this.gridoptions);
    
    this.windowNewGraf.createWidget({
      width: 350, height:280, theme: 'metro',
      resizable: false, isModal: true, autoOpen: false, modalOpacity: 0.5
    });

    this.questionWindow.createWidget({   
      theme: 'metro',
      resizable: false, isModal: true, autoOpen: false, modalOpacity: 0.5
    });

    this.shareWindow.createWidget({   
      theme: 'metro',
      resizable: false, isModal: true, autoOpen: false, modalOpacity: 0.5,
    });

    this.fileWindow.createWidget({   
      theme: 'metro',
      resizable: true, isModal: true, autoOpen: false, modalOpacity: 0.5,
    });

    document.addEventListener('keyup', (event:any)=>{this.g_keypress(event)});
    this.generateTreeSource();
  }




  selected: any=null;
  lastSelected:any =null;
  startX: any=0;
  startY: any=0;
  resize: boolean = false;

  isDrawing= false;
  isDragged = false;

  newline: any;

  selectedText:string='tekst';
  selectedFontSize:number=15;

  action:string = null;

  selectedShape: any=null;  
  linesContainer: any = new linesContainerClass(this);

  //#region userAction methods(mouse, kyboard)
  g_mousedown(event: any){
    
    // if(this.lastSelected){
    //   let sl = this.gObjects.get(this.lastSelected.id);
    //   sl?sl.makeUnselected():(this.linesContainer.get(this.lastSelected.id)?this.linesContainer.get(this.lastSelected.id).makeUnselected:null);
    // }
    CVObject.makeUnselected();
    this.selectedGObject=null;
    
    if(event['target'].id!="" ||  event['target'].tagName=='tspan'){

    

      this.startX = event.offsetX;
      this.startY = event.offsetY;

      if(event['target'].id=="svgCanvas"){
        
        if(this.selectedShape!=null){
            this.drawElement(event);
        }
        else{
        this.isDragged = true;
   
        }
      }
      else {

        let sl = this.gObjects.get(event['target'].id);           
        this.selectedGObject=sl?sl:null;  
        sl?sl.makeSelected():(this.linesContainer.get(event['target'].id)?this.linesContainer.get(event['target'].id).makeSelected():null);

        if(this.selectedShape!=null && this.selectedShape != 'line')
          this.selectShape(this.selectedShape, event);

        if(event['target'].id.indexOf('info')!=-1){
          this.lastSelected = this.selected = this.gObjects.getByInfoId(event['target'].id);
        }
        else if(event['target'].tagName=='tspan'){
         
          if(event['target'].parentNode.id.indexOf('info')!=-1){
            this.lastSelected = this.selected = this.gObjects.getByInfoId(event['target'].parentNode.id);     
          }
          else
            this.lastSelected = this.selected = event['target'].parentNode;          
        }
        else{
          this.selected = document.getElementById(event['target'].id);
          this.lastSelected = this.selected;
        }
  

        if(this.selected)
        this.gObjects.setToEdit(this.selected.id);

      
        if(this.selectedShape == 'line'){  
          this.drawElement(event);
          return;
        }
                
        this.isDragged = true;

        //wyciaga element na wierzch
        if(this.selected)
        if(!this.selected.id.includes('line')){
          this.gObjects.updateLayout(this.selected.id);
        }

       if( this.selected)
        if(this.selected.tagName!=null){      
            this.resize = this.gObjects.isOnBorder(this.selected.id, event);
        }      
      }    
    }
  }

  g_mousemove(event: any){

    let eventX=event.offsetX;
    let eventY=event.offsetY;
      
    let x = (Math.max(this.startX,eventX)-Math.min(this.startX,eventX))*Math.sign(eventX-this.startX)*(1/this.scale);
    let y = (Math.max(this.startY,eventY)-Math.min(this.startY,eventY))*Math.sign(eventY-this.startY)*(1/this.scale);


    if(this.selected!= null){
      
      if(this.resize){
        if(this.selected.tagName!=null)
          this.gObjects.resize(this.selected.id, x, y);
      }
      else if(this.isDragged){      

        let tx = x;
        let ty = y;

        if(this.selected.tagName!=null && this.selectedShape==null){          
          this.gObjects.move(tx,ty,this.selected.id);
          this.linesContainer.updatePos($("#"+this.selected.id));
        }
        // var m =(this.s.select("#"+this.selected.id)).transform().localMatrix.split();
        // for(var i in m)
        //   console.log("m:"+m[i]);
        //console.log(this.s.select("#"+this.selected.id).transform().local);
      }
    }
    
    else{
      if(this.isDragged){      
        let vb =  this.s.attr('viewBox');
        this.s.attr({viewBox:(parseInt(vb.x)-x)+","+(parseInt(vb.y)-y)+","+vb.w+","+vb.h})
      }
    }
    
    if(this.selectedShape!=null && this.isDrawing){
      this.drawElement(event);
    }
    this.startX =event.offsetX;
    this.startY =event.offsetY;
  }

  g_mouseup(event: any){
    if(this.newline && event['target'].id!=""){

      if(event['target'].id!="svgCanvas"){

        let vbb =  this.s.attr('viewBox');
        let tmp_p = this.svg.createSVGPoint();
        tmp_p.x = event.offsetX*(1/this.scale)+vbb.x;
        tmp_p.y = event.offsetY*(1/this.scale)+vbb.y;

        let obj= this.gObjects.getelementInPoint(tmp_p.x, tmp_p.y);     

        if(obj){
          this.linesContainer.setEndLine(obj.id, this.newline);                
          this.gObjects.updateLayout(obj.id);
        }


      }      
    }

    //this.selectedShape = null;
  
    this.selected = null;
    this.isDragged = false;

    this.resize = false;
    this.newline = null;
  
    if(this.isDrawing){
      this.isDrawing = false;
    }

  }
  
  g_mousedblclick(event: any){

    this.test('double'); 
    console.log('dfgdfg');
      
  }

  scale: number=1;
  g_mousewheel(event: any){
    let vb =  this.s.attr('viewBox');

    let tmp1_p = this.svg.createSVGPoint();
    tmp1_p.x = (event.offsetX*(1/this.scale));
    tmp1_p.y = (event.offsetY*(1/this.scale));

    let sign = 1
    if(event['wheelDelta']>0){
      this.scale +=0.2; 
    }
    else{
      if(this.scale>0.4){
        this.scale -=0.2;  
        sign = -1    
      }
    }

    this.scale = Math.round(this.scale*100)/100;
    
    let tmp2_p = this.svg.createSVGPoint();
    tmp2_p.x = (event.offsetX*(1/this.scale));
    tmp2_p.y = (event.offsetY*(1/this.scale));

    this.s.attr({viewBox:(vb.x+(tmp2_p.x-tmp1_p.x)*(Math.sign(tmp2_p.x-tmp1_p.x))*sign)+","+(vb.y+(tmp2_p.y-tmp1_p.y)*(Math.sign(tmp2_p.y-tmp1_p.y))*sign)+","+this.orgVBwidth*(1/this.scale)+","+this.orgVBheight*(1/this.scale)});

    //this.s.transform('s'+this.scale);
  }

  g_keypress(event: any){   
    //console.log('dfdf'+this.selected.id);
    if(event['target'].id!='g_displaytext')
    if(this.lastSelected)
    if(event.keyCode == 46){   
      CVObject.makeUnselected();    
      if(this.lastSelected.id.includes('line')){
        this.linesContainer.removeline(this.lastSelected);
        this.lastSelected = null;
      
      }
      else{
        this.linesContainer.removeFromElement(this.lastSelected);
        //$('#'+this.lastSelected.id).remove();
        this.gObjects.del(this.lastSelected.id);
      }

    }  
  }

  //#endregion

 
  selectShape(shape: string, event:any){

    if( $('#'+event['target'].id).hasClass('button-highlighted'))
    $('#'+event['target'].id).toggleClass('button-highlighted');
    else{
      $('.button-highlighted').toggleClass('button-highlighted');
      $('#'+event['target'].id).toggleClass('button-highlighted')
    }

    if(this.selectedShape==shape)
      this.selectedShape = null;
    else
      this.selectedShape = shape;
  }

  wyczysc(){
    this.s.clear();

    this.scale=1;
    this.s.attr({viewBox:("0,0,2400, 1600")});

    this.svgObjects =[];
    this.gObjects.clean();
    this.linesContainer.clean();

    this.canvasBackgroundColor=null;

    this.cleanSelection();

  }

  cleanSelection(){
    this.backgroundColor.setContent(this.getTextElementByColor({r:255,g:255,b:255,hex:'ffffff'}));
    this.fontColor.setContent(this.getTextElementByColor({r:0,g:0,b:0,hex:'000000'}));
    $('#g_displaytext').val('');
    $('#g_fontsize').val('15');
    this.selectedText = "";
    this.selectedFontSize = 15;
    this.selected = this.lastSelected = null;
    this.selectedGObject=null;
  }


  showquestionWindow(message: string='', byes:boolean=true, byesval:string='Tak', bno:boolean=true, bnoval:string='Nie', title:string="Pytanie" ){return new Promise((resolve, reject)=> {
      this.questionWindowParams = {'message':message, 'byes':byes, 'byesval':byesval, 'bno':bno, 'bnoval':bnoval};
      this.questionWindow.title(title);
      this.questionWindow.open();
      let sub = this.questionWindow.onClose.subscribe((event:any)=>{
        //console.log(event.args.dialogResult);
        //this.questionMessage = null;
        sub.unsubscribe();  
        resolve(event.args.dialogResult);
      })

    
    
    });
  }

  showInfo(){
    let msg="<p>Aplikacja przeznaczona do rysowania grafów.</p>"+  
            "Rysowanie grafu odbywa się na zasadzie rysowania w programie Paint.<br>"+
            "<p><strong><font color='red'>Sugerowaną przeglądarką jest Google Chrome.</font></strong></p>"+           
            "<p>Stworzony graf można zapisać jako plik png, który może być wklejony do Worda. Takie rozwiązanie eliminuje problem <i>rozsypujących</i> się grafów przy otwieraniu w różnych edytorach tekstu.</p>"+          
            "<p>Po zalogowaniu do systemu dostępne są dodatkowe opcje, takie jak zapisywanie grafów na własnym koncie w celu późniejszej obróbki, a także udostępnianie innym uzytkownikom.<br>"+
            "Udostępnienie grafu innym użytkownikom możliwe jest na dwa sposoby jako obserwator(użytkownik nie może nanosić zmian) lub edytor(możliwość nanoszenia zmian na równi z autorem grafu).</p>"+
            "System pozwala stworzyć kopię grafu również udostępnionego w trybie obserwatora.<br>"
            
    this.showquestionWindow(msg, false,'tak',true,'Zamknij','Informacja');
  }
 

  //#region tree
  treeSource: any[]=[];
  grafyRole:any[]=[];
  generateTreeSource(selectId? :any){ return new Promise((resolve, reject)=> {  
      this.treeSource = [];
      this.grafyRole=[];

      let user = this.auth.getUser();
      
      $.ajax({
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        url: this.sg['SERVICE_URL'] + 'Grafy/GetUsersGrafsTree/'+(user!=''?user:'null'),
        type: 'GET',
        success: (data: any, status: any, xhr: any)=> {
          if(data)
          this.grafyRole = data;
          data.forEach(element => {
            //console.log(element);
            if(element.idParent == null){
              this.treeSource.push({label:element.nazwa, items:[]=[], selected:(element.id==selectId?true:false), id:element.id, icon: ((element.role!='author')?"/images/grafy/share.png":(element.typ=='katalog'?"/images/folder.png":""))});
              this.generateTreeBranches(this.treeSource[this.treeSource.length-1], data, element.id,selectId);
            }

          });

          this.myTree.source(this.treeSource);

          resolve(true);
        },
        error: function (jqXHR: any, textStatus: any, errorThrown: any) {
          alert(textStatus + ' - ' + errorThrown);
          resolve(false);
        }
      })

    // this.myTree.source(this.treeSource);
    })
  }

  generateTreeBranches(branch: any, leafs: any, parent: any, selectId? :any){  
    leafs.forEach(element => {
      if(element.idParent == parent){
        branch.items.push({label:element.nazwa, items:[]=[], id:element.id, selected:element.id==selectId?true:false, icon:element.role!='author'?"/images/grafy/share.png":(element.typ=='katalog'?"/images/folder.png":'')})
        this.generateTreeBranches(branch.items[branch.items.length-1],leafs, element.id,selectId);
      }
    });

  }

  treeSelected: any=null;
  treeclick:number=0;
  myTreeOnSelect(event : any): void{  
 
    this.treeclick++;
    if(this.treeclick>2)
      this.treeclick = 1;

    if(this.treeclick==2){


      let args = event.args;
      let item = this.myTree.getItem(args.element);
      this.wyczysc();
      if(this.treeSelected)
      if(this.treeSelected.id == item['id']){  
        this.myTree.selectItem(null);   
        this.treeSelected=null;
        this.selectedGraf=null;
        return;
      }
            
      let tmp  = this.grafyRole.filter(o=>o.id==item['id'])[0];  
      this.treeSelected = tmp;  

      if(tmp.typ=='graf'){
        this.loadGraf(tmp.idGrafu);
        this.loadShares();
      }
      
      this.treeclick=0; 

  
    }
  }


  loadShares(){
    this.sharesGridsource.data={id:this.grafyRole.filter(g=>g.id==this.treeSelected.id)[0].idGrafu, user:this.auth.getUser()};
    let sharesGriddataAdapter = new $.jqx.dataAdapter(this.sharesGridsource);
    this.sharesGrid.source(sharesGriddataAdapter);
  }

  sharesGridcolumns: any[] =
  [
    { text: 'Rola', datafield: 'rola',  width: 50},
    { text: 'Osoba', datafield: 'osoba',  minwidth: 150},
  ]

  sharesGridsource={
    datatype: 'json',

      datafields:[  
        {name: 'id'},
        {name: 'rola', type:'string'},   
        {name: 'osoba', type:'string'},          
      ],
      id:'id',
      url: this.sg['SERVICE_URL']+'Grafy/GetUsersInShare',
      data:{
        id: '0',//this.grafyRole.filter(g=>g.id==this.treeSelected.id)[0].idGrafu,//this.grafyRole.filter(g=>g.id==this.treeSelected.id)[0].id_grafu,  //this.treeSelected?(this.treeSelected.id?this.treeSelected.id:0):0,
        user:''
      },

  };

  sharesGriddataAdapter = new $.jqx.dataAdapter(this.sharesGridsource);


  //#endregion
  
  //#region edit Tree
 

  newRoleModel: any= {'typ':'graf', 'nazwa':'','error':false};
  newgrafAction:string ="";
  newGraf(title?:string){
    
    this.windowNewGraf.title(title);
    this.windowNewGraf.open();
    // this.windowNewGraf.onClose.subscribe(this.newGrafOk);
  }

  newGrafOk(){
    // console.log($('#newRoleName').val()+" user:"+this.auth.getUser())

    // if($('#newRoleName').val()==""){
    //   $('#errormsg').css('visibility','visible');
    //   return;
    // }

    if(this.newRoleModel.nazwa==""){
      this.newRoleModel.error = true;
      return;
    }

    let parent = !this.treeSelected?null:this.treeSelected.id;

    if(this.newgrafAction=="clone")
      parent = this.grafyRole.filter(o=>o.id==parent)[0].idParent;

    if(this.treeSelected)
      parent = this.treeSelected.typ == 'graf'?null:parent;

    //let rola={id:0,IdGrafu:0,User:this.auth.getUser(),Role:'author',Nazwa:$('#newRoleName').val(), IdParent: parent, Typ:"katalog"};
    let rola={id:0,IdGrafu:0,User:this.auth.getUser(),Role:'author',Nazwa:this.newRoleModel.nazwa, IdParent: parent, Typ:this.newRoleModel.typ};

    // if($("#typroli").is(":checked")){
    //   rola['typ']='graf';
    // }

    const t = JSON.stringify(rola);

    $.ajax({
      cache: false,
      dataType: 'json',
      contentType: 'application/json',
      url: this.sg['SERVICE_URL'] + 'Grafy/AddGraf',
      data: t,
      type: 'POST',
      success: (data: any, status: any, xhr: any)=> {
   
        let id = data?data:this.treeSelected;
        this.generateTreeSource(null).then((result:any)=>{  
          if(result)        
          if(this.newgrafAction!=null){
            let tmp  = this.grafyRole.filter(o=>o.id==id)[0];
            if(tmp)
            this.loadGraf(tmp.idGrafu).then((result:any)=>{
              if(result==true)
                this.saveGraf();
                this.newgrafAction = null;
            });      
          }
        });
        
        this.windowNewGraf.close();  
        this.newRoleModel= {'typ':'graf', 'nazwa':'', 'error':false};            
      },
      error: function (jqXHR: any, textStatus: any, errorThrown: any) {
        alert(textStatus + ' - ' + errorThrown);
      }
    })
 
  }

  newGrafCancel(){
    this.windowNewGraf.close();
    this.newRoleModel= {'typ':'graf', 'nazwa':'', 'error':false};

  }

  deleteGraf(){

    this.showquestionWindow("Czy na pewno chcesz skasować wybrany element? Operacja ta jest nieodwracalna.").then((result:any)=>{
      //console.log(result);
      let rola = this.grafyRole.filter(o=>o.id==this.treeSelected.id)[0];
      if(rola && result.OK){
        //const t = JSON.stringify(rola);
        $.ajax({
          cache: false,
          dataType: 'json',
          contentType: 'application/json',
          url: this.sg['SERVICE_URL'] + 'Grafy/DelGraf/'+rola.id,
          //data:t,
          type: 'POST',
          success: (data: any, status: any, xhr: any)=> {
            this.treeSelected=null;
            this.wyczysc();
            this.generateTreeSource();   
            
          },
          error: function (jqXHR: any, textStatus: any, errorThrown: any) {
            alert(textStatus + ' - ' + errorThrown);
          }
        })
      }
      this.questionWindow.close();
    });
  }

  cloneGraf(){
    this.newgrafAction = "clone";
    this.newGraf("Podaje nazwę dla kopii");

  }

  //#endregion

  //#region graf functions
  saveGraf(){
    let xmlData: any=[];
    xmlData={lines:this.linesContainer.getXml(),
             gobjects: this.gObjects.getXml(),
            graf:{bgcolor:this.canvasBackgroundColor}};

    //console.log(xmlData['lines']+ ' ' +xmlData['gobjects'])
    if(!xmlData['lines'] && !xmlData['gobjects'])
      return;

    let rez = (new Xml.Builder()).buildObject(xmlData);

    // let url = this.sg['SERVICE_URL'] + 'Grafy/AddGraf';
    // let newgraf={id:0, nazwa:"test", dataUtworzenia:null, opis:null, xml:rez};

    if(!this.selectedGraf){
      this.newgrafAction='createNew';
      this.newGraf();
      return;
    }

     
    this.selectedGraf.xml = rez;
    let url = this.sg['SERVICE_URL'] + 'Grafy/UpdateGraf/'+this.selectedGraf.id;
    let newgraf = this.selectedGraf;
  
   
    const t = JSON.stringify(newgraf);

    $.ajax({
      cache: false,
      dataType: 'json',
      contentType: 'application/json',
      url: url,
      data: t,
      type: 'POST',
      success: (data: any, status: any, xhr: any)=> {
        //alert('Wstawiono nowy rekord - id: ' + data); 
        this.generateTreeSource(this.treeSelected?this.treeSelected.id:null);                          
      },
      error: function (jqXHR: any, textStatus: any, errorThrown: any) {
        alert(textStatus + ' - ' + errorThrown);
      }
    })
  }

  selectedGraf:any;
  loadGraf(id: any){ return new Promise((resolve, reject)=> {  
    $.ajax({
      cache: false,
      dataType: 'json',
      contentType: 'application/json',
      url: this.sg['SERVICE_URL'] + 'Grafy/GetGraf/'+id,
      type: 'GET',
      success: (data: any, status: any, xhr: any)=>{     
          this.selectedGraf = data;

          resolve(true);
          if(!this.newgrafAction){
            this.wyczysc();
            
            if(data)
            if(data.xml)
            Xml.parseString(data.xml, (err:any, rez:any)=>{
              
              if(rez.root.gobjects)
                this.gObjects.drawXml(rez.root.gobjects);  
              if(rez.root.graf){
                this.canvasBackgroundColor = rez.root.graf[0].bgcolor[0];       
                this.canvasColor.setContent('<div style="text-shadow: none; position: relative; padding-bottom: 2px; margin-top: 2px; background:' + this.canvasBackgroundColor+ '">' + this.canvasBackgroundColor + '</div>');
              }
              if(rez.root.lines)        
                this.linesContainer.drawXml(rez.root.lines); 

              this.gObjects.updateLayout();
          
            });  
          }
        },
        error: function (jqXHR: any, textStatus: any, errorThrown: any) {
          reject(false);
          alert(textStatus + ' - ' + errorThrown);
        }
      });
    })
  }

  saveImage(){
    // var a      = document.createElement('a');
    // a.href     = 'data:image/svg+xml;utf8,' + encodeURI($('#svgCanvas')[0].outerHTML);
    // a.download = 'plot.svg';
    // a.target   = '_blank';
    // document.body.appendChild(a); a.click(); document.body.removeChild(a);

		
    var myWindow = window.open("", "MsgWindow", "left=100,top=100,width=300px,height=300px");

    let serializer = new XMLSerializer();
    let img = new Image(7200, 2800);

    myWindow.document.body.appendChild(img); 
    var canvas = myWindow.document.createElement("canvas");

    let farrestpoint: coordPoint = this.gObjects.getFarrestPoint();

    let vbb =  this.s.attr('viewBox');
    let tmp_p = this.svg.createSVGPoint();
    tmp_p.x = (farrestpoint.x+ parseInt(vbb.x)*(-1));
    tmp_p.y = (farrestpoint.y+ parseInt(vbb.y)*(-1));

    canvas.width=  (tmp_p.x+50)*(this.scale);//farrestpoint.x+50;
    canvas.height= (tmp_p.y+50)*(this.scale);//farrestpoint.y+50;
    

    myWindow.document.body.appendChild(canvas);
    // var xml =serializer.serializeToString(this.svg);
    // var svg64 = btoa(xml); 
    // var b64Start = 'data:image/svg+xml;base64,';
    // var image64 = b64Start + svg64;
    // img.src = image64;

    var data = serializer.serializeToString(this.svg);
    img.src = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(data);
    
    img.onload = ()=>{
      canvas.getContext('2d').drawImage(img, 0, 0,2400, 1600);

      var imgr    = canvas.toDataURL("image/png");
      var a      = document.createElement('a');
      a.href     = imgr;
      a.download = 'plot.png';
      a.target   = '_blank';
      document.body.appendChild(a); a.click(); 
      myWindow.close();
    }
    



  }

  drawElement(event: any){
    let vb =  this.s.attr('viewBox');
    //let tmp_p = this.svg.createSVGPoint();
    this.startX = event.offsetX*(1/this.scale)+vb.x;
    this.startY = event.offsetY*(1/this.scale)+vb.y; 
         

    let tmp_id:string;
    let shape: any;
    if(true)
    switch(this.selectedShape){
      case 'circle':
        this.gObjects.add(new GCircleClass(this.startX,this.startY,this));
        break;
      case 'rect':
        this.gObjects.add(new GRectClass(this.startX,this.startY,this));
        break;
      case 'text': 
        this.gObjects.add(new GTextClass(this.startX,this.startY,this));
        break; 
      case 'line':            
        if(!this.newline){
          this.newline = new lineClass(this.startX, this.startY, this)
          this.linesContainer.addline(this.newline);
          if(this.selected && this.selected.id.indexOf('line')==-1){
            this.gObjects.get(this.selected.id).updateLayout();        
            this.newline.startid = this.selected.id;
          }

          this.isDrawing = true;        
        }
        else{         
          let tmp = this.newline;
          tmp.extendLine(new coordPoint(this.startX, this.startY));
        }
  
        break;
    }


    if(this.selectedShape=='line')
      return;

    //shape.attr("fill",'none');
  
    this.isDrawing = false;
    this.resize = true;
  }

  
  textmodyfied(event: any){
    this.selectedText = event['target'].value;
    if(this.lastSelected)
    this.gObjects.changeInfo(this.lastSelected.id, event['target'].value);
  }

  changeFontSize(event:any){
    this.selectedFontSize = event['target'].value;
    if(this.lastSelected)
      this.gObjects.changeFontSize(this.lastSelected.id, this.selectedFontSize.toString());
  }
      
  addMouseListeners(object:any){
  
    object.dblclick((e: any)=>{this.g_mousedblclick(e)});
    object.mousedown((e: any)=>{this.g_mousedown(e)});
    //object.mouseup((e:any)=>{this.g_mouseup(e)});
    
  }

  getTextElementByColor(color: any): any { 
    if (color == 'transparent' || color.hex == "") {
        return '<div style="text-shadow: none; position: relative; padding-bottom: 2px; margin-top: 2px;">transparent</div>';
    }
    let nThreshold = 105;
    let bgDelta = (color.r * 0.299) + (color.g * 0.587) + (color.b * 0.114);
    let foreColor = (255 - bgDelta < nThreshold) ? 'Black' : 'White';
    let element = '<div style="text-shadow: none; position: relative; padding-bottom: 2px; margin-top: 2px;color:' + foreColor + '; background: #' + color.hex + '">#' + color.hex + '</div>';
    return element;
  }

  public canvasBackgroundColor=null;
  colorPickerEvent(event: any, target: any): void {   
    if(target=='canvas'){
      // $('#svgCanvas').css({'background-color':'#' + event.args.color.hex});
      this.canvasBackgroundColor = '#' + event.args.color.hex;
      this.canvasColor.setContent(this.getTextElementByColor(event.args.color));
    }
    if(target=='font'){
      this.fontColor.setContent(this.getTextElementByColor(event.args.color));
      // (<HTMLElement>document.getElementsByClassName('jqx-scrollview')[0]).style.borderColor = '#' + event.args.color.hex;
      this.gObjects.changeFontColor('#' + event.args.color.hex);
    }
    if(target=='gobject'){
      this.backgroundColor.setContent(this.getTextElementByColor(event.args.color));
      // (<HTMLElement>document.getElementsByClassName('jqx-scrollview')[0]).style.borderColor = '#' + event.args.color.hex;
      this.gObjects.changeBgColor('#' + event.args.color.hex);
    }
  }


  //#endregion

  //#region share window

  shareType: string = "obserwator";
  searchShareUser: string='';
  shareGraf(){
    this.sharedGridsource.data={id:this.grafyRole.filter(g=>g.id==this.treeSelected.id)[0].idGrafu, user:this.auth.getUser()};
    let sharedGriddataAdapter = new $.jqx.dataAdapter(this.sharedGridsource);
    this.sharedusersGrid.source(sharedGriddataAdapter);

    this.shareWindow.open();
    let sb = this.shareWindow.onClose.subscribe((event:any)=>{
      //$('#searchInput').val('');
      this.searchShareUser = '';
      this.shareType = "obserwator";
      this.allusersGrid.clear();
      this.loadShares();
      sb.unsubscribe();
    })
  }

  findUsersToShare(event: any){
 
    //if(event['target'].id=='searchInput' ){
      if(event['target'].value.length>=3){
        this.allGridsource.url = this.sg['SERVICE_URL']+'Grafy/GetUsersToShare/'+event['target'].value;

        let allGriddataAdapter = new $.jqx.dataAdapter(this.allGridsource);
        this.allusersGrid.source(allGriddataAdapter);
        this.allusersGrid.updatebounddata();
      }

    //}
  }

  shareHandle(action: string){
   
    if(action=='add'){
      if(this.allusersGrid.getselectedrowindex()>=0){
        let id = 0;
        let role = this.shareType; //$("#userRole").is(":checked")?'obserwator':'edytor';
        let idgrafu = this.grafyRole.filter(g=>g.id==this.treeSelected.id)[0].idGrafu;
        let nazwa = this.grafyRole.filter(g=>g.id==this.treeSelected.id)[0].nazwa;
        let user = this.allusersGrid.getrowid(this.allusersGrid.getselectedrowindex().valueOf());

        let newShare = {id:0, idGrafu:idgrafu, User:user, Role:role, Nazwa:nazwa, IdParent:null, Typ:"graf" };
        this.sharedusersGrid.addrow(null, newShare, top);
        this.allusersGrid.deleterow(this.allusersGrid.getselectedrowindex().valueOf());

       
      }
    }
    else{
      if(this.sharedusersGrid.getselectedrowindex()>=0){
        let removShare = this.sharedusersGrid.getrowid(this.sharedusersGrid.getselectedrowindex().valueOf());
        //this.sharedusersGrid.getrowdatabyid(this.sharedusersGrid.getselectedrowindex().toString());
        // this.grafyRole.filter(g=>g.id==this.treeSelected.id)[0];
        this.sharedusersGrid.deleterow(removShare);
        
      }
    }
  }

  
  gridoptions: jqwidgets.GridOptions ={    
    localization: {
      pagergotopagestring: 'Idź do', pagerrangestring: ' z ',
      pagershowrowsstring: 'Liczba wierszy', loadtext: 'Wczytywanie...',
      sortascendingstring: 'Sortuj rosnąco', sortdescendingstring: 'Sortuj malejąco',
      sortremovestring: 'Wyczyść sortowanie',
      emptydatastring: 'Brak danych',
    },
  
    //height:'100%',
    columnsresize: true,
    
    filterable: false,
    autoshowfiltericon: true,
    filtermode: 'excel',
    showfilterrow: false,
    //pagesize:10,

    autorowheight: true,
    autoheight: false,
    altrows: true,
    enabletooltips: false,
    
    columnsheight:30,
    theme: 'metro',

    pageable: true,

  };

  alluserscolumns: any[] =
  [
    { text: 'Osoba', datafield: 'osoba',  width: 150},
    { text: 'Wydział', datafield: 'wydzial',  minwidth: 120},
  ]

  allGridsource={
    datatype: 'json',

      datafields:[  
        {name: 'id'},   
        {name: 'osoba', type:'string'},   
        {name: 'wydzial', type:'string'},   
      ],
      id:'id',
      url: this.sg['SERVICE_URL']+'Grafy/GetUsersToShare/'+'',

      deleterow: (rowdata: any, commit: any) => {
        commit(true);
      },
  };

  allGriddataAdapter = new $.jqx.dataAdapter(this.allGridsource);




  shareduserscolumns: any[] =
  [
    { text: 'Rola', datafield: 'rola',  width: 50},
    { text: 'Osoba', datafield: 'osoba',  width: 150},
    { text: 'Wydział', datafield: 'wydzial',  minwidth: 120},
  ]

  sharedGridsource={
    datatype: 'json',

      datafields:[  
        {name: 'id'},
        {name: 'rola', type:'string'},   
        {name: 'osoba', type:'string'},   
        {name: 'wydzial', type:'string'},   
      ],
      id:'id',
      url: this.sg['SERVICE_URL']+'Grafy/GetUsersInShare',
      data:{
        id: '0',//this.grafyRole.filter(g=>g.id==this.treeSelected.id)[0].id_grafu,  //this.treeSelected?(this.treeSelected.id?this.treeSelected.id:0):0,
        user:''
      },
      addrow: (rowid: any, rowdata: any, position: any, commit: any) => {
        const t = JSON.stringify(rowdata);  
        $.ajax({
          cache: false,
          dataType: 'json',
          contentType: 'application/json',
          url: this.sg['SERVICE_URL'] + 'Grafy/AddGraf',
          data: t,
          type: 'POST',
          success:  (data: any, status: any, xhr: any)=> {             
            commit(true);   
            this.sharedusersGrid.updatebounddata();               
          },
          error: function (jqXHR: any, textStatus: any, errorThrown: any) {
            alert(textStatus + ' - ' + errorThrown);
            commit(false);
          }
        })
      },
      deleterow: (rowdata: any, commit: any) => {
        const t = JSON.stringify(rowdata);
        $.ajax({
          cache: false,
          dataType: 'json',
          contentType: 'application/json',
          url: this.sg['SERVICE_URL'] + 'Grafy/DelGraf/'+rowdata,
          //data:t,
          type: 'POST',
          success: (data: any, status: any, xhr: any)=> {
            this.sharedusersGrid.updatebounddata();                             
          },
          error: function (jqXHR: any, textStatus: any, errorThrown: any) {
            alert(textStatus + ' - ' + errorThrown);
          }
        })
        commit(true);
      },
  };
  sharedGriddataAdapter = new $.jqx.dataAdapter(this.sharedGridsource);



  //#endregion

  //#region help functions
  
      getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
    
      getLength(x1:number,y1:number, x2:number, y2:number){
        let rez = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
    
        return rez;
      }
    
      newCircle(){
    
        var c = this.s.circle(Math.round(250*Math.random())+10, Math.round(250*Math.random())+10, 30);
        c.attr("id","id_"+Date.now());
        c.attr("fill", this.getRandomColor());  
        this.addMouseListeners(c);
    
      }

    
      test(value: any){
        if(value!=null){
          //console.log(value.target.files[0]);

         
        }
        else{

          
          console.log('ddd');
        }
      }

      isInType(object: any): boolean{
        if(this.selected)
          if(this.selected instanceof object)
          return true;

        return false;
      }
  
    //#endregion
  

  //#region file operations

  showFileInfo: boolean = false;
  fileContent: string="";
  loadFile(){
    this.fileWindow.title("Generowanie grafu na podstawie pliku");
    this.fileWindow.open();
  }

  readFile(event: any){
    var reader = new FileReader();
    reader.onload = (e)=> {
      let content = reader.result;
      this.fileContent = content;
      this.prepareGrid(content);
    };
    reader.readAsText(event.target.files[0],'Windows-1250');
  }

  filecolumns: any[] =[
      { text: 'kolumna-0', datafield: 'column0',  width: 120},
      { text: 'kolumna-1', datafield: 'column1',  width: 120},
      { text: 'kolumna-2', datafield: 'column2',  width: 120},
      { text: 'kolumna-3', datafield: 'column3',  width: 120}
  ]

  filesource={
    datafields: [  
       {name:'wydzial', type: 'string', map: '0'}     
      ],

    datatype: 'array',
     
  };

  filedataAdapter = new $.jqx.dataAdapter(this.filesource);

  separator=";";
  firstRowHeaders: boolean = false;
  primaryKey: any="";
  primaryContent: any="";
  secondaryKey: any="";
  prepareGrid(data: any){
    if(data){

      let rows = data.split('\n');

      let rowcounter=0;
      let startrow = this.firstRowHeaders?1:0;
      
      if(rows.length>startrow){
        let columnsCounter = rows[0].split(this.separator).length;

        let resultSource=[]=[];

        
        rows.forEach((row:any, index)=>{  
          if(index>=startrow){      
            let tmpsource= []=[];
            for(let i =0; i<columnsCounter; i++){            
              tmpsource.push(row.split(this.separator)[i]);
            
            }

            rowcounter++;
            resultSource.push(tmpsource);      
          }
        });
       
        for(let i =0; i<columnsCounter; i++){
        
          let col = 'kolumna-'+i;
          if(this.firstRowHeaders){           
            col=resultSource[0][i]?resultSource[0][i]:col;
          }
    
          this.filecolumns[i] = i<columnsCounter-1?{ text: col, datafield: 'column'+i,  width: 120}: { text: col, datafield: 'column'+i};

          switch (i){
            case 0:
              this.primaryKey = 'column0';
              break;
            case 1:
              this.primaryContent='column1';
              break;
            case 2:
              this.secondaryKey='column2';
              break;
          }

          this.filesource['datafields'].push({name: 'column'+i, type:'string', map:i.toString()});
        }

        // this.filecolumns[ this.filecolumns.length-1]['minwidth']=120;
        // this.filecolumns[ this.filecolumns.length-1]['width']='auto';

        let grid
        this.filesource['localdata']= resultSource.slice(0,5);
              
        this.fileGrid['source']=new $.jqx.dataAdapter(this.filesource);
         //this.fileGrid.refresh();
  
        this.fileGrid.updatebounddata(); 
       
      }
    }

  }

  refreshFileGrid(){

    this.prepareGrid(this.fileContent);
  }

  fileWindowClose(event: any){
    this.separator =";"
    this.primaryKey= "";
    this.primaryContent="";
    this.secondaryKey="";
    this.graphLevels =[];
    this.firstRowHeaders= false;

    this.filecolumns =[
      { text: 'kolumna-0', datafield: 'wydzial',  width: 120},
      { text: 'kolumna-1', datafield: 'wydzial1',  width: 120},
      { text: 'kolumna-2', datafield: 'wydzial2',  width: 120},
      { text: 'kolumna-3', datafield: 'wydzial3',  width: 120}
    ]

    this.filesource={

      datafields: [  
         {name:'kolumna', type: 'string', map: '0'}     
        ],
  
      datatype: 'array',
       
    };

    this.filedataAdapter = new $.jqx.dataAdapter(this.filesource);

    $('#file-field').val('');

  }

  graphLevels: any[][]=[];
  pK: number=0;pC: number=0; sK: number=0;
  startDrawingFromFile(){

    this.wyczysc();

    this.pK =parseInt(this.primaryKey.replace('column',''));
    this.pC =parseInt(this.primaryContent.replace('column',''));
    this.sK =parseInt(this.secondaryKey.replace('column',''));

    this.graphLevels[0]=[];
    this.filesource['localdata'].forEach((row: any)=>{
     
      if(row[this.sK]===""){
        this.graphLevels[0].push({id: row[this.pK], content: row[this.pC], parent: row[this.sK] });
        this.prepareGraphFromFile(row[this.pK],1);
      }
    })

    this.drawElementsFromFile();



    
  }

  prepareGraphFromFile(element: string, level: number){
  
    if(!this.graphLevels[level])
      this.graphLevels[level]=[];

    this.filesource['localdata'].forEach((row: any)=>{
      if(row[this.sK]===element){
        this.graphLevels[level].push({id: row[this.pK], content: row[this.pC], parent: row[this.sK] });
        this.prepareGraphFromFile(row[this.pK],level+1);
      }
    });
  }

  drawElementsFromFile(){
    let maxCount=0;
    this.graphLevels.forEach((el:any)=>{ 
      maxCount<el.length?maxCount=el.length:false;
    })

    let w = 150;
    let h = 50;

    if(maxCount>0)
    this.graphLevels.forEach((item, index)=>{
      item.forEach((el,elindex)=>{
      
        this.gObjects.drawFromFile({x: (maxCount/item.length)*w +2*w*elindex,
                                    y: 2*h*index+h,
                                    w: w,
                                    h: h,
                                    uid: el['id'],
                                    info: el['content'] })
      });

    });


    this.graphLevels.forEach((item, index)=>{
      item.forEach((el,elindex)=>{
        if(el['parent']!=='')
          this.linesContainer.drawFromFile({id: "id_line_"+Date.now()+elindex+index, start: 'id_rect_'+el['parent'], stop: 'id_rect_'+el['id']});
      });
    });

    this.gObjects.updateLayout();

    this.myTree.selectItem(null);   
    this.treeSelected=null;
    this.selectedGraf=null;
    
  }


  //#endregion
}

export class CVObject{

  constructor(){};

  makeSelected(){};

  public static makeUnselected(){
    $('#id_selected').remove();
  };
}

export class linesContainerClass{
  linesContainer: lineClass[]=[];

  parent: AnalizaGraficznaComponent=null;

  constructor(parent: AnalizaGraficznaComponent){
    this.parent = parent;
  }

  addline(line: lineClass){

    this.linesContainer.push(line);
  }

  clean(){
    this.linesContainer.forEach(element => {      
      $('#'+element.id).remove();
    });
    this.linesContainer=[];
  }

  get(id: string): lineClass{
    return this.linesContainer.filter(o=>o.id==id)[0];
  }

  removeline(line: any){

    let tmp = this.linesContainer.filter(o=>o.id==line.id)[0];

    let index = this.linesContainer.indexOf(tmp)
    if(index>-1){
      $('#'+line.id).remove();
      this.linesContainer.splice(index,1);

      $('#arrow_'+line.id).remove();
     
    }
  }

  removeFromElement(obj: any){
    let list: any []=[];
    for(let i in this.linesContainer){
      if(this.linesContainer[i].startid == obj.id || this.linesContainer[i].stopid == obj.id)      
        list.push(this.linesContainer[i]);
    }

    for(let i in list)
    this.removeline(list[i]);
  }

  setEndLine(endid: any, line: any){
    line.stopid = endid;

    line.move($("#"+endid));

    // let tmp = this.parent.gObjects.get(endid);
    // if(tmp)
    //   line.extendLine(tmp.getCenter());

    //line.drawArrow();
  }

  updatePos(object: any){
    // for(let i in this.linesContainer)
    //   this.linesContainer[i].move(object);

    let obid = object.attr('id');
    this.linesContainer.filter(l=>l.startid == obid || l.stopid==obid).forEach((l)=>{l.move(object)});

    
  }

  getXml(){
    if(this.linesContainer.length<1)
      return null;
    let linesXml: any=[];

    this.linesContainer.forEach(element => { 
      linesXml.push({line:{id:element.id,
      startid:element.startid,
      stopid:element.stopid,
      x1:element.x1,
      x2:element.x2,
      y1:element.y1,
      y2:element.y2,
    }});
    });
    return linesXml;
  }

  drawXml(list: any){
    this.clean();
    list.forEach(element => {
      //console.log('h'+element.line);
      if(element.line){
        let line = new lineClass(null,null,null);
        this.addline(line);
        line.createFromXml(element.line[0], this.parent);
      }
    
    });
  }

  drawFromFile(object:any){
    let line = new lineClass(null,null,null);
    this.addline(line);
    line.createFromFile(object, this.parent);
  }

}

export class lineClass{

  id: string;
  startid:string;
  stopid:string;
  parent: AnalizaGraficznaComponent=null;
  
  x1:number=0;
  y1:number=0;
  x2:number=0;
  y2:number=0;

  svgobject: any;

  constructor(x:number, y: number, parent: AnalizaGraficznaComponent){
     
   if(x){
    this.parent=parent;  

    this.x1=this.x2=x;
    this.y1=this.y2=y
    
    this.id = "id_line_"+Date.now();
    
    this.createLine();

   }
  }

  createLine(){
    let tmp = this.parent.s.line(this.x1,this.y1,this.x2,this.y2);    
    tmp.attr({"id":this.id,'stroke-width':2, 'stroke':'black'});

    this.svgobject = tmp;

    this.move();
  }

  createFromXml(object: any, parent: any){
    this.parent=parent; 
    this.x1=parseInt(object.x1[0]);
    this.x2=parseInt(object.x2[0]);
    this.y1=parseInt(object.y1[0]);
    this.y2=parseInt(object.y2[0]);
    
    this.id = object.id[0];
    this.startid=object.startid[0];
    this.stopid=object.stopid[0];
    
    this.createLine(); 

    //this.drawArrow();
  }

  createFromFile(object: any, parent: any){
    this.parent=parent;
    
    let start= this.parent.gObjects.get(object.start).getCenter();
    let stop = this.parent.gObjects.get(object.stop).getCenter();

    this.x1=start.x;
    this.x2=stop.x;
    this.y1=start.y;
    this.y2=stop.y;
    
    this.id =object.id;
    this.startid=object.start;
    this.stopid=object.stop;
    
    this.createLine(); 

    //this.drawArrow();
  }

  drawArrow(touchPoint:coordPoint){

    // let startpoint = {x: parseInt(this.svgobject.attr('x1')), y: parseInt(this.svgobject.attr('y1'))};
    let startpoint = {x: this.svgobject.attr('x1'), y: this.svgobject.attr('y1')};

 
    let tmp = this.parent.s.path('M'+startpoint.x+" "+startpoint.y+"L"+touchPoint.x+" "+touchPoint.y);
    tmp.attr({'id':'tmp'+this.id});
    

    let joint_x = touchPoint.x;
    let joint_y = touchPoint.y;

    //wyznaczenie odleglosci od poczatku linii  do punktu styku
    let len = Snap.len(joint_x, joint_y, startpoint.x, startpoint.y);
    if(len>20){

      //**************** punkt podstawy strzałki */
      let top = tmp.getPointAtLength(len-15);
      $('#tmp'+this.id).remove();

      //********** współczynnik a prostej prostopadłej do linii */
      if(this.y2-startpoint.y!=0){
        let A:number = (this.x2-startpoint.x)/(this.y2-startpoint.y);        
        
        //*********** wyznaczanie pierwszego narożnika strzałki */
        let x1 :number= top.x+50;
        let y1 :number= -A*x1+top.y+top.x*A;

        tmp = this.parent.s.path('M'+top.x+" "+top.y+"L"+x1+" "+y1);
        tmp.attr({'id':'tmp'+this.id});
        let p1 = tmp.getPointAtLength(5);
        $('#tmp'+this.id).remove();

        //*********** wyznaczanie drugiego narożnika strzałki */
        let x2 :number= top.x-50;
        let y2 :number= -A*x2+top.y+top.x*A;
        
        tmp = this.parent.s.path('M'+top.x+" "+top.y+"L"+x2+" "+y2);
        tmp.attr({'id':'tmp'+this.id});
        let p2 = tmp.getPointAtLength(5);
        $('#tmp'+this.id).remove();

        $('#arrow_'+this.id).remove();
        let arrow=this.parent.s.path('M'+p1.x+" "+p1.y+"L"+p2.x+" "+p2.y+" L"+joint_x+" "+joint_y+" Z");
        
        arrow.attr({'id':'arrow_'+this.id, 'fill':'black' });
        arrow.click(()=>{this.makeSelected();});
        $('#'+this.id).attr({'x2':joint_x, 'y2':joint_y});
      }
    }       
    else{
      $('#arrow_'+this.id).remove();
    }

    $('#tmp'+this.id).remove();    
  }

  extendLine(point: coordPoint){
    this.x2 = point.x;
    this.y2 = point.y;
    $('#'+this.id).attr({x2:this.x2, y2:this.y2});
  }

  public move(object?: any){
   
      //if(object.attr('id') == this.startid || object.attr('id')==this.stopid)
      {    

        let isstartpoint: boolean= false;

        if(object){
          let gobject = this.parent.gObjects.get(object.attr('id'));
          let center = gobject.getCenter();
          isstartpoint = (object.attr('id') == this.startid);
       

          if(isstartpoint){
            this.x1 = center.x;
            this.y1 = center.y;  
          }
          else{
            this.x2 = center.x;
            this.y2 = center.y;
          }  

        }

        let startpoint = this.startid?this.parent.gObjects.get(this.startid).getLineTouchPoint(new coordPoint(this.x2,this.y2)): new coordPoint(this.x1,this.y1);
        let stoppoint = this.stopid?this.parent.gObjects.get(this.stopid).getLineTouchPoint(new coordPoint(this.x1,this.y1)): new coordPoint(this.x2,this.y2);

       
        if(startpoint && stoppoint){
          $('#'+this.id).attr({x1:startpoint.x,y1: startpoint.y, x2: stoppoint.x, y2: stoppoint.y});

          this.drawArrow(stoppoint);             
        }
      }
  }

  makeSelected(){
    $('#id_selected').remove();

    let tmp = $('#'+this.id);
   

    let frame = this.parent.s.line(tmp.attr('x1'),tmp.attr('y1'),tmp.attr('x2'),tmp.attr('y2'));  
    frame.attr({id:'id_selected','stroke':'gold','stroke-width':2, 'fill':'none'});

    // let bb =this.svgobject.getBBox();

    // //let frame =this.parent.s.rect(bb.x-5, bb.y-5, bb.width+10, bb.height+10);

    // let x1 = Math.min(this.x1, this.x2);
    // let x2 = Math.max(this.x1, this.x2);
    // let y1 = Math.min(this.y1, this.y2);
    // let y2 = Math.max(this.y1, this.y2);

    // let frame = this.parent.s.path('M'+(x1-2)+" "+(y1-2)+
    // "L"+(x2+2)+" "+(y2-2)+
    // "L"+(x2+2)+" "+(y2+2)+
    // "L"+(x1-2)+" "+(y1+2)+" Z");
    // frame.attr({id:'id_selected','stroke':'gold','stroke-width':1, 'fill':'none'});

  }

  getTarget(object: any): coordPoint{
    let ob = this.parent.gObjects.get(object.attr('id'));
    if(ob)
      return ob.getCenter();
    return null;
  }

}
//klasa pomocnicza do przechowywania punktu (x,y)
export class coordPoint{
  x:number;
  y:number;

  constructor(x:number, y:number){
    this.x = x;
    this.y = y;
  }
}



export class GObjectContainerClass{
  private objectsContainer: GObjectBaseClass[]=[];
  parent: AnalizaGraficznaComponent=null;

  constructor(parent: AnalizaGraficznaComponent){
    this.parent = parent;
  }

  add(gobject: GObjectBaseClass){
 
    this.objectsContainer.push(gobject);
    //this.parent.selected = gobject;
  }

  
  changeInfo(id:string, tresc: string){
    let tmp = this.get(id);
    if(tmp)
      tmp.changeInfo(tresc);
  }

  changeFontSize(id:string, tresc: string){   
    let tmp = this.objectsContainer.filter(o=>o.id==id)[0];
    if(tmp)
      tmp.changeFontSize(tresc);
  }

  changeBgColor(tresc: string){  
  
    if(this.parent.lastSelected){
    let tmp = this.get(this.parent.lastSelected.id);
    if(tmp)
      tmp.changeBgColor(tresc);
    }
  }

  changeFontColor(tresc: string){  
  
    if(this.parent.lastSelected){
    let tmp = this.get(this.parent.lastSelected.id);
    if(tmp)
      tmp.changeFontColor(tresc);
    }
  }

  clean(){
    this.objectsContainer.forEach(element => {      
      element.del();
    });
    this.objectsContainer =[];
  }

  drawXml(list: any){
    //this.clean();
    list.forEach(element => {
     
      switch(element.gobject[0].shape[0]){
        case 'rect':
          let tmpr = new GRectClass(null,null,null);
          this.add(tmpr);
          (tmpr).createFromXml(element.gobject[0], this.parent);
          break;
        case 'circle':
          let tmpc = new GCircleClass(null,null,null);
          this.add(tmpc);
          (tmpc).createFromXml(element.gobject[0], this.parent);
          break;
        case 'text':
          let tmpt = new GTextClass(null,null,null);
          this.add(tmpt);
          (tmpt).createFromXml(element.gobject[0], this.parent);
          break;        
      }
    });
  }

  drawFromFile(object: any){
    let tmpr = new GRectClass(null,null,null);
    this.add(tmpr);
    (tmpr).createFromFile(object, this.parent);
  }

  del(id:string){
    let tmp = this.objectsContainer.filter(o=>o.id==id)[0];
      
    if(tmp){
      let index = this.objectsContainer.indexOf(tmp)
      if(index>-1){
        tmp.del();
        this.objectsContainer.splice(index,1);      
        this.parent.cleanSelection();
      }
    }


  }

  get(id: string){
    return this.objectsContainer.filter(o=>o.id==id)[0];
  }

  getByInfoId(id:string){
    id =id.replace('id_info_','');
    return this.objectsContainer.filter(o=>o.uid== parseInt( id))[0];
  }

  getelementInPoint(x:number, y:number){
    let rez = null;
    this.objectsContainer.forEach(element => {              

          if(element.isContainingPoint(x,y))
            rez = this.parent.svg.getElementById(element.id);
    });    
    return rez;
  }

  isOnBorder(id: string, event:any): boolean{
    let tmp = this.get(id);      
    if(tmp)
      return tmp.isOnBorder(event);

    return false;
  }

  move(x:number, y:number, id:string){
    let tmp = this.get(id);
    if(tmp)
      tmp.move(x,y);
  }

  resize(id:string, x:number, y:number){
    let tmp = this.get(id); //this.objectsContainer.filter(o=>o.id==id)[0];
    if(tmp){
      tmp.resize(x,y);
    }
  }

  setToEdit(id:string){
    let tmp = this.get(id); 
    if(tmp)
      tmp.setToEdit();
  }

  updateLayout(id?:string){
    if(id){
      let tmp = this.get(id);
      if(tmp){
        tmp.updateLayout();


        this.objectsContainer.splice(0,0,this.objectsContainer.splice(this.objectsContainer.indexOf(tmp),1)[0]);   
      }
    }
    else
      this.objectsContainer.forEach(element=>{element.updateLayout();})
  }

  

  getXml(){

    if(this.objectsContainer.length<1)
    return null;

    let objectsXml: any=[];

    this.objectsContainer.forEach(element => { 
      objectsXml.push({gobject:element.getXML()});
    });
    return objectsXml;
  }

  getFarrestPoint(): coordPoint{
    let p = new coordPoint(0,0);
    this.objectsContainer.forEach(element => {      
      let tmp = element.getFarrestPoint();
      p.x=tmp.x>p.x?tmp.x:p.x;
      p.y=tmp.y>p.y?tmp.y:p.y;
    });

    return p;
  }

}

export class GObjectBaseClass extends CVObject{

  uid : number=0;
  id:string="";
  shape:string="";
  info:string="przykładowa treść"; 
  fontsize:number=15;  
  bgcolor:string='#ffffff';
  fontcolor: string="#000000";

  opis2:string="";

  x:number=0;
  y:number=0;
  w:number=150;
  h:number=50;

  r:number=25;

  svgobject:any;


  parent: AnalizaGraficznaComponent=null;

  constructor();
  constructor(){super(); }

  baseFunction(){ 
    
    $('#'+this.id).attr({class:'gObject'});
   }

  del(){}

 
  checkIsOnBorder(event: any){  }

  changeFontSize(size: string){
    this.fontsize = parseInt(size);
    //$('#id_info_'+this.uid).css({"font-size": size+'px'});
    this.create_multiline();
  }

  createFromXml(object: any, parent: any){}


  create_multiline() {

    let startP: coordPoint = this.getInfoPosition();

    let delel=document.getElementById("id_info_"+this.uid);

    if(delel)
      delel.parentNode.removeChild(delel);

    let text_element = this.parent.s.text(startP.x+5,startP.y,this.info).attr({id:'tmpinfo',"font-size":this.fontsize });
    text_element.attr({y:this.y+parseInt(this.parent.svg.getElementById('tmpinfo').getBBox().height)})
    
    var result :string []=[];
    
    // if(width< text_element.getBBox().width)
    if((this.w< parseInt(this.parent.svg.getElementById('tmpinfo').getComputedTextLength()) && this.info.replace(/\n/g, " \n ").split(' ').length>1) || this.info.indexOf('\n')>-1 )
    {
      $('#tmpinfo').remove();

      let words = this.info.replace(/\n/g, " \n ").split(' ');

      let line=words[0];
      for(var i=1; i<words.length;i++){

        let gtmp = this.parent.s.text(startP.x,startP.y,line +" "+ words[i]).attr({id:'tmpinfo',"font-size":this.fontsize});      
        if(parseInt(this.parent.svg.getElementById('tmpinfo').getComputedTextLength())>this.w-5 || words[i]=='\n'){     
          result.push(line);
          line = words[i]=='\n'?'':words[i];    
        }
        else
          line=line +(line==''?'':" ")+ words[i];   
          $('#tmpinfo').remove();

        
        if(i+1>=words.length )
          result.push(line);
      }


     let wyn = this.parent.s.text(startP.x+5,startP.y,result);
     wyn.attr({"id":"id_info_"+this.uid, "font-size":this.fontsize});
     let size = 1;
     wyn.selectAll("tspan").forEach((tspan, i)=>{
       if(i==0)
       size = parseInt(tspan.getBBox().height);
       tspan.node.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
       tspan.attr({x:startP.x+5, y:startP.y+(i*size)*(1/this.parent.scale)+size*(1/this.parent.scale)}); 
      });
     //wyn.selectAll("tspan").forEach((tspan, i)=>{tspan.attr({x:x, dy:i*18+5}); });     

     text_element = wyn;
    }

    text_element.attr({"id":"id_info_"+this.uid, "font-size":this.fontsize, 'fill':this.fontcolor});
    $('#'+"id_info_"+this.uid).toggleClass('text');

    return text_element;
  }

  changeBgColor(color: string){    
    this.bgcolor = color;
    $('#'+this.id).attr({"fill": this.bgcolor});
  }

  changeFontColor(color: string){
    this.fontcolor = color;
    $('#id_info_'+this.uid).attr({"fill": this.fontcolor});
  }

  getCenter(): coordPoint{ return new coordPoint(0,0);}
 
  getFarrestPoint():coordPoint{
    return new coordPoint(0,0);
  }

  getInfoPosition(): coordPoint{
    return new coordPoint(this.x,this.y);
  }

  //punkt styku z linia
  getLineTouchPoint(startPoint: coordPoint): coordPoint{

    let endPoint = this.getCenter();

    if(!((startPoint.x>this.x && startPoint.x<this.x+this.w) && (startPoint.y>this.y && startPoint.y<this.y+this.h)) )
    {
            
      let Ap, Bp= new coordPoint(0,0);

      //współczynniki przekątnych

      let x_l = this.x;
      let x_r = this.x+this.w;
      let y_u=this.y;
      let y_d=this.y+this.h;

      let Ar = (y_u-y_d)/(x_r-x_l);
      let Br = -Ar*x_l+y_d;
      let Al = (y_u-y_d)/(x_l-x_r);
      let Bl = -Al*x_r+y_d;

      //wyznaczenie przecinanej krawedzi
      let Ak, Bk: number;
      let x,y:number;
      //y=Al*line.x1+Bl;
    

      //wspolczynnik dla linii
      let Dt = (endPoint.y-startPoint.y)/(endPoint.x-startPoint.x);

      //gora
      if((Al*startPoint.x+Bl)>startPoint.y && (Ar*startPoint.x+Br)>startPoint.y){
        y=this.y;
        x=(y+Dt*startPoint.x-startPoint.y)/Dt;      
      }
      //prawa
      if((Al*startPoint.x+Bl)>startPoint.y && (Ar*startPoint.x+Br)<startPoint.y && startPoint.x>this.x+this.w){
        x=this.x+this.w;
        y=(Dt*x)-Dt*startPoint.x+startPoint.y;      
      }
      //dol
      if((Al*startPoint.x+Bl)<startPoint.y && (Ar*startPoint.x+Br)<startPoint.y){
        y=this.y+this.h;
        x=(y+Dt*startPoint.x-startPoint.y)/Dt;      
      }
      //lewa
      if((Al*startPoint.x+Bl)<startPoint.y && (Ar*startPoint.x+Br)>startPoint.y && startPoint.x<this.x){
        x=this.x;
        y=(Dt*x)-Dt*startPoint.x+startPoint.y;      
      }

      if(x && y){  
        let rez = new coordPoint(x,y);
        return rez;
      }
    }

    return null; 
  }

  getXML(){}

  isContainingPoint(x:number, y:number){}

  isOnBorder(event: any):boolean{
    return false;
  }

  move(x:number, y:number){     

    // let infoob = this.parent.s.select("#id_info_"+this.uid);
    // let tmp_x = parseInt(infoob.attr('x'));
    // let tmp_y = parseInt(infoob.attr('y'));
    // infoob.attr({x:tmp_x+x, y: tmp_y+y});
    // infoob.selectAll("tspan").forEach((tspan, i)=>{
    //   let tmp_x = parseInt(tspan.attr('x'));
    //   let tmp_y = parseInt(tspan.attr('y'));
    //   tspan.attr({x:tmp_x+x, y:tmp_y+y});
    // });

    this.makeSelected();
  }   
  
  makeSelected(){
    $('#id_selected').remove();
    let bb =this.svgobject.getBBox();

    let frame =this.parent.s.rect(bb.x-5, bb.y-5, bb.width+10, bb.height+10);
    frame.attr({id:'id_selected','stroke':'gold','stroke-width':1, 'fill':'none'});

  }

  resize(x:number, y:number){   this.makeSelected();} 

  setToEdit(){
    this.parent.selectedText = this.info;
    this.parent.backgroundColor.setContent('<div style="text-shadow: none; position: relative; padding-bottom: 2px; margin-top: 2px; background:' + this.bgcolor+ '">' + this.bgcolor + '</div>');
    this.parent.fontColor.setContent('<div style="text-shadow: none; position: relative; padding-bottom: 2px; margin-top: 2px; background:' + this.fontcolor+ '">' + this.fontcolor + '</div>');
    this.parent.selectedFontSize = this.fontsize;
  }

  updateLayout(){
    this.parent.s.append(document.getElementById(this.id));

    //this.parent.svg.getElementById("id_info_"+this.uid).remove();
    //this.create_multiline(this.x,this.y, this.w );
    this.parent.s.append(document.getElementById("id_info_"+this.uid));

   
  }

  changeInfo(tresc: string){
    this.info = tresc;
    //$('#id_info_'+this.uid).text(tresc);
   // this.parent.svg.getElementById('#id_info_'+this.uid).remove();
    this.create_multiline();
  }

}

export class GRectClass extends GObjectBaseClass{

  constructor(x:number, y:number, parent: AnalizaGraficznaComponent )
  {
    super();

    if(x){
      this.x = x;
      this.y = y;
      this.parent = parent;


      this.shape = "rect";
      
      this.uid = Date.now();
      this.id = "id_rect_"+this.uid;       

      this.createObject();
      this.parent.svgObjects.push(this.id);  
    } 
  }

  calculateRadius(){
    let center = this.getCenter();
    this.r = Snap.len(this.x, this.y, center.x, center.y);
  }

  createObject(){    
    this.calculateRadius();
    
    let tmpobject = this.parent.s.rect(this.x, this.y, this.w, this.h);
    tmpobject.attr({'id':this.id,'rx':"5", 'ry':"5", "fill":this.bgcolor, 'stroke': 'skyblue', 'stroke-width':1});
    this.svgobject = tmpobject;

    //tmpobject = this.parent.s.text(this.x+5,this.y+15,this.info);
    tmpobject = this.create_multiline();

    this.baseFunction();
  }

  createFromXml(object: any, parent: any){

    this.x = parseInt(object.x[0]);
    this.y = parseInt(object.y[0]);
    this.w = parseInt(object.w[0]);
    this.h = parseInt(object.h[0]);
    this.parent = parent;
    this.shape = "rect";    
    this.uid = object.uid[0];
    this.id = object.id[0];
    this.info = object.info[0];
    this.fontsize = object.fontsize[0];
    this.bgcolor = object.bgcolor[0];
    if(object.fontcolor)
    this.fontcolor = object.fontcolor[0];
    this.opis2 =object.opis2?object.opis2[0]:null;
    this.createObject();
    this.parent.svgObjects.push(this.id);   

  }

  createFromFile(object: any, parent: any){
    this.x = parseInt(object.x);
    this.y = parseInt(object.y);
    this.w = parseInt(object.w);
    this.h = parseInt(object.h);
    this.parent = parent;
    this.shape = "rect";    
    this.uid = object.uid;
    this.id = 'id_rect_'+object.uid;
    this.info = object.info;

    this.createObject();
    this.parent.svgObjects.push(this.id);   
  }

  checkIsOnBorder(event: any){        
    let vbb =  this.parent.s.attr('viewBox');

    let cx = event.offsetX*(1/this.parent.scale)+vbb.x;
    let cy = event.offsetY*(1/this.parent.scale)+vbb.y;

    let rez = false;
 
    if(
      (((cy>(this.y-3))&&(cy<(this.y+this.h+3)))&&((cx>(this.x+this.w-3))&&(cx<(this.x+this.w+3)))) 
      ||
      (((cy>(this.y+this.h-3))&&(cy<(this.y+this.h+3)))&&((cx>(this.x-3))&&(cx<(this.x+this.w+3))))
    )
    rez = true;

    return rez;
  }

  del(){
    $('#'+this.id).remove();
    $('#id_info_'+this.uid).remove();
  }

  
  getCenter(){
    return new coordPoint(this.x+this.w/2, this.y+this.h/2)
  }
  
  getXML(){
    return {id: this.id,
            uid:this.uid,
            shape:this.shape,
            info:this.info,
            x:this.x,
            y:this.y,
            w:this.w,
            h:this.h,
            fontsize:this.fontsize,
            bgcolor:this.bgcolor,
            fontcolor:this.fontcolor,
            opis2:this.opis2,
            };
  }

  getFarrestPoint(){
    return new coordPoint(this.x+this.w, this.y+this.h);
  }

  isContainingPoint(x:number, y:number){
    if((this.x<x && this.x+this.w>x) && (this.y<y && this.y+this.h>y))
      return true;

    return false;
  }

  isOnBorder(event: any): boolean{

    let vbb =  this.parent.s.attr('viewBox');
    let w =  parseInt($("#"+this.parent.selected.id).attr("width"));
    let h =  parseInt($("#"+this.parent.selected.id).attr("height"));
    let x =  parseInt($("#"+this.parent.selected.id).attr("x"));
    let y =  parseInt($("#"+this.parent.selected.id).attr("y"));

    let cx = event.offsetX*(1/this.parent.scale)+vbb.x;
    let cy = event.offsetY*(1/this.parent.scale)+vbb.y;

    let rez = false;
    if(
      (((cy>(y-3))&&(cy<(y+h+3)))&&((cx>(x+w-3))&&(cx<(x+w+3)))) 
      ||
      (((cy>(y+h-3))&&(cy<(y+h+3)))&&((cx>(x-3))&&(cx<(x+w+3))))
    )
    rez = true;

    return rez;
  }

  move(x:number, y:number){

    this.x +=x;
    this.y +=y;

    //this.calculateRadius();

    $("#"+this.id).attr({x:this.x, y: this.y});

    super.move(x,y);
    this.create_multiline();

    // let infoob = this.parent.s.select('#id_info_'+this.uid);
    // infoob.attr({x: parseInt(infoob.attr('x'))+x, y: parseInt(infoob.attr('y'))+y});
    // infoob.selectAll("tspan").forEach((el)=>{
    //   el.attr({x:parseInt(el.attr('x'))+x, y:parseInt(el.attr('y'))+y}); 
    //  });


    super.move(x,y);
  }

  resize(x:number, y:number){    
    if(((this.w+x)>5 && (this.w+x<$("#svgCanvas").width())) && (((this.h+y)>5 && (this.h+y)<$("#svgCanvas").height()))){
      this.w+=x;
      this.h+=y;

      this.calculateRadius();

      $("#"+this.id).attr({width:this.w, height:this.h});

      this.create_multiline();

    }

    super.resize(x,y);
  }

}

export class GCircleClass extends GObjectBaseClass{

  constructor(x:number, y:number, parent: AnalizaGraficznaComponent )
  {
 
    super();
    if(x){
      this.x = x;
      this.y = y;
      this.parent = parent;

      this.shape = "circle";
      
      this.uid = Date.now();
      this.id = "id_circle_"+this.uid;
    
      this.createObject();
      this.parent.svgObjects.push(this.id);
    }
  }

  createObject(){
  
    let tmpobject = this.parent.s.circle(this.x, this.y, this.r);
    tmpobject.attr({'id':this.id, "fill":this.bgcolor, 'stroke': 'skyblue', 'stroke-width':1});
    this.svgobject = tmpobject;

    //tmpobject = this.parent.s.text(this.x-(this.r-10),this.y-(this.r-10),this.info);
    //tmpobject.attr({"id":"id_info_"+this.uid, "font-size":this.fontsize});
    // $('#'+"id_info_"+this.uid).toggleClass('text');
    this.create_multiline();

    this.baseFunction();
  }

  createFromXml(object: any, parent: any){

    this.x = parseInt(object.x[0]);
    this.y = parseInt(object.y[0]);
    this.r = parseInt(object.r[0]);
    this.parent = parent;
    this.shape = "circle";    
    this.uid = object.uid[0];
    this.id = object.id[0];
    this.info = object.info[0];
    this.fontsize = object.fontsize[0];
    this.bgcolor = object.bgcolor[0];
    if(object.fontcolor)
    this.fontcolor = object.fontcolor[0];
    this.opis2 =object.opis2?object.opis2[0]:null;
   
    this.createObject();
    this.parent.svgObjects.push(this.id);   

  }
  
  del(){
    $('#'+this.id).remove();
    $('#id_info_'+this.uid).remove();
  }


  getLineTouchPoint(startPoint: coordPoint): coordPoint{
    let endPoint = new coordPoint(this.x, this.y);

    if(!(Snap.len(startPoint.x, startPoint.y, this.x, this.y)<=this.r*2) ){

      let tmp = this.parent.s.path('M'+startPoint.x+" "+startPoint.y+"L"+endPoint.x+" "+endPoint.y);
      tmp.attr({'id':'tmp'+this.uid});//, 'stroke':"yellow", 'stroke-width':"3"

      let len = Snap.len(startPoint.x, startPoint.y, endPoint.x, endPoint.y)-this.r;
      let joinPoint = tmp.getPointAtLength(len);
      $('#tmp'+this.uid).remove();

      return new coordPoint(joinPoint.x, joinPoint.y);

    }
    return null;
  }

  getCenter(){
    return new coordPoint(this.x, this.y)
  }

  getXML(){
    return {id: this.id,
            uid:this.uid,
            shape:this.shape,
            info:this.info,
            x:this.x,
            y:this.y,
            r:this.r,
            fontsize:this.fontsize,
            bgcolor:this.bgcolor,
            fontcolor:this.fontcolor,       
            opis2:this.opis2,
            };
  }

  getFarrestPoint(){
    return new coordPoint(this.x+this.r, this.y+this.r);
  }

  getInfoPosition(): coordPoint{
    this.w = 2*this.r;
    return new coordPoint(this.x-this.r,this.y-15);
  }


  isContainingPoint(x:number, y:number){
    if(Snap.len(x,y,this.x, this.y)<=this.r)
      return true;

    return false;
  }

  isOnBorder(event: any): boolean{

    let vbb =  this.parent.s.attr('viewBox');
    let tmp_p = this.parent.svg.createSVGPoint();
    tmp_p.x = event.offsetX*(1/this.parent.scale)+vbb.x;
    tmp_p.y = event.offsetY*(1/this.parent.scale)+vbb.y; 
    // this.s.rect(tmp_p.x,tmp_p.y,2,2);
    let vb  = this.parent.s.attr('viewBox');
    //let tmpdist = this.getLength((this.startX),(this.startY),parseInt($("#"+this.selected.id).attr("cx")),parseInt($("#"+this.selected.id).attr("cy")));

    let tmpr = parseInt($("#"+this.parent.selected.id).attr("r"));             
    //tmp_p=tmp_p.matrixTransform(this.selected.getScreenCTM().inverse());

    let tdlugosc =this.parent.getLength((tmp_p.x),(tmp_p.y),this.x,this.y);
                
    //console.log("dlugosc:"+tmpdist+"    "+"promien:"+tmpr + "    cx:"+this.s.select("#"+this.selected.id).attr("cx")+ "  tx"+tmp_p.x+ "  tdlugosc"+tdlugosc+" hhh:"+thhh);
    if(tdlugosc>tmpr-3 && tdlugosc<tmpr+3){    
     return true;
    }

    return false;

  }
    
  move(x:number, y:number){
    this.x+=x;
    this.y+=y;
    $("#"+this.id).attr({cx:this.x, cy: this.y});

    //$("#id_info_"+this.uid).attr({x:this.x-(this.r-10), y: this.y-10});//-(this.r-10)
    this.create_multiline();

    // let infoob = this.parent.s.select('#id_info_'+this.uid);
    // infoob.attr({x: parseInt(infoob.attr('x'))+x, y: parseInt(infoob.attr('y'))+y});
    // infoob.selectAll("tspan").forEach((el)=>{
    //   el.attr({x:parseInt(el.attr('x'))+x, y:parseInt(el.attr('y'))+y}); 
    //  });

    super.move(x,y);

    //#region old
      // let tmpcx =  parseInt($("#"+this.selected.id).attr("cx"));
      // let tmpcy =   parseInt($("#"+this.selected.id).attr("cy"));

      // $("#"+this.selected.id).attr({cx:tmpcx+tx, cy: tmpcy+ty});

    //endregion
  }

  makeSelected(){
    $('#id_selected').remove();
    

    let frame =this.parent.s.circle(this.x, this.y,this.r+5);
    frame.attr({id:'id_selected','stroke':'gold','stroke-width':1, 'fill':'none'});

  }

  resize(x:number, y:number){
    let tmpr =  this.r;
    if((tmpr+x)>5 && (tmpr+x)<$("#svgCanvas").width()){
      this.r = tmpr+x;
      $("#"+this.id).attr({r:this.r});
    }
  
    super.resize(x,y);
  }
}

export class GTextClass extends GObjectBaseClass{

  constructor(x:number, y:number, parent: AnalizaGraficznaComponent)
  {
    super();

    if(x){
      this.x = x;
      this.y = y;
      this.parent = parent;

      this.shape = "text";
      
      this.uid = Date.now();
      this.id = "id_text_"+this.uid;

      this.bgcolor = '#000000'

      this.createObject();
      this.parent.svgObjects.push(this.id);    
    }
  }

  calculateRadius(){
    let center = this.getCenter();
    this.r = Snap.len(this.x, this.y, center.x, center.y);
  }

  changeInfo(tresc: string){
    this.info = tresc;
    //$('#'+this.id).text(tresc);
    this.create_multiline();
  }

  changeFontSize(size: string){
    this.fontsize = parseInt(size);
    $('#'+this.id).css({'font-size':size+'px'});
    this.makeSelected();
  }

  changeBgColor(color: string){
  }

  changeFontColor(color: string){
    this.fontcolor = color;
    $('#'+this.id).attr({"fill": this.fontcolor});
  }

  createObject(){   
    let tmpobject = this.create_multiline(); // this.parent.s.text(this.x, this.y, this.info);
    tmpobject.attr({'id':this.id,"fill": this.fontcolor, "font-size":this.fontsize+"px"});
    this.svgobject = tmpobject;

    this.h = tmpobject.getBBox().height;
    this.w = tmpobject.getBBox().width;

    $('#'+this.id).toggleClass('text');

    this.calculateRadius();

    this.baseFunction();
  }

  createFromXml(object: any, parent: any){
    this.x = parseInt(object.x[0]);
    this.y = parseInt(object.y[0]);
    this.parent = parent;
    this.shape = "text";    
    this.uid = object.uid[0];
    this.id = object.id[0];
    this.info = object.info[0];
    this.fontsize = object.fontsize[0];
    if(object.fontcolor)
    this.fontcolor = object.fontcolor[0];
    this.opis2 = object.opis2?object.opis2[0]:null;
   
    this.createObject();
    this.parent.svgObjects.push(this.id);   

  }

  
  create_multiline(){

    let startP: coordPoint = this.getInfoPosition();

    // let result = this.info.replace(/\n/g, " \n ").split(' ');
    let result = this.info.split('\n');

    // $('#id_text_'+this.uid).remove();
    $('#'+this.id).remove();

    let wyn = this.parent.s.text(startP.x+5,startP.y,result);
    //wyn.attr({"id":"id_text_"+this.uid, "font-size":this.fontsize,'fill':this.fontcolor});
    wyn.attr({"id":this.id, "font-size":this.fontsize,'fill':this.fontcolor});
    let size = 1;
    wyn.selectAll("tspan").forEach((tspan, i)=>{
      if(i==0)
      size = parseInt(tspan.getBBox().height);
    
      tspan.node.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");

      tspan.attr({x:startP.x+5, y:startP.y+(i*size)+size}); 
     });


    this.h = wyn.getBBox().height;
    this.w = wyn.getBBox().width;

    this.svgobject = wyn;

    this.makeSelected();

    return wyn;
  }
  
  del(){
    $('#'+this.id).remove();
  }

  getLineTouchPoint(startPoint: coordPoint): coordPoint{

    let bbox = this.svgobject.getBBox();
    let endPoint = new coordPoint(bbox.cx, bbox.cy)

    if(!((startPoint.x>bbox.x && startPoint.x<bbox.x+bbox.width) && (startPoint.y>bbox.y && startPoint.y<bbox.y+bbox.height)) )
    {
      
      
      // //linia przecinająca
      // let tmp = this.parent.s.path('M'+startPoint.x+" "+startPoint.y+"L"+endPoint.x+" "+endPoint.y);
      // tmp.attr({'id':'tmp'+this.uid});//, 'stroke':"yellow", 'stroke-width':"3"
      // $('#tmp'+this.uid).remove();
      //określenie krawędź przecinanej

      let Ap, Bp= new coordPoint(0,0);

      //współczynniki przekątnych

      let x_l = bbox.x;
      let x_r = bbox.x+bbox.width;
      let y_u=bbox.y;
      let y_d=bbox.y+bbox.height;

      let Ar = (y_u-y_d)/(x_r-x_l);
      let Br = -Ar*x_l+y_d;
      let Al = (y_u-y_d)/(x_l-x_r);
      let Bl = -Al*x_r+y_d;

      //wyznaczenie przecinanej krawedzi
      let Ak, Bk: number;
      let x,y:number;
      //y=Al*line.x1+Bl;
    

      //wspolczynnik dla linii
      let Dt = (endPoint.y-startPoint.y)/(endPoint.x-startPoint.x);

      //gora
      if((Al*startPoint.x+Bl)>startPoint.y && (Ar*startPoint.x+Br)>startPoint.y){
        y=bbox.y;
        x=(y+Dt*startPoint.x-startPoint.y)/Dt;      
      }
      //prawa
      if((Al*startPoint.x+Bl)>startPoint.y && (Ar*startPoint.x+Br)<startPoint.y && startPoint.x>bbox.x+bbox.width){
        x=bbox.x+bbox.width;
        y=(Dt*x)-Dt*startPoint.x+startPoint.y;      
      }
      //dol
      if((Al*startPoint.x+Bl)<startPoint.y && (Ar*startPoint.x+Br)<startPoint.y){
        y=bbox.y+bbox.height;
        x=(y+Dt*startPoint.x-startPoint.y)/Dt;      
      }
      //lewa
      if((Al*startPoint.x+Bl)<startPoint.y && (Ar*startPoint.x+Br)>startPoint.y && startPoint.x<bbox.x){
        x=bbox.x;
        y=(Dt*x)-Dt*startPoint.x+startPoint.y;      
      }

      if(x && y)
        return new coordPoint(x,y);      

    }

    return null;

  }

  getCenter(){
    // let h=0;
    // let w=0;

    //let bbox = this.svgobject.getBBox();
    //console.log(bbox)
    // this.svgobject.selectAll("tspan").forEach((el)=>{
    //   let b =el.getBBox();
    //   h+=parseInt(b.height)/2;
    //   w=b.width>w?b.width:w;
    //   //console.log(el);
    //  });
     return new coordPoint(this.x+this.w/2, this.y+this.h/2);
    // return new coordPoint(bbox.x+bbox.width/2, bbox.y+bbox.height/2);
    //return new coordPoint(this.x+this.svgobject.getBBox().width/2, this.y+this.svgobject.getBBox().height/4)
  }

  getXML(){
    return {id: this.id,
            uid:this.uid,
            shape:this.shape,
            info:this.info,
            x:this.x,
            y:this.y,     
            fontsize:this.fontsize,
            fontcolor:this.fontcolor,            
            opis2:this.opis2,
            };
  }

  getFarrestPoint(){
    let tmp = this.svgobject.getBBox();
    return new coordPoint(tmp.x+tmp.width, tmp.y+tmp.height);
  }

  isContainingPoint(x:number, y:number){      
    let tmp = this.parent.svg.getElementById(this.id).getBBox();

    if((this.x<x && this.x+tmp.width>x) && ((this.y-this.y+tmp.height/2<y && this.y+tmp.height>y)))
      return true;

    return false;
  }

  move(x:number, y:number){
    this.x+=x;
    this.y+=y;

    //this.calculateRadius();

    // $("#"+this.id).attr({x:this.x, y: this.y});
    this.create_multiline();

    // let infoob = this.parent.s.select('#'+this.id);
    // infoob.attr({x: parseInt(infoob.attr('x'))+x, y: parseInt(infoob.attr('y'))+y});
    // infoob.selectAll("tspan").forEach((el)=>{
    //   el.attr({x:parseInt(el.attr('x'))+x, y:parseInt(el.attr('y'))+y}); 
    //  });


    super.move(x,y);
  }

}



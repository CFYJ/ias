import {ViewChild, Component, OnInit, AfterViewInit } from '@angular/core';

import { AuthenticationService } from './../authentication.service';
import { SimpleGlobal } from 'ng2-simple-global';

import { jqxSplitterComponent} from 'jqwidgets-ts/angular_jqxsplitter';
import { jqxDropDownButtonComponent } from 'jqwidgets-ts/angular_jqxdropdownbutton';
import { jqxTreeComponent} from 'jqwidgets-ts/angular_jqxtree';
import { jqxWindowComponent } from 'jqwidgets-ts/angular_jqxwindow';

import { TEMPLATE_DRIVEN_DIRECTIVES } from '@angular/forms/src/directives';
import { shallowEqual } from '@angular/router/src/utils/collection';

import * as Xml from 'xml2js';
import { HtmlTagDefinition } from '@angular/compiler';
// { parseString, Builder }
declare var Snap: any;
declare var mina: any;

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


  @ViewChild('grafySceletonSplitter') grafySceletonSplitter: jqxSplitterComponent;
  @ViewChild('grafyTableSplitter') grafyTableSplitter: jqxSplitterComponent;
  @ViewChild('dropDownButton') myDropDown: jqxDropDownButtonComponent;
  @ViewChild('canvasColor') canvas: jqxDropDownButtonComponent;
  @ViewChild('myTree') myTree: jqxTreeComponent;
  @ViewChild('windowNewGraf') windowNewGraf: jqxWindowComponent;

  constructor(private authService: AuthenticationService,
    private sg: SimpleGlobal) { }



  ngOnInit() {

    this.s = Snap("#svgCanvas");
    this.svg = document.getElementById('svgCanvas');
    this.orgVBwidth = $("#svgCanvas").width();
    this.orgVBheight=$("#svgCanvas").height();     
    this.s.attr({viewBox:0+","+0+","+this.orgVBwidth+","+this.orgVBheight})
   
  }

  ngAfterViewInit(): void{
    this.grafySceletonSplitter.createComponent();
    this.grafyTableSplitter.createComponent();
    this.myTree.createComponent();
    this.myDropDown.createComponent(); 
    this.myDropDown.setContent(this.getTextElementByColor({ hex: "FFAABB" }));
    this.canvas.createComponent();
    this.canvas.setContent(this.getTextElementByColor({ hex: "FFFFFF" }));

    
    this.windowNewGraf.createWidget({
      width: 450, height:230, theme: 'metro',
      resizable: false, isModal: true, autoOpen: false, modalOpacity: 0.5
    });


    document.addEventListener('keyup', (event:any)=>{this.g_keypress(event)});

    this.generateTreeSource();


    //ocument.getElementById('testtext').getComputedTextLength();
   // console.log(this.svg.getElementById('testtext').getComputedTextLength());

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

  colorPickerEvent(event: any, target: any): void {   
    if(target=='canvas'){
      $('#svgCanvas').css({'background-color':'#' + event.args.color.hex});
      this.canvas.setContent(this.getTextElementByColor(event.args.color));
    }
    else{
      this.myDropDown.setContent(this.getTextElementByColor(event.args.color));
      // (<HTMLElement>document.getElementsByClassName('jqx-scrollview')[0]).style.borderColor = '#' + event.args.color.hex;
      this.gObjects.changeBgColor('#' + event.args.color.hex);
    }
  }



  selected: any=null;
  lastSelected:any =null;
  startX: any=0;
  startY: any=0;
  resize: boolean = false;

  isDrawing= false;
  isDragged = false;

  newline: any;

  selectedText:string='test';
  selectedFontSize:number=15;

  action:string = null;

  
  g_mousedown(event: any){
      //console.log(event);
  
    if(event['target'].id!=""){

      this.startX = event.offsetX;
      this.startY = event.offsetY;

      

      if(event['target'].id=="svgCanvas"){
        if(this.selectedShape!=null){
        // this.isDrawing = true;
            this.drawElement(event);
        }
        else
        this.isDragged = true;
      }
      else if(event['target'].id.indexOf('info')==-1 ){

        this.selected = document.getElementById(event['target'].id);
        this.lastSelected = this.selected;
  
        this.gObjects.setToEdit(this.selected.id);
      
        if(this.selectedShape == 'line'){
          // /console.log('1');
          this.drawElement(event);
          return;
        }
                
        this.isDragged = true;

        //wyciaga element na wierzch
        if(!this.selected.id.includes('line')){
          this.gObjects.updateLayout(this.selected.id);
        }


        if(this.selected.tagName!=null){                      
            switch(this.selected.tagName){
              case 'circle':
                let vbb =  this.s.attr('viewBox');
                let tmp_p = this.svg.createSVGPoint();
                tmp_p.x = event.offsetX*(1/this.scale)+vbb.x;
                tmp_p.y = event.offsetY*(1/this.scale)+vbb.y; 
                // this.s.rect(tmp_p.x,tmp_p.y,2,2);
                let vb  = this.s.attr('viewBox');
                //let tmpdist = this.getLength((this.startX),(this.startY),parseInt($("#"+this.selected.id).attr("cx")),parseInt($("#"+this.selected.id).attr("cy")));

                let tmpr = parseInt($("#"+this.selected.id).attr("r"));             
                //tmp_p=tmp_p.matrixTransform(this.selected.getScreenCTM().inverse());

                let tdlugosc =this.getLength((tmp_p.x),(tmp_p.y),parseInt($("#"+this.selected.id).attr("cx")),parseInt($("#"+this.selected.id).attr("cy")));
                            
                //console.log("dlugosc:"+tmpdist+"    "+"promien:"+tmpr + "    cx:"+this.s.select("#"+this.selected.id).attr("cx")+ "  tx"+tmp_p.x+ "  tdlugosc"+tdlugosc+" hhh:"+thhh);
                if(tdlugosc>tmpr-3 && tdlugosc<tmpr+3){    
                  this.resize = true;
                }
                break;
              case 'rect':
                if(this.isOnRectangleBorder(event)){
                  this.resize = true;
                }
                break;
              case 'text':           
                this.selectedText=this.selected.innerHTML;
                break;
 
            }
          

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
        // switch(this.selected.tagName.toLowerCase()){
        //   case 'circle':
        //     let tmpr =  parseInt($("#"+this.selected.id).attr("r"));
        //     if((tmpr+x)>5 && (tmpr+x)<$("#svgCanvas").width())
        //       $("#"+this.selected.id).attr({r:tmpr+x});
        //     break;
        //   case 'rect':
            
        //       let w =  parseInt($("#"+this.selected.id).attr("width"));
        //       let h =  parseInt($("#"+this.selected.id).attr("height"));
        //       if(((w+x)>5 && (w+x<$("#svgCanvas").width())) && (((h+y)>5 && (h+y)<$("#svgCanvas").height())))
        //         $("#"+this.selected.id).attr({width:w+x, height:h+y});
            
        //     break;

        
        // }

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

  selectedShape: any=null;  
  linesContainer: any = new linesContainerClass(this);

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
          if(this.selected && this.selected.id.indexOf('line')==-1)
            this.gObjects.get(this.selected.id).updateLayout();

          this.isDrawing = true;        
        }
        else{         
          let tmp = this.newline;
          tmp.extendLine(this.startX, this.startY);
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
    this.gObjects.changeInfo(this.lastSelected.id, event['target'].value);
  }

  changeFontSize(event:any){
    this.selectedFontSize = event['target'].value;
    this.gObjects.changeFontSize(this.lastSelected.id, this.selectedFontSize.toString());
  }
    
  addMouseListeners(object:any){
  
    object.dblclick((e: any)=>{this.g_mousedblclick(e)});
    object.mousedown((e: any)=>{this.g_mousedown(e)});
    //object.mouseup((e:any)=>{this.g_mouseup(e)});

    
  }

  wyczysc(){
    //this.s.clear();
    this.svgObjects =[];
    this.gObjects.clean();
    this.linesContainer.clean();

    this.selected=null;
    this.lastSelected=null;
  }

  saveImage(){
    // var a      = document.createElement('a');
    // a.href     = 'data:image/svg+xml;utf8,' + encodeURI($('#svgCanvas')[0].outerHTML);
    // a.download = 'plot.svg';
    // a.target   = '_blank';
    // document.body.appendChild(a); a.click(); document.body.removeChild(a);

    // var img    = this.svg.toDataURL("image/png");		
		// var myWindow = window.open("", "MsgWindow", "width=1000px, height=1000px");
    // myWindow.document.write('<img src="'+img+'"/>');
    

    //var a      = document.createElement('a');
    
    // a.href     = 'data:image/svg+xml;utf8,' + encodeURI($('#svgCanvas')[0].outerHTML);
    // a.download = 'plot.svg';
    // a.target   = '_blank';
    

    

     let serializer = new XMLSerializer();
    console.log(window.btoa(encodeURI(this.svg)));

     let imgb = new Image();
    // imgb.src = serializer.serializeToString(this.svg);
    imgb.src = window.btoa(encodeURI(this.svg));
    var canvas = document.createElement("canvas");
    //document.body.appendChild(canvas);
    canvas.getContext("2d").drawImage(imgb,0,0,800,1000);
		var img    = canvas.toDataURL("image/png");
		
		var myWindow = window.open("", "MsgWindow", "width=1000px, height=1000px");
		myWindow.document.write('<img src="data:image/png;base64,'+img+'"/>');

    //document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }

  //#region tree
  treeSource: any[]=[];
  grafyRole:any[]=[];
  generateTreeSource(){
    this.treeSource = [];
    this.grafyRole=[];
    $.ajax({
      cache: false,
      dataType: 'json',
      contentType: 'application/json',
      url: this.sg['SERVICE_URL'] + 'Grafy/GetUsersGrafsTree/'+1,
      type: 'GET',
      success: (data: any, status: any, xhr: any)=> {
        this.grafyRole = data;
        data.forEach(element => {
          //console.log(element);
          if(element.idParent == null){
            this.treeSource.push({label:element.nazwa, items:[]=[], id:element.id, icon: (element.typ=='katalog'?"/images/folder.png":"")});
            this.generateTreeBranches(this.treeSource[this.treeSource.length-1], data, element.id);
          }
        });

        // let i=0;
        // this.treeSource.forEach(element => {
        //   this.addTreeBranches(this.treeSource[i], data, element.id);
        //   i++;
        // });
        

        this.myTree.source(this.treeSource);

      },
      error: function (jqXHR: any, textStatus: any, errorThrown: any) {
        alert(textStatus + ' - ' + errorThrown);
      }
    })

   // this.myTree.source(this.treeSource);
  }

  generateTreeBranches(branch: any, leafs: any, parent: any){
    leafs.forEach(element => {
      if(element.idParent == parent){
        branch.items.push({label:element.nazwa, items:[]=[], id:element.id, icon: element.typ=='katalog'?"/images/folder.png":''})
        this.generateTreeBranches(branch.items[branch.items.length-1],leafs, element.id);
      }
    });

  }

  treeSelected: any={id:-1};
  myTreeOnSelect(event : any): void{  
    //console.log(this.gObjects);
    let args = event.args;
    let item = this.myTree.getItem(args.element);
    this.wyczysc();
    // console.log(this.treeSelected.id+" el:"+item['id']);
    // if(this.treeSelected.id == item['id'] && this.treeSelected.id!=-1)
    //    this.myTree.selectItem(null);
     
    let tmp  = this.grafyRole.filter(o=>o.id==item['id'])[0];  
    this.treeSelected = tmp;  

    if(tmp.typ=='graf')
      this.loadGraf(tmp.idGrafu);
     
   // }
  }


  //#endregion
  
  //#region edit Tree
 
  newGraf(){
    //console.log(this.grafyRole);
    this.windowNewGraf.title('Dodawanie');
    this.windowNewGraf.open();
  }
  newGrafOk(){
    //console.log(this.treeSelected);
    let rola={id:0,IdGrafu:0,User:'jakisuser',Role:'author',Nazwa:$('#newRoleName').val(), IdParent: this.treeSelected.id==-1?null:this.treeSelected.id, Typ:"katalog"};

    
    
    if($("#typroli").is(":checked")){
      rola['typ']='graf';
    }

    const t = JSON.stringify(rola);

    $.ajax({
      cache: false,
      dataType: 'json',
      contentType: 'application/json',
      url: this.sg['SERVICE_URL'] + 'Grafy/AddGraf',
      data: t,
      type: 'POST',
      success: (data: any, status: any, xhr: any)=> {
        //alert('Wstawiono nowy rekord - id: ' + data); 
        this.generateTreeSource();    
        this.windowNewGraf.close();               
      },
      error: function (jqXHR: any, textStatus: any, errorThrown: any) {
        alert(textStatus + ' - ' + errorThrown);
      }
    })
 
  }

  newGrafCancel(){
    this.windowNewGraf.close();
  }

  deleteGraf(){
    let rola = this.grafyRole.filter(o=>o.id==this.treeSelected.id)[0];
    if(rola){
      const t = JSON.stringify(rola);
      $.ajax({
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        url: this.sg['SERVICE_URL'] + 'Grafy/DelGraf',
        data:t,
        type: 'POST',
        success: (data: any, status: any, xhr: any)=> {
          this.generateTreeSource();   
          this.treeSelected=null;
        },
        error: function (jqXHR: any, textStatus: any, errorThrown: any) {
          alert(textStatus + ' - ' + errorThrown);
        }
      })
    }
  }

  //#endregion


  saveGraf(){

    let xmlData: any=[];
    xmlData={lines:this.linesContainer.getXml(),
             gobjects: this.gObjects.getXml()};

    //console.log(xmlData['lines']+ ' ' +xmlData['gobjects'])
    if(!xmlData['lines'] && !xmlData['gobjects'])
      return;

    let rez = (new Xml.Builder()).buildObject(xmlData);

    let url = this.sg['SERVICE_URL'] + 'Grafy/AddGraf';
    let newgraf={id:0, nazwa:"test", dataUtworzenia:null, opis:null, xml:rez};

    //if(this.selectedGraf){
      this.selectedGraf.xml = rez;
      url = this.sg['SERVICE_URL'] + 'Grafy/UpdateGraf/'+this.selectedGraf.id;
      newgraf = this.selectedGraf;
    //}
   
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
        this.generateTreeSource();                          
      },
      error: function (jqXHR: any, textStatus: any, errorThrown: any) {
        alert(textStatus + ' - ' + errorThrown);
      }
    })
  }


  selectedGraf:any;
  loadGraf(id: any){

   

    $.ajax({
      cache: false,
      dataType: 'json',
      contentType: 'application/json',
      url: this.sg['SERVICE_URL'] + 'Grafy/GetGraf/'+id,
      type: 'GET',
      success: (data: any, status: any, xhr: any)=>{
        this.wyczysc();

        this.selectedGraf = data;
        if(data)
        if(data.xml)
        Xml.parseString(data.xml, (err:any, rez:any)=>{
          if(rez.root.lines)        
            this.linesContainer.drawXml(rez.root.lines);  
          if(rez.root.gobjects)
            this.gObjects.drawXml(rez.root.gobjects);  
        });
      },
      error: function (jqXHR: any, textStatus: any, errorThrown: any) {
        alert(textStatus + ' - ' + errorThrown);
      }
    });
  }

  selectShape(shape: string, event:any){
    // if( $('#'+event['target'].parentElement['id']).hasClass('button-highlighted'))
    //   $('#'+event['target'].parentElement['id']).toggleClass('button-highlighted');
    // else{
    //   $('.button-highlighted').toggleClass('button-highlighted');
    //   $('#'+event['target'].parentElement['id']).toggleClass('button-highlighted')
    // }

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
        //var circle = document.createElement("circle")
    
        // $("circle").attr("r",30)
        // .attr("cx", 250*Math.random())
        // .attr("cy",250*Math.random());
        
        //$("<circle />").attr({id:"id_"+Date.now(), "r":30, "cx": Math.round(25*Math.random())+100, "cy":Math.round(50*Math.random())+100,stroke:"green", "stroke-width":"4", fill:"yellow"}).appendTo("#svgCanvas");    
        //$("#svgCanvas").append("circle").attr({id:"id_"+Date.UTC, "r":30, "cx": Math.round(250*Math.random()), "cy":Math.round(250*Math.random())});
    
        var c = this.s.circle(Math.round(250*Math.random())+10, Math.round(250*Math.random())+10, 30);
        c.attr("id","id_"+Date.now());
        c.attr("fill", this.getRandomColor());  
        this.addMouseListeners(c);
    
      }
    
      isOnRectangleBorder(event: any){
    
    
        let vbb =  this.s.attr('viewBox');
        // let tmp_p = this.svg.createSVGPoint();
        // tmp_p.x = event.offsetX*(1/this.scale)+vbb.x;
        // tmp_p.y = event.offsetY*(1/this.scale)+vbb.y; 
        // this.s.rect(tmp_p.x,tmp_p.y,2,2);
    
    
        let w =  parseInt($("#"+this.selected.id).attr("width"))//*(1/this.scale);
        let h =  parseInt($("#"+this.selected.id).attr("height"))//*(1/this.scale);
        let x =  parseInt($("#"+this.selected.id).attr("x"))//*(1/this.scale);
        let y =  parseInt($("#"+this.selected.id).attr("y"))//*(1/this.scale);
    
        let cx = event.offsetX*(1/this.scale)+vbb.x;
        let cy = event.offsetY*(1/this.scale)+vbb.y;
    
        let rez = false;
        //console.log((x+w)+"    "+(y+h) +"   "+cx+"    "+cy);
        if(
          (((cy>(y-3))&&(cy<(y+h+3)))&&((cx>(x+w-3))&&(cx<(x+w+3)))) 
          ||
          (((cy>(y+h-3))&&(cy<(y+h+3)))&&((cx>(x-3))&&(cx<(x+w+3))))
        )
        rez = true;
    
        return rez;
      }
    
      
      
      test(value: any){
        if(value!=null)
          console.log(value);
        else{

          this.loadGraf(1);

          //console.log(this.selectedShape);
          //var z = this.s.scale(10);
          // var zz = new Snap.Matrix();
          // zz.scale(0.4);


          // var ff = this.s.selectAll('*');
          // ff.forEach(element => {
          //   element.transform('S0.4');
          // });



          //ff.transform('s0.4');    
          //this.newCircle();
        }
      }
  
    //#endregion
  
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

  removeline(line: any){

    let tmp = this.linesContainer.filter(o=>o.id==line.id)[0];

    let index = this.linesContainer.indexOf(tmp)
    if(index>-1){
      $('#'+line.id).remove();
      this.linesContainer.splice(index,1);
     
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
    // let tmp = this.linesContainer.filter(o=>o.id==line.attr('id'))[0]; 
    // if(tmp)
    //   tmp.stopid = endid;
  }

  updatePos(object: any){
    for(let i in this.linesContainer)
      this.linesContainer[i].move(object);
      // this.s.append(this.selected);
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




  constructor(x:number, y: number, parent: AnalizaGraficznaComponent){
     
   if(x){
    this.parent=parent;  

    if(this.parent.selected)
      this.startid = this.parent.selected.id;

      // let startpoint = this.getTarget(this.parent.selected);
      // this.x1=this.x2=startpoint.x;
      // this.y1=this.y2=startpoint.y;
  

    this.x1=this.x2=x;
    this.y1=this.y2=y
    
    this.id = "id_line_"+Date.now();
    
    this.createLine();

   }
  }

  createLine(){
    let tmp = this.parent.s.line(this.x1,this.y1,this.x2,this.y2);    
    tmp.attr({"id":this.id,'stroke-width':3, 'stroke':'black'});

    //#region old
      // this.newline = this.s.line(this.startX,this.startY,this.startX,this.startY);   
      // let id = "id_line_"+Date.now();
      // this.newline.attr({"id":id,'stroke-width':3, 'stroke':'black'});
      // this.isDrawing = true;
      // //this.addMouseListeners(this.newline);
      // let start = this.selected?this.selected.id:null;
      // this.linesContainer.addline(new lineClass(id , start, null));
      // if(this.selected)
      //   this.s.append(this.selected);
    //endregion
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

  }

  extendLine(x:number, y:number){
    this.x2 = x;
    this.y2 = y;
    $('#'+this.id).attr({x2:this.x2, y2:this.y2});
  }



  public move(object: any): boolean{
    //console.log('yyy'+object.attr('id'));
  
    let rez = false;
      if(object.attr('id') == this.startid || object.attr('id')==this.stopid)
      {
        rez = true;
        if(object.attr('id') == this.startid){               
          let tmp =   $('#'+this.id);
          this.x1 = this.getTarget(object).x;
          this.y1 = this.getTarget(object).y;
          tmp.attr({x1:this.x1,y1:this.y1});
         
        }
        else{
          let tmp =   $('#'+this.id);
          this.x2 = this.getTarget(object).x;
          this.y2 = this.getTarget(object).y;
          tmp.attr({x2:this.x2,y2:this.y2});
        }

      }
    return true;
  }

  getTarget(object: any): coordPoint{
    switch(object.attr('id').split('_')[1]){
      case 'circle':
        return new coordPoint(parseInt(object.attr("cx")), parseInt(object.attr("cy")));
      case 'rect':
        return new coordPoint(parseInt(object.attr("x"))+parseInt(object.attr("width"))/2,
         parseInt(object.attr("y"))+parseInt(object.attr("height"))/2);
      case 'text': 
      return new coordPoint(parseInt(object.attr("x"))+parseInt(this.parent.svg.getElementById(object.attr('id')).getBBox().width)/2,parseInt(object.attr("y"))-parseInt(this.parent.svg.getElementById(object.attr('id')).getBBox().height)/2);
    }
    
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
    let tmp = this.objectsContainer.filter(o=>o.id==id)[0];
    if(tmp)
      tmp.changeInfo(tresc);
  }

  changeFontSize(id:string, tresc: string){   
    let tmp = this.objectsContainer.filter(o=>o.id==id)[0];
    if(tmp)
      tmp.changeFontSize(tresc);
  }

  changeBgColor(tresc: string){  
  
    let tmp = this.objectsContainer.filter(o=>o.id==this.parent.lastSelected.id)[0];
    if(tmp)
      tmp.changeBgColor(tresc);
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

  del(id:string){
    let tmp = this.objectsContainer.filter(o=>o.id==id)[0];
      
    if(tmp){
      let index = this.objectsContainer.indexOf(tmp)
      if(index>-1){
        tmp.del();
        this.objectsContainer.splice(index,1);      
      }
    }


  }

  get(id: string){
    return this.objectsContainer.filter(o=>o.id==id)[0];
  }

  getelementInPoint(x:number, y:number){
    let rez = null;
    this.objectsContainer.forEach(element => {        
          // switch (element.shape){
          //   case 'circle':
          //     if(Snap.len(x,y,parseInt(tmpobject.attr('cx')), parseInt(tmpobject.attr('cy')))<=parseInt(tmpobject.attr('r')))
          //       rez = tmpobject;                     
          //       break;
          //   case 'rect':
          //     if((parseInt(tmpobject.attr('x'))<x && parseInt(tmpobject.attr('x'))+parseInt(tmpobject.attr('width'))>x)
          //         &&
          //         ((parseInt(tmpobject.attr('y'))<y && parseInt(tmpobject.attr('y'))+parseInt(tmpobject.attr('height'))>y))
          //     )      
          //       rez = tmpobject;
          //       break;
          //   case 'text':
          //       let tmp = this.parent.svg.getElementById(element).getBBox();
          //       if((tmp.x<x && tmp.x+tmp.width>x)
          //       &&
          //       ((tmp.y<y && tmp.y+tmp.height>y))
          //       )      

          //       rez = tmpobject;
          //       break;
          // }

          if(element.isContainingPoint(x,y))
            rez = this.parent.svg.getElementById(element.id);
    });    
    return rez;
  }


  move(x:number, y:number, id:string){
    let tmp = this.objectsContainer.filter(o=>o.id==id)[0];
    if(tmp)
      tmp.move(x,y);
  }

  resize(id:string, x:number, y:number){
    let tmp = this.objectsContainer.filter(o=>o.id==id)[0];
    if(tmp){
      tmp.resize(x,y);
    }
  }

  setToEdit(id:string){

    let tmp = this.objectsContainer.filter(o=>o.id==id)[0];
    if(tmp)
      tmp.setToEdit();
  }

  updateLayout(id:string){
    let tmp = this.objectsContainer.filter(o=>o.id==id)[0];
    if(tmp){
      tmp.updateLayout();

      this.objectsContainer.splice(0,0,this.objectsContainer.splice(this.objectsContainer.indexOf(tmp),1)[0]);   
    }
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

}

export class GObjectBaseClass{

  uid : number=0;
  id:string="";
  shape:string="";
  info:string="przykładowa treść"; 
  fontsize:number=15;  
  bgcolor:string='#ffffff';

  parent: AnalizaGraficznaComponent=null;

  constructor();
  constructor()
  {    
  }

  del(){}

  checkIsOnBorder(event: any){  }

  changeFontSize(size: string){
    this.fontsize = parseInt(size);
    $('#id_info_'+this.uid).css({"font-size": size+'px'});
  }

  createFromXml(object: any, parent: any){}

  changeBgColor(color: string){
    this.bgcolor = color;
    $('#'+this.id).attr({"fill": this.bgcolor});
  }

  getXML(){
  }



  isContainingPoint(x:number, y:number){}

  move(x:number, y:number){  }    

  resize(x:number, y:number){  } 

  setToEdit(){
    this.parent.selectedText = this.info;
    this.parent.myDropDown.setContent('<div style="text-shadow: none; position: relative; padding-bottom: 2px; margin-top: 2px; background:' + this.bgcolor+ '">' + this.bgcolor + '</div>');
    this.parent.selectedFontSize = this.fontsize;
  }

  updateLayout(){
    this.parent.s.append(document.getElementById(this.id));
    this.parent.s.append(document.getElementById("id_info_"+this.uid));
  }

  changeInfo(tresc: string){
    this.info = tresc;
    $('#id_info_'+this.uid).text(tresc);
  }

}

export class GRectClass extends GObjectBaseClass{

  x:number=0;
  y:number=0;
  w:number=150;
  h:number=50;

  
  
  svgobject:any;

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

  createObject(){
  
    
    let tmpobject = this.parent.s.rect(this.x, this.y, this.w, this.h);
    tmpobject.attr({'id':this.id,'rx':"5", 'ry':"5", "fill":this.bgcolor, 'stroke': 'skyblue', 'stroke-width':1});
    this.svgobject = tmpobject;

    tmpobject = this.parent.s.text(this.x+5,this.y+15,this.info);
    tmpobject.attr({"id":"id_info_"+this.uid, "font-size":this.fontsize});
    $('#'+"id_info_"+this.uid).toggleClass('text');

    //#region old
      // shape = this.s.rect(this.startX,this.startY, 40,30);
      // shape.attr({'rx':"5", 'ry':"5"});
      // let rect_id  = Date.now();
      // tmp_id = "id_rect_"+rect_id;
      // let tmp = this.s.text(this.startX+5,this.startY+15,'przykłdowa treść');
      // tmp.attr({"id":"id_info_"+rect_id});
      // this.s.append(tmp);
      // console.log("id_info_"+rect_id);
      // $('#'+"id_info_"+rect_id).toggleClass('text');

    //endregion
  }

  // addMouseListeners(object:any){  
  //   //object.dblclick((e: any)=>{this.parent.g_mousedblclick(e)});
  //   object.mousedown((e: any)=>{this.parent.g_mousedown(e)});
  //   //object.mouseup((e:any)=>{this.g_mouseup(e)});    
  // }

  
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
            bgcolor:this.bgcolor
            };
  }

  isContainingPoint(x:number, y:number){
    if((this.x<x && this.x+this.w>x) && (this.y<y && this.y+this.h>y))
      return true;

    return false;
  }

  move(x:number, y:number){

    this.x +=x;
    this.y +=y;
    $("#"+this.id).attr({x:this.x, y: this.y});
    $("#id_info_"+this.uid).attr({x:this.x+5, y: this.y+15});
    

    //#region old
      // let tmprx =  parseInt($("#"+this.selected.id).attr("x"));
      // let tmpry =   parseInt($("#"+this.selected.id).attr("y"));
      // $("#"+this.selected.id).attr({x:tmprx+tx, y: tmpry+ty});
      // $("#id_info_"+this.selected.id.split("_")[2]).attr({x:tmprx+tx+5, y: tmpry+ty+15})
    //endregion
  }

  resize(x:number, y:number){    
    if(((this.w+x)>5 && (this.w+x<$("#svgCanvas").width())) && (((this.h+y)>5 && (this.h+y)<$("#svgCanvas").height()))){
      this.w+=x;
      this.h+=y;
      $("#"+this.id).attr({width:this.w, height:this.h});

    }
  }

}

export class GCircleClass extends GObjectBaseClass{
  x:number = 0;
  y:number = 0;
  r:number = 25;

  svgobject:any;

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

    tmpobject = this.parent.s.text(this.x-(this.r-10),this.y-(this.r-10),this.info);
    tmpobject.attr({"id":"id_info_"+this.uid, "font-size":this.fontsize});
    $('#'+"id_info_"+this.uid).toggleClass('text');

    //#region old
      //shape = this.s.circle(this.startX, this.startY, this.getLength(this.startX, this.startY, event.offsetX, event.offsetY));
      // shape = this.s.circle(this.startX, this.startY,30);
      // tmp_id = "id_circle_"+Date.now();
      // // shape.attr({"id":"id_"+Date.now(),"fill":'white', 'stroke': 'skyblue', 'stroke-width':2});
      // break;
    //endregion

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
   
    this.createObject();
    this.parent.svgObjects.push(this.id);   

  }
  
  del(){
    $('#'+this.id).remove();
    $('#id_info_'+this.uid).remove();
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
            bgcolor:this.bgcolor
            };
  }

  isContainingPoint(x:number, y:number){
    if(Snap.len(x,y,this.x, this.y)<=this.r)
      return true;

    return false;
  }
    
  move(x:number, y:number){
    this.x+=x;
    this.y+=y;
    $("#"+this.id).attr({cx:this.x, cy: this.y});
    $("#id_info_"+this.uid).attr({x:this.x-(this.r-10), y: this.y-(this.r-10)});

    //#region old
      // let tmpcx =  parseInt($("#"+this.selected.id).attr("cx"));
      // let tmpcy =   parseInt($("#"+this.selected.id).attr("cy"));

      // $("#"+this.selected.id).attr({cx:tmpcx+tx, cy: tmpcy+ty});

    //endregion
  }

  resize(x:number, y:number){
    let tmpr =  this.r;
    if((tmpr+x)>5 && (tmpr+x)<$("#svgCanvas").width()){
      this.r = tmpr+x;
      $("#"+this.id).attr({r:this.r});
    }
  }
}

export class GTextClass extends GObjectBaseClass{
  x:number = 0;
  y:number = 0;
  bgcolor: string='#000000';
  
  svgobject:any;

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
    

      this.createObject();
      this.parent.svgObjects.push(this.id);    
    }
  }

  createObject(){
  
    let tmpobject = this.parent.s.text(this.x, this.y, this.info);
    tmpobject.attr({'id':this.id,"fill": this.bgcolor, "font-size":this.fontsize+"px"});
    this.svgobject = tmpobject;

    $('#'+this.id).toggleClass('text');

    //#region 
      // shape = this.s.text(this.startX,this.startY, 'przykładowa treść');                
      // tmp_id = "id_text_"+Date.now();
      // shape.attr({"id":tmp_id, 'font-size':'30px'});
      // $('#'+tmp_id).toggleClass('text');
    
    //endregion
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
    this.bgcolor = object.bgcolor[0];
   
    this.createObject();
    this.parent.svgObjects.push(this.id);   

  }

  changeInfo(tresc: string){
    this.info = tresc;
    $('#'+this.id).text(tresc);
  }

  changeFontSize(size: string){
    this.fontsize = parseInt(size);
    $('#'+this.id).css({'font-size':size+'px'});
  }

  
  del(){
    $('#'+this.id).remove();
  }

  getXML(){
    return {id: this.id,
            uid:this.uid,
            shape:this.shape,
            info:this.info,
            x:this.x,
            y:this.y,     
            fontsize:this.fontsize,
            bgcolor:this.bgcolor
            };
  }

  move(x:number, y:number){
    this.x+=x;
    this.y+=y;

    $("#"+this.id).attr({x:this.x, y: this.y});

    //#region 
      // let tmptx =  parseInt($("#"+this.selected.id).attr("x"));
      // let tmpty =   parseInt($("#"+this.selected.id).attr("y"));
      // $("#"+this.selected.id).attr({x:tmptx+tx, y: tmpty+ty});
    //endregion
  }

  isContainingPoint(x:number, y:number){      
    let tmp = this.parent.svg.getElementById(this.id).getBBox();

    if((this.x<x && this.x+tmp.width>x) && ((this.y-this.y+tmp.height/2<y && this.y+tmp.height>y)))
      return true;

    return false;
  }

}
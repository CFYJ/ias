/*
jQWidgets v4.5.2 (2017-May)
Copyright (c) 2011-2017 jQWidgets.
License: http://jqwidgets.com/license/
*/
!function(a){a.jqx.jqxWidget("jqxDockPanel","",{}),a.extend(a.jqx._jqxDockPanel.prototype,{defineInstance:function(){var b={width:null,height:null,lastchildfill:!0,disabled:!1,events:["layout"]};return this===a.jqx._jqxDockPanel.prototype?b:(a.extend(!0,this,b),b)},createInstance:function(b){var c=this;this.host.addClass(this.toThemeProperty("jqx-dockpanel")),this.host.addClass(this.toThemeProperty("jqx-rc-all")),this.childrenCount=a(this.host).children().length,this.host.wrapInner('<div style="overflow: hidden; width: 100%; height: 100%;" class="innerContainer"></div>'),this.$wrapper=this.host.find(".innerContainer"),this.$wrapper.css("position","relative"),this.sizeCache=new Array,this.performLayout(),a.jqx.utilities.resize(this.host,function(){c.refresh()})},render:function(){null!=this.width&&this.width.toString().indexOf("px")!=-1?this.host.width(this.width):void 0==this.width||isNaN(this.width)||this.host.width(this.width),null!=this.height&&this.height.toString().indexOf("px")!=-1?this.host.height(this.height):void 0==this.height||isNaN(this.height)||this.host.height(this.height),this.sizeCache=new Array,this.performLayout()},resize:function(a,b){this.width=a,this.height=b,this.render()},performLayout:function(){if(!this.disabled){var b=this.childrenCount,c=0,d=0,e=0,f=0,g=this,h={width:this.host.width(),height:this.host.height()};this.sizeCache.length<this.$wrapper.children().length&&a.each(this.$wrapper.children(),function(b){var c=a(this);c.css("position","absolute");var d={width:c.css("width"),height:c.css("height")};g.sizeCache[b]=d}),a.each(this.$wrapper.children(),function(i){var j=this.getAttribute("dock");void 0==j&&(j="left"),i==b-1&&g.lastchildfill&&(j="fill");var k=a(this);k.css("position","absolute"),k.css("width",g.sizeCache[i].width),k.css("height",g.sizeCache[i].height);var l={width:k.outerWidth(),height:k.outerHeight()},m={x:e,y:f,width:Math.max(0,h.width-(e+c)),height:Math.max(0,h.height-(f+d))};if(i<b)switch(j){case"left":e+=l.width,m.width=l.width;break;case"top":f+=l.height,m.height=l.height;break;case"right":c+=l.width,m.x=Math.max(0,h.width-c),m.width=l.width;break;case"bottom":d+=l.height,m.y=Math.max(0,h.height-d),m.height=l.height}k.css("left",m.x),k.css("top",m.y),k.css("width",m.width),k.css("height",m.height)}),this._raiseevent(0)}},destroy:function(){a.jqx.utilities.resize(this.host,null,!0),this.host.remove()},_raiseevent:function(b,c,d){if(void 0!=this.isInitialized&&1==this.isInitialized){var e=this.events[b],f=new a.Event(e);f.previousValue=c,f.currentValue=d,f.owner=this;var g=this.host.trigger(f);return g}},propertyChangedHandler:function(a,b,c,d){this.isInitialized&&a.render()},refresh:function(){this.render()}})}(jqxBaseFramework);


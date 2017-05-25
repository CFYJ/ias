/*
jQWidgets v4.5.2 (2017-May)
Copyright (c) 2011-2017 jQWidgets.
License: http://jqwidgets.com/license/
*/
!function(a){"use strict";a.jqx.jqxWidget("jqxToolBar","",{}),a.extend(a.jqx._jqxToolBar.prototype,{defineInstance:function(){var b={width:"100%",minWidth:null,maxWidth:null,height:35,tools:"",initTools:null,minimizeWidth:200,disabled:!1,rtl:!1,events:["open","close"]};return this===a.jqx._jqxToolBar.prototype?b:(a.extend(!0,this,b),b)},createInstance:function(){var a=this;"none"!==a.host.css("display")&&document.body.contains(a.element)!==!1||(a._initiallyHidden=!0),a._toolToWidgetMapping={button:"jqxButton",toggleButton:"jqxToggleButton",dropdownlist:"jqxDropDownList",combobox:"jqxComboBox",input:"jqxInput"},a._toolChanges=[],a.render()},render:function(){var b=this,c=!0;b.element.innerHTML="",b.element.className.length>0&&b._removeClass(b.element,b.toThemeProperty("jqx-widget jqx-fill-state-normal jqx-rc-all jqx-toolbar jqx-fill-state-disabled")),b._setSize(),b._destroyTools(!1),b._toolWidgets&&(c=!1,a(b._minimizeButton).remove(),a(b._minimizePopup).remove()),b._appendMinimizeButton(),b._addClasses(),b._initiallyHidden||b._createTools(),b.disabled===!0&&(b.element.className+=" "+b.toThemeProperty("jqx-fill-state-disabled"),b._disableTools(!0)),b._initiallyHidden||b._minimize(),b._removeHandlers(),b._addHandlers(),c===!1&&b._toolChanges.length>0&&b._restoreChanges()},refresh:function(a){a!==!0&&this.render()},getTools:function(){return this._toolWidgets},destroy:function(){var a=this;a._removeHandlers(),a._destroyTools(),a.host.remove()},_destroyTools:function(a){var b=this;if(a!==!1&&(a=!0),b._toolWidgets)for(var c=b._toolWidgets.length-1;c>=0;c--)b._destroyTool(c,a,!0)},_destroyTool:function(b,c,d){var e=this;b=parseInt(b,10);var f=e._toolWidgets[b];if(f){var g=f.type,h=f.tool,i=f.menuTool;"custom"!==g?(h[e._toolToWidgetMapping[g]]("destroy"),i&&i[e._toolToWidgetMapping[g]]("destroy")):(h.remove(),i&&i.remove()),f.menuSeparator&&a(f.menuSeparator).remove(),e._toolWidgets.splice(b,1),e._checkType(g)&&e._refreshButtonGroups(),d!==!0&&e._minimize(),c!==!1&&e._toolChanges.push({action:"destroyTool",index:b})}},destroyTool:function(a){this._destroyTool(a,!0)},addTool:function(a,b,c,d){var e,f,g,h,i=this;e="first"===b?0:i._toolWidgets.length,i._toolWidgets[e-1]&&(f=i._toolWidgets[e-1].tool,g=i._toolWidgets[e-1].separatorAfterWidget?"|":i._toolWidgets[e-1].type),c===!0?h="|":i._toolWidgets[e+1]&&(h=i._toolWidgets[e+1].type);var j=i._initializeTool(e,a,f,g,h,d,!1);"first"===b?i._toolWidgets.splice(0,0,j):i._toolWidgets.push(j),i._removeHandlers(),i._addHandlers(),i._checkType(a)&&i._refreshButtonGroups(),"first"!==b&&i._minimizedTools>0?i._minimizeTool(!0):i._minimize(),i._toolChanges.push({action:"addTool",type:a,position:b,separator:c,initCallback:d})},_disableTools:function(a){for(var b=this,c=0;c<b._toolWidgets.length;c++)b.disableTool(c,a)},disableTool:function(a,b){var c=this;a=parseInt(a,10);var d=c._toolWidgets[a];if(d){var e=d.type;"custom"!==e&&(d.tool[c._toolToWidgetMapping[e]]({disabled:b}),d.menuTool[c._toolToWidgetMapping[e]]({disabled:b})),c._toolChanges.push({action:"disableTool",index:a,disable:b})}},propertyChangedHandler:function(b,c,d,e){if("initTools"!==c&&e!==d)switch(c){case"theme":""!==d&&(b._removeClass(b.element,b.toThemeProperty("jqx-widget-"+d+" jqx-fill-state-normal-"+d+" jqx-rc-all-"+d+" jqx-toolbar-"+d)),b._removeClass(b._minimizePopup,"jqx-popup-"+d+" jqx-fill-state-normal-"+d+" jqx-rc-b-"+d+" jqx-toolbar-minimized-popup-"+d)),b._addClasses(),b._minimizePopup.className+=" "+b.toThemeProperty("jqx-popup jqx-fill-state-normal jqx-rc-b jqx-toolbar-minimized-popup");for(var f=0;f<b._toolWidgets.length;f++){var g=b._toolWidgets[f];"custom"!==g.type&&(g.menuTool&&(g.menuSeparator&&(""!==d&&b._removeClass(g.menuSeparator,"jqx-fill-state-pressed-"+d+" jqx-toolbar-minimized-popup-separator-"+d),g.menuSeparator.className+=" jqx-fill-state-pressed-"+e+" jqx-toolbar-minimized-popup-separator-"+e),g.menuTool[b._toolToWidgetMapping[b._toolWidgets[f].type]]({theme:e})),g.tool[b._toolToWidgetMapping[b._toolWidgets[f].type]]({theme:e}))}a.jqx.utilities.setTheme(d,e,b.host);break;case"width":b.element.style.width=b._toPx(e),b._minimize();break;case"minWidth":b.element.style.minWidth=b._toPx(e),b._minimize();break;case"maxWidth":b.element.style.maxWidth=b._toPx(e),b._minimize();break;case"height":var h,i=!1;if(b.element.style.height=b._toPx(e),"string"==typeof e&&e.indexOf("%")!==-1){if("string"==typeof d&&d.indexOf("%")!==-1)return void b.host.trigger("resize");i=!0}else h=parseInt(e,10),h-=b._getComputedStyle(b.element,"paddingTop")+b._getComputedStyle(b.element,"paddingBottom")+b._getComputedStyle(b.element,"borderTopWidth")+b._getComputedStyle(b.element,"borderBottomWidth");for(var j=0;j<b._toolWidgets.length;j++){var k=b._toolWidgets[j],l=k.type;"button"===l||"toggleButton"===l||"repeatButton"===l||"linkButton"===l?(k.tool[0].style.height=i?"100%":b._toPx(h),k.menuTool&&(k.menuTool[0].style.height=i?"100%":b._toPx(h))):"dropdownlist"!==l&&"combobox"!==l&&"input"!==l||(k.tool[b._toolToWidgetMapping[l]]({height:i?"100%":h-2}),k.menuTool&&k.menuTool[b._toolToWidgetMapping[l]]({height:i?"100%":h-2}))}break;case"tools":b._removeHandlers(),b._destroyTools(),b._createTools(),b._addHandlers(),b._minimize();break;case"minimizeWidth":if(b._isOpen===!0){var m=b._getComputedStyle(b._minimizePopup,"left")-(e-d);b._minimizePopup.style.width=b._toPx(e),b._minimizePopup.style.left=b._toPx(m)}else b._minimizePopup.style.width=b._toPx(e);break;case"rtl":b.render();break;case"disabled":e===!0?(b.element.className+=" "+b.toThemeProperty("jqx-fill-state-disabled"),b._disableTools(!0)):(b._removeClass(b.element,b.toThemeProperty("jqx-fill-state-disabled")),b._disableTools(!1))}},_raiseEvent:function(b,c){void 0===c&&(c={owner:null});var d=this.events[b];c.owner=this;var e=new a.Event(d);e.owner=this,e.args=c,e.preventDefault&&e.preventDefault();var f=this.host.trigger(e);return f},_addClasses:function(){var a=this,b="jqx-widget jqx-fill-state-normal jqx-rc-all jqx-toolbar";a.rtl===!0&&(b+=" jqx-toolbar-rtl"),a.element.className+=" "+a.toThemeProperty(b)},_checkType:function(a){return"button"===a||"toggleButton"===a||"repeatButton"===a||"linkButton"===a},_refreshButtonGroups:function(){function b(b,d,e,f,g,h){var i=b.tool[0],j=b.menuTool[0],k={add:"",remove:""};k[d]+=" jqx-toolbar-tool-inner-button",k[e]+=" jqx-rc-all",k[f]+=" jqx-rc-l",k[g]+=" jqx-rc-r",""!==k.add&&(i.className+=" "+c.toThemeProperty(a.trim(k.add)),j&&(j.className+=" "+c.toThemeProperty(a.trim(k.add)))),""!==k.remove&&(c._removeClass(i,c.toThemeProperty(a.trim(k.remove))),j&&c._removeClass(j,c.toThemeProperty(a.trim(k.remove)))),i.style.borderLeftWidth=h+"px",j&&(j.style.borderLeftWidth=h+"px")}for(var c=this,d=0;d<c._toolWidgets.length;d++){var e=c._toolWidgets[d];if(c._checkType(e.type)){var f,g,h=e.tool,i=e.menuTool;d>0&&(f=c._toolWidgets[d-1].separatorAfterWidget?"|":c._toolWidgets[d-1]),e.separatorAfterWidget?g="|":d<c._toolWidgets.length-1&&(g=c._toolWidgets[d+1]);var j=f&&c._checkType(f.type),k=e.separatorAfterWidget===!1&&g&&c._checkType(g.type);j||k?!j&&k?b(e,"remove","remove","add","remove",1):j&&k?b(e,"add","remove","remove","remove",0):j&&!k&&b(e,"remove","remove","remove","add",0):b(e,"remove","add","remove","remove",1);var l=c.rtl?"rtl":"ltr";k?(c._removeClass(h[0],c.toThemeProperty("jqx-toolbar-tool-separator-"+l)),c._removeClass(h[0],c.toThemeProperty("jqx-toolbar-tool-no-separator-"+l)),i&&(c._removeClass(i[0],c.toThemeProperty("jqx-toolbar-tool-separator-"+l)),c._removeClass(i[0],c.toThemeProperty("jqx-toolbar-tool-no-separator-"+l)))):e.separatorAfterWidget?(c._removeClass(h[0],c.toThemeProperty("jqx-toolbar-tool-no-separator-"+l)),h[0].className+=" "+c.toThemeProperty("jqx-toolbar-tool-separator-"+l),i&&(c._removeClass(i[0],c.toThemeProperty("jqx-toolbar-tool-no-separator-"+l)),i[0].className+=" "+c.toThemeProperty("jqx-toolbar-tool-separator-"+l))):(c._removeClass(h[0],c.toThemeProperty("jqx-toolbar-tool-separator-"+l)),h[0].className+=" "+c.toThemeProperty("jqx-toolbar-tool-no-separator-"+l),i&&(c._removeClass(i[0],c.toThemeProperty("jqx-toolbar-tool-separator-"+l)),i[0].className+=" "+c.toThemeProperty("jqx-toolbar-tool-no-separator-"+l)))}}},_addHandlers:function(){var b=this,c=b.element.id;a.jqx.utilities.resize(b.host,function(){return b._initiallyHidden?(b._createTools(),b._minimize(),void(b._initiallyHidden=!1)):(b._isOpen===!0&&(b._minimizePopup.style.display="none",b._isOpen=!1,b._raiseEvent("1")),void b._minimize())}),b.addHandler(document,"click.jqxToolbar"+c,function(){b._isOpen===!0&&b._openMinimizePopup()}),b.addHandler(b._minimizeButton,"click.jqxToolbar"+c,function(a){a.stopPropagation(),b._openMinimizePopup()}),b.addHandler(a(".jqx-popup"),"click.jqxToolbar"+c,function(a){a.target.className.indexOf("jqx-window-content")===-1&&a.stopPropagation()})},_removeHandlers:function(){var b=this,c=b.element.id;b.removeHandler(document,"click.jqxToolbar"+c),b.removeHandler(b._minimizeButton,"click.jqxToolbar"+c),b.removeHandler(a(".jqx-popup"),"click.jqxToolbar"+c)},_setSize:function(){var a=this,b=a.element.style;b.width=a._toPx(a.width),b.height=a._toPx(a.height),a.minWidth&&(b.minWidth=a._toPx(a.minWidth)),a.maxWidth&&(b.maxWidth=a._toPx(a.maxWidth))},_createTools:function(){var b=this,c=b.tools.split(" "),d=a.trim(b.tools.replace(/\|/g,""));d=d.replace(/\s+/g," "),d=d.split(" "),b._toolWidgets=[];for(var e=0,f=0;f<d.length;f++){d[f]!==c[f+e]&&e++;var g,h=f+e;b._toolWidgets[f-1]&&(g=b._toolWidgets[f-1].tool);var i=c[h],j=c[h-1],k=c[h+1],l=b.initTools;if(""===i)return!0;var m=b._initializeTool(f,i,g,j,k,l,!0);b._toolWidgets.push(m)}b._minimizePopup.style.display="none",b._minimizePopup.style.visibility="visible"},_initializeTool:function(a,b,c,d,e,f,g){var h,i,j=this,k=j._initializeWidget(b,h,i,c);h=k.tool,i=k.menuTool;var l,m=h[0],n="jqx-toolbar-tool",o=i[0],p=!0;if(j.rtl===!0&&(n+=" jqx-toolbar-tool-rtl"),j.initTools){var q;q=g===!0?j.initTools(b,a,h,!1):f(b,h,!1),!q||q.minimizable!==!1&&q.menuTool!==!1?(g===!0?j.initTools(b,a,i,!0):f(b,i,!0),i&&(l="jqx-toolbar-tool-minimized")):("custom"!==b?i[j._toolToWidgetMapping[b]]("destroy"):i.remove(),q.minimizable===!1&&(p=!1),i=!1)}var r=!1;i&&(o.style.display="none");var s,t=j.rtl?"rtl":"ltr",u=["button","toggleButton","repeatButton","linkButton"],v={button:"jqxButton",toggleButton:"jqxToggleButton",repeatButton:"jqxRepeatButton",linkButton:"jqxRepeatButton"};"|"===e?(r=!0,n+=" jqx-toolbar-tool-separator-"+t,i&&(l+=" jqx-toolbar-tool-separator-"+t),i&&(s=document.createElement("div"),s.className=j.toThemeProperty("jqx-fill-state-pressed jqx-toolbar-minimized-popup-separator"),j._minimizePopup.appendChild(s))):(u.indexOf(b)===-1||u.indexOf(b)!==-1&&u.indexOf(e)===-1)&&(n+=" jqx-toolbar-tool-no-separator-"+t,i&&(l+=" jqx-toolbar-tool-no-separator-"+t)),u.indexOf(d)===-1&&u.indexOf(b)!==-1&&u.indexOf(e)!==-1?j.rtl===!1?(h[v[b]]({roundedCorners:"left"}),i&&i[v[b]]({roundedCorners:"left"})):(h[v[b]]({roundedCorners:"left"}),m.style.borderLeftWidth="0px",i&&(i[v[b]]({roundedCorners:"left"}),o.style.borderLeftWidth="0px")):u.indexOf(d)!==-1&&u.indexOf(b)!==-1&&u.indexOf(e)!==-1?(n+=" jqx-toolbar-tool-inner-button",m.style.borderLeftWidth="0px",i&&(l+=" jqx-toolbar-tool-inner-button",o.style.borderLeftWidth="0px")):u.indexOf(d)!==-1&&u.indexOf(b)!==-1&&u.indexOf(e)===-1&&(j.rtl===!1?(h[v[b]]({roundedCorners:"right"}),m.style.borderLeftWidth="0px",i&&(i[v[b]]({roundedCorners:"right"}),o.style.borderLeftWidth="0px")):(h[v[b]]({roundedCorners:"left"}),i&&i[v[b]]({roundedCorners:"left"}))),m.className+=" "+j.toThemeProperty(n),i&&(o.className+=" "+j.toThemeProperty(l));var w={type:b,tool:h,separatorAfterWidget:r,minimizable:p,minimized:!1,menuTool:i,menuSeparator:s};return w},_initializeWidget:function(b,c,d,e){function f(){var b=i.host.children(),f=a(i._minimizePopup).children();e||1===b.length&&0===f.length?(i.element.appendChild(c),i._minimizePopup.appendChild(d)):(i.element.insertBefore(c,b[1]),i._minimizePopup.insertBefore(d,f[0]))}var g,h,i=this,j=i._toolToWidgetMapping[b],k=!1;if("string"==typeof i.height&&i.height.indexOf("%")!==-1)k=!0;else{var l=window.getComputedStyle?window.getComputedStyle(i.element):i.element.currentStyle;h=i.element.offsetHeight-(parseInt(l.paddingTop,10)+parseInt(l.paddingBottom,10)+parseInt(l.borderTopWidth,10)+parseInt(l.borderBottomWidth,10))}if("custom"!==b&&void 0===i.host[j]){var m=i._toolToWidgetMapping[b].toLowerCase();throw new Error("jqxToolBar: Missing reference to "+m+".js")}switch(b){case"button":case"toggleButton":c=document.createElement("button"),d=document.createElement("button"),g={theme:i.theme,height:k?"100%":h,disabled:i.disabled,rtl:i.rtl};break;case"dropdownlist":case"combobox":c=document.createElement("div"),d=document.createElement("div"),g={theme:i.theme,autoDropDownHeight:!0,height:k?"100%":h-2,disabled:i.disabled,rtl:i.rtl};break;case"input":c=document.createElement("input"),c.setAttribute("type","text"),d=document.createElement("input"),d.setAttribute("type","text"),g={theme:i.theme,height:k?"100%":h-2,disabled:i.disabled,rtl:i.rtl};break;case"custom":c=document.createElement("div"),d=document.createElement("div")}return f(),c=a(c),d=a(d),"custom"!==b&&(c[j](g),d[j](g)),{tool:c,menuTool:d}},_appendMinimizeButton:function(){var a=this;a._minimizedTools=0;var b=document.createElement("div"),c="jqx-menu-minimized-button jqx-toolbar-minimized-button",d=document.createElement("div"),e="jqx-popup jqx-fill-state-normal jqx-rc-b jqx-toolbar-minimized-popup";d.setAttribute("id",a.element.id+"Popup"),a.rtl===!0&&(c+=" jqx-toolbar-minimized-button-rtl",e+=" jqx-toolbar-minimized-popup-rtl"),b.className=a.toThemeProperty(c),d.className=a.toThemeProperty(e),a.element.appendChild(b),document.body.appendChild(d),a._isOpen=!1,d.style.width=a._toPx(a.minimizeWidth),a._minimizeButton=b,a._minimizePopup=d},_openMinimizePopup:function(){var b=this;if(b._isOpen===!1){var c=b.host.offset(),d=c.left;b.rtl===!1&&(d+=b.element.offsetWidth-parseInt(b.minimizeWidth,10)-(b._getComputedStyle(b._minimizePopup,"paddingLeft")+b._getComputedStyle(b._minimizePopup,"paddingRight")+b._getComputedStyle(b._minimizePopup,"borderLeftWidth")+b._getComputedStyle(b._minimizePopup,"borderRightWidth")));var e=c.top+b.element.offsetHeight-1;b._minimizePopup.style.left=d+"px",b._minimizePopup.style.top=e+"px",a(b._minimizePopup).slideDown("fast",function(){b._isOpen=!0,b._raiseEvent("0")})}else a(b._minimizePopup).slideUp("fast"),b._isOpen=!1,b._raiseEvent("1")},_minimize:function(){function b(b){var d,e=b.cloneNode(!0);return e.style.visibility="hidden",e.style.display="block",e.style.position="absolute",document.body.appendChild(e),d=e.offsetWidth+c._getComputedStyle(e,"marginLeft")+c._getComputedStyle(e,"marginRight"),a(e).remove(),d}var c=this,d=0;c._minimizedTools>0&&(d=c._minimizeButton.offsetWidth+c._getComputedStyle(c._minimizeButton,"marginLeft"));var e=c.element.offsetWidth-c._getComputedStyle(c.element,"paddingLeft")-c._getComputedStyle(c.element,"paddingRight")-d-10;if(!(e<0)){for(var f,g=0,h=0;h<c._toolWidgets.length;h++){var i=c._toolWidgets[h].tool;if(c._toolWidgets[h].minimized===!1){var j=i[0].offsetWidth+c._getComputedStyle(i[0],"marginLeft")+c._getComputedStyle(i[0],"marginRight");g+=j}else void 0===f&&(f=b(i[0]))}g>e?(c._minimizeTool(!0),c._minimize()):void 0!==f&&g+f<e&&(c._minimizeTool(!1),c._minimize())}},_minimizeTool:function(a){var b,c,d=this;if(a===!0){for(var e=d._toolWidgets.length-1;e>=0;e--)if(b=d._toolWidgets[e],b.minimizable!==!1&&b.minimized===!1){c=d._getToolValue(b.tool,b.type),b.tool[0].style.display="none",b.menuTool&&(b.menuTool[0].style.display="block",d._setToolValue(c,b.menuTool,b.type)),b.menuSeparator&&(b.menuSeparator.style.display="block"),d._toolWidgets[e].minimized=!0,d._minimizedTools++,1===d._minimizedTools&&(d._minimizeButton.style.display="block");break}}else for(var f=0;f<d._toolWidgets.length;f++)if(b=d._toolWidgets[f],b.minimized===!0){b.menuTool&&(c=d._getToolValue(b.menuTool,b.type),b.menuTool[0].style.display="none"),b.menuSeparator&&(b.menuSeparator.style.display="none"),b.tool.show(),b.menuTool&&d._setToolValue(c,b.tool,b.type),d._toolWidgets[f].minimized=!1,d._minimizedTools--,0===d._minimizedTools&&(d._minimizeButton.style.display="none");break}},_getToolValue:function(a,b){var c;switch(b){case"button":case"custom":c=void 0;break;case"toggleButton":var d=a[0].className.indexOf("jqx-fill-state-pressed")!==-1;c={text:a[0].innerHTML,toggled:d};break;case"dropdownlist":case"combobox":var e=this._toolToWidgetMapping[b];c=a[e]("checkboxes")?a[e]("val"):a[e]("getSelectedIndex");break;case"input":c=a.val()}return c},_setToolValue:function(a,b,c){if(void 0!==a)switch(c){case"button":case"custom":break;case"toggleButton":b[0].innerHTML=a.text;var d=b[0].className.indexOf("jqx-fill-state-pressed")!==-1;d!==a.toggled&&b.jqxToggleButton("toggle");break;case"dropdownlist":case"combobox":var e=this._toolToWidgetMapping[c];if(b[e]("checkboxes")){if(b[e]("uncheckAll"),""===a)return;for(var f=a.split(","),g=0;g<f.length;g++)b[e]("checkItem",f[g])}else a=b[e]("selectIndex",a);break;case"input":b.val(a)}},_restoreChanges:function(){var b=this;a.each(b._toolChanges,function(a,c){"addTool"===c.action?b.addTool(c.type,c.position,c.separator,c.initCallback):"destroyTool"===c.action?b._destroyTool(c.index):"disableTool"===c.action&&b.disableTool(c.index,c.disable)})},_removeClass:function(b,c){a(b).removeClass(c)},_toPx:function(a){return"number"==typeof a?a+"px":a},_getComputedStyle:function(a,b){var c;return window.getComputedStyle?c=window.getComputedStyle(a):a.currentStyle&&(c=a.currentStyle),"string"==typeof c[b]&&c[b].indexOf("px")===-1?0:parseInt(c[b],10)}})}(jqxBaseFramework);

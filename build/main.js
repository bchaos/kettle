!function(){define(function(e,t,o){var n,i,r,l,a,s,c,u,f,p,m;return s=brackets.getModule("utils/ExtensionUtils"),c=brackets.getModule("utils/NodeDomain"),n=brackets.getModule("language/CodeInspection"),l=brackets.getModule("document/DocumentManager"),a=brackets.getModule("editor/EditorManager"),u=brackets.getModule("widgets/StatusBar"),i=brackets.getModule("widgets/DefaultDialogs"),r=brackets.getModule("widgets/Dialogs"),m=$("<div>K</div>"),m.css("color","#76ff03"),m.css("font-size","14px"),m.css("font-family","Comic Sans MS, Verdana"),p="Kettle Status Indicator",u.addIndicator("nelsonkam-kettle",m,!0,"","Kettle"),m.on("click",function(){return r.showModalDialog(i.DIALOG_ID_INFO,"Kettle",p)}),f=function(e,t){var n,i;return n=new c("CoffeeCompiler",s.getModulePath(o,"node/CoffeeCompiler.js")),i=function(e){return console.log("kettle - "+e),null!=e?(m.css("color","#d50000"),p="Couldn't compile. Your file contains errors.",u.updateIndicator("nelsonkam-kettle",!0,"",p)):void 0},n.exec("compile",t).done(function(){return m.css("color","#76ff03"),p="File compiled successfully.",u.updateIndicator("nelsonkam-kettle",!0,"",p)}).fail(i)},l.on("documentSaved",function(e,t){var o,n,i,r,l,s,c;for(r=!1,c=["coffeescript","coffeescriptimproved"],i=0,l=c.length;l>i;i++)if(s=c[i],t.language.getId()===s){r=!0;break}if(o=a.getCurrentFullEditor().document,o===t&&r)try{return f(t.getText(),t.file.fullPath)}catch(u){return n=u,console.log(n.stack)}})})}.call(this);
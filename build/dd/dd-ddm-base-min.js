YUI.add("dd-ddm-base",function(B){var A=function(){A.superclass.constructor.apply(this,arguments);};A.NAME="ddm";A.ATTRS={dragCursor:{value:"move"},clickPixelThresh:{value:3},clickTimeThresh:{value:1000},throttleTime:{value:-1},dragMode:{value:"point",setter:function(C){this._setDragMode(C);return C;}}};B.extend(A,B.Base,{_createPG:function(){},_active:null,_setDragMode:function(C){if(C===null){C=B.DD.DDM.get("dragMode");}switch(C){case 1:case"intersect":return 1;case 2:case"strict":return 2;case 0:case"point":return 0;}return 0;},CSS_PREFIX:B.ClassNameManager.getClassName("dd"),_activateTargets:function(){},_drags:[],activeDrag:false,_regDrag:function(C){if(this.getDrag(C.get("node"))){return false;}if(!this._active){this._setupListeners();}this._drags.push(C);return true;},_unregDrag:function(D){var C=[];B.each(this._drags,function(F,E){if(F!==D){C[C.length]=F;}});this._drags=C;},_setupListeners:function(){this._createPG();this._active=true;},_start:function(){this.fire("ddm:start");this._startDrag();},_startDrag:function(){},_endDrag:function(){},_dropMove:function(){},_end:function(){if(this.activeDrag){this._endDrag();this.fire("ddm:end");this.activeDrag.end.call(this.activeDrag);this.activeDrag=null;}},stopDrag:function(){if(this.activeDrag){this._end();}return this;},_move:function(C){if(this.activeDrag){this.activeDrag._move.call(this.activeDrag,C);this._dropMove();}},cssSizestoObject:function(D){var C=D.split(" ");switch(C.length){case 1:C[1]=C[2]=C[3]=C[0];break;case 2:C[2]=C[0];C[3]=C[1];break;case 3:C[3]=C[1];break;}return{top:parseInt(C[0],10),right:parseInt(C[1],10),bottom:parseInt(C[2],10),left:parseInt(C[3],10)};},getDrag:function(D){var C=false,E=B.one(D);if(E instanceof B.Node){B.each(this._drags,function(G,F){if(E.compareTo(G.get("node"))){C=G;}});}return C;},swapPosition:function(D,C){D=B.DD.DDM.getNode(D);C=B.DD.DDM.getNode(C);var F=D.getXY(),E=C.getXY();D.setXY(E);C.setXY(F);return D;},getNode:function(C){if(C&&C.get){if(B.Widget&&(C instanceof B.Widget)){C=C.get("boundingBox");}else{C=C.get("node");}}else{C=B.one(C);}return C;},swapNode:function(E,C){E=B.DD.DDM.getNode(E);C=B.DD.DDM.getNode(C);var F=C.get("parentNode"),D=C.get("nextSibling");if(D==E){F.insertBefore(E,C);}else{if(C==E.get("nextSibling")){F.insertBefore(C,E);}else{E.get("parentNode").replaceChild(C,E);F.insertBefore(E,D);}}return E;}});B.namespace("DD");B.DD.DDM=new A();},"@VERSION@",{requires:["node","base","yui-throttle","classnamemanager"],skinnable:false});
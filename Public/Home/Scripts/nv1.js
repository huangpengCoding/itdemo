// JavaScript Document
//导航固定
	var FixedBox=function(el){
		this.element=el;
		this.BoxY=getXY(this.element).y;
	}
	FixedBox.prototype={
		setCss:function(){
			var windowST=(document.compatMode && document.compatMode!="CSS1Compat")? document.body.scrollTop:document.documentElement.scrollTop||window.pageYOffset;
			if(windowST>this.BoxY){
				this.element.style.cssText="position:fixed; top: 0px; opacity:0.9; z-index:60; background:#F2F2F2; box-shadow: 0px 2px 5px 0px rgba(0,0,0,.15); padding:0; ";
			}else{
				this.element.style.cssText="";
			}
		}
	};
	//添加事件
	function addEvent(elm, evType, fn, useCapture) {
		if (elm.addEventListener) {
			elm.addEventListener(evType, fn, useCapture);
		return true;
		}else if (elm.attachEvent) {
			var r = elm.attachEvent('on' + evType, fn);
			return r;
		}
		else {
			elm['on' + evType] = fn;
		}
	}
	//获取元素的XY坐标；
	function getXY(el) {
        return document.documentElement.getBoundingClientRect && (function() {//取元素坐标，如元素或其上层元素设置position relative
            var pos = el.getBoundingClientRect();
            return { x: pos.left + document.documentElement.scrollLeft, y: pos.top + document.documentElement.scrollTop };
        })() || (function() {
            var _x = 0, _y = 0;
            do {
                _x += el.offsetLeft;
                _y += el.offsetTop;
            } while (el = el.offsetParent);
            return { x: _x, y: _y };
        })();
    }
	//实例化；
	var divA=new FixedBox(document.getElementById("deanheader"));
   	addEvent(window,"scroll",function(){
		divA.setCss();
	});
	
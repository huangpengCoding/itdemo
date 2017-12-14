var locationHost="www.vr186.com",
locationHostOne="www.vr186.com";

var JF = JFAST = (function() {
    var jFastObj = {};
    var logs = [];
    jFastObj.inc = function(d, c) {
        return true
    };
    //给jFastObj在某命名空间下添加方法
    jFastObj.register = function(e, c) {
        var g = e.split(".");
        var f = jFastObj;
        var d = null;
        while (d = g.shift()) {
            if (g.length) {
                if (f[d] === undefined) {
                    f[d] = {}
                }
                f = f[d]
            } else {
                if (f[d] === undefined) {
                    try {
                        f[d] = c(jFastObj)
                    } catch(h) {
                        b.push(h)
                    }
                }
            }
        }
    };
    jFastObj.regShort = function(c, d) {
        if (jFastObj[c] !== undefined) {
            throw "[" + c + "] : short : has been register"
        }
        jFastObj[c] = d
    };
    jFastObj.IE = /msie/i.test(navigator.userAgent);
    jFastObj.E = function(c) {
        if (typeof c === "string") {
            return document.getElementById(c)
        } else {
            return c
        }
    };
    jFastObj.C = function(c) {
        var d;
        c = c.toUpperCase();
        if (c == "TEXT") {
            d = document.createTextNode("")
        } else {
            if (c == "BUFFER") {
                d = document.createDocumentFragment()
            } else {
                d = document.createElement(c)
            }
        }
        return d
    };
    jFastObj.log = function(msg) {
        logs.push("[" + ((new Date()).getTime() % 100000) + "]: " + msg)
    };
    jFastObj.getErrorLogInforList = function(maxLenth) {
        return logs.splice(0, maxLenth || logs.length)
    };
    return jFastObj
})();


//根据ID取得DOM对象
function $E(b) {
    var a = typeof b == "string" ? document.getElementById(b) : b;
    if (a != null) {
        return a
    } else {}
    return null
}
//创建DOM对象
function $C(a) {
    return document.createElement(a)
}


//图片缓存
try{
    document.execCommand("BackgroundImageCache", false, true)
}catch(e) {};



JFAST.register("fui.text.getUiHtml",function(a){
	return function(p){
		return '<div onmouseover="JF.fui.text.mouseOver(this.firstChild.firstChild)" onmouseout="JF.fui.text.mouseOut(this.firstChild.firstChild)" class="divTextLeft"><div class="divTextRight"><input type="text" onblur="JF.fui.text.blur(this)" onfocus="JF.fui.text.focus(this)" autocomplete="off" class="inputtext"'+  (p["style"]?' style="'+p["style"]+'"':'') +(p["node-type"]?' node-type="'+p["node-type"]+'"':'')+' /></div></div>';
	}
});
JFAST.register("fui.pass.getUiHtml",function(a){
	return function(p){
		return '<div onmouseover="JF.fui.text.mouseOver(this.firstChild.firstChild)" onmouseout="JF.fui.text.mouseOut(this.firstChild.firstChild)" class="divTextLeft"><div class="divTextRight"><input type="password" onblur="JF.fui.text.blur(this)" onfocus="JF.fui.text.focus(this)" autocomplete="off" class="inputtext"'+  (p["style"]?' style="'+p["style"]+'"':'') +(p["node-type"]?' node-type="'+p["node-type"]+'"':'')+' /></div></div>';
	}
});





JFAST.register("dom.contains",function(a) {
    return function(b, c) {
        if (b === c) {
            return false
        } else {
            if (b.compareDocumentPosition) {
                return ((b.compareDocumentPosition(c) & 16) === 16)
            } else {
                if (b.contains && c.nodeType === 1) {
                    return b.contains(c)
                } else {
                    while (c = c.parentNode) {
                        if (b === c) {
                            return true
                        }
                    }
                }
            }
        }
        return false
    }
});
JFAST.register("dom.uniqueID",function(a) {
    return function(b) {
        return b && (b.uniqueID || (b.uniqueID = a.util.getUniqueKey()))
    }
});


JFAST.register("dom.scroll",function(a) {
    return function(el) {
       el = el || document;
       var b = el.documentElement,c = el.body;
       return {
           top: Math.max(window.pageYOffset || 0, b.scrollTop, c.scrollTop),
           left: Math.max(window.pageXOffset || 0, b.scrollLeft, c.scrollLeft)
       }
	}
});



JFAST.register("evt.custEvent",
function(c) {
    var a = "__custEventKey__",
    d = 1,
    e = {},
    b = function(h, g) {
        var f = (typeof h == "number") ? h: h[a];
        return (f && e[f]) && {
            obj: (typeof g == "string" ? e[f][g] : e[f]),
            key: f
        }
    };
    return {
        define: function(m, h) {
            if (m && h) {
                var g = (typeof m == "number") ? m: m[a] || (m[a] = d++),
                j = e[g] || (e[g] = {});
                h = [].concat(h);
                for (var f = 0; f < h.length; f++) {
                    j[h[f]] || (j[h[f]] = [])
                }
                return g
            }
        },
        undefine: function(j, h) {
            if (j) {
                var g = (typeof j == "number") ? j: j[a];
                if (g && e[g]) {
                    if (h) {
                        h = [].concat(h);
                        for (var f = 0; f < h.length; f++) {
                            if (h[f] in e[g]) {
                                delete e[g][h[f]]
                            }
                        }
                    } else {
                        delete e[g]
                    }
                }
            }
        },
        add: function(m, g, f, h) {
            if (m && typeof g == "string" && f) {
                var j = b(m, g);
                if (!j || !j.obj) {
                    throw "custEvent (" + g + ") is undefined !"
                }
                j.obj.push({
                    fn: f,
                    data: h
                });
                return j.key
            }
        },
        once: function(m, g, f, h) {
            if (m && typeof g == "string" && f) {
                var j = b(m, g);
                if (!j || !j.obj) {
                    throw "custEvent (" + g + ") is undefined !"
                }
                j.obj.push({
                    fn: f,
                    data: h,
                    once: true
                });
                return j.key
            }
        },
        remove: function(n, j, h) {
            if (n) {
                var m = b(n, j),
                o,
                f;
                if (m && (o = m.obj)) {
                    if (c.arr.isArray(o)) {
                        if (h) {
                            var g = 0;
                            while (o[g]) {
                                if (o[g].fn === h) {
                                    break
                                }
                                g++
                            }
                            o.splice(g, 1)
                        } else {
                            o.splice(0, o.length)
                        }
                    } else {
                        for (var g in o) {
                            o[g] = []
                        }
                    }
                    return m.key
                }
            }
        },
        fire: function(g, p, n) {
            if (g && typeof p == "string") {
                var f = b(g, p),
                m;
                if (f && (m = f.obj)) {
                    if (!c.arr.isArray(n)) {
                        n = n != undefined ? [n] : []
                    }
                    for (var h = m.length - 1; h > -1 && m[h]; h--) {
                        var q = m[h].fn;
                        var o = m[h].once;
                        if (q && q.apply) {
                            try {
                                q.apply(g, [{
                                    type: p,
                                    data: m[h].data
                                }].concat(n));
                                if (o) {
                                    m.splice(h, 1)
                                }
                            } catch(j) {
                                c.log("[error][custEvent]" + j.message)
                            }
                        }
                    }
                    return f.key
                }
            }
        },
        destroy: function() {
            e = {};
            d = 1
        }
    }
});

JFAST.register("arr.isArray",
function(a) {
    return function(b) {
        return Object.prototype.toString.call(b) === "[object Array]"
    }
});

JFAST.register("arr.indexOf",
function(a) {
    return function(d, e) {
        if (e.indexOf) {
            return e.indexOf(d)
        }
        for (var c = 0,
        b = e.length; c < b; c++) {
            if (e[c] === d) {
                return c
            }
        }
        return - 1
    }
});

JFAST.register("arr.inArray",
function(a) {
    return function(b, c) {
        return a.arr.indexOf(b, c) > -1
    }
});



JFAST.register("obj.cut",
function(a) {
    return function(e, d) {
        var c = {};
        if (!a.arr.isArray(d)) {
            throw "obj.cut need array as second parameter"
        }
        for (var b in e) {
            if (!a.arr.inArray(b, d)) {
                c[b] = e[b]
            }
        }
        return c
    }
});

JFAST.register("obj.parseParam",function(a) {
    return function(d, c, b) {
        var e, f = {};
        c = c || {};
        for (e in d) {
            f[e] = d[e];
            if (c[e] != null) {
                if (b) {
                    if (d.hasOwnProperty[e]) {
                        f[e] = c[e]
                    }
                } else {
                    f[e] = c[e]
                }
            }
        }
        return f
    }
});
JFAST.register("util.getUniqueKey",
function(c) {
    var a = (new Date()).getTime().toString(),
    b = 1;
    return function() {
        return a + (b++)
    }
});
JFAST.register("util.winSize",
function(a) {
	return function(a) {
		var b, c, d;
		a ? d = a.document: d = document;
		if (d.compatMode === "CSS1Compat") {
			b = d.documentElement.clientWidth;
			c = d.documentElement.clientHeight
		} else if (self.innerHeight) {
			a ? d = a.self: d = self;
			b = d.innerWidth;
			c = d.innerHeight
		} else if (d.documentElement && d.documentElement.clientHeight) {
			b = d.documentElement.clientWidth;
			c = d.documentElement.clientHeight
		} else if (d.body) {
			b = d.body.clientWidth;
			c = d.body.clientHeight
		}
		return {
			width: b,
			height: c
		}
	}
});


JFAST.register("util.scrollPos",
function(a) {
    return function(d) {
        d = d || document;
        var b = d.documentElement;
        var c = d.body;
        return {
            top: Math.max(window.pageYOffset || 0, b.scrollTop, c.scrollTop),
            left: Math.max(window.pageXOffset || 0, b.scrollLeft, c.scrollLeft)
        }
    }
});



//给对象添加通用方法
JFAST.register("kit.extra.reuse",
function(a) {
    return function(b, c) {
        var d, e, f;
        d = a.obj.parseParam({},
        c);
        f = [];
        var g = function() {
            var a = b();
            f.push({
                store: a,
                used: !0
            });
            return a
        },
        h = function(b) {
            a.arr.foreach(f,
            function(a, c) {
                if (b === a.store) {
                    a.used = !0;
                    return ! 1
                }
            })
        },
        i = function(b) {
            a.arr.foreach(f,
            function(a, c) {
                if (b === a.store) {
                    a.used = !1;
                    return ! 1
                }
            })
        },
        j = function() {
            for (var a = 0,
            b = f.length; a < b; a += 1) if (f[a].used === !1) {
                f[a].used = !0;
                return f[a].store
            }
            return g()
        };
        e = {};
        e.setUsed = h;
        e.setUnused = i;
        e.getOne = j;
        e.getLength = function() {
            return f.length
        };
        return e
    }
});


JFAST.register("number.pad",function(a) {
	return function (source, length) {
	    var pre = "",
	        negative = (source < 0),
	        string = String(Math.abs(source));
	
	    if (string.length < length) {
	        pre = (new Array(length - string.length + 1)).join('0');
	    }
	
	    return (negative ?  "-" : "") + pre + string;
	}
});





JFAST.register("date.format",function(a){
	return function (source, pattern) {
	    if ('string' != typeof pattern) {
	        return source.toString();
	    }
	
	    function replacer(patternPart, result) {
	        pattern = pattern.replace(patternPart, result);
	    }
	    
	    var pad     = a.number.pad,
	        year    = source.getFullYear(),
	        month   = source.getMonth() + 1,
	        date2   = source.getDate(),
	        hours   = source.getHours(),
	        minutes = source.getMinutes(),
	        seconds = source.getSeconds();
	
	    replacer(/yyyy/g, pad(year, 4));
	    replacer(/yy/g, pad(parseInt(year.toString().slice(2), 10), 2));
	    replacer(/MM/g, pad(month, 2));
	    replacer(/M/g, month);
	    replacer(/dd/g, pad(date2, 2));
	    replacer(/d/g, date2);
	
	    replacer(/HH/g, pad(hours, 2));
	    replacer(/H/g, hours);
	    replacer(/hh/g, pad(hours % 12, 2));
	    replacer(/h/g, hours % 12);
	    replacer(/mm/g, pad(minutes, 2));
	    replacer(/m/g, minutes);
	    replacer(/ss/g, pad(seconds, 2));
	    replacer(/s/g, seconds);
	
	    return pattern;
	}
});


JFAST.register("string.left",function(a){
	return function(s,len,addStr){
		if(typeof s=='undefined' || s==null){
			return '';
		}
		var sLen=s.length,addStr=(typeof addStr=='undefined'?'':addStr);
		if(sLen>len){
			return s.substring(0,len)+addStr;
		}
		return s;
	};
});


JFAST.register("string.trim",function(a){
    var trimer = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g");
    return function (source) {
        return String(source).replace(trimer, "");
    };
});



JFAST.register("string.format",function(a){
	return function (source, opts) {
	    source = String(source);
	    var data = Array.prototype.slice.call(arguments,1), toString = Object.prototype.toString;
	    if(data.length){
		    data = data.length == 1 ? 
		    	(opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data) 
		    	: data;
	    	return source.replace(/#\{(.+?)\}/g, function (match, key){
		    	var replacer = data[key];
		    	if("[object Function]" == toString.call(replacer)){
		    		replacer = replacer(key);
		    	}
		    	return ("undefined" == typeof replacer ? "" : replacer);
	    	});
	    }
	    return source;
	}
});





JFAST.register("string.toCamelCase",function(a){
	return function (source) {
	    //提前判断，提高getStyle等的效率 thanks xianwei
	    if (source.indexOf('-') < 0 && source.indexOf('_') < 0) {
	        return source;
	    }
	    return source.replace(/[-_][^-_]/g, function (match) {
	        return match.charAt(1).toUpperCase();
	    });
	}
});

JFAST.register("string.cut",function(a){
	return function(s,len,addStr){
		if(typeof s=='undefined' || s==null){
			return '';
		}
		var sLen=s.length,addStr=(typeof addStr=='undefined'?'':addStr);
		if(sLen>len){
			return s.substring(0,len)+addStr;
		}
		return s;
	}
});


JFAST.register("evt.isMouseLeaveOrEnter",function(a){
	return function(e, handler) {  
	    if (e.type != 'mouseout' && e.type != 'mouseover') return false;  
	    var reltg = e.relatedTarget ? e.relatedTarget : e.type == 'mouseout' ? e.toElement : e.fromElement;  
	    while (reltg && reltg != handler)  
	        reltg = reltg.parentNode;  
	    return (reltg != handler);  
	}
});

JFAST.register("evt.addEvent",function(a){
	return function(el,type,listener,useCapture){
	    var el = $E(el);
	    if (el == null) {
	        return
	    }
	    if (typeof listener != "function") {
	        return
	    }
	    type = type || "click";
	    useCapture = useCapture ? useCapture : false;
	    if (el.addEventListener) {
	        el.addEventListener(type, listener, useCapture);
	    } else {
	        if (el.attachEvent) {
	            el.attachEvent("on" + type, listener);
	        } else {
	            el["on" + type] = listener
	        }
	    }
	    return true
	};
});



JFAST.register("evt.getEvent",function(a){
	if(a.IE){
		return function(){
			return window.event
		}
	}else{
		return function(){
	        if (window.event) {
	            return window.event
	        }
	        var b = arguments.callee.caller;
	        var a;
	        var c = 0;
	        while (b != null && c < 40) {
	            a = b.arguments[0];
	            if (a && (a.constructor == Event || a.constructor == MouseEvent)) {
	                return a
	            }
	            c++;
	            b = b.caller
	        }
	        return a
		}
	}
});



JFAST.register("evt.removeEvent",
function(a) {
	return function(b, c, d, e) {
		var f = a.E(b);
		if (f == null) return ! 1;
		if (typeof d != "function") return ! 1;
		f.removeEventListener ? f.removeEventListener(c, d, e) : f.detachEvent ? f.detachEvent("on" + c, d) : f["on" + c] = null;
		return ! 0
	}
});


JFAST.register("evt.stopEvent",function(a) {
    return function(c) {
        var b = c ? c: a.evt.getEvent();
        if (a.IE) {
            b.cancelBubble = true;
            b.returnValue = false
        } else {
            b.preventDefault();
            b.stopPropagation()
        }
        return false
    }
});
	

JFAST.register("evt.fixEvent",function(a){
	return function(event) {
	    if (typeof event == "undefined") {
	        event = window.event
	    }
	    if (!event.target) {
	        event.target = event.srcElement;
	        event.pageX = event.x;
	        event.pageY = event.y
	    }
	    if (typeof event.layerX == "undefined") {
	        event.layerX = event.offsetX
	    }
	    if (typeof a.layerY == "undefined") {
	        event.layerY = event.offsetY
	    }
	    return event;
	}
});	
	
	


JFAST.register("evt.fireEvent",function(a) {
    return function(c, d) {
        _el = a.E(c);
        if (a.IE) {
            _el.fireEvent("on" + d)
        } else {
            var b = document.createEvent("HTMLEvents");
            b.initEvent(d, true, true);
            _el.dispatchEvent(b)
        }
    }
});


JFAST.register("dom.isNode",function(a) {
    return function(b) {
        return (b != undefined) && Boolean(b.nodeName) && Boolean(b.nodeType)
    }
});



JFAST.register("ajax.request",function(a){
	return function(url,options){
		var	data        = options.data || "",
	        async       = !(options.async === false),
	        username    = options.username || "",
	        password    = options.password || "",
	        method      = (options.method || "POST").toUpperCase(),
	        headers     = options.headers || {},
	        // 基本的逻辑来自lili同学提供的patch
	        timeout     = options.timeout || 0,
	        eventHandlers = {},
	        tick, key, xhr;
	        
	        
	    /**
	     * readyState发生变更时调用
	     * 
	     * @ignore
	     */
	    function stateChangeHandler() {
	        if (xhr.readyState == 4) {
	            try {
	                var stat = xhr.status;
	            } catch (ex) {
	                // 在请求时，如果网络中断，Firefox会无法取得status
	                fire('failure');
	                return;
	            }
	            fire(stat);
	            if ((stat >= 200 && stat < 300)
	                || stat == 304
	                || stat == 1223) {
	                fire('success');
	            } else {
	                fire('error');
	            }
	            
	            window.setTimeout(
	                function() {
	                    xhr.onreadystatechange = JFAST.fn.funcEmpty;
	                    if (async) {
	                        xhr = null;
	                    }
	                }, 0);
	        }
	    }
	    
	    /**
	     * 获取XMLHttpRequest对象
	     * 
	     * @ignore
	     * @return {XMLHttpRequest} XMLHttpRequest对象
	     */
	    function getXHR() {
	        if (window.ActiveXObject) {
	            try {
	                return new ActiveXObject("Msxml2.XMLHTTP");
	            } catch (e) {
	                try {
	                    return new ActiveXObject("Microsoft.XMLHTTP");
	                } catch (e) {}
	            }
	        }
	        if (window.XMLHttpRequest) {
	            return new XMLHttpRequest();
	        }
	    }
	    
	    /**
	     * 触发事件
	     * 
	     * @ignore
	     * @param {String} type 事件类型
	     */
	    function fire(type) {
	        var handler = eventHandlers[type],
	            globelHandler = JFAST.ajax[type];
	            
	        // 不对事件类型进行验证
	        if (handler) {
	            if (tick) {
	              clearTimeout(tick);
	            }
	
	            if (type != 'success') {
	                handler(xhr);
	            } else {
	                //处理获取xhr.responseText导致出错的情况,比如请求图片地址.
	                try {
	                    var rText=xhr.responseText;
	                } catch(error) {
	                    return handler(xhr);
	                }
	                handler(xhr,xhr.responseText);
	            }
	        } else if (globelHandler) {
	            //onsuccess不支持全局事件
	            if (type == 'onsuccess') {
	                return;
	            }
	            globelHandler(xhr);
	        }
	    }
	    
	    
	    for (key in options) {
	        eventHandlers[key] = options[key];
	    }
	    
	    
	    headers['X-Requested-With'] = 'XMLHttpRequest';
	    
	    
	    try {
	        xhr = getXHR();
	        
	        if (method == 'GET') {
	            if (data) {
	                url += (url.indexOf('?') >= 0 ? '&' : '?') + data;
	                data = null;
	            }
	            if(options['noCache'])
	                url += (url.indexOf('?') >= 0 ? '&' : '?') + 'b' + (+ new Date) + '=1';
	        }
	        
	        if (username) {
	            xhr.open(method, url, async, username, password);
	        } else {
	            xhr.open(method, url, async);
	        }
	        
	        if (async) {
	            xhr.onreadystatechange = stateChangeHandler;
	        }
	        
	        // 在open之后再进行http请求头设定
	        // FIXME 是否需要添加; charset=UTF-8呢
	        if (method == 'POST') {
	            xhr.setRequestHeader("Content-Type",
	                (headers['Content-Type'] || "application/x-www-form-urlencoded"));
	        }
	        
	        for (key in headers) {
	            if (headers.hasOwnProperty(key)) {
	                xhr.setRequestHeader(key, headers[key]);
	            }
	        }
	        
	        fire('beforerequest');
	        
	        if (timeout) {
	          tick = setTimeout(function(){
	            xhr.onreadystatechange = a.fn.blank;
	            xhr.abort();
	            fire("timeout");
	          }, timeout);
	        }
	        xhr.send(data);
	        
	        if (!async) {
	            stateChangeHandler();
	        }
	    } catch (ex) {
	        fire('failure');
	    }
	    
	    return xhr;
	}
});





JFAST.register("dom.scrollTo",function(a){
    return function(c, m) {
        var d = a.obj.parseParam({
            box: document.documentElement,
            top: 0,
            step: 2,
            onMoveStop: null
        },
        m);
        d.step = Math.max(2, Math.min(10, d.step));
        var b = [];
        var j = a.dom.position(c);
        var h;
        if (d.box == document.documentElement) {
            h = {
                t: 0
            }
        } else {
            h = a.dom.position(d.box)
        }
        var e = Math.max(0, (j ? j.t: 0) - (h ? h.t: 0) - d.top);
        var f = d.box === document.documentElement ? (d.box.scrollTop || document.body.scrollTop || window.pageYOffset) : d.box.scrollTop;
        while (Math.abs(f - e) > d.step && f !== 0) {
            b.push(Math.round(f + (e - f) * d.step / 10));
            f = b[b.length - 1]
        }
        if (!b.length) {
            b.push(e)
        }
        var g = a.util.timer.add(function() {
            if (b.length) {
                if (d.box === document.documentElement) {
                    window.scrollTo(0, b.shift())
                } else {
                    d.box.scrollTop = b.shift()
                }
            } else {
                if (d.box === document.documentElement) {
                    window.scrollTo(0, e)
                } else {
                    d.box.scrollTop = e
                }
                a.util.timer.remove(g);
                if (typeof d.onMoveStop === "function") {
                    d.onMoveStop()
                }
            }
        })
    }
});	




JFAST.register("dom.hasClass",function(a) {
	return function (element, className) {
	    element = $E(element);
	
	    // 对于 textNode 节点来说没有 className
	    if(!element || !element.className) return false;
	
	    var classArray = a.string.trim(className).split(/\s+/), 
	        len = classArray.length;
	
	    className = element.className.split(/\s+/).join(" ");
	
	    while (len--) {
	        if(!(new RegExp("(^| )" + classArray[len] + "( |\x24)")).test(className)){
	            return false;
	        }
	    }
	    return true;
	}
});

JFAST.register("dom.addClass",function(a) {
	return function (element, className) {
	    element = $E(element);
	    var classArray = className.split(/\s+/),
	        result = typeof element.className =='undefined'?'':element.className,
	        classMatch = " " + result + " ",
	        i = 0,
	        l = classArray.length;
	
	    for (; i < l; i++){
	         if ( classMatch.indexOf( " " + classArray[i] + " " ) < 0 ) {
	             result += (result ? ' ' : '') + classArray[i];
	         }
	    }
	
	    element.className = result;
	    return element;
	}
});



JFAST.register("dom.removeClass",function(a) {
	return function (element, className) {
	    element = $E(element);
	
	    var oldClasses = element.className.split(/\s+/),
	        newClasses = className.split(/\s+/),
	        lenOld,
	        lenDel = newClasses.length,
	        j,
	        i = 0;
	
		for (; i < lenDel; ++i){
		    for(j = 0, lenOld = oldClasses.length; j < lenOld; ++j){
		        if(oldClasses[j] == newClasses[i]){
		        	oldClasses.splice(j, 1);
		        	break;
		        }
		    }
		}
		element.className = oldClasses.join(' ');
		return element;
	}
});


JFAST.register("dom.getStyle",
function(a) {
    return function(c, f) {
        if (a.IE) {
            switch (f) {
            case "opacity":
                var h = 100;
                try {
                    h = c.filters["DXImageTransform.Microsoft.Alpha"].opacity
                } catch(g) {
                    try {
                        h = c.filters("alpha").opacity
                    } catch(g) {}
                }
                return h / 100;
            case "float":
                f = "styleFloat";
            default:
                var d = c.currentStyle ? c.currentStyle[f] : null;
                return (c.style[f] || d)
            }
        } else {
            if (f == "float") {
                f = "cssFloat"
            }
            try {
                var b = document.defaultView.getComputedStyle(c, "")
            } catch(g) {}
            return c.style[f] || b ? b[f] : null
        }
    }
});
JFAST.register("dom.setStyle",function(a) {
    return function(b, c, d) {
        if (a.IE) {
            switch (c) {
            case "opacity":
            	if(d+""==""){
            		b.style.filter="";
            	}else{
	                b.style.filter = "alpha(opacity=" + (d * 100) + ")";
	                if (!b.currentStyle || !b.currentStyle.hasLayout) {
	                    b.style.zoom = 1
	                }
	        	}
                break;
            case "float":
                c = "styleFloat";
            default:
                b.style[c] = d
            }
        } else {
            if (c == "float") {
                c = "cssFloat"
            }
            b.style[c] = d
        }
    }
});

JFAST.register("dom.removeNode",function(a) {
    return function(el) {
        el = a.E(el) || el;
        try {
            el.parentNode.removeChild(el)
        } catch(c) {}
    }
});



JFAST.register("dom.insertHTML",function(a) {
    return function(e,c,d) {
        e = a.E(e) || document.body;
        c = c ? c.toLowerCase() : "beforeend";
        if (e.insertAdjacentHTML) {
            switch (c) {
            case "beforebegin":
                e.insertAdjacentHTML("BeforeBegin", d);
                return e.previousSibling;
            case "afterbegin":
                e.insertAdjacentHTML("AfterBegin", d);
                return e.firstChild;
            case "beforeend":
                e.insertAdjacentHTML("BeforeEnd", d);
                return e.lastChild;
            case "afterend":
                e.insertAdjacentHTML("AfterEnd", d);
                return e.nextSibling
            }
            throw 'Illegal insertion point -> "' + c + '"'
        } else {
            var b = e.ownerDocument.createRange();
            var f;
            switch (c) {
            case "beforebegin":
                b.setStartBefore(e);
                f = b.createContextualFragment(d);
                e.parentNode.insertBefore(f, e);
                return e.previousSibling;
            case "afterbegin":
                if (e.firstChild) {
                    b.setStartBefore(e.firstChild);
                    f = b.createContextualFragment(d);
                    e.insertBefore(f, e.firstChild);
                    return e.firstChild
                } else {
                    e.innerHTML = d;
                    return e.firstChild
                }
                break;
            case "beforeend":
                if (e.lastChild) {
                    b.setStartAfter(e.lastChild);
                    f = b.createContextualFragment(d);
                    e.appendChild(f);
                    return e.lastChild
                } else {
                    e.innerHTML = d;
                    return e.lastChild
                }
                break;
            case "afterend":
                b.setStartAfter(e);
                f = b.createContextualFragment(d);
                e.parentNode.insertBefore(f, e.nextSibling);
                return e.nextSibling
            }
            throw 'Illegal insertion point -> "' + c + '"'
        }
    }
});





JFAST.register("system.winSize",function(a) {
	return function(b) {
	    var a, c;
	    if (b) {
	        target = b.document
	    } else {
	        target = document
	    }
	    if (self.innerHeight) {
	        if (b) {
	            target = b.self
	        } else {
	            target = self
	        }
	        a = target.innerWidth;
	        c = target.innerHeight
	    } else {
	        if (target.documentElement && target.documentElement.clientHeight) {
	            a = target.documentElement.clientWidth;
	            c = target.documentElement.clientHeight
	        } else {
	            if (target.body) {
	                a = target.body.clientWidth;
	                c = target.body.clientHeight
	            }
	        }
	    }
	    return {
	        width: a,
	        height: c
	    }
	}
});







JFAST.register("util.browser",
function(h) {
    var a = navigator.userAgent.toLowerCase();
    var o = window.external || "";
    var c, d, f, p, g;
    var b = function(e) {
        var m = 0;
        return parseFloat(e.replace(/\./g,
        function() {
            return (m++==1) ? "": "."
        }))
    };
    try {
        if ((/windows|win32/i).test(a)) {
            g = "windows"
        } else {
            if ((/macintosh/i).test(a)) {
                g = "macintosh"
            } else {
                if ((/rhino/i).test(a)) {
                    g = "rhino"
                }
            }
        }
        if ((d = a.match(/applewebkit\/([^\s]*)/)) && d[1]) {
            c = "webkit";
            p = b(d[1])
        } else {
            if ((d = a.match(/presto\/([\d.]*)/)) && d[1]) {
                c = "presto";
                p = b(d[1])
            } else {
                if (d = a.match(/msie\s([^;]*)/)) {
                    c = "trident";
                    p = 1;
                    if ((d = a.match(/trident\/([\d.]*)/)) && d[1]) {
                        p = b(d[1])
                    }
                } else {
                    if (/gecko/.test(a)) {
                        c = "gecko";
                        p = 1;
                        if ((d = a.match(/rv:([\d.]*)/)) && d[1]) {
                            p = b(d[1])
                        }
                    }
                }
            }
        }
        if (/world/.test(a)) {
            f = "world"
        } else {
            if (/360se/.test(a)) {
                f = "360"
            } else {
                if ((/maxthon/.test(a)) || typeof o.max_version == "number") {
                    f = "maxthon"
                } else {
                    if (/tencenttraveler\s([\d.]*)/.test(a)) {
                        f = "tt"
                    } else {
                        if (/se\s([\d.]*)/.test(a)) {
                            f = "sogou"
                        }
                    }
                }
            }
        }
    } catch(n) {}
    var j = {
        OS: g,
        CORE: c,
        Version: p,
        EXTRA: (f ? f: false),
        IE: /msie/.test(a),
        OPERA: /opera/.test(a),
        MOZ: /gecko/.test(a) && !/(compatible|webkit)/.test(a),
        IE5: /msie 5 /.test(a),
        IE55: /msie 5.5/.test(a),
        IE6: /msie 6/.test(a),
        IE7: /msie 7/.test(a),
        IE8: /msie 8/.test(a),
        IE9: /msie 9/.test(a),
        SAFARI: !/chrome\/([\d.]*)/.test(a) && /\/([\d.]*) safari/.test(a),
        CHROME: /chrome\/([\d.]*)/.test(a),
        IPAD: /\(ipad/i.test(a),
        IPHONE: /\(iphone/i.test(a),
        ITOUCH: /\(itouch/i.test(a),
        MOBILE: /mobile/i.test(a)
    };
    return j
});

JFAST.register("kit.dom.cssText",
function(a) {
    var b = function(a, b) {
        var c = (a + ";" + b).replace(/(\s*(;)\s*)|(\s*(:)\s*)/g, "$2$4"),
        d;
        while (c && (d = c.match(/(^|;)([\w\-]+:)([^;]*);(.*;)?\2/i))) c = c.replace(d[1] + d[2] + d[3], "");
        return c
    };
    return function(a) {
        a = a || "";
        var c = [],
        d = {
            push: function(a, b) {
                c.push(a + ":" + b);
                return d
            },
            remove: function(a) {
                for (var b = 0; b < c.length; b++) c[b].indexOf(a + ":") == 0 && c.splice(b, 1);
                return d
            },
            getStyleList: function() {
                return c.slice()
            },
            getCss: function() {
                return b(a, c.join(";"))
            }
        };
        return d
    }
});
JFAST.register("kit.dom.fix",function(a) {
    function f(c, e, f) {
        if ( !! d(c)) {
            var g = "fixed",
            h, i, j, k, l = c.offsetWidth,
            m = c.offsetHeight,
            n = a.util.winSize(),
            o = 0,
            p = 0,
            q = a.kit.dom.cssText(c.style.cssText);
            if (!b) {
                g = "absolute";
                var r = a.util.scrollPos();
                o = h = r.top;
                p = i = r.left;
                switch (e) {
                case "lt":
                    h += f[1];
                    i += f[0];
                    break;
                case "lb":
                    h += n.height - m - f[1];
                    i += f[0];
                    break;
                case "rt":
                    h += f[1];
                    i += n.width - l - f[0];
                    break;
                case "rb":
                    h += n.height - m - f[1];
                    i += n.width - l - f[0];
                    break;
                case "c":
                default:
                    h += (n.height - m) / 2 + f[1];
                    i += (n.width - l) / 2 + f[0]
                }
                j = k = ""
            } else {
                h = k = f[1];
                i = j = f[0];
                switch (e) {
                case "lt":
                    k = j = "";
                    break;
                case "lb":
                    h = j = "";
                    break;
                case "rt":
                    i = k = "";
                    break;
                case "rb":
                    h = i = "";
                    break;
                case "c":
                default:
                    h = (n.height - m) / 2 + f[1];
                    i = (n.width - l) / 2 + f[0];
                    k = j = ""
                }
            }
            if (e == "c") {
                h < o && (h = o);
                i < p && (i = p)
            }
            q.push("position", g).push("top", h + "px").push("left", i + "px").push("right", j + "px").push("bottom", k + "px");
            c.style.cssText = q.getCss()
        }
    }
    function e(b) {
        b = a.arr.isArray(b) ? b: [0, 0];
        for (var c = 0; c < 2; c++) typeof b[c] != "number" && (b[c] = 0);
        return b
    }
    function d(b) {
        return a.dom.getStyle(b, "display") != "none"
    }
    var b = !(a.util.browser.IE6 || document.compatMode !== "CSS1Compat" && STK.IE),
    c = /^(c)|(lt)|(lb)|(rt)|(rb)$/;
    return function(d, g, h) {
        var i, j, k = !0,
        l;
        if (a.dom.isNode(d) && c.test(g)) {
            var m = {
                getNode: function() {
                    return d
                },
                isFixed: function() {
                    return k
                },
                setFixed: function(a) { (k = !!a) && f(d, i, j);
                    return this
                },
                setAlign: function(a, b) {
                    if (c.test(a)) {
                        i = a;
                        j = e(b);
                        k && f(d, i, j)
                    }
                    return this
                },
                destroy: function() {
                    b || b && a.evt.removeEvent(window, "scroll", n);
                    a.evt.removeEvent(window, "resize", n);
                    a.evt.custEvent.undefine(l)
                }
            };
            l = a.evt.custEvent.define(m, "beforeFix");
            m.setAlign(g, h);
            function n(c) {
                c = c || window.event;
                a.evt.custEvent.fire(l, "beforeFix", c.type);
                k && (!b || i == "c") && f(d, i, j)
            }
            b || a.evt.addEvent(window, "scroll", n);
            a.evt.addEvent(window, "resize", n);
            return m
        }
    }
});



JFAST.register("obj.extend",function(a) {
	return function (target, source) {
	    for (var p in source) {
	        if (source.hasOwnProperty(p)) {
	            target[p] = source[p];
	        }
	    }
	    return target;
	}
});



JFAST.register("obj.clone",function(a) {
	return function(s) {
	    var f= function(){};
	    f.prototype=s;
	    var sub=new f;
	    sub._super=s;
	    return sub;
	}
});


JFAST.register("fn.extend",function(a) {
	return function(subClass,superClass) {
	    var F= function(){};
	    F.prototype=superClass.prototype;
	    subClass.prototype=new F();
	    subClass.prototype.constructor=subClass;
	    subClass._super=superClass.prototype;
	    if(superClass.prototype.constructor==Object.prototype.constructor){
	    	superClass.prototype.constructor=superClass;
	    }
	    return subClass;
	}
});




JFAST.register("fn.funcEmpty",function(a) {
	return  function () {}
});

JFAST.register("func.getType",
function(a) {
    return function(b) {
        var c;
        return ((c = typeof(b)) == "object" ? b == null && "null" || Object.prototype.toString.call(b).slice(8, -1) : c).toLowerCase()
    }
});

JFAST.register("dom.sizzle",
function(n) {
    var t = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
    m = 0,
    d = Object.prototype.toString,
    s = false,
    j = true; [0, 0].sort(function() {
        j = false;
        return 0
    });
    var b = function(z, e, C, D) {
        C = C || [];
        e = e || document;
        var F = e;
        if (e.nodeType !== 1 && e.nodeType !== 9) {
            return []
        }
        if (!z || typeof z !== "string") {
            return C
        }
        var A = [],
        w,
        H,
        K,
        v,
        y = true,
        x = b.isXML(e),
        E = z,
        G,
        J,
        I,
        B;
        do {
            t.exec("");
            w = t.exec(E);
            if (w) {
                E = w[3];
                A.push(w[1]);
                if (w[2]) {
                    v = w[3];
                    break
                }
            }
        } while ( w );
        if (A.length > 1 && o.exec(z)) {
            if (A.length === 2 && f.relative[A[0]]) {
                H = h(A[0] + A[1], e)
            } else {
                H = f.relative[A[0]] ? [e] : b(A.shift(), e);
                while (A.length) {
                    z = A.shift();
                    if (f.relative[z]) {
                        z += A.shift()
                    }
                    H = h(z, H)
                }
            }
        } else {
            if (!D && A.length > 1 && e.nodeType === 9 && !x && f.match.ID.test(A[0]) && !f.match.ID.test(A[A.length - 1])) {
                G = b.find(A.shift(), e, x);
                e = G.expr ? b.filter(G.expr, G.set)[0] : G.set[0]
            }
            if (e) {
                G = D ? {
                    expr: A.pop(),
                    set: a(D)
                }: b.find(A.pop(), A.length === 1 && (A[0] === "~" || A[0] === "+") && e.parentNode ? e.parentNode: e, x);
                H = G.expr ? b.filter(G.expr, G.set) : G.set;
                if (A.length > 0) {
                    K = a(H)
                } else {
                    y = false
                }
                while (A.length) {
                    J = A.pop();
                    I = J;
                    if (!f.relative[J]) {
                        J = ""
                    } else {
                        I = A.pop()
                    }
                    if (I == null) {
                        I = e
                    }
                    f.relative[J](K, I, x)
                }
            } else {
                K = A = []
            }
        }
        if (!K) {
            K = H
        }
        if (!K) {
            b.error(J || z)
        }
        if (d.call(K) === "[object Array]") {
            if (!y) {
                C.push.apply(C, K)
            } else {
                if (e && e.nodeType === 1) {
                    for (B = 0; K[B] != null; B++) {
                        if (K[B] && (K[B] === true || K[B].nodeType === 1 && b.contains(e, K[B]))) {
                            C.push(H[B])
                        }
                    }
                } else {
                    for (B = 0; K[B] != null; B++) {
                        if (K[B] && K[B].nodeType === 1) {
                            C.push(H[B])
                        }
                    }
                }
            }
        } else {
            a(K, C)
        }
        if (v) {
            b(v, F, C, D);
            b.uniqueSort(C)
        }
        return C
    };
    b.uniqueSort = function(v) {
        if (c) {
            s = j;
            v.sort(c);
            if (s) {
                for (var e = 1; e < v.length; e++) {
                    if (v[e] === v[e - 1]) {
                        v.splice(e--, 1)
                    }
                }
            }
        }
        return v
    };
    b.matches = function(e, v) {
        return b(e, null, null, v)
    };
    b.find = function(B, e, C) {
        var A;
        if (!B) {
            return []
        }
        for (var x = 0,
        w = f.order.length; x < w; x++) {
            var z = f.order[x],
            y;
            if ((y = f.leftMatch[z].exec(B))) {
                var v = y[1];
                y.splice(1, 1);
                if (v.substr(v.length - 1) !== "\\") {
                    y[1] = (y[1] || "").replace(/\\/g, "");
                    A = f.find[z](y, e, C);
                    if (A != null) {
                        B = B.replace(f.match[z], "");
                        break
                    }
                }
            }
        }
        if (!A) {
            A = e.getElementsByTagName("*")
        }
        return {
            set: A,
            expr: B
        }
    };
    b.filter = function(F, E, I, y) {
        var w = F,
        K = [],
        C = E,
        A,
        e,
        B = E && E[0] && b.isXML(E[0]);
        while (F && E.length) {
            for (var D in f.filter) {
                if ((A = f.leftMatch[D].exec(F)) != null && A[2]) {
                    var v = f.filter[D],
                    J,
                    H,
                    x = A[1];
                    e = false;
                    A.splice(1, 1);
                    if (x.substr(x.length - 1) === "\\") {
                        continue
                    }
                    if (C === K) {
                        K = []
                    }
                    if (f.preFilter[D]) {
                        A = f.preFilter[D](A, C, I, K, y, B);
                        if (!A) {
                            e = J = true
                        } else {
                            if (A === true) {
                                continue
                            }
                        }
                    }
                    if (A) {
                        for (var z = 0; (H = C[z]) != null; z++) {
                            if (H) {
                                J = v(H, A, z, C);
                                var G = y ^ !!J;
                                if (I && J != null) {
                                    if (G) {
                                        e = true
                                    } else {
                                        C[z] = false
                                    }
                                } else {
                                    if (G) {
                                        K.push(H);
                                        e = true
                                    }
                                }
                            }
                        }
                    }
                    if (J !== undefined) {
                        if (!I) {
                            C = K
                        }
                        F = F.replace(f.match[D], "");
                        if (!e) {
                            return []
                        }
                        break
                    }
                }
            }
            if (F === w) {
                if (e == null) {
                    b.error(F)
                } else {
                    break
                }
            }
            w = F
        }
        return C
    };
    b.error = function(e) {
        throw "Syntax error, unrecognized expression: " + e
    };
    var f = {
        order: ["ID", "NAME", "TAG"],
        match: {
            ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
            ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
            TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
            CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+\-]*)\))?/,
            POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
            PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
        },
        leftMatch: {},
        attrMap: {
            "class": "className",
            "for": "htmlFor"
        },
        attrHandle: {
            href: function(e) {
                return e.getAttribute("href")
            }
        },
        relative: {
            "+": function(A, v) {
                var x = typeof v === "string",
                z = x && !/\W/.test(v),
                B = x && !z;
                if (z) {
                    v = v.toLowerCase()
                }
                for (var w = 0,
                e = A.length,
                y; w < e; w++) {
                    if ((y = A[w])) {
                        while ((y = y.previousSibling) && y.nodeType !== 1) {}
                        A[w] = B || y && y.nodeName.toLowerCase() === v ? y || false: y === v
                    }
                }
                if (B) {
                    b.filter(v, A, true)
                }
            },
            ">": function(A, v) {
                var y = typeof v === "string",
                z, w = 0,
                e = A.length;
                if (y && !/\W/.test(v)) {
                    v = v.toLowerCase();
                    for (; w < e; w++) {
                        z = A[w];
                        if (z) {
                            var x = z.parentNode;
                            A[w] = x.nodeName.toLowerCase() === v ? x: false
                        }
                    }
                } else {
                    for (; w < e; w++) {
                        z = A[w];
                        if (z) {
                            A[w] = y ? z.parentNode: z.parentNode === v
                        }
                    }
                    if (y) {
                        b.filter(v, A, true)
                    }
                }
            },
            "": function(x, v, z) {
                var w = m++,
                e = u,
                y;
                if (typeof v === "string" && !/\W/.test(v)) {
                    v = v.toLowerCase();
                    y = v;
                    e = r
                }
                e("parentNode", v, w, x, y, z)
            },
            "~": function(x, v, z) {
                var w = m++,
                e = u,
                y;
                if (typeof v === "string" && !/\W/.test(v)) {
                    v = v.toLowerCase();
                    y = v;
                    e = r
                }
                e("previousSibling", v, w, x, y, z)
            }
        },
        find: {
            ID: function(v, w, x) {
                if (typeof w.getElementById !== "undefined" && !x) {
                    var e = w.getElementById(v[1]);
                    return e ? [e] : []
                }
            },
            NAME: function(w, z) {
                if (typeof z.getElementsByName !== "undefined") {
                    var v = [],
                    y = z.getElementsByName(w[1]);
                    for (var x = 0,
                    e = y.length; x < e; x++) {
                        if (y[x].getAttribute("name") === w[1]) {
                            v.push(y[x])
                        }
                    }
                    return v.length === 0 ? null: v
                }
            },
            TAG: function(e, v) {
                return v.getElementsByTagName(e[1])
            }
        },
        preFilter: {
            CLASS: function(x, v, w, e, A, B) {
                x = " " + x[1].replace(/\\/g, "") + " ";
                if (B) {
                    return x
                }
                for (var y = 0,
                z; (z = v[y]) != null; y++) {
                    if (z) {
                        if (A ^ (z.className && (" " + z.className + " ").replace(/[\t\n]/g, " ").indexOf(x) >= 0)) {
                            if (!w) {
                                e.push(z)
                            }
                        } else {
                            if (w) {
                                v[y] = false
                            }
                        }
                    }
                }
                return false
            },
            ID: function(e) {
                return e[1].replace(/\\/g, "")
            },
            TAG: function(v, e) {
                return v[1].toLowerCase()
            },
            CHILD: function(e) {
                if (e[1] === "nth") {
                    var v = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(e[2] === "even" && "2n" || e[2] === "odd" && "2n+1" || !/\D/.test(e[2]) && "0n+" + e[2] || e[2]);
                    e[2] = (v[1] + (v[2] || 1)) - 0;
                    e[3] = v[3] - 0
                }
                e[0] = m++;
                return e
            },
            ATTR: function(y, v, w, e, z, A) {
                var x = y[1].replace(/\\/g, "");
                if (!A && f.attrMap[x]) {
                    y[1] = f.attrMap[x]
                }
                if (y[2] === "~=") {
                    y[4] = " " + y[4] + " "
                }
                return y
            },
            PSEUDO: function(y, v, w, e, z) {
                if (y[1] === "not") {
                    if ((t.exec(y[3]) || "").length > 1 || /^\w/.test(y[3])) {
                        y[3] = b(y[3], null, null, v)
                    } else {
                        var x = b.filter(y[3], v, w, true ^ z);
                        if (!w) {
                            e.push.apply(e, x)
                        }
                        return false
                    }
                } else {
                    if (f.match.POS.test(y[0]) || f.match.CHILD.test(y[0])) {
                        return true
                    }
                }
                return y
            },
            POS: function(e) {
                e.unshift(true);
                return e
            }
        },
        filters: {
            enabled: function(e) {
                return e.disabled === false && e.type !== "hidden"
            },
            disabled: function(e) {
                return e.disabled === true
            },
            checked: function(e) {
                return e.checked === true
            },
            selected: function(e) {
                return e.selected === true
            },
            parent: function(e) {
                return !! e.firstChild
            },
            empty: function(e) {
                return ! e.firstChild
            },
            has: function(w, v, e) {
                return !! b(e[3], w).length
            },
            header: function(e) {
                return (/h\d/i).test(e.nodeName)
            },
            text: function(e) {
                return "text" === e.type
            },
            radio: function(e) {
                return "radio" === e.type
            },
            checkbox: function(e) {
                return "checkbox" === e.type
            },
            file: function(e) {
                return "file" === e.type
            },
            password: function(e) {
                return "password" === e.type
            },
            submit: function(e) {
                return "submit" === e.type
            },
            image: function(e) {
                return "image" === e.type
            },
            reset: function(e) {
                return "reset" === e.type
            },
            button: function(e) {
                return "button" === e.type || e.nodeName.toLowerCase() === "button"
            },
            input: function(e) {
                return (/input|select|textarea|button/i).test(e.nodeName)
            }
        },
        setFilters: {
            first: function(v, e) {
                return e === 0
            },
            last: function(w, v, e, x) {
                return v === x.length - 1
            },
            even: function(v, e) {
                return e % 2 === 0
            },
            odd: function(v, e) {
                return e % 2 === 1
            },
            lt: function(w, v, e) {
                return v < e[3] - 0
            },
            gt: function(w, v, e) {
                return v > e[3] - 0
            },
            nth: function(w, v, e) {
                return e[3] - 0 === v
            },
            eq: function(w, v, e) {
                return e[3] - 0 === v
            }
        },
        filter: {
            PSEUDO: function(w, B, A, C) {
                var e = B[1],
                v = f.filters[e];
                if (v) {
                    return v(w, A, B, C)
                } else {
                    if (e === "contains") {
                        return (w.textContent || w.innerText || b.getText([w]) || "").indexOf(B[3]) >= 0
                    } else {
                        if (e === "not") {
                            var x = B[3];
                            for (var z = 0,
                            y = x.length; z < y; z++) {
                                if (x[z] === w) {
                                    return false
                                }
                            }
                            return true
                        } else {
                            b.error("Syntax error, unrecognized expression: " + e)
                        }
                    }
                }
            },
            CHILD: function(e, x) {
                var A = x[1],
                v = e;
                switch (A) {
                case "only":
                case "first":
                    while ((v = v.previousSibling)) {
                        if (v.nodeType === 1) {
                            return false
                        }
                    }
                    if (A === "first") {
                        return true
                    }
                    v = e;
                case "last":
                    while ((v = v.nextSibling)) {
                        if (v.nodeType === 1) {
                            return false
                        }
                    }
                    return true;
                case "nth":
                    var w = x[2],
                    D = x[3];
                    if (w === 1 && D === 0) {
                        return true
                    }
                    var z = x[0],
                    C = e.parentNode;
                    if (C && (C.sizcache !== z || !e.nodeIndex)) {
                        var y = 0;
                        for (v = C.firstChild; v; v = v.nextSibling) {
                            if (v.nodeType === 1) {
                                v.nodeIndex = ++y
                            }
                        }
                        C.sizcache = z
                    }
                    var B = e.nodeIndex - D;
                    if (w === 0) {
                        return B === 0
                    } else {
                        return (B % w === 0 && B / w >= 0)
                    }
                }
            },
            ID: function(v, e) {
                return v.nodeType === 1 && v.getAttribute("id") === e
            },
            TAG: function(v, e) {
                return (e === "*" && v.nodeType === 1) || v.nodeName.toLowerCase() === e
            },
            CLASS: function(v, e) {
                return (" " + (v.className || v.getAttribute("class")) + " ").indexOf(e) > -1
            },
            ATTR: function(z, x) {
                var w = x[1],
                e = f.attrHandle[w] ? f.attrHandle[w](z) : z[w] != null ? z[w] : z.getAttribute(w),
                A = e + "",
                y = x[2],
                v = x[4];
                return e == null ? y === "!=": y === "=" ? A === v: y === "*=" ? A.indexOf(v) >= 0 : y === "~=" ? (" " + A + " ").indexOf(v) >= 0 : !v ? A && e !== false: y === "!=" ? A !== v: y === "^=" ? A.indexOf(v) === 0 : y === "$=" ? A.substr(A.length - v.length) === v: y === "|=" ? A === v || A.substr(0, v.length + 1) === v + "-": false
            },
            POS: function(y, v, w, z) {
                var e = v[2],
                x = f.setFilters[e];
                if (x) {
                    return x(y, w, v, z)
                }
            }
        }
    };
    b.selectors = f;
    var o = f.match.POS,
    g = function(v, e) {
        return "\\" + (e - 0 + 1)
    };
    for (var q in f.match) {
        f.match[q] = new RegExp(f.match[q].source + (/(?![^\[]*\])(?![^\(]*\))/.source));
        f.leftMatch[q] = new RegExp(/(^(?:.|\r|\n)*?)/.source + f.match[q].source.replace(/\\(\d+)/g, g))
    }
    var a = function(v, e) {
        v = Array.prototype.slice.call(v, 0);
        if (e) {
            e.push.apply(e, v);
            return e
        }
        return v
    };
    if(document.documentElement.childNodes.length==0){
    //try {
        //Array.prototype.slice.call(document.documentElement.childNodes,0)[0].nodeType
    //} catch(p) {
        a = function(y, x) {
            var v = x || [],
            w = 0;
            if (d.call(y) === "[object Array]") {
                Array.prototype.push.apply(v, y)
            } else {
                if (typeof y.length === "number") {
                    for (var e = y.length; w < e; w++) {
                        v.push(y[w])
                    }
                } else {
                    for (; y[w]; w++) {
                        v.push(y[w])
                    }
                }
            }
            return v
        }
    //}
    }
    var c;
    if (document.documentElement.compareDocumentPosition) {
        c = function(v, e) {
            if (!v.compareDocumentPosition || !e.compareDocumentPosition) {
                if (v == e) {
                    s = true
                }
                return v.compareDocumentPosition ? -1 : 1
            }
            var w = v.compareDocumentPosition(e) & 4 ? -1 : v === e ? 0 : 1;
            if (w === 0) {
                s = true
            }
            return w
        }
    } else {
        if ("sourceIndex" in document.documentElement) {
            c = function(v, e) {
                if (!v.sourceIndex || !e.sourceIndex) {
                    if (v == e) {
                        s = true
                    }
                    return v.sourceIndex ? -1 : 1
                }
                var w = v.sourceIndex - e.sourceIndex;
                if (w === 0) {
                    s = true
                }
                return w
            }
        } else {
            if (document.createRange) {
                c = function(x, v) {
                    if (!x.ownerDocument || !v.ownerDocument) {
                        if (x == v) {
                            s = true
                        }
                        return x.ownerDocument ? -1 : 1
                    }
                    var w = x.ownerDocument.createRange(),
                    e = v.ownerDocument.createRange();
                    w.setStart(x, 0);
                    w.setEnd(x, 0);
                    e.setStart(v, 0);
                    e.setEnd(v, 0);
                    var y = w.compareBoundaryPoints(Range.START_TO_END, e);
                    if (y === 0) {
                        s = true
                    }
                    return y
                }
            }
        }
    }
    b.getText = function(e) {
        var v = "",
        x;
        for (var w = 0; e[w]; w++) {
            x = e[w];
            if (x.nodeType === 3 || x.nodeType === 4) {
                v += x.nodeValue
            } else {
                if (x.nodeType !== 8) {
                    v += b.getText(x.childNodes)
                }
            }
        }
        return v
    }; (function() {
        var v = document.createElement("div"),
        w = "script" + (new Date()).getTime();
        v.innerHTML = "<a name='" + w + "'/>";
        var e = document.documentElement;
        e.insertBefore(v, e.firstChild);
        if (document.getElementById(w)) {
            f.find.ID = function(y, z, A) {
                if (typeof z.getElementById !== "undefined" && !A) {
                    var x = z.getElementById(y[1]);
                    return x ? x.id === y[1] || typeof x.getAttributeNode !== "undefined" && x.getAttributeNode("id").nodeValue === y[1] ? [x] : undefined: []
                }
            };
            f.filter.ID = function(z, x) {
                var y = typeof z.getAttributeNode !== "undefined" && z.getAttributeNode("id");
                return z.nodeType === 1 && y && y.nodeValue === x
            }
        }
        e.removeChild(v);
        e = v = null
    })(); (function() {
        var e = document.createElement("div");
        e.appendChild(document.createComment(""));
        if (e.getElementsByTagName("*").length > 0) {
            f.find.TAG = function(v, z) {
                var y = z.getElementsByTagName(v[1]);
                if (v[1] === "*") {
                    var x = [];
                    for (var w = 0; y[w]; w++) {
                        if (y[w].nodeType === 1) {
                            x.push(y[w])
                        }
                    }
                    y = x
                }
                return y
            }
        }
        e.innerHTML = "<a href='#'></a>";
        if (e.firstChild && typeof e.firstChild.getAttribute !== "undefined" && e.firstChild.getAttribute("href") !== "#") {
            f.attrHandle.href = function(v) {
                return v.getAttribute("href", 2)
            }
        }
        e = null
    })();
    if (document.querySelectorAll) { (function() {
            var e = b,
            w = document.createElement("div");
            w.innerHTML = "<p class='TEST'></p>";
            if (w.querySelectorAll && w.querySelectorAll(".TEST").length === 0) {
                return
            }
            b = function(A, z, x, y) {
                z = z || document;
                if (!y && z.nodeType === 9 && !b.isXML(z)) {
                    try {
                        return a(z.querySelectorAll(A), x)
                    } catch(B) {}
                }
                return e(A, z, x, y)
            };
            for (var v in e) {
                b[v] = e[v]
            }
            w = null
        })()
    } (function() {
        var e = document.createElement("div");
        e.innerHTML = "<div class='test e'></div><div class='test'></div>";
        if (!e.getElementsByClassName || e.getElementsByClassName("e").length === 0) {
            return
        }
        e.lastChild.className = "e";
        if (e.getElementsByClassName("e").length === 1) {
            return
        }
        f.order.splice(1, 0, "CLASS");
        f.find.CLASS = function(v, w, x) {
            if (typeof w.getElementsByClassName !== "undefined" && !x) {
                return w.getElementsByClassName(v[1])
            }
        };
        e = null
    })();
    function r(v, A, z, D, B, C) {
        for (var x = 0,
        w = D.length; x < w; x++) {
            var e = D[x];
            if (e) {
                e = e[v];
                var y = false;
                while (e) {
                    if (e.sizcache === z) {
                        y = D[e.sizset];
                        break
                    }
                    if (e.nodeType === 1 && !C) {
                        e.sizcache = z;
                        e.sizset = x
                    }
                    if (e.nodeName.toLowerCase() === A) {
                        y = e;
                        break
                    }
                    e = e[v]
                }
                D[x] = y
            }
        }
    }
    function u(v, A, z, D, B, C) {
        for (var x = 0,
        w = D.length; x < w; x++) {
            var e = D[x];
            if (e) {
                e = e[v];
                var y = false;
                while (e) {
                    if (e.sizcache === z) {
                        y = D[e.sizset];
                        break
                    }
                    if (e.nodeType === 1) {
                        if (!C) {
                            e.sizcache = z;
                            e.sizset = x
                        }
                        if (typeof A !== "string") {
                            if (e === A) {
                                y = true;
                                break
                            }
                        } else {
                            if (b.filter(A, [e]).length > 0) {
                                y = e;
                                break
                            }
                        }
                    }
                    e = e[v]
                }
                D[x] = y
            }
        }
    }
    b.contains = document.compareDocumentPosition ?
    function(v, e) {
        return !! (v.compareDocumentPosition(e) & 16)
    }: function(v, e) {
        return v !== e && (v.contains ? v.contains(e) : true)
    };
    b.isXML = function(e) {
        var v = (e ? e.ownerDocument || e: 0).documentElement;
        return v ? v.nodeName !== "HTML": false
    };
    var h = function(e, B) {
        var x = [],
        y = "",
        z,
        w = B.nodeType ? [B] : B;
        while ((z = f.match.PSEUDO.exec(e))) {
            y += z[0];
            e = e.replace(f.match.PSEUDO, "")
        }
        e = f.relative[e] ? e + "*": e;
        for (var A = 0,
        v = w.length; A < v; A++) {
            b(e, w[A], x)
        }
        return b.filter(y, x)
    };
    return b
});
JFAST.register("dom.parent",function(a){
	var tagRegex=/([^\[]*)/,
	attrRegex=/\[([^\=]*)=([^\]]*)]/;
	 return function(el,check,endEl,lv){
	 	var tagMatch=tagRegex.exec(check),attrMatch=attrRegex.exec(check);

	 	if( (  (tagMatch && tagMatch[0] && el.tagName.toUpperCase()==tagMatch[1].toUpperCase())||!tagMatch )&&
	 		(  (attrMatch && attrMatch[0] && el.getAttribute(attrMatch[1])==attrMatch[2])||!attrMatch )
	 	){
	 		return el;
	 	}else if( (lv==undefined || lv++>0) && el!=endEl && el!=document.body){
	 		return JFAST.dom.parent(el.parentNode,check);
	 	}else{
	 		return false;
	 	}
	 }
});

JFAST.register("dom.builder",
function(a) {
	//取得html标签中有node-type属性的对象
    function getNodeTypeObj(m, f) {
        if (f) {
            return f
        }
        var e, h = /\<(\w+)[^>]*\s+node-type\s*=\s*([\'\"])?(\w+)\2.*?>/g;
        var g = {};
        var j, d, c;
        while ((e = h.exec(m))) {
            d = e[1];
            j = e[3];
            c = d + "[node-type=" + j + "]";
            g[j] = g[j] == null ? [] : g[j];
            if (!a.arr.inArray(c, g[j])) {
                g[j].push(d + "[node-type=" + j + "]");
            }
        }
        return g
    }
    return function(g, f) {
    	//判断g是不是字符串
        var isString = a.func.getType(g) == "string";
        //取得html标签中有node-type属性的对象
        var nodeType = getNodeTypeObj(isString ? g: g.innerHTML, f);
        
        var tplEl = g;
        if (isString) {
            tplEl = a.C("div");
            tplEl.innerHTML = g
        }
        
        var n, list, nodeTypeElArr;
        //取得node-type的DOM数组
        nodeTypeElArr = a.dom.sizzle("[node-type]", tplEl);
        list = {};
        for (n in nodeType) {
            list[n] = a.dom.sizzle.matches(nodeType[n].toString(), nodeTypeElArr);
        }
        var box = g;
        //如果传人的是字符串
        if (isString) {
            box = a.C("buffer");
            while (tplEl.children[0]) {
                box.appendChild(tplEl.children[0])
            }
        }
        return {
            box: box,
            list: list
        }
    }
});


JFAST.register("evt.preventDefault",
function(a) {
    return function(c) {
        var b = c ? c: a.evt.getEvent();
        if (a.IE) {
            b.returnValue = false
        } else {
            b.preventDefault()
        }
    }
});


JFAST.register("module.layer",function(a) {
	//取得隐藏和显示的elemtent的大小
    var getOffsetSize = function(el) {
        var size = {};
        if (el.style.display == "none") {
            el.style.visibility = "hidden";
            el.style.display = "";
            size.w = el.offsetWidth;
            size.h = el.offsetHeight;
            el.style.display = "none";
            el.style.visibility = "visible"
        } else {
            size.w = el.offsetWidth;
            size.h = el.offsetHeight
        }
        return size
    },
    //取得隐藏和显示的elemtent的位置
    getPosition = function(el, type) {
        type = type || "topleft";
        var pos = null;
        if (el.style.display == "none") {
            el.style.visibility = "hidden";
            el.style.display = "";
            pos = a.dom.position(el);
            el.style.display = "none";
            el.style.visibility = "visible"
        }else{
        	pos = a.dom.position(el);
        }
        if (type !== "topleft") {
            var size = getOffsetSize(c);
            if (type === "topright") pos.l = pos.l + size.w;
            else if (type === "bottomleft") pos.t = pos.t + size.h;
            else if (type === "bottomright") {
                pos.l = pos.l + size.w;
                pos.t = pos.t + size.h
            }
        }
        return pos
    };
    return function(d) {
    	//取得根节点的Element、node-type数组
        var e = a.dom.builder(d),
        outerEl = e.list.outer[0],
        innerEl = e.list.inner[0],
        uniqueID = a.dom.uniqueID(outerEl),
        //创建布局对象
        layer = {},
        evtIndex = a.evt.custEvent.define(layer, "show");
        a.evt.custEvent.define(evtIndex, "hide");
        var k = null;
        layer.show = function() {
            outerEl.style.display = "";
            a.evt.custEvent.fire(evtIndex, "show");
            return layer
        };
        layer.hide = function() {
            outerEl.style.display = "none";
            a.evt.custEvent.fire(evtIndex, "hide");
            return layer
        };
        layer.getPosition = function(a) {
            return getPosition(outerEl, a)
        };
        layer.getSize = function(a) {
            if (a || !k) k = getOffsetSize.apply(layer, [outerEl]);
            return k
        };
        layer.html = function(html) {
            html !== undefined && (innerEl.innerHTML = html);
            return innerEl.innerHTML
        };
        layer.text = function(b) {
            text !== undefined && (innerEl.innerHTML = a.str.encodeHTML(b));
            return a.str.decodeHTML(innerEl.innerHTML)
        };
        layer.appendChild = function(a) {
            innerEl.appendChild(a);
            return layer
        };
        layer.getUniqueID = function() {
            return uniqueID
        };
        layer.getOuter = function() {
            return outerEl
        };
        layer.getInner = function() {
            return innerEl
        };
        layer.getParentNode = function() {
            return outerEl.parentNode
        };
        layer.getDomList = function() {
            return e.list
        };
        layer.getDomListByKey = function(a) {
            return e.list[a]
        };
        layer.getDom = function(a, b) {
            return e.list[a] ? e.list[a][b || 0] : !1
        };
        layer.getCascadeDom = function(b, c) {
            return e.list[b] ? a.dom.cascadeNode(e.list[b][c || 0]) : !1
        };
        return layer
    }
});
JFAST.register("obj.sup",
function(a) {
    return function(f, c) {
        var e = {};
        for (var d = 0,
        b = c.length; d < b; d += 1) {
            if (typeof f[c[d]] !== "function") {
                throw "super need function list as the second paramsters"
            }
            e[c[d]] = (function(g) {
                return function() {
                    return g.apply(f, arguments)
                }
            })(f[c[d]])
        }
        return e
    }
});




JFAST.register("module.dialog",function(a) {
    return function(tpl, param) {
        if (!tpl) throw "module.dialog need template as first parameter";
        var layerParam, layer, dialog, outerEl, titleEl, innerEL, closeEl, titleContentEl, l, beforeHide,layerSup,closeFun;
        l = !0;
        var p = function() {
            l !== !1 && layer.hide()
        },
        init = function() {
            layerParam = a.obj.parseParam({
                t: null,
                l: null,
                width: null,
                height: null
            },
            param);
            //new layer
            layer = a.module.layer(tpl,layerParam);
            outerEl = layer.getOuter();
            titleEl = layer.getDom("title");
            titleContentEl = layer.getDom("title_content");
            innerEL = layer.getDom("inner");
            closeEl = layer.getDom("close");
            //添加关闭按钮事件
            a.evt.addEvent(closeEl, "click",function(b) {
                a.evt.preventDefault(b);
                closeFun();
                return ! 1
            });
            //添加显示订阅
            a.evt.custEvent.add(layer,"show",function() {
                a.evt.hotKey.add(document.documentElement, ["esc"], p, {
                    type: "keyup",
                    disableInInput: !0
                })
            });
             //添加隐藏订阅
            a.evt.custEvent.add(layer, "hide",function() {
                a.evt.hotKey.remove(document.documentElement, ["esc"], p, {
                    type: "keyup"
                });
                l = !0
            })
        };
        init();
        layerSup = a.obj.sup(layer, ["show", "hide"]);
        closeFun= function(b) {
            if (typeof m == "function" && !b && m() === !1) return ! 1;
            layerSup.hide();
            a.contains(document.body, layer.getOuter()) && document.body.removeChild(layer.getOuter());
            return dialog
        };
        
        dialog = layer;
        dialog.show = function() {
            a.contains(document.body, layer.getOuter()) || document.body.appendChild(layer.getOuter());
            layerSup.show();
            return dialog
        };

        dialog.hide =closeFun;
        dialog.setPosition = function(a) {
            outerEl.style.top = a.t + "px";
            outerEl.style.left = a.l + "px";
            return dialog
        };
        dialog.setMiddle = function() {
            var b = a.util.winSize(),
            c = layer.getSize(!0);
            outerEl.style.top = a.util.scrollPos().top + (b.height - c.h) / 2 + "px";
            outerEl.style.left = (b.width - c.w) / 2 + "px";
            return dialog
        };
        dialog.setTitle = function(a) {
            titleContentEl.innerHTML = a;
            return dialog
        };
        dialog.getTitle = function() {
            return titleContentEl.innerHTML
        };
        dialog.setContent = function(a) {
            typeof a == "string" ? innerEL.innerHTML = a: innerEL.appendChild(a);
            return dialog
        };
        dialog.clearContent = function() {
            while (innerEL.children.length) a.dom.removeNode(innerEL.children[0]);
            innerEL.innerHTML="";
            return dialog
        };
        dialog.setAlign = function() {};
        dialog.setBeforeHideFn = function(fun) {
            beforeHide = fun
        };
        dialog.clearBeforeHideFn = function() {
            beforeHide = null
        };
        dialog.unsupportEsc = function() {
            l = !1
        };
        dialog.supportEsc = function() {
            l = !0
        };
        return dialog
    }
});








JFAST.register("util.drag",
function(c) {
    var a = function(d) {
        d.cancelBubble = true;
        return false
    };
    //取得可视区域和整个页面的xy坐标
    var b = function(e, d) {
        e.clientX = d.clientX;
        e.clientY = d.clientY;
        e.pageX = d.clientX + c.util.scrollPos()["left"];
        e.pageY = d.clientY + c.util.scrollPos()["top"];
        return e
    };
    return function(e, p) {
        if (!c.dom.isNode(e)) {
            throw "util.drag need Element as first parameter"
        }
        var o = c.obj.parseParam({
            actRect: [],
            actObj: {}
        },
        p);
        var j = {};
        /*注册事件*/
        var m = c.evt.custEvent.define(o.actObj, "dragStart");
        var f = c.evt.custEvent.define(o.actObj, "dragEnd");
        var g = c.evt.custEvent.define(o.actObj, "draging");
        var n = function(r) {
            var q = b({},r);
            //禁止选中文字
            document.body.onselectstart = function() {
                return false
            };
            c.evt.addEvent(document, "mousemove", h);
            c.evt.addEvent(document, "mouseup", d);
            c.evt.addEvent(document, "click", a, true);
            if (!c.IE) {
                r.preventDefault();
                r.stopPropagation()
            }
            c.evt.custEvent.fire(m, "dragStart", q);
            return false
        };
        //鼠标点下
        var h = function(r) {
            var q = b({},r);
            r.cancelBubble = true;
            c.evt.custEvent.fire(m, "draging", q)
        };
        //鼠标弹起
        var d = function(r) {
            var q = b({},r);
            document.body.onselectstart = function() {
                return true
            };
            c.evt.removeEvent(document, "mousemove", h);
            c.evt.removeEvent(document, "mouseup", d);
            c.evt.removeEvent(document, "click", a, true);
            c.evt.custEvent.fire(m, "dragEnd", q);
        };
        c.evt.addEvent(e, "mousedown", n);
        j.destroy = function() {
            c.evt.removeEvent(e, "mousedown", n);
            o = null
        };
        j.getActObj = function() {
            return o.actObj
        };
        return j
    }
});

JFAST.register("util.pageSize",
function(a) {
	return function(b) {
		b ? target = b.document: target = document;
		var c = target.compatMode == "CSS1Compat" ? target.documentElement: target.body,
		d,
		e,
		f,
		g;
		if (window.innerHeight && window.scrollMaxY) {
			d = c.scrollWidth;
			e = window.innerHeight + window.scrollMaxY
		} else if (c.scrollHeight > c.offsetHeight) {
			d = c.scrollWidth;
			e = c.scrollHeight
		} else {
			d = c.offsetWidth;
			e = c.offsetHeight
		};
		var h = a.util.winSize(b);
		e < h.height ? f = h.height: f = e;
		d < h.width ? g = h.width: g = d;
		return {
			page: {
				width: g,
				height: f
			},
			win: {
				width: h.width,
				height: h.height
			}
		}
	}
});



JFAST.register("kit.dom.drag",
function(a) {
    return function(b, c) {
        var d, e, f, g, h, i, j, k, l = function() {
            m();
            n()
        },
        //添加初始化参数及样式
        m = function() {
            d = a.obj.parseParam({
                moveDom: b,
                perchStyle: "border:solid #999999 2px;",
                dragtype: "perch",
                actObj: {},
                pagePadding: 5
            },
            c);
            f = d.moveDom;
            e = {};
            g = {};
            //new drag对象
            h = a.util.drag(b, {
                actObj: d.actObj
            });
            if (d.dragtype === "perch") {
                i = a.C("div");
                j = !1;
                k = !1;
                f = i
            }
            b.style.cursor = "move"
        },
        //添加订阅
        n = function() {
            a.evt.custEvent.add(d.actObj, "dragStart", o);
            a.evt.custEvent.add(d.actObj, "dragEnd", p);
            a.evt.custEvent.add(d.actObj, "draging", q)
        },
        //移动开始
        o = function(c, e) {
            document.body.style.cursor = "move";
            var f = a.util.pageSize().page;
            g = a.dom.position(d.moveDom);
            g.pageX = e.pageX;
            g.pageY = e.pageY;
            g.height = d.moveDom.offsetHeight;
            g.width = d.moveDom.offsetWidth;
            g.pageHeight = f.height;
            g.pageWidth = f.width;
            if (d.dragtype === "perch") {
                var h = [];
                h.push(d.perchStyle);
                h.push("position:absolute");
                h.push("z-index:" + (d.moveDom.style.zIndex + 10));
                h.push("width:" + d.moveDom.offsetWidth + "px");
                h.push("height:" + d.moveDom.offsetHeight + "px");
                h.push("left:" + g.l + "px");
                h.push("top:" + g.t + "px");
                i.style.cssText = h.join(";");
                k = !0;
                setTimeout(function() {
                    if (k) {
                        document.body.appendChild(i);
                        j = !0
                    }
                },
                100)
            }
            b.setCapture !== undefined && b.setCapture();
        },
        //移动结束
        p = function(a, c) {
            document.body.style.cursor = "auto";
            b.setCapture !== undefined && b.releaseCapture();
            if (d.dragtype === "perch") {
                k = !1;
                d.moveDom.style.top = i.style.top;
                d.moveDom.style.left = i.style.left;
                if (j) {
                    document.body.removeChild(i);
                    j = !1
                }
            }
        },
        //移动中
        q = function(a, b) {
            var c = g.t + (b.pageY - g.pageY),
            e = g.l + (b.pageX - g.pageX),
            h = c + g.height,
            i = e + g.width,
            j = g.pageHeight - d.pagePadding,
            k = g.pageWidth - d.pagePadding;
            if (h < j && c > 0) f.style.top = c + "px";
            else {
                c < 0 && (f.style.top = "0px");
                h >= j && (f.style.top = j - g.height + "px")
            }
            if (i < k && e > 0) f.style.left = e + "px";
            else {
                e < 0 && (f.style.left = "0px");
                i >= k && (f.style.left = k - g.width + "px")
            }
        };
        l();
        //销毁
        e.destroy = function() {
            document.body.style.cursor = "auto";
            typeof f.setCapture == "function" && f.releaseCapture();
            if (d.dragtype === "perch") {
                k = !1;
                if (j) {
                    document.body.removeChild(i);
                    j = !1
                }
            }
            a.evt.custEvent.remove(d.actObj, "dragStart", o);
            a.evt.custEvent.remove(d.actObj, "dragEnd", p);
            a.evt.custEvent.remove(d.actObj, "draging", q);
            h.destroy && h.destroy();
            d = null;
            f = null;
            g = null;
            h = null;
            i = null;
            j = null;
            k = null
        };
        e.getActObj = function() {
            return d.actObj
        };
        return e
    }
});




JFAST.register("ui.markEdit",function(a){
	var tplMarkEdit='<div class="mke" node-type="outer"><div class="mke-Tab" node-type="inner"><ul node-type="tab"><li class="current"><a href="#" class="editBtn">编辑</a></li><li><a href="#" class="previewBtn">预览</a></li></ul></div><div class="mke-Data" node-type="data"><div class="edit"><div class="editTool"><a href="javascript:;" class="icon iconBold" title="粗体" node-type="boldBtn"></a><a href="javascript:;" class="icon iconCode" title="代码" node-type="codeBtn"></a><a href="javascript:;" class="icon iconFace" title="表情" node-type="phizBtn"></a><a href="javascript:;" class="icon iconLink" title="超级链接" node-type="linkBtn"></a><a href="javascript:;" class="icon iconNetImage" title="网络图片" node-type="netImageBtn"></a><a href="javascript:;" class="icon iconImage" title="上传图片" node-type="imageBtn"><span id="#{upImageSwfId}"></span></a><div class="mke-UpImgTip" node-type="upImageTip"></div></div><textarea node-type="textContent" name="#{textContent}" id="#{textContent}"></textarea></div><div class="preview"><div node-type="preview" class="mke-Content"></div></div></div></div>';
	return function(meEl,options){
		var markEdit={
			init:function(meEl,options){
				meEl=a.E(meEl);
				
				var me=this,
				layer = JF.kit.extra.reuse(function(){
					return JF.module.layer(JF.string.format(tplMarkEdit,{textContent:meEl.id,upImageSwfId:"upImageSwfId_"+(new Date()).getTime()}));
				}),
				layerOne = layer.getOne(),
				outerEl=layerOne.getDom("outer"),
				tabEl=layerOne.getDom("tab"),
				previewEl=layerOne.getDom("preview");
				dataEl=layerOne.getDom("data"),
				imageBtnEl=layerOne.getDom("imageBtn"),
				upImageTipEl=layerOne.getDom("upImageTip"),
				boldBtnEl=layerOne.getDom("boldBtn"),
				codeBtnEl=layerOne.getDom("codeBtn"),
				articleContentEl=layerOne.getDom("textContent"),
				phizBtnEl=layerOne.getDom("phizBtn"),
				netImageBtnEl=layerOne.getDom("netImageBtn"),
				linkBtnEl=layerOne.getDom("linkBtn");
				
				me._options=options;
				me._boldBtnEl=boldBtnEl;
				
				articleContentEl.value=meEl.value;
				meEl.parentNode.replaceChild(outerEl,meEl); 

				marked.setOptions({
				  gfm: true,
				  tables: true,
				  breaks: false,
				  pedantic: false,
				  sanitize: true,
				  smartLists: true,
				  langPrefix: 'language-',
				  highlight: function(code, lang) {
				    if (lang === 'js') {
				      return highlighter.javascript(code);
				    }
				    return code;
				  }
				});
				me._imgLazy=JF.ui.imgLazy();
				
				me._shareContentTabObj=JF.ui.tab({
						tabElement:tabEl,
						contentElement:dataEl,
						eventType:"onclick"
					},
					function(a,b,c,d){
						switch(b){
							case 0:
								break;
							case 1:
								var tokens = marked.lexer($E("circleContent.articleContent").value);
								previewEl.innerHTML=marked.parser(tokens);
								me._imgLazy.addArea(previewEl,function(el,width,height){
									var pWidth=620,
									pHeight=1500,
									imgNewWidth=0,
									imgNewHeight=0;
									if (width > 0 && height > 0) {
										var rate = 1;
										if (width > pWidth || height > pHeight) {
											if (pWidth / width < pHeight / height) {
												rate = pWidth / width;
											} else {
												rate = pHeight / height;
											}
										}
										imgNewWidth=Math.ceil(width * rate);
										imgNewHeight=Math.ceil(height * rate);
										el.width = imgNewWidth;
										el.height = imgNewHeight;
									}
								});
								
								break;
						}
				});
				
				me._articleContentEl=articleContentEl;
				

				
		        var evtIndex = a.evt.custEvent.define(layer, "change");
		        a.evt.custEvent.define(evtIndex, "select");
		        a.evt.custEvent.add(evtIndex, "change",function(){
		            me._onChange();
		        });
		        a.evt.custEvent.add(evtIndex, "select",function(){
		            me._onChange();
		        });
		        
		        me._evtIndex=evtIndex;
		        
				JF.evt.addEvent(articleContentEl,"select",function(){
					a.evt.custEvent.fire(evtIndex, "select");
				});
				JF.evt.addEvent(articleContentEl,"click",function(){
					a.evt.custEvent.fire(evtIndex, "select");
					return ! 1
				});
				JF.evt.addEvent(articleContentEl,"keyup",function(){
					a.evt.custEvent.fire(evtIndex, "change");
				});
				JF.evt.addEvent(articleContentEl,"propertychange",function(){
					a.evt.custEvent.fire(evtIndex, "change");
				});
				
				me.bold.init(evtIndex,boldBtnEl,articleContentEl);
				me.uploadImage.init(evtIndex,imageBtnEl,upImageTipEl,articleContentEl,options.tool.uploadImage);
				me.code.init(evtIndex,codeBtnEl,articleContentEl);
				me.phiz.init(evtIndex,phizBtnEl,articleContentEl);
				me.netImage.init(evtIndex,netImageBtnEl);
				me.link.init(evtIndex,linkBtnEl,articleContentEl);
				
				me.selection.init(evtIndex,articleContentEl);
			},
			_onChange:function(){
				var me=this;
				me._options.onChange&&me._options.onChange();
			},
			setText:function(v){
				this._articleContentEl.value=v;
			},
			text:function(){
				return this._articleContentEl.value;
			},
			getImg:function(){
				var imgArr=[],paragraphImgArr=[],attrArr=[],tokens = marked.lexer(markEdit.text());
				for(var i=0,iLen=tokens.length;i<iLen;i++){
					if(tokens[i].type=="paragraph"){
						paragraphImgArr=tokens[i].text.match(/\!\[.*?\]\(.*?\)/g);
						if(paragraphImgArr!=null){
							for(var j=0,jLen=paragraphImgArr.length;j<jLen;j++){
								attrArr=paragraphImgArr[j].match(/\!\[(.*?)\]\((.*?)\)/);
								imgArr.push({alt:attrArr[1],url:attrArr[2]});
							}
						}
					}
				}
				return imgArr;
			}
		};
		
		markEdit.selection={
			_contentEl:null,
			init:function(evtIndex,contentEl) {
				var me=this,range;
				me._evtIndex=evtIndex;
				me._contentEl=contentEl;
				if(JF.IE){
					setTimeout(function(){
						me._contentEl.focus();
						var range=document.selection.createRange();
						range.select();
						range.moveStart('character',contentEl.value.length);
				        a.evt.custEvent.add(evtIndex, "select",function(){
				            me._range=document.selection.createRange();
				        });
				        me._range=range;
				        me._contentEl.blur();
				       },1);
				}else{
					contentEl.selectionStart=contentEl.selectionStart=contentEl.value.length;
				}
			},
			focus:function(){
				this._contentEl.focus();
				if(JF.IE){this._range.select();}
			},
			getText:function(){
				var contentEl=this._contentEl;
				if(JF.IE){
					return this._range.text;
				}else if(typeof contentEl.selectionStart === 'number' && typeof contentEl.selectionEnd === 'number') {
			        var tmpStr = contentEl.value;
			    	return tmpStr.substring(contentEl.selectionStart, contentEl.selectionEnd);
		    	}
			},
			setText:function(v,selected){
				var me=this,
				range=me._range,
				contentEl=me._contentEl,
				oldValue=contentEl.value;
				contentEl.focus();
		        if(JF.IE){
					range.text=v;
					if(selected){
						range.moveStart("character", -1*v.length);
					}
					range.select();
		        }else if(typeof contentEl.selectionStart === 'number' && typeof contentEl.selectionEnd === 'number') {
			        var startPos = contentEl.selectionStart,
			            endPos = contentEl.selectionEnd,
			            tmpStr = contentEl.value;
			    	contentEl.value=tmpStr.substring(0, startPos) + v + tmpStr.substring(endPos, tmpStr.length);
			    	if(selected){
				    	contentEl.selectionStart=startPos;
				        contentEl.selectionEnd=startPos+v.length;
			        }else{
				    	contentEl.selectionStart=contentEl.selectionEnd=startPos+v.length;
			        }
		    	}
		    	if(oldValue!=contentEl.value){
		    		a.evt.custEvent.fire(me._evtIndex,"select");
		    		a.evt.custEvent.fire(me._evtIndex,"change");
		    	}
			}
		};
		
		markEdit.uploadImage={
			init:function(evtIndex,upImgBtnEl,tipEl,textAreaEl,options){
				var me=this,layer,layerOne,listEl,opEl,okEl,cancelEl;
				me._tipEl=tipEl;
				tpl = '<div node-type="outer" class="upImageArea markEditWin"><div class="clearfix"><ul node-type="inner"></ul></div><div class="op clearfix" node-type="op"><a href="javascript:;" node-type="ok" class="ok"><span>确定</span></a><a href="javascript:;" node-type="cancel" class="cancel"><span>取消</span></a></div></div>';
				layer = JF.kit.extra.reuse(function(){
					return JF.module.layer(tpl);
				});
				layerOne = layer.getOne();
				listEl=layerOne.getDom("inner");
				opEl=layerOne.getDom("op");
				okEl=layerOne.getDom("ok");
				cancelEl=layerOne.getDom("cancel");
				
				me._dialog = JF.ui.dialog({isHold:true});
				me._dialog.setTitle("上传图片");
				me._dialog.setContent(layerOne.getOuter());
		        JF.evt.custEvent.add(me._dialog, "hide",function() {
		            markEdit.selection.focus();
		            listEl.innerHTML="";
		            opEl.style.display="none";
		        })
				
				me._uploadifySwf=JF.ui.uploadify(upImgBtnEl.firstChild.id,
					{
						'scriptData' :options.data,
						'script'         :options.action,
						'fileDataName':options.fileDataName,
						'method':'POST',
						'width':'20',
						'height':'20',
						'auto' :'true',
						'swf':'/uploadcomponent/uploadify.swf',
						'fileExt':'*.png;*.gif;*.jpg;*.jpeg',
						'fileDesc':'图片文件(*.png;*.gif;*.jpg;*.jpeg)',
						'multi':'true',
						'hideButton':'true',
						'queueSizeLimit':'15',
						'sizeLimit':'2097152',
						'onCheckFileListLength':function(size){
							var imgLen=markEdit.getImg().length,maxImgLen=15-imgLen;
							if(size>maxImgLen){
								JF.ui.alert('最多还能上传'+maxImgLen+'张图片，'+'正文中已上传'+imgLen+'张图片',{title:"错误",icon:'error'});
								return false;
							}else{
								return true;
							}
						},
						'onSelect':function(id,fileObj){
							var liEle=$C('li');
							liEle.className='uploading';
							listEl.appendChild(liEle);
							liEle.setAttribute('id',id);
							fileObj = eval("("+fileObj+")");
							var byteSize = Math.round(fileObj.size / 1024 * 100) * .01;
							var suffix = 'KB';
							if (byteSize > 1000) {
								byteSize = Math.round(byteSize *.001 * 100) * .01;
								suffix = 'MB';
							}
							var sizeParts = byteSize.toString().split('.');
							if (sizeParts.length > 1) {
								byteSize = sizeParts[0] + '.' + sizeParts[1].substr(0,2);
							} else {
								byteSize = sizeParts[0];
							}
							var fileName;
							if (fileObj.name.length > 6) {
								fileName = fileObj.name.substr(0,6) + '...';
							} else {
								fileName = fileObj.name;
							}
			
							liEle.innerHTML='<div class="uploading"><div class="txt"><em></em>'+byteSize+' KB...</div><div class="bar"><span id="bar_'+id+'"></span></div></div>';
							
							me.show();
						},
						'onComplete':function(id,file,response){
							var response = eval("("+unescape(response)+")"),
							liEle=$E(id);
							liEle.className='';
							liEle.innerHTML='<a href="javascript:;" class="del" op="del"></a><div class="photo"><img src="/images/img_login.gif" lazysrc="/timg/'+response.enjoyFile[0].fid+'.jpg" border="0"></div><input type="text" name="imgstitle"/><input type="hidden" name="imags" value="'+response.enjoyFile[0].fid+'" />';
							JF.ui.imgLazy().addImg(liEle.firstChild.nextSibling.firstChild);
						},
						'onProgress':function(id,f,d){
							d = eval("("+d+")");
							$E('bar_'+id).style.width=d.percentage+'%';
						},
						'onError':function(id,f,d){
							d = eval("("+d+")");
							var s;
							if(d.type=='File Size'){
								s='文件大小不能超过2M';
							}else{
								s='文件上传出错，请稍后尝试';
							}
							$E(id).innerHTML='<div class="error"><em></em>'+s+'</div><a op="del" class="del" href="javascript:;"></a>';
						},
						'onAllComplete':function(id,f,d){
							opEl.style.display="block";
						}
					}
				);
				
				JF.evt.addEvent(listEl,"click",function(e){
					var t=e.srcElement||e.target;
					if(t.getAttribute('op')=='del'){
						JF.dom.removeNode(t.parentNode);
					}
				});
				
				
				JF.evt.addEvent(okEl,"click",function(){
					var imgSrc="";
					altEls=document.getElementsByName("imgstitle"),
					idEls=document.getElementsByName("imags");
					for(var i=0,iLen=altEls.length;i<iLen;i++){
						imgSrc+="!["+altEls[i].value+"](/img/"+idEls[i].value+".jpg)\r\r";
					}
					markEdit.selection.setText(imgSrc);
					me.hide();
					return false;
				});
				JF.evt.addEvent(cancelEl,"click",function(){
					me.hide();
					return false;
				});
				
		        a.evt.custEvent.add(evtIndex, "change",function(){
		        	me._tipQtyChange();
		        });
		        
		        me._tipQtyChange();
			},
			show:function(){
				this._dialog.show().setMiddle();
			},
			hide:function(){
				this._dialog.hide();
			},
			_tipQtyChange:function(){
				var me=this,
				imgLen=markEdit.getImg().length;
				if(imgLen==0){
					me._tipEl.innerHTML='最多可上传<span class="qty">15</span>图片';
				}else{
					me._tipEl.innerHTML='最多还能上传<span class="qty">'+(15-imgLen)+'</span>张图片，'+'正文中已上传'+imgLen+'张图片';
				}
			}
		};
		
		markEdit.bold={
			init:function(evtIndex,boldBtnEl,articleContentEl){
				var me=this;
				me._boldBtnEl=boldBtnEl;
				
				JF.evt.addEvent(boldBtnEl,"click",function(){
					var selStr=markEdit.selection.getText();
					if(selStr.length>0){
						if((/^\*\*(.*?)\*\*$/).exec(selStr)!=null){
					   		markEdit.selection.setText(selStr.replace(/^\*\*|\*\*$/g,""),!0);
						}else{
					   		markEdit.selection.setText("**"+selStr+"**",!0);
					   	}
						me._changeBoldStatus();
				   	}
				   	return ! 1
				});
		        a.evt.custEvent.add(evtIndex, "select",function(){
		            me._changeBoldStatus();
		        });
			},
			_changeBoldStatus:function(){
				var me=this;
				if((/^\*\*(.*?)\*\*$/).exec(markEdit.selection.getText())!=null){
					JF.dom.addClass(me._boldBtnEl,"selected");
				}else{
					JF.dom.removeClass(me._boldBtnEl,"selected");
				}
			}
		};
		
		markEdit.code={
			init:function(evtIndex,codeBtnEl){
				var me=this,layer,layerOne,codeContentEl,formatEl,okEl,cancelEl;
				tpl = '<div node-type="outer" class="codeArea markEditWin"><dl node-type="inner" class="clearfix"><dt>代码</dt><dd>'+JF.fui.textArea.getUiHtml({"node-type":"codeContent",style:"width:700px"})+'</dd></dl><div class="op clearfix"><a href="javascript:;" node-type="format"><span>格式化代码</span></a><a href="javascript:;" node-type="ok" class="ok"><span>确定</span></a><a href="javascript:;" node-type="cancel" class="cancel"><span>取消</span></a></div></div>';
				layer = JF.kit.extra.reuse(function(){
					return JF.module.layer(tpl);
				});
				layerOne = layer.getOne();
				codeContentEl=layerOne.getDom("codeContent");
				okEl=layerOne.getDom("ok");
				cancelEl=layerOne.getDom("cancel");
				formatEl=layerOne.getDom("format");
				
				me._dialog = JF.ui.dialog({isHold:true});
				me._dialog.setTitle("插入代码");
				me._dialog.setContent(layerOne.getOuter());
		        JF.evt.custEvent.add(me._dialog, "hide",function() {
		            markEdit.selection.focus();
		        })
		
				JF.evt.addEvent(codeBtnEl,'click',function(){
					me.show();
					return ! 1
				});
				
				JF.evt.addEvent(formatEl,"click",function(){
					var js_source = codeContentEl.value.replace(/^\s+/, ''),
					tabsize = 4,
					tabchar = ' ';
					if (tabsize == 1) {
						tabchar = '\t';
					}
					if (js_source && js_source.charAt(0) === '<') {
						codeContentEl.value = style_html(js_source, tabsize, tabchar, 80);
					} else {
						codeContentEl.value = js_beautify(js_source, tabsize, tabchar);
					}
					return ! 1
				});	
				
				JF.evt.addEvent(okEl,"click",function(){
					markEdit.selection.setText("\r\r    "+codeContentEl.value.replace(/\rn/gi,"\rn    ").replace(/\r/gi,"\r    ").replace(/\n/gi,"\r    "));
					codeContentEl.value="";
					me.hide();
					return ! 1
				});
				JF.evt.addEvent(cancelEl,"click",function(){
					me.hide();
					codeContentEl.value="";
					return ! 1
				});
			},
			show:function(){
				this._dialog.show().setMiddle();
			},
			hide:function(){
				this._dialog.hide();
			}
		};
		
		markEdit.link={
			init:function(evtIndex,linkBtnEl,textAreaEl){
				var me=this,layer,layerOne,linkTextEl,linkUrlEl,okEl,cancelEl;
				
				tpl = '<div node-type="outer" class="linkArea markEditWin"><dl node-type="inner" class="clearfix"><dt>链接文字</dt><dd>'+JF.fui.text.getUiHtml({"node-type":"linkText",style:"width:358px"})+'</dd><dt>链接URL</dt><dd>'+JF.fui.textArea.getUiHtml({"node-type":"linkUrl",style:"width:358px"})+'</dd></dl><div class="op clearfix"><a href="javascript:;" node-type="ok" class="ok"><span>确定</span></a><a href="javascript:;" node-type="cancel" class="cancel"><span>取消</span></a></div></div>';
				layer = JF.kit.extra.reuse(function(){
					return JF.module.layer(tpl);
				});
				layerOne = layer.getOne();
				linkUrlEl=layerOne.getDom("linkUrl");
				me._linkUrlEl=linkUrlEl;
				linkTextEl=layerOne.getDom("linkText");
				me._linkTextEl=linkTextEl;
				okEl=layerOne.getDom("ok");
				cancelEl=layerOne.getDom("cancel");
				
				me._dialog = JF.ui.dialog({isHold:true});
				me._dialog.setContent(layerOne.getOuter());
		        JF.evt.custEvent.add(me._dialog, "hide",function() {
		             markEdit.selection.focus();
		        })
				
		
				JF.evt.addEvent(linkBtnEl,'click',function(){
					var linkTextStr="",
					linkUrlStr="",
					selText=markEdit.selection.getText(textAreaEl),
					execArr,
					reUrl=/^\[(.*?)\]\(([^\)]*)\)$/;
					if(selText!=null && selText.length>0){
						execArr=reUrl.exec(selText);
						if(execArr!=null && execArr.length==3){
							linkTextStr=execArr[1];
							linkUrlStr=execArr[2];
						}else{
							linkTextStr=selText;
						}
						me._dialog.setTitle("替换链接");
					}else{
						me._dialog.setTitle("插入链接");
					}
					me.setLinkText(linkTextStr);
					me.setLinkUrl(linkUrlStr);
					me.show();
					return ! 1
				});
				
		
				
				JF.evt.addEvent(okEl,"click",function(){
					markEdit.selection.setText("["+linkTextEl.value+"]("+linkUrlEl.value+")");
					me.hide();
					return ! 1
				});
				JF.evt.addEvent(cancelEl,"click",function(){
					me.hide();
					return ! 1
				});
			},
			setLinkText:function(v){
				this._linkTextEl.value=v;
			},
			setLinkUrl:function(v){
				this._linkUrlEl.value=v;
			},
			show:function(){
				this._dialog.show().setMiddle();
			},
			hide:function(){
				this._dialog.hide();
			}
		};
		
		
		markEdit.phiz={
			status:'hidd',
			init:function(evtIndex,phizBtnEl,textAreaEl){
				var me=this;
				
				//初始化表情
				var phizEle=$C('div');
				document.body.appendChild(phizEle);
				phizEle.className='phizArea';
				phizEle.innerHTML='<span style="zoom:1;widht:0px;height:0px;overflow:hidden"></span><em></em><a title="[微笑]" href="javascript:;"><img title="[微笑]" src="/images/faces/wx.gif"></a><a title="[爱心]" href="javascript:;"><img title="[爱心]" src="/images/faces/ax.gif"></a><a title="[亲亲]" href="javascript:;"><img title="[亲亲]" src="/images/faces/qq.gif"></a><a title="[可爱]" href="javascript:;"><img title="[可爱]" src="/images/faces/ka.gif"></a><a title="[鼻涕]" href="javascript:;"><img title="[鼻涕]" src="/images/faces/bt.gif"></a><a title="[哭泣]" href="javascript:;"><img title="[哭泣]" src="/images/faces/kq.gif"></a><a title="[奸笑]" href="javascript:;"><img title="[奸笑]" src="/images/faces/jx.gif"></a><a title="[可怜]" href="javascript:;"><img title="[可怜]" src="/images/faces/kl.gif"></a><a title="[流汗]" href="javascript:;"><img title="[流汗]" src="/images/faces/lh.gif"></a><a title="[抓狂]" href="javascript:;"><img title="[抓狂]" src="/images/faces/zk.gif"></a><a title="[挖鼻]" href="javascript:;"><img title="[挖鼻]" src="/images/faces/wb.gif"></a><a title="[不屑]" href="javascript:;"><img title="[不屑]" src="/images/faces/bx.gif"></a><a title="[疑问]" href="javascript:;"><img title="[疑问]" src="/images/faces/yw.gif"></a><a title="[鄙视]" href="javascript:;"><img title="[鄙视]" src="/images/faces/bs.gif"></a><a title="[生气]" href="javascript:;"><img title="[生气]" src="/images/faces/sq.gif"></a><a title="[惊讶]" href="javascript:;"><img title="[惊讶]" src="/images/faces/jy.gif"></a><a title="[囧]" href="javascript:;"><img title="[囧]" src="/images/faces/jong.gif"></a><a title="[黑线]" href="javascript:;"><img title="[黑线]" src="/images/faces/hx.gif"></a><a title="[和尚]" href="javascript:;"><img title="[和尚]" src="/images/faces/hs.gif"></a><a title="[寒]" href="javascript:;"><img title="[寒]" src="/images/faces/han.gif"></a>';
		
				JF.evt.addEvent(phizBtnEl,'click',function(){
					if(me.status=='hidd'){
						me.status='show';
						phizEle.style.display='block';
						var pos=JF.dom.position(phizBtnEl);
						phizEle.style.top=(pos.t+phizBtnEl.clientHeight+10)+'px';
						phizEle.style.left=(pos.l-12)+'px';
					}else{
						me.status='hidd';
						phizEle.style.display='none';
					}
					return ! 1
				});
		
				
				JF.evt.addEvent(phizBtnEl,'blur',function(){
					me.status='hidd';
					phizEle.style.display='none';
				});
				
				JF.evt.addEvent(phizEle,'mousedown',function(e){
					var t=e.srcElement||e.target;
					markEdit.selection.setText(t.title);
					me.status='hidd';
					phizEle.style.display='none';
					return ! 1
				});

			}
		};
		
		markEdit.netImage={
			status:'hidd',
			_tpl:'<div node-type="outer" class="netImageArea markEditWin"><dl node-type="inner" class="clearfix"><dt>网络图片地址</dd><dd>'+JF.fui.textArea.getUiHtml({"node-type":"url",style:"width:358px"})+'</dd><dt>图片描述</dt><dd>'+JF.fui.text.getUiHtml({"node-type":"alt",style:"width:358px"})+'</dd></dl><div class="op clearfix"><a href="javascript:;" node-type="ok" class="ok"><span>确定</span></a><a href="javascript:;" node-type="cancel" class="cancel"><span>取消</span></a></div></div>',
			init:function(evtIndex,netImageBtnEl,textAreaEl){
				var me=this,layer,layerOne,urlEl,altEl,okEl,cancelEl;
				
				layer = JF.kit.extra.reuse(function(){
					return JF.module.layer(me._tpl);
				});
				layerOne = layer.getOne();
				urlEl=layerOne.getDom("url");
				me._urlEl=urlEl;
				altEl=layerOne.getDom("alt");
				me._altEl=altEl;
				okEl=layerOne.getDom("ok");
				cancelEl=layerOne.getDom("cancel");
		
				me._dialog = JF.ui.dialog({isHold:true});
				me._dialog.setContent(layerOne.getOuter());
		        JF.evt.custEvent.add(me._dialog, "hide",function() {
		             markEdit.selection.focus();
		        })
				
				JF.evt.addEvent(netImageBtnEl,'click',function(){
					var utlStr="",
					altStr="",
					selText=markEdit.selection.getText(textAreaEl),
					execArr,
					reUrl=/^\!\[(.*?)\]\(([^\)]*)\)$/;
					if(selText!=null && selText.length>0){
						execArr=reUrl.exec(selText);
						if(execArr!=null && execArr.length==3){
							altStr=execArr[1];
							utlStr=execArr[2];
						}else{
							linkTextStr="";
						}
						me._dialog.setTitle("替换网络图片");
					}else{
						me._dialog.setTitle("插入网络图片");
					}
					me.setAlt(altStr);
					me.setUrl(utlStr);
					me.show();
					return ! 1
				});
				
				JF.evt.addEvent(okEl,"click",function(){
					markEdit.selection.setText("!["+altEl.value+"]("+urlEl.value+")");
					me.hide();
					return ! 1
				});
				JF.evt.addEvent(cancelEl,"click",function(){
					me.hide();
					return ! 1
				});
			},
			setAlt:function(v){
				this._altEl.value=v;
			},
			setUrl:function(v){
				this._urlEl.value=v;
			},
			show:function(){
				this._dialog.show().setMiddle();
			},
			hide:function(){
				this._dialog.hide();
			}
		};
		markEdit.init(meEl,options);
		return markEdit;
	}
});


JFAST.register("ui.uploadify",function(a){
	var uploadifyObj={};
	return function(id,options){
		var uploadify=uploadifyObj[id];
		if(typeof uploadify=="undefined"){
			uploadify={
					id:'', // The ID of the object being Uploadified
					swf        		: '/uploadcomponent/uploadify.swf', // The path to the uploadify swf file
					script          : '', // The path to the uploadify backend upload script
					expressInstall  : null, // The path to the express install swf file
					folder          : '', // The path to the upload folder
					height          : 30, // The height of the flash button
					width           : 120, // The width of the flash button
					buttonHide      : false,
					cancelImg       : '', // The path to the cancel image for the default file queue item container
					wmode           : 'transparent', //'opaque', // The wmode of the flash file
					scriptAccess    : 'sameDomain', // Set to "always" to allow script access across domains
					fileDataName    : 'Filedata', // The name of the file collection object in the backend upload script
					method          : 'POST', // The method for sending variables to the backend upload script
					scriptData:{},
					multi:false,
					auto:true,
					checkFileListLength : 1,
					queueSizeLimit  : 6, // The maximum size of the file queue
					simUploadLimit  : 1, // The number of simultaneous uploads allowed
					queueID         : false, // The optional ID of the queue container
					displayData     : 'percentage', // Set to "speed" to show the upload speed in the default queue item
					removeCompleted : true, // Set to true if you want the queue items to be removed when a file is done uploading
					onInit          : function() {}, // Function to run when uploadify is initialized
					onSelect        : function() {}, // Function to run when a file is selected
					onCheckFileListLength : function() {return true},
					onUploadifyOpen : function(){},
					onSelectOnce    : function() {}, // Function to run once when files are added to the queue
					onQueueFull     : function() {}, // Function to run when the queue reaches capacity
					onCheck         : function() {}, // Function to run when script checks for duplicate files on the server
					onCancel        : function() {}, // Function to run when an item is cleared from the queue
					onClearQueue    : function() {}, // Function to run when the queue is manually cleared
					onError         : function() {}, // Function to run when an upload item returns an error
					onProgress      : function() {}, // Function to run each time the upload progress is updated
					onComplete      : function() {}, // Function to run when an upload is completed
					onAllComplete   : function() {}  // Function to run when all uploads are completed
			};
			uploadify.id=id;
			uploadify= a.obj.parseParam(uploadify,options);
			if (uploadify.scriptData) {
				var scriptDataString = '';
				for (var name in uploadify.scriptData) {
					scriptDataString += '&' + name + '=' + uploadify.scriptData[name];
				}
				uploadify.scriptData = escape(scriptDataString.substr(1));
			}
			uploadify.setScriptData=function(settingValue) {
				var returnValue = false;
				if (settingValue != null) {
					var scriptDataString = '';
					for (var name in settingValue) {
						scriptDataString += '&' + name + '=' + settingValue[name];
					}
					uploadify.scriptData = escape(scriptDataString.substr(1));
					var paramEls=$E(uploadify.id).getElementsByTagName("param"),
					paramLen=paramEls.length;
					for(var i=0;i<paramLen;i++){
						if(paramEls[i].name=="scriptData"){
							paramEls[i].value=uploadify.scriptData;
						}
					}
				}
				
			};

			uploadifyObj[uploadify.id]=uploadify;
			
			
			paramObj={
					id				:uploadify.id,
					swf        		:uploadify.swf,
					script          :uploadify.script,
					expressInstall  :uploadify.expressInstall,
					folder          :uploadify.folder,
					height          :uploadify.height,
					width           :uploadify.width,
					buttonHide      :uploadify.buttonHide,
					cancelImg       :uploadify.cancelImg,
					wmode           :uploadify.wmode,
					scriptAccess    :uploadify.scriptAccess,
					fileDataName    :uploadify.fileDataName,
					method          :uploadify.method,
					scriptData		:uploadify.scriptData,
					multi			:uploadify.multi,
					auto			:uploadify.auto,
					checkFileListLength :uploadify.checkFileListLength,
					queueSizeLimit  :uploadify.queueSizeLimit,
					simUploadLimit  :uploadify.simUploadLimit,
					queueID         :uploadify.queueID,
					displayData     :uploadify.displayData,
					removeCompleted :uploadify.removeCompleted
			}
			
			
			swfobject.embedSWF(uploadify.swf,uploadify.id,uploadify.width,uploadify.height,"10.0.0",null,paramObj,paramObj);
		}
		return uploadify;
	}
});


JFAST.register("ui.tip",function(a){
	return function(el,options){
		var tip={
			options: {
				errorCode:null,
				type:"",
				contentType:"text",
				msg:null,
				animateTime:500,
				showTime:1000,
				button:null,
				tipClass:null,
				maxLength:null,
				btnConfirmText:""
			},
			drawLayer: function(){
				var me = this,
				options = me.options,
				el = me.el;
				var outerEl = a.C("div"),innerEl = a.C("div"),arrowEl=a.C("div"),iconEl=a.C("div");
				me._outerEl=outerEl;
				a.dom.addClass(iconEl,"tipIcon");
				a.dom.addClass(outerEl,"tipLayer");
				!options.tipClass||a.dom.addClass(outerEl,options.tipClass);
				me.outerEl=outerEl;
				innerEl.className="tipContent";
				arrowEl.className="tipArrow";
				outerEl.appendChild(iconEl);
				outerEl.appendChild(innerEl);
				outerEl.appendChild(arrowEl);
				innerEl.innerHTML=options.msg;
				document.body.appendChild(outerEl);
				arrowEl.style.left=(outerEl.offsetWidth / 2 - 5) + "px";
				outerEl.style.cssText="left:" + (a.dom.position(el).l - (outerEl.offsetWidth - el.offsetWidth) / 2) + "px;top:" + a.dom.position(el).t + "px";
			},
			tipup:function(e) {
				var f = this,
				d = f.options,
				c = f.element;
				if (f.show) {
					return
				}
				if (typeof e === "string") {
					d.msg = e
				} else {
					a.extend(f.options, e)
				}
				if (f.show) {
					return
				}
				this.drawLayer();
				if (d.button) {
					f.preventHide = true
				}
				this._bindEvent();
				return false
			},
			hideForDocument: function() {
				if (!this.preventHide) {
					this.tiphide(0)
				}
			},
			hide: function() {
				this.$tip.hide();
				this.show = false;
				this.destroy()
			},
			tiphide: function(c) {
				
			},
			_bindEvent: function() {
				var me = this,
				options = me.options,
				el = me.el;
				a.amt.animate(me.outerEl,{top:(a.dom.position(me.outerEl).t),opacity:70},{top:(a.dom.position(me.outerEl).t-me.outerEl.offsetHeight-el.offsetHeight),opacity:1},options.animateTime,function(){
					me.outerEl.style.filter="";
					setTimeout(function(){
						a.amt.animate(me.outerEl,{top:(a.dom.position(me.outerEl).t),opacity:1},{top:(a.dom.position(me.outerEl).t-50),opacity:0},options.animateTime,function(){
							me.destroy();
						});
					},options.showTime);
				});

			},
			destroy: function() {
				a.dom.removeNode(this._outerEl);
			}
		};
		tip.el=a.E(el);
		tip.options= a.obj.parseParam(tip.options,options);
		return tip;
	}
});


JFAST.register("ui.clientTip",function(a){
	return function(options){
		var clientTip={
			options: {
				type:"",
				msg:"",
				animateShowTime:300,
				animateHideTime:200,
				showTime:2000
			},
			drawLayer: function(){
				var me = this,
				options = me.options,
				el = me.el;
				var outerEl = a.C("div");
				me.outerEl=outerEl;
				outerEl.className="clientTip "+(options.type=="success"?"clientTipSuccess":"clientTipError");
				outerEl.innerHTML=options.msg;
				document.body.appendChild(outerEl);
			},
			show:function(p) {
				var me = this;
				if (typeof p === "string") {
					me.options.msg = p
				} else {
					me.options=a.obj.parseParam(me.options,p);
				}
				me.drawLayer();
				me._bindEvent();
				return false
			},
			hide: function() {
				this.destroy()
			},
			_bindEvent: function() {
				var me = this,
				options = me.options,
				left=a.util.pageSize().page.width/2+100,
				top=0;
				if(a.util.browser.IE6){
					top=JF.dom.scroll().top
				}
				me.outerEl.style.left=left+"px";
				a.amt.animate(me.outerEl,{top:top+100,opacity:0.5},{top:top+"px",opacity:1},options.animateShowTime,function(){
					me.outerEl.style.filter="";
					setTimeout(function(){
						a.amt.animate(me.outerEl,{top:top,opacity:1},{top:top-50+"px",opacity:0},options.animateHideTime,function(){
							me.destroy();
						});
					},options.showTime);
				});
			},
			destroy: function() {
				a.dom.removeNode(this.outerEl);
			}
		};
		clientTip.options=a.obj.parseParam(clientTip.options,options);
		return clientTip;
	}
});


JFAST.register("ui.tab",function(a) {
	return function(e, t){
		var tab={
			init: function(e, t) {
		        this.onchange = t || null,
		        this.setOptions(e),
		        this.bind();
		    },
		    setOptions: function(e) {
		        this.tabElement = e.tabElement || null,
		        this.contentElement = e.contentElement || null,
		        this.currentClass = e.currentClass || "current",
		        this.eventType = e.eventType || "onclick",
		        this.defaultIndex = e.defaultIndex || 0,
		        this.deferTime = Math.abs(e.deferTime) || 0,
		        this.mateAttribute = e.mateAttribute || null,
		        this.tabTimer = null,
		        this.targetCache = null,
		        this.instance = []
		    },
		    bind: function() {
		        var e = this.tabElement.children,
		        t = this.contentElement.children,
		        n = e.length,
		        r = this,
		        i = (this.defaultIndex % n + n) % n;
		        //if (n != t.length) throw new Error("tabs numbers or contents numbers erorr!");
		        for (; n--;) if (this.mateAttribute) {
		            var s = t.length,
		            o = e[n].getAttribute(this.mateAttribute);
		            while (s--) if (t[s].getAttribute(this.mateAttribute) == o) {
		                e[n].setAttribute("index", s);
		                break
		            }
		        } else e[n].setAttribute("index", n);
		        a.dom.addClass(e[i],r.currentClass);
		        var u = e[i].getAttribute("index");
		        t[u].style.display = "block",
		        this.targetCache = e[i],
		        r.onchange && r.onchange(r, i, e[i], t[u]),
		        this.tabElement[this.eventType] = function(e) {
		            e = e || window.event;
		            var n = e.target || e.srcElement;
		            if (this == n.parentNode.parentNode){
		            	n=n.parentNode;
		            }else if (this == n.parentNode.parentNode.parentNode){
		            	n=n.parentNode.parentNode;
		            }else{
		            	return false;
		            }
		            "function" == typeof e.preventDefault ? (e.preventDefault(), e.stopPropagation()) : (e.returnValue = !1, e.cancelBubble = !0);
		            return n.getAttribute("index")!=r.targetCache.getAttribute("index")&&r.currentIndex(n.getAttribute("index")),!1;
		        },
		        r.deferTime > 0 && (r.tabElement.onmouseout = function() {
		            window.clearTimeout(r.tabTimer)
		        })
		    },
			currentIndex:function(index){
				var me=this,
				cacheIndex = me.targetCache.getAttribute("index");
				window.clearTimeout(me.tabTimer);
	            me.tabTimer = window.setTimeout(function() {
                    var tabs=me.tabElement.children,
                    tabs=me.tabElement.children,
                    contents=me.contentElement.children;
                    a.dom.addClass(tabs[index],me.currentClass);
	                contents[index].style.display = "block";
	                cacheIndex!=index&&(a.dom.removeClass(me.targetCache,me.currentClass),
	                contents[cacheIndex].style.display = "none",
	                me.targetCache = tabs[index]);
	                me.onchange && me.onchange(me,parseInt(index),parseInt(cacheIndex),me.targetCache);
	            }, me.deferTime);
			}
		};
		tab.init(e,t);
		return tab;
	};
});



/*
     template:框的html模版
     isHold:
*/
JFAST.register("ui.dialog",function(a) {
    var tpl = '<div class="wLayer" node-type="outer" style="display:none;position:absolute;z-index:10001"><div class="bg"><table border="0" cellspacing="0" cellpadding="0"class="mBlogLayer"><tbody><tr><td class="top_l"></td><td class="top_c"></td><td class="top_r"></td></tr><tr><td class="mid_l"></td><td class="mid_c"><div class="content" node-type="layoutContent"><div class="title" node-type="title"><span node-type="title_content"></span></div><a href="javascript:void(0);" class="wClose" title="关闭" node-type="close"></a><div node-type="inner"></div></div></td><td class="mid_r"></td></tr>			    	<tr><td class="bottom_l"></td><td class="bottom_c"></td><td class="bottom_r"></td></tr></tbody></table></div></div>',
    dialog = null,
    dialogParam,
    //取得Dialog对象
    getDialog = function() {
        var dialog = a.module.dialog(dialogParam.template);
        a.evt.custEvent.add(dialog, "show",function() {
            a.module.mask.showUnderNode(dialog.getOuter());
        });
        a.evt.custEvent.add(dialog, "hide",function() {
            a.module.mask.back();
            dialog.setMiddle()
        });
        a.kit.dom.drag(dialog.getDom("title"), {
            actObj: dialog,
            moveDom:dialog.getOuter()
        });
        dialog.destroy = function() {
            g(dialog);
            try {
                dialog.hide(!0)
            } catch(a) {}
        };
        return dialog
    },
    setUnusedHide = function(a) {
        a.setTitle("").clearContent();
        dialog.setUnused(a)
    };
    return function(param) {
        dialogParam = a.obj.parseParam({
	            template: tpl,
	            isHold: !1
	        },
        	param
        );
        var isHold = dialogParam.isHold;
        dialogParam = a.obj.cut(dialogParam, ["isHold"]);
        //不存在就取得dialog对象并添加通用方法
        dialog || (dialog = a.kit.extra.reuse(getDialog));
        var dialogOne = dialog.getOne();
        isHold || a.evt.custEvent.add(dialogOne, "hide",function() {
            a.evt.custEvent.remove(dialogOne, "hide", arguments.callee);
            setUnusedHide(dialogOne);
        });
        return dialogOne
    }
});





/*批次验证*/
JFAST.register("ui.validatorBatch",function(a) {
	return function(batchError,itemId,showId,ruleCheck){
		var err=a.ui.validator(itemId,showId,ruleCheck);
		if(err && !batchError){
			var t=a.E(itemId),posT=a.dom.position(t).t;
			t.focus();
			if(posT>50){
				window.scrollTo(0,(posT-50));
			}else{
				window.scrollTo(0,0);
			}
			
		}
		return err;
	}
});

/*验证*/
JFAST.register("ui.validator",function(a) {
	return function(itemId,showId,ruleCheck){
		var o=$E(itemId);
		var v=o.value;
		var show=$E(showId);
	
		if(!ruleCheck.errorForm){
			ruleCheck.errorForm='<div class="formItemError"><div><span>';
		}
		if(!ruleCheck.errorTo){
			ruleCheck.errorTo="</span></div></div>";
		}
	
		if(!ruleCheck.trim){
			ruleCheck.trim=true;
		}
		
		if(ruleCheck.empty && !ruleCheck.empty.val && ((o.type=="checkbox" && o.checked==false) || v.length==0)){
			error=ruleCheck.errorForm+ruleCheck.empty.error+ruleCheck.errorTo;
			show.innerHTML=error;
			return error;
		}
		
		var lenError=false;
		if(ruleCheck.len && ruleCheck.len.minLen && ruleCheck.len.minLen.val && v.length<ruleCheck.len.minLen.val){
			error=ruleCheck.errorForm+ruleCheck.len.error+ruleCheck.errorTo;
			show.innerHTML=error;
			return error;
		}
		
		if(ruleCheck.len && ruleCheck.len.maxLen && ruleCheck.len.maxLen.val && v.length>ruleCheck.len.maxLen.val){
			error=ruleCheck.errorForm+ruleCheck.len.error+ruleCheck.errorTo;
			show.innerHTML=error;
			return error;
		}

		if(typeof(ruleCheck.regex)=="object" && $CHECK.LOGIN_EMAIL.regex.val.test(v)==false){
			error=ruleCheck.errorForm+ruleCheck.regex.error+ruleCheck.errorTo;
			show.innerHTML=error;
			return error;
		}
	
		if(ruleCheck.checkFun){
			error=ruleCheck.checkFun();
			if(error){
				error=ruleCheck.errorForm+error+ruleCheck.errorTo;
				show.innerHTML=error;
				return error;
			}
		}
	
		if(ruleCheck.ajaxFun){
			error=ruleCheck.ajaxFun(itemId,showId,v,ruleCheck);
			if(error){
				error=ruleCheck.errorForm+error+ruleCheck.errorTo;
				show.innerHTML=error;
				return error;
			}
		}
	
		show.innerHTML="";
		return "";
	}
});




JFAST.register("ui.goTop",function(a) {
	var topEle=null,
	isShow=false,
	moveStatus=false,
	perTop=0;
	return {
		show:function(){
			isShow||this.init();
			if(a.dom.scroll().top<200){
				topEle.style.display="none";
			}else{
				topEle.style.display="block";
			}
		},
		isMove:false,
		init:function(w){
			w=w || 974;
			var winW = document.documentElement.offsetWidth || document.body.offsetWidth;
			var left=0;
			if(winW>w){
				left=(winW-w)/2+w-5;
			}else{
				left=winW-60;
			}
			
			var me=this;
			topEle=$C('div');
			topEle.style.left=left+'px';
			topEle.className='goTop';
			topEle.innerHTML='<a href="javascript:;"></a> ';
			
			document.body.appendChild(topEle);
			
			JF.evt.addEvent(topEle,'click',function(){
				perTop=0;
				moveStatus=true;
				if(a.util.browser.IE6){
					topEle.style.display="none";
				}
				a.ui.goTop.move(0.2,10);
				return false;
			});
			
			JF.evt.addEvent(window,"scroll",function(){
				if(a.dom.scroll().top==0){
					topEle.style.display="none";
				}else if(a.dom.scroll().top>=200 && moveStatus==false){
					topEle.style.display="block";
				}
				if(a.dom.scroll().top==0){
					moveStatus=false;
				}
				if(a.util.browser.IE6 && moveStatus==false){
					topEle.style.top=a.util.scrollPos().top+a.util.winSize().height-100+"px";
				}
			});
		},
		/**  
		 * 回到页面顶部  
		 * @param acceleration 加速度  
		 * @param time 时间间隔 (毫秒)  
		 **/  
		move:function (acceleration, time){	
	 		if(moveStatus){
	 			var top=a.dom.scroll().top;
	 			if(top<=perTop || perTop==0){
	 				perTop=top;
					// 滚动距离 = 目前距离 / 速度, 因为距离原来越小, 速度是大于 1 的数, 所以滚动距离会越来越小  
					var speed = 1+ acceleration;
					
					window.scrollTo(0,Math.floor(top / speed));  
					// 如果距离不为零, 继续调用迭代本函数  
					if (perTop > 0) {  
					    var invokeFunction = "JFAST.ui.goTop.move(" + acceleration + ", " + time + ")";  
					    window.setTimeout(invokeFunction, time);  
					}
				}else{
					moveStatus=false;
					if(top<200){
						topEle.style.display="none";
					}else{
						topEle.style.display="block";
						topEle.style.top=a.util.scrollPos().top+a.util.winSize().height-100+"px";
					}
				}
				
			}
	   }
	}
});






JFAST.register("amt.animate",function(a) {
	return function(el,beginStyle,targetStyle,t,fn) {
		fn=fn||function(){};
		el=a.E(el);
		var len=Math.floor(t/40),
		i,
		arrS=[],
		s=0;
		
		for(i=0;i<len;i++){
			s+=Math.pow(1.3,i+1);
			arrS.push(s);
		}
		
		for(var key in beginStyle){
			a.dom.setStyle(el,key,beginStyle[key]);
		}

		var i=0;
		(function() {
			i++;
			if(i==len){
				for(var key in targetStyle){
					a.dom.setStyle(el,key,targetStyle[key]);
				}
				fn();
			}else{
				var num="";
				for(var key in targetStyle){
					num=parseFloat(Math.abs(parseFloat(targetStyle[key])-parseFloat(beginStyle[key]))/s*arrS[i-1]);
					num=(parseFloat(beginStyle[key])<=parseFloat(targetStyle[key])?parseFloat(beginStyle[key])+num:parseFloat(beginStyle[key])-num);
					if(key=="marginTop"||key=="marginLeft"||key=="left"||key=="top"||key=="right"||key=="bottom"||key=="height"||key=="width"){
						num=num+"px";
					}
					a.dom.setStyle(el,key,num);
				}
				setTimeout(arguments.callee,40);
			}
		})();
	}
});



minHaderView={
	_topNav_MyManageBtnEle:null,
	_topNav_MyManageExtendEle:null,
	init:function(spaceUid){
		var me=this;
		me.loginView.init();
		
		me._topNav_MyManageBtnEle=$E('topNav_MyManageBtn');
		me._topNav_MyManageExtendEle=$E('topNav_MyManageExtend');

		var spaceFocusOrUnBtnEl=$E("spaceFocusOrUnfocusBtn");
		JF.evt.addEvent(spaceFocusOrUnBtnEl,"click",function(e){
			if(spaceFocusOrUnBtnEl.getAttribute("action-code")=="focus"){
				me._spaceFocus(spaceFocusOrUnBtnEl,spaceUid);
			}else{
				me._spaceUnfocus(spaceFocusOrUnBtnEl,spaceUid);
			}
			return false;
		});
		
		
		JF.evt.addEvent("ltNav","mouseover",function(e){
			if(JF.evt.isMouseLeaveOrEnter(e,$E("ltNav"))){
				$E("ltNav").style.zIndex=1000;
				$E("ltNavExpand").style.display="block";
			}
		});
		JF.evt.addEvent("ltNav","mouseout",function(e){
			if(JF.evt.isMouseLeaveOrEnter(e,$E("ltNav"))){
				$E("ltNav").style.zIndex=999;
				$E("ltNavExpand").style.display="none";
			}
		});
		
		
		JF.evt.addEvent("myManage_Share","mouseover",function(e){
			if(JF.evt.isMouseLeaveOrEnter(e,$E("myManage_Share"))){
				JF.dom.addClass($E("myManage_Share").firstChild,"current");
				$E("myManage_Share").lastChild.style.display="block";
				var icoEls=$E("myManage_Share").lastChild.childNodes;
				JF.amt.animate(icoEls[6],{top:"47px",right:"-4px",opacity:0},{top:"0",right:"5px",opacity:1},150);
				JF.amt.animate(icoEls[5],{top:"47px",right:"-4px",opacity:0},{top:"30px",right:"20px",opacity:1},150);
				JF.amt.animate(icoEls[4],{top:"47px",right:"-4px",opacity:0},{top:"64px",right:"20px",opacity:1},150);
				JF.amt.animate(icoEls[3],{top:"47px",right:"-4px",opacity:0},{top:"94px",right:"5px",opacity:1},150);
				JF.amt.animate(icoEls[2],{top:"47px",right:"-4px",opacity:0},{top:"2px",right:"39px",opacity:1},250);
				JF.amt.animate(icoEls[1],{top:"47px",right:"-4px",opacity:0},{top:"46px",right:"49px",opacity:1},250);
				JF.amt.animate(icoEls[0],{top:"47px",right:"-4px",opacity:0},{top:"92px",right:"39px",opacity:1},250);
			}
		});
		JF.evt.addEvent("myManage_Share","mouseout",function(e){
			if(JF.evt.isMouseLeaveOrEnter(e,$E("myManage_Share"))){
				JF.dom.removeClass($E("myManage_Share").firstChild,"current");
				$E("myManage_Share").lastChild.style.display="none";
			}
		});
		
		JF.ajax.request("/newmsgcount.html",{
			success:function(xhr,responseText){
				var data = eval("("+responseText+")");
				if(data.totalSize>0){
					$E("topNav_RemindCount").innerHTML="("+data.totalSize+")";
				}else{
					$E("topNav_RemindCount").innerHTML="";
				}
			}
		});
		
		
		JF.evt.addEvent(me._topNav_MyManageBtnEle,'mouseover',function(e){
			me._myManageShow(me,e);
		});
		JF.evt.addEvent(me._topNav_MyManageBtnEle,'mouseout',function(e){
			me._myManageHidd(me,e);
		});
		JF.evt.addEvent('changeSkinBtn','click',function(e){
			setSkinView.show();
		});
		JF.evt.addEvent('skinBtn','click',function(e){
			setSkinView.show();
			return false;
		});
		JF.evt.addEvent('loginBtn','click',function(e){
			loginView.show();
			return false;
		});
	},
	_myManageShow:function(me,e){
		if (JF.evt.isMouseLeaveOrEnter(e,me._topNav_MyManageBtnEle)){
			JF.dom.addClass(me._topNav_MyManageBtnEle,"liHover");
			me._topNav_MyManageExtendEle.style.display='block';
		}
	},
	_myManageHidd:function(me,e){
		if (JF.evt.isMouseLeaveOrEnter(e,me._topNav_MyManageBtnEle)){
			JF.dom.removeClass(me._topNav_MyManageBtnEle,"liHover");
			me._topNav_MyManageExtendEle.style.display='none';
		}
	},
	_spaceFocus:function(t,uid){
		var url='/addfollow.html?u.uid='+uid;
		JF.ajax.request(url,{
			success:function(xhr,responseText){
				var data = eval("("+responseText+")");
				if(data.status==1){
					loginView.show();
				}else if(data.status==2 || data.status==3){
					JF.ui.alert(data.msg,{title:"错误",icon:'error'});
				}else{
					t.className="spaceUnfocusBtn";
					t.setAttribute('action-code','unfocus');
					t.setAttribute('title','取消收听');
					t.lastChild.innerHTML="取消收听";
					JF.ui.clientTip().show({type:"success",msg:"收听成功!"});
				}
			},
			error:function(){
			}
		});
	},
	_spaceUnfocus:function(t,uid){
		var url='/unfollow.html?u.uid='+uid;
		JF.ajax.request(url,{
			success:function(xhr,responseText){
				var data = eval("("+responseText+")");
				if(data.status==1){
					loginView.show();
				}else if(data.status==2 || data.status==3){
					JF.ui.alert(data.msg,{title:"错误",icon:'error'});
				}else{
					t.className="spaceFocusBtn";
					t.setAttribute('action-code','focus');
					t.setAttribute('title','收听');
					t.lastChild.innerHTML="收听";
					JF.ui.clientTip().show({type:"success",msg:"取消收听成功！"});
				}
			},
			error:function(){
			}
		});
	}
};



topHaderCircleView={
	_topNav_MyManageBtnEle:null,
	_topNav_MyManageExtendEle:null,
	init:function(){
		var me=this;
		me.loginView.init();

		JF.evt.addEvent("ltNav","mouseover",function(e){
			if(JF.evt.isMouseLeaveOrEnter(e,$E("ltNav"))){
				if(JF.util.browser.IE6){
					$E("ltNav").firstChild.style.backgroundPosition="-348px -58px";
				}
				$E("ltNavExpand").style.display="block";
			}
		});
		JF.evt.addEvent("ltNav","mouseout",function(e){
			if(JF.evt.isMouseLeaveOrEnter(e,$E("ltNav"))){
				if(JF.util.browser.IE6){
					$E("ltNav").firstChild.style.backgroundPosition="-348px 0";
				}
				$E("ltNavExpand").style.display="none";
			}
		});
		
		JF.evt.addEvent("myManage_Share","mouseover",function(e){
			if(JF.evt.isMouseLeaveOrEnter(e,$E("myManage_Share"))){
				JF.dom.addClass($E("myManage_Share").firstChild,"current");
				$E("myManage_Share").lastChild.style.display="block";
				var icoEls=$E("myManage_Share").lastChild.childNodes;
				JF.amt.animate(icoEls[6],{top:"47px",right:"-4px",opacity:0},{top:"0",right:"5px",opacity:1},150);
				JF.amt.animate(icoEls[5],{top:"47px",right:"-4px",opacity:0},{top:"30px",right:"20px",opacity:1},150);
				JF.amt.animate(icoEls[4],{top:"47px",right:"-4px",opacity:0},{top:"64px",right:"20px",opacity:1},150);
				JF.amt.animate(icoEls[3],{top:"47px",right:"-4px",opacity:0},{top:"94px",right:"5px",opacity:1},150);
				JF.amt.animate(icoEls[2],{top:"47px",right:"-4px",opacity:0},{top:"2px",right:"39px",opacity:1},250);
				JF.amt.animate(icoEls[1],{top:"47px",right:"-4px",opacity:0},{top:"46px",right:"49px",opacity:1},250);
				JF.amt.animate(icoEls[0],{top:"47px",right:"-4px",opacity:0},{top:"92px",right:"39px",opacity:1},250);
			}
		});
		JF.evt.addEvent("myManage_Share","mouseout",function(e){
			if(JF.evt.isMouseLeaveOrEnter(e,$E("myManage_Share"))){
				JF.dom.removeClass($E("myManage_Share").firstChild,"current");
				$E("myManage_Share").lastChild.style.display="none";
			}
		});
		
		JF.ajax.request("/newmsgcount.html",{
			success:function(xhr,responseText){
				var data = eval("("+responseText+")");
				if(data.totalSize>0){
					$E("topNav_RemindCount").innerHTML="("+data.totalSize+")";
				}else{
					$E("topNav_RemindCount").innerHTML="";
				}
			}
		});
		
		
		JF.evt.addEvent("ltNavCirclShareLi","mouseover",function(e){
			if(JF.evt.isMouseLeaveOrEnter(e,$E("ltNavCirclShareLi"))){
				JF.dom.addClass($E("ltNavCirclShareLi").firstChild,"hasSubHover");
				$E("ltNavCirclShareLi").lastChild.style.display="block";
			}
		});
		JF.evt.addEvent("ltNavCirclShareLi","mouseout",function(e){
			if(JF.evt.isMouseLeaveOrEnter(e,$E("ltNavCirclShareLi"))){
				JF.dom.removeClass($E("ltNavCirclShareLi").firstChild,"hasSubHover");
				$E("ltNavCirclShareLi").lastChild.style.display="none";
			}
		});
		
		me._topNav_MyManageBtnEle=$E('topNav_MyManageBtn');
		me._topNav_MyManageExtendEle=$E('topNav_MyManageExtend');

		JF.evt.addEvent(me._topNav_MyManageBtnEle,'mouseover',function(e){
			me._myManageShow(me,e);
		});
		JF.evt.addEvent(me._topNav_MyManageBtnEle,'mouseout',function(e){
			me._myManageHidd(me,e);
		});
		

		JF.evt.addEvent('changeSkinBtn','click',function(e){
			setSkinView.show();
		});
		JF.evt.addEvent('skinBtn','click',function(e){
			setSkinView.show();
		});
		JF.evt.addEvent('loginBtn','click',function(e){
			loginView.show();
		});
	},
	_myManageShow:function(me,e){
		if (JF.evt.isMouseLeaveOrEnter(e,me._topNav_MyManageBtnEle)){
			JF.dom.addClass(me._topNav_MyManageBtnEle,"liHover");
			me._topNav_MyManageExtendEle.style.display='block';
		}
	},
	_myManageHidd:function(me,e){
		if (JF.evt.isMouseLeaveOrEnter(e,me._topNav_MyManageBtnEle)){
			JF.dom.removeClass(me._topNav_MyManageBtnEle,"liHover");
			me._topNav_MyManageExtendEle.style.display='none';
		}
	}
};



var loginView=topHaderCircleView.loginView=minHaderView.loginView={
	_uid:null,
	_dialog:null,
	_cDialog:function(){
		var me=this,uid,tplLogin,layer,layerOne,submitEl,eMailEl,passEl,topTipEl,eMailTipEl,passTipEl,formEl,eMailBlur,passBlur,loginSubmit;
		tplLogin = '<div node-type="outer" class="unloginDialog"><div class="loginWin"><form onsubmit="return false;" node-type="form"><div class="item topTip divMaxText" node-type="inner"></div><div class="item divMaxText"><label for="email">电子邮件</label>'+JF.fui.text.getUiHtml({"node-type":"eMailInput",style:"width:200px"})+'<span id="eMailTip" class="tip" node-type="eMailTip"></span></div><div class="item divMaxText"><label for="pass">登录密码</label>'+JF.fui.pass.getUiHtml({"node-type":"passInput",style:"width:200px"})+'<span id="passTip" class="tip" node-type="passTip"></span></div><div class="item itemBtn"><a href="javascript:;" class="submitBtn" node-type="submitBtn"><span>登&nbsp;录</span><em></em></a><a href="aq.'+locationHostOne+'/security.html" class="lostPass" target="_blank">忘记密码？</a></div></form></div></div>';
		layer = JF.kit.extra.reuse(function(){
				return JF.module.layer(tplLogin);
		});
		layerOne = layer.getOne();
		submitEl=layerOne.getDom("submitBtn");
		eMailEl=layerOne.getDom("eMailInput");
		passEl=layerOne.getDom("passInput");
		topTipEl=layerOne.getDom("inner");
		eMailTipEl=layerOne.getDom("eMailTip");
		passTipEl=layerOne.getDom("passTip");
		formEl=layerOne.getDom("form");
		
		me._topTipEl=topTipEl;
		
		eMailBlur=function(){
			return JFAST.ui.validator(eMailEl,eMailTipEl,$CHECK.LOGIN_EMAIL);
		};
		passBlur=function(){
			return JFAST.ui.validator(passEl,passTipEl,$CHECK.LOGIN_PASSWORD);
		};
		loginSubmit= function() {
			if(!(eMailBlur()+passBlur()) && !submitEl.status){
				JFAST.dom.addClass(submitEl,"waitBtn");
				topTipEl.style.display="none";
				JFAST.ajax.request("/ajaxlogin.html",{
					data:['user.accountId=',eMailEl.value,'&user.accountPassword=',passEl.value].join(''),
					success:function(xhl,responseText){
						JFAST.dom.removeClass(submitEl,"waitBtn");
						var data=eval('(' + responseText + ')');
						if(data.status=="1" || data.status=="2" || data.status=="3"){
							topTipEl.style.display="block";
							topTipEl.innerHTML='<div class="formItemError"><div><span>'+data.msg+'</span></div></div>';
						}else{
							me._dialog.hide();
							var ulStatus="";
							if(me._success){
								me._success();
							}else{
								location.reload();
							}
						}
					},
					error:function(){
						JFAST.dom.removeClass(submitEl,"waitBtn");
						topTipEl.style.display="block";
						JF.ui.clientTip().show({type:"success",msg:"服务期请求失败,请稍后从新尝试！"});
					}
				});
			}
			return false;
		};
		me._dialog = JF.ui.dialog({isHold:true});
		me._dialog.setTitle("登录");
		me._dialog.setContent(layerOne.getOuter());
		JF.evt.addEvent(eMailEl,'blur',eMailBlur);
		JF.evt.addEvent(passEl,'blur',passBlur);
	    JF.evt.addEvent(submitEl,"click",loginSubmit);
	    formEl.onkeydown=function(){
	    	if(JF.evt.getEvent().keyCode==13){
	    		loginSubmit();
	    	}
	    };
	},
	init:function(o){
		var me=this;
		me._dialog||me._cDialog();
	},
	show:function(success){
		this._success=success;
		this._topTipEl.style.display="none";
		this._dialog.show().setMiddle();
	},
	hide:function(){
		this._dialog.hide();
	}
};


var tomeLogin={
	
	init:function(){
		var me=this;
		topHaderCircleView.init();
		JF.ui.goTop.show();
		me.shareView.init();
		me.circleShareView.init();
		me.talkView.init();
	},


	shareView:{
		init:function(){
			var me=this,aEls=$E("shareList").getElementsByTagName("a");
			me._storeCommentArr=[];
			me._shareTextArr=[];
			me._sharePicArr=[];
			for(var i=0,iLen=aEls.length;i<iLen;i++){
				if(JF.dom.hasClass(aEls[i].parentNode,"shareText")){
					me._shareTextArr.push(aEls[i]);
				}else if(JF.dom.hasClass(aEls[i].parentNode,"storeComment")){
					me._storeCommentArr.push(aEls[i]);
				}else{
					me._sharePicArr.push(aEls[i]);
				}
			}
			me._createPageBtn();
		},
		_changePageTime:10000,
		_createPageBtn:function(){
			var me=this;
			me._pageWidth=960;
			me._shareWidth=$E("shareList").offsetWidth;
			me._pageLen=Math.ceil(me._shareWidth/me._pageWidth);
			me._pageStatus="";
			
			var btnHtmlArr=[];
			for(var i=0;i<me._pageLen;i++){
				btnHtmlArr.push('<a index="'+i+'" href="javascript:;"><span><em></em></span></a>');
			}
			$E("pageLayout").innerHTML=btnHtmlArr.join("");
			
		    me._pageCurrent=0,
		    pageEmEls=$E("pageLayout").getElementsByTagName("em");
		    pageEmEls[me._pageCurrent].style.width="25px";
			JF.evt.addEvent("pageLayout","click",function(e){
				var t=JF.evt.fixEvent(e).target;
				if(t!=$E("pageLayout") && me._pageStatus!="wait"){
					var aEl=JF.dom.parent(t,"a"),
					index=parseInt(aEl.getAttribute("index"));
					me._pageMove(index);
				}
				return false;
			});
			JF.evt.addEvent("backBtn","click",function(e){
				me._pageMove( me._pageCurrent-1<0?me._pageLen-1:me._pageCurrent-1)
				return false;
			});
			JF.evt.addEvent("nextBtn","click",function(e){
				me._pageMove( me._pageCurrent+1==me._pageLen?0:me._pageCurrent+1)
				return false;
			});
			me._interval=window.setInterval(function(){me._pageMove( me._pageCurrent+1==me._pageLen?0: me._pageCurrent+1)},me._changePageTime);
		},
		_pageMove:function(index){
			var me=this;
			if(me._pageStatus!="wait"){
				me._pageStatus="wait";
				window.clearInterval(me._interval); 
				var begin=me._pageCurrent+1==me._pageLen?me._pageWidth-me._shareWidth+"px":-parseInt(me._pageCurrent*me._pageWidth)+"px",
				end=index+1==me._pageLen?me._pageWidth-me._shareWidth+"px":-parseInt(index*me._pageWidth)+"px";
				JF.amt.animate($E("shareList"),{left:begin},{left:end},500,function(){
					me._pageCurrent=index;
					me._pageStatus="";
					me._interval=window.setInterval(function(){me._pageMove(index+1==me._pageLen?0:index+1)},me._changePageTime);
				});
		
				if(me._pageCurrent>index){
					JF.dom.setStyle(pageEmEls[me._pageCurrent],"float","left");
				}else{
					JF.dom.setStyle(pageEmEls[me._pageCurrent],"float","right");
				}
				
				JF.amt.animate(pageEmEls[me._pageCurrent],{width:"25px"},{width:0},500,function(){
					pageEmEls[index].style.width="25px";
				});
			}
		}
	}
};
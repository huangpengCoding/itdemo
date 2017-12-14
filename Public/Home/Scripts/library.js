/**
 * Created by zhongliang on 14-3-23.
 */
(function ($) {
	$.extend({
		udblogin: function() {
			UDB.sdk.PCWeb.popupOpenLgn(
				SITEURL+'login.php?mod=getauthorizeurl',
				SITEURL+'login.php?mod=callback',
				SITEURL+'login.php?mod=denycallback');
		},
		udblogout: function(formhash) {
			var getDelCookieURL = 'login.php';
			jQuery.post(
				getDelCookieURL, { mod: 'getdelcookieurl' },
				function(data) {
					if("1" != data.success) {
						alert(data.errMsg);
						return;
					}
					UDB.sdk.PCWeb.deleteCrossmainCookieWithCallBack(
						data.delCookieURL,
						function(){
							top.location.href = "member.php?mod=logging&action=logout&formhash=" + formhash;
						}
					);
				},
			"json");
		}
	});
	$.fn.sign = function(formhash) {
		var _this = $(this);
		var _base = _this.closest('#ysign');
		var _loading = _base.find('.ysign-loading');
		var _info = _base.find('.ysign-info');
		var _signed = $('<div>', {
			'class': 'ysign-signed',
			'text': '已签到'
		});
		$.ajax({
			type: 'post',
			url: 'plugin.php?id=gone:sign',
			data: {'formhash': formhash, 'sign': 'yes'},
			cache: false,
			dataType: 'json',
			beforeSend: function() {
				_loading.show();
			},
			success: function(ret) {
				switch(ret.code) {
					case 0:
						_loading.hide();
						layer.tips('系统错误，请重试！', _this, {
							time: 2,
							style: ['background-color:#0FA6D8; color:#fff', '#0FA6D8']
						});
						break;
					case 1:
					case 2:
						_this.remove();
						_loading.remove();
						_signed.prependTo(_base);
						_info.find('em').text(ret.keep);
						layer.tips('签到成功！', _signed, {
							time: 3
						});
						break;
					case 3:
						_loading.hide();
						$.udblogin();
						break;
				}
			}
		});
	};
	$.fn.slide = function(options) {
		$.fn.slide.defaults = {
			type: "slide",
			effect: "fade",
			autoPlay: false,
			delayTime: 500,
			interTime: 2500,
			triggerTime: 150,
			defaultIndex: 0,
			titCell: ".hd li",
			mainCell: ".bd",
			targetCell: null,
			trigger: "mouseover",
			scroll: 1,
			vis: 1,
			titOnClassName: "on",
			autoPage: false,
			prevCell: ".prev",
			nextCell: ".next",
			pageStateCell: ".pageState",
			opp: false,
			pnLoop: true,
			easing: "swing",
			startFun: null,
			endFun: null,
			switchLoad: null,
			playStateCell: ".playState",
			mouseOverStop: true,
			defaultPlay: true,
			returnDefault: false
		};
		return this.each(function() {
			var opts = $.extend({}, $.fn.slide.defaults, options);
			var slider = $(this);
			var effect = opts.effect;
			var prevBtn = $(opts.prevCell, slider);
			var nextBtn = $(opts.nextCell, slider);
			var pageState = $(opts.pageStateCell, slider);
			var playState = $(opts.playStateCell, slider);
			var navObj = $(opts.titCell, slider);
			var navObjSize = navObj.size();
			var conBox = $(opts.mainCell, slider);
			var conBoxSize = conBox.children().size();
			var sLoad = opts.switchLoad;
			var tarObj = $(opts.targetCell, slider);
			var index = parseInt(opts.defaultIndex);
			var delayTime = parseInt(opts.delayTime);
			var interTime = parseInt(opts.interTime);
			var triggerTime = parseInt(opts.triggerTime);
			var scroll = parseInt(opts.scroll);
			var vis = parseInt(opts.vis);
			var autoPlay = (opts.autoPlay == "false" || opts.autoPlay == false) ? false : true;
			var opp = (opts.opp == "false" || opts.opp == false) ? false : true;
			var autoPage = (opts.autoPage == "false" || opts.autoPage == false) ? false : true;
			var pnLoop = (opts.pnLoop == "false" || opts.pnLoop == false) ? false : true;
			var mouseOverStop = (opts.mouseOverStop == "false" || opts.mouseOverStop == false) ? false : true;
			var defaultPlay = (opts.defaultPlay == "false" || opts.defaultPlay == false) ? false : true;
			var returnDefault = (opts.returnDefault == "false" || opts.returnDefault == false) ? false : true;
			var slideH = 0;
			var slideW = 0;
			var selfW = 0;
			var selfH = 0;
			var easing = opts.easing;
			var inter = null;
			var mst = null;
			var rtnST = null;
			var titOn = opts.titOnClassName;
			var onIndex = navObj.index(slider.find("." + titOn));
			var oldIndex = index = onIndex == -1 ? index : onIndex;
			var defaultIndex = index;
			var _ind = index;
			var cloneNum = conBoxSize >= vis ? (conBoxSize % scroll != 0 ? conBoxSize % scroll : scroll) : 0;
			var _tar;
			var isMarq = effect == "leftMarquee" || effect == "topMarquee" ? true : false;
			var doStartFun = function() {
				if ($.isFunction(opts.startFun)) {
					opts.startFun(index, navObjSize, slider, $(opts.titCell, slider), conBox, tarObj, prevBtn, nextBtn)
				}
			}
			var doEndFun = function() {
				if ($.isFunction(opts.endFun)) {
					opts.endFun(index, navObjSize, slider, $(opts.titCell, slider), conBox, tarObj, prevBtn, nextBtn)
				}
			}
			var resetOn = function() {
				navObj.removeClass(titOn);
				if (defaultPlay) navObj.eq(defaultIndex).addClass(titOn)
			}
			if (opts.type == "menu") {
				if (defaultPlay) {
					navObj.removeClass(titOn).eq(index).addClass(titOn)
				}
				navObj.hover(function() {
					_tar = $(this).find(opts.targetCell);
					var hoverInd = navObj.index($(this));
					mst = setTimeout(function() {
						index = hoverInd;
						navObj.removeClass(titOn).eq(index).addClass(titOn);
						doStartFun();
						switch (effect) {
							case "fade":
								_tar.stop(true, true).animate({
									opacity: "show"
								}, delayTime, easing, doEndFun);
								break;
							case "slideDown":
								_tar.stop(true, true).animate({
									height: "show"
								}, delayTime, easing, doEndFun);
								break
						}
					}, opts.triggerTime)
				}, function() {
					clearTimeout(mst);
					switch (effect) {
						case "fade":
							_tar.animate({
								opacity: "hide"
							}, delayTime, easing);
							break;
						case "slideDown":
							_tar.animate({
								height: "hide"
							}, delayTime, easing);
							break
					}
				});
				if (returnDefault) {
					slider.hover(function() {
						clearTimeout(rtnST)
					}, function() {
						rtnST = setTimeout(resetOn, delayTime)
					})
				}
				return
			}
			if (navObjSize == 0) navObjSize = conBoxSize;
			if (isMarq) navObjSize = 2;
			if (autoPage) {
				if (conBoxSize >= vis) {
					if (effect == "leftLoop" || effect == "topLoop") {
						navObjSize = conBoxSize % scroll != 0 ? (conBoxSize / scroll ^ 0) + 1 : conBoxSize / scroll
					} else {
						var tempS = conBoxSize - vis;
						navObjSize = 1 + parseInt(tempS % scroll != 0 ? (tempS / scroll + 1) : (tempS / scroll));
						if (navObjSize <= 0) navObjSize = 1
					}
				} else {
					navObjSize = 1
				}
				navObj.html("");
				var str = "";
				if (opts.autoPage == true || opts.autoPage == "true") {
					for (var i = 0; i < navObjSize; i++) {
						str += "<li>" + (i + 1) + "</li>"
					}
				} else {
					for (var i = 0; i < navObjSize; i++) {
						str += opts.autoPage.replace("$", (i + 1))
					}
				}
				navObj.html(str);
				var navObj = navObj.children()
			}
			if (conBoxSize >= vis) {
				conBox.children().each(function() {
					if ($(this).width() > selfW) {
						selfW = $(this).width();
						slideW = $(this).outerWidth(true)
					}
					if ($(this).height() > selfH) {
						selfH = $(this).height();
						slideH = $(this).outerHeight(true)
					}
				});
				var _chr = conBox.children();
				var cloneEle = function() {
					for (var i = 0; i < vis; i++) {
						_chr.eq(i).clone().addClass("clone").appendTo(conBox)
					}
					for (var i = 0; i < cloneNum; i++) {
						_chr.eq(conBoxSize - i - 1).clone().addClass("clone").prependTo(conBox)
					}
				}
				switch (effect) {
					case "fold":
						conBox.css({
							"position": "relative",
							"width": slideW,
							"height": slideH
						}).children().css({
								"position": "absolute",
								"width": selfW,
								"left": 0,
								"top": 0,
								"display": "none"
							});
						break;
					case "top":
						conBox.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:' + vis * slideH + 'px"></div>').css({
							"top": -(index * scroll) * slideH,
							"position": "relative",
							"padding": "0",
							"margin": "0"
						}).children().css({
								"height": selfH
							});
						break;
					case "left":
						conBox.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:' + vis * slideW + 'px"></div>').css({
							"width": conBoxSize * slideW,
							"left": -(index * scroll) * slideW,
							"position": "relative",
							"overflow": "hidden",
							"padding": "0",
							"margin": "0"
						}).children().css({
								"float": "left",
								"width": selfW
							});
						break;
					case "leftLoop":
					case "leftMarquee":
						cloneEle();
						conBox.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:' + vis * slideW + 'px"></div>').css({
							"width": (conBoxSize + vis + cloneNum) * slideW,
							"position": "relative",
							"overflow": "hidden",
							"padding": "0",
							"margin": "0",
							"left": -(cloneNum + index * scroll) * slideW
						}).children().css({
								"float": "left",
								"width": selfW
							});
						break;
					case "topLoop":
					case "topMarquee":
						cloneEle();
						conBox.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:' + vis * slideH + 'px"></div>').css({
							"height": (conBoxSize + vis + cloneNum) * slideH,
							"position": "relative",
							"padding": "0",
							"margin": "0",
							"top": -(cloneNum + index * scroll) * slideH
						}).children().css({
								"height": selfH
							});
						break
				}
			}
			var scrollNum = function(ind) {
				var _tempCs = ind * scroll;
				if (ind == navObjSize) {
					_tempCs = conBoxSize
				} else if (ind == -1 && conBoxSize % scroll != 0) {
					_tempCs = -conBoxSize % scroll
				}
				return _tempCs
			}
			var doSwitchLoad = function(objs) {
				var changeImg = function(t) {
					for (var i = t; i < (vis + t); i++) {
						objs.eq(i).find("img[" + sLoad + "]").each(function() {
							var _this = $(this);
							_this.attr("src", _this.attr(sLoad)).removeAttr(sLoad);
							if (conBox.find(".clone")[0]) {
								var chir = conBox.children();
								for (var j = 0; j < chir.size(); j++) {
									chir.eq(j).find("img[" + sLoad + "]").each(function() {
										if ($(this).attr(sLoad) == _this.attr("src")) $(this).attr("src", $(this).attr(sLoad)).removeAttr(sLoad)
									})
								}
							}
						})
					}
				}
				switch (effect) {
					case "fade":
					case "fold":
					case "top":
					case "left":
					case "slideDown":
						changeImg(index * scroll);
						break;
					case "leftLoop":
					case "topLoop":
						changeImg(cloneNum + scrollNum(_ind));
						break;
					case "leftMarquee":
					case "topMarquee":
						var curS = effect == "leftMarquee" ? conBox.css("left").replace("px", "") : conBox.css("top").replace("px", "");
						var slideT = effect == "leftMarquee" ? slideW : slideH;
						var mNum = cloneNum;
						if (curS % slideT != 0) {
							var curP = Math.abs(curS / slideT ^ 0);
							if (index == 1) {
								mNum = cloneNum + curP
							} else {
								mNum = cloneNum + curP - 1
							}
						}
						changeImg(mNum);
						break
				}
			}
			var doPlay = function(init) {
				if (defaultPlay && oldIndex == index && !init && !isMarq) return;
				if (isMarq) {
					if (index >= 1) {
						index = 1
					} else if (index <= 0) {
						index = 0
					}
				} else {
					_ind = index;
					if (index >= navObjSize) {
						index = 0
					} else if (index < 0) {
						index = navObjSize - 1
					}
				}
				doStartFun();
				if (sLoad != null) {
					doSwitchLoad(conBox.children())
				}
				if (tarObj[0]) {
					_tar = tarObj.eq(index);
					if (sLoad != null) {
						doSwitchLoad(tarObj)
					}
					if (effect == "slideDown") {
						tarObj.not(_tar).stop(true, true).slideUp(delayTime);
						_tar.slideDown(delayTime, easing, function() {
							if (!conBox[0]) doEndFun()
						})
					} else {
						tarObj.not(_tar).stop(true, true).hide();
						_tar.animate({
							opacity: "show"
						}, delayTime, function() {
							if (!conBox[0]) doEndFun()
						})
					}
				}
				if (conBoxSize >= vis) {
					switch (effect) {
						case "fade":
							conBox.children().stop(true, true).eq(index).animate({
								opacity: "show"
							}, delayTime, easing, function() {
								doEndFun()
							}).siblings().hide();
							break;
						case "fold":
							conBox.children().stop(true, true).eq(index).animate({
								opacity: "show"
							}, delayTime, easing, function() {
								doEndFun()
							}).siblings().animate({
									opacity: "hide"
								}, delayTime, easing);
							break;
						case "top":
							conBox.stop(true, false).animate({
								"top": -index * scroll * slideH
							}, delayTime, easing, function() {
								doEndFun()
							});
							break;
						case "left":
							conBox.stop(true, false).animate({
								"left": -index * scroll * slideW
							}, delayTime, easing, function() {
								doEndFun()
							});
							break;
						case "leftLoop":
							var __ind = _ind;
							conBox.stop(true, true).animate({
								"left": -(scrollNum(_ind) + cloneNum) * slideW
							}, delayTime, easing, function() {
								if (__ind <= -1) {
									conBox.css("left", -(cloneNum + (navObjSize - 1) * scroll) * slideW)
								} else if (__ind >= navObjSize) {
									conBox.css("left", -cloneNum * slideW)
								}
								doEndFun()
							});
							break;
						case "topLoop":
							var __ind = _ind;
							conBox.stop(true, true).animate({
								"top": -(scrollNum(_ind) + cloneNum) * slideH
							}, delayTime, easing, function() {
								if (__ind <= -1) {
									conBox.css("top", -(cloneNum + (navObjSize - 1) * scroll) * slideH)
								} else if (__ind >= navObjSize) {
									conBox.css("top", -cloneNum * slideH)
								}
								doEndFun()
							});
							break;
						case "leftMarquee":
							var tempLeft = conBox.css("left").replace("px", "");
							if (index == 0) {
								conBox.animate({
									"left": ++tempLeft
								}, 0, function() {
									if (conBox.css("left").replace("px", "") >= 0) {
										conBox.css("left", -conBoxSize * slideW)
									}
								})
							} else {
								conBox.animate({
									"left": --tempLeft
								}, 0, function() {
									if (conBox.css("left").replace("px", "") <= -(conBoxSize + cloneNum) * slideW) {
										conBox.css("left", -cloneNum * slideW)
									}
								})
							}
							break;
						case "topMarquee":
							var tempTop = conBox.css("top").replace("px", "");
							if (index == 0) {
								conBox.animate({
									"top": ++tempTop
								}, 0, function() {
									if (conBox.css("top").replace("px", "") >= 0) {
										conBox.css("top", -conBoxSize * slideH)
									}
								})
							} else {
								conBox.animate({
									"top": --tempTop
								}, 0, function() {
									if (conBox.css("top").replace("px", "") <= -(conBoxSize + cloneNum) * slideH) {
										conBox.css("top", -cloneNum * slideH)
									}
								})
							}
							break
					}
				}
				navObj.removeClass(titOn).eq(index).addClass(titOn);
				oldIndex = index;
				if (!pnLoop) {
					nextBtn.removeClass("nextStop");
					prevBtn.removeClass("prevStop");
					if (index == 0) {
						prevBtn.addClass("prevStop")
					}
					if (index == navObjSize - 1) {
						nextBtn.addClass("nextStop")
					}
				}
				pageState.html("<span>" + (index + 1) + "</span>/" + navObjSize)
			};
			if (defaultPlay) {
				doPlay(true)
			}
			if (returnDefault) {
				slider.hover(function() {
					clearTimeout(rtnST)
				}, function() {
					rtnST = setTimeout(function() {
						index = defaultIndex;
						if (defaultPlay) {
							doPlay()
						} else {
							if (effect == "slideDown") {
								_tar.slideUp(delayTime, resetOn)
							} else {
								_tar.animate({
									opacity: "hide"
								}, delayTime, resetOn)
							}
						}
						oldIndex = index
					}, 300)
				})
			}
			var setInter = function(time) {
				inter = setInterval(function() {
					opp ? index-- : index++;
					doPlay()
				}, !! time ? time : interTime)
			}
			var setMarInter = function(time) {
				inter = setInterval(doPlay, !! time ? time : interTime)
			}
			var resetInter = function() {
				if (!mouseOverStop) {
					clearInterval(inter);
					setInter()
				}
			}
			var nextTrigger = function() {
				if (pnLoop || index != navObjSize - 1) {
					index++;
					doPlay();
					if (!isMarq) resetInter()
				}
			}
			var prevTrigger = function() {
				if (pnLoop || index != 0) {
					index--;
					doPlay();
					if (!isMarq) resetInter()
				}
			}
			var playStateFun = function() {
				clearInterval(inter);
				isMarq ? setMarInter() : setInter();
				playState.removeClass("pauseState")
			}
			var pauseStateFun = function() {
				clearInterval(inter);
				playState.addClass("pauseState")
			}
			if (autoPlay) {
				if (isMarq) {
					opp ? index-- : index++;
					setMarInter();
					if (mouseOverStop) conBox.hover(pauseStateFun, playStateFun)
				} else {
					setInter();
					if (mouseOverStop) slider.hover(pauseStateFun, playStateFun)
				}
			} else {
				if (isMarq) {
					opp ? index-- : index++
				}
				playState.addClass("pauseState")
			}
			playState.click(function() {
				playState.hasClass("pauseState") ? playStateFun() : pauseStateFun()
			});
			if (opts.trigger == "mouseover") {
				navObj.hover(function() {
					var hoverInd = navObj.index(this);
					mst = setTimeout(function() {
						index = hoverInd;
						doPlay();
						resetInter()
					}, opts.triggerTime)
				}, function() {
					clearTimeout(mst)
				})
			} else {
				navObj.click(function() {
					index = navObj.index(this);
					doPlay();
					resetInter()
				})
			}
			if (isMarq) {
				nextBtn.mousedown(nextTrigger);
				prevBtn.mousedown(prevTrigger);
				if (pnLoop) {
					var st;
					var marDown = function() {
						st = setTimeout(function() {
							clearInterval(inter);
							setMarInter(interTime / 10 ^ 0)
						}, 150)
					}
					var marUp = function() {
						clearTimeout(st);
						clearInterval(inter);
						setMarInter()
					}
					nextBtn.mousedown(marDown);
					nextBtn.mouseup(marUp);
					prevBtn.mousedown(marDown);
					prevBtn.mouseup(marUp)
				}
				if (opts.trigger == "mouseover") {
					nextBtn.hover(nextTrigger, function() {});
					prevBtn.hover(prevTrigger, function() {})
				}
			} else {
				nextBtn.click(nextTrigger);
				prevBtn.click(prevTrigger)
			}
		})
	};
	$.easing['jswing'] = $.easing['swing'];
	$.extend($.easing, {
		def: 'easeOutQuad',
		swing: function(x, t, b, c, d) {
			return $.easing[$.easing.def](x, t, b, c, d)
		},
		easeInQuad: function(x, t, b, c, d) {
			return c * (t /= d) * t + b
		},
		easeOutQuad: function(x, t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b
		},
		easeInOutQuad: function(x, t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t + b;
			return -c / 2 * ((--t) * (t - 2) - 1) + b
		},
		easeInCubic: function(x, t, b, c, d) {
			return c * (t /= d) * t * t + b
		},
		easeOutCubic: function(x, t, b, c, d) {
			return c * ((t = t / d - 1) * t * t + 1) + b
		},
		easeInOutCubic: function(x, t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t + 2) + b
		},
		easeInQuart: function(x, t, b, c, d) {
			return c * (t /= d) * t * t * t + b
		},
		easeOutQuart: function(x, t, b, c, d) {
			return -c * ((t = t / d - 1) * t * t * t - 1) + b
		},
		easeInOutQuart: function(x, t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
			return -c / 2 * ((t -= 2) * t * t * t - 2) + b
		},
		easeInQuint: function(x, t, b, c, d) {
			return c * (t /= d) * t * t * t * t + b
		},
		easeOutQuint: function(x, t, b, c, d) {
			return c * ((t = t / d - 1) * t * t * t * t + 1) + b
		},
		easeInOutQuint: function(x, t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t * t * t + 2) + b
		},
		easeInSine: function(x, t, b, c, d) {
			return -c * Math.cos(t / d * (Math.PI / 2)) + c + b
		},
		easeOutSine: function(x, t, b, c, d) {
			return c * Math.sin(t / d * (Math.PI / 2)) + b
		},
		easeInOutSine: function(x, t, b, c, d) {
			return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b
		},
		easeInExpo: function(x, t, b, c, d) {
			return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b
		},
		easeOutExpo: function(x, t, b, c, d) {
			return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b
		},
		easeInOutExpo: function(x, t, b, c, d) {
			if (t == 0) return b;
			if (t == d) return b + c;
			if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
			return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b
		},
		easeInCirc: function(x, t, b, c, d) {
			return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
		},
		easeOutCirc: function(x, t, b, c, d) {
			return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
		},
		easeInOutCirc: function(x, t, b, c, d) {
			if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
			return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
		},
		easeInElastic: function(x, t, b, c, d) {
			var s = 1.70158;
			var p = 0;
			var a = c;
			if (t == 0) return b;
			if ((t /= d) == 1) return b + c;
			if (!p) p = d * .3;
			if (a < Math.abs(c)) {
				a = c;
				var s = p / 4
			} else var s = p / (2 * Math.PI) * Math.asin(c / a);
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b
		},
		easeOutElastic: function(x, t, b, c, d) {
			var s = 1.70158;
			var p = 0;
			var a = c;
			if (t == 0) return b;
			if ((t /= d) == 1) return b + c;
			if (!p) p = d * .3;
			if (a < Math.abs(c)) {
				a = c;
				var s = p / 4
			} else var s = p / (2 * Math.PI) * Math.asin(c / a);
			return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b
		},
		easeInOutElastic: function(x, t, b, c, d) {
			var s = 1.70158;
			var p = 0;
			var a = c;
			if (t == 0) return b;
			if ((t /= d / 2) == 2) return b + c;
			if (!p) p = d * (.3 * 1.5);
			if (a < Math.abs(c)) {
				a = c;
				var s = p / 4
			} else var s = p / (2 * Math.PI) * Math.asin(c / a);
			if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b
		},
		easeInBack: function(x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c * (t /= d) * t * ((s + 1) * t - s) + b
		},
		easeOutBack: function(x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
		},
		easeInOutBack: function(x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
			return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b
		},
		easeInBounce: function(x, t, b, c, d) {
			return c - $.easing.easeOutBounce(x, d - t, 0, c, d) + b
		},
		easeOutBounce: function(x, t, b, c, d) {
			if ((t /= d) < (1 / 2.75)) {
				return c * (7.5625 * t * t) + b
			} else if (t < (2 / 2.75)) {
				return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b
			} else if (t < (2.5 / 2.75)) {
				return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b
			} else {
				return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b
			}
		},
		easeInOutBounce: function(x, t, b, c, d) {
			if (t < d / 2) return $.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
			return $.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b
		}
	});
	$.extend({
		hiido: {
			domain: "ylog.hiido.com",
			ipPrefix: "183.61.2.",
			ips: [91, 92, 94, 95, 96, 97, 98],
			getServerUrl: function(host) {
				host = host || this.domain;
				var ptl = location.protocol;
				var path = "j.gif?";
				return ptl + "//" + host + "/" + path;
			},
			randomIp: function() {
				var Rand = Math.random();
				var index = Math.round(Rand * (this.ips.length - 1));
				var suff = this.ips[index];
				return this.ipPrefix + suff;
			},
			getParam: function(opt) {
				var obj = $.extend({
					act: 'webevent',
					uid: window.uid || 0,
					eventid: '',
					value: 1,
					class1: '',
					class2: '',
					eventype: 'click'
				}, opt);
				var param = [];
				obj.time = parseInt(1 * new Date() / 1000);
				obj.ui = this.getCookie("hiido_ui");
				obj.username = this.getCookie("username");
				for (var h in obj) {
					if (obj.hasOwnProperty(h)) {
						param.push(encodeURIComponent(h) + "=" + (obj[h] === undefined || obj[h] === null ? "" : encodeURIComponent(obj[h])))
					}
				}
				return param.join("&");
			},
			send: function(url, backurl, times) {
				var reties = times || 0;
				var img = new Image();
				var self = this;
				img.onerror = function() {
					if (reties <= 1) {
						self.send(url, backurl, ++reties);
					} else if (reties == 2) {
						self.send(backurl, backurl, ++reties);
					}
				}
				img.src = url;
			},
			getCookie: function(name) {
				var arr, RE = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
				if (arr = document.cookie.match(RE)) {
					return unescape(arr[2]);
				} else {
					return ''
				};
			},
			stat: function(o) {
				if (!o) return;
				var svr = $.hiido.getServerUrl();
				var param = $.hiido.getParam(o);
				var url = svr + param
				var backurl = $.hiido.getServerUrl($.hiido.randomIp()) + param;
				$.hiido.send(url, backurl)
			}
		}
	});
	$.fn.formly = function (options, callback) {
		var settings = {
			'theme': 'Base',
			'onBlur': true
		};
		if (options) {
			$.extend(settings, options);
		}
		var formName = this.attr('id');
		if (!formName) {
			formName = Math.ceil(Math.random() * 5000);
			this.attr('id', formName);
		}
		this.append('<div style="clear:both;"></div><div class="formlyAlerts"></div>');
		this.addClass('formlyWrapper-' + settings['theme']);
		if (this.attr('width')) {
			this.css('width', this.attr('width'));
		}
		if (this.attr('subtitle') || this.attr('title')) {
			this.prepend('<hr/>');
		}
		if (this.attr('subtitle')) {
			this.prepend('<h2>' + this.attr('subtitle') + '</h2>');
		}
		if (this.attr('title')) {
			this.prepend('<h1>' + this.attr('title') + '</h1>');
		}
		this.children().each(function (index, item) {
			if ($(item).attr('place')) {
				if ($(item).attr('type') == 'password') {
					var hID = 'pwPlace-' + $(item).attr('name');
					$(item).after('<input type="text" id="' + hID + '" value="' + $(item).attr('place') + '" class="formlyPWPlaces" />');
					$('#' + hID).css('color', '#bbb');
					$(item).hide();
					$('#' + hID).show();
					$('#' + hID).focus(function () {
						$('#' + hID).hide();
						$(item).show();
						$(item).focus();
					});
					$(item).blur(function () {
						if (!$(item).val()) {
							$('#' + hID).show();
							$(item).hide();
						}
					});
				} else {
					$(item).val($(item).attr('place'));
					$(item).css('color', '#bbb');
				}
			}
			$(item).blur(function () {
				if (!$(item).val() || $(item).val() == $(item).attr('pre-fix')) {
					if ($(item).attr('type') != 'password') {
						$(item).val($(item).attr('place'));
						$(item).css('color', '#bbb');
					}
				}
				if ($(item).attr('pre-fix')) {
					var originalVal = $(item).val();
					var thePrefix = $(item).attr('pre-fix');
					if (thePrefix.length == 1) {
						if (originalVal.charAt(0) != thePrefix && $(item).val() != $(item).attr('place')) {
							$(item).val(thePrefix + originalVal);
						}
					} else {
						if (originalVal.indexOf(thePrefix) == -1 && $(item).val() != $(item).attr('place')) {
							$(item).val(thePrefix + originalVal);
						}
					}
				}
				if (settings['onBlur']) {
					if ($(item).attr('validate')) {
						functions.validate(item);
					}
					if ($(item).attr('require')) {
						functions.require(item);
					}
					if ($(item).attr('match')) {
						functions.match(item);
					}
				}
			});
			$(item).focus(function () {
				if ($(item).attr('place')) {
					if ($(item).val() == $(item).attr('place')) {
						$(item).val('');
						$(item).css('color', '');
					}
				}
				if ($(item).attr('pre-fix') && !$(item).val()) {
					$(item).val('');
					$(item).val($(item).attr('pre-fix'));
				}
			});
			$('#' + formName).find('input:reset').click(function (item) {
				item.preventDefault();
				$('#' + formName).find('input:text, input:password, input:checkbox, input:radio').each(function () {
					$(this).css('border-color', '');
					if ($(this).is(':checked')) {
						$(this).attr('checked', false);
					}
					if ($(this).attr('place')) {
						if ($(this).attr('type') != 'password') {
							$(this).val($(this).attr('place'));
							$(this).css('color', '#bbb');
						} else {
							if ($(this).hasClass('formlyPWPlaces')) {
								$(this).show();
								$(this).prev('input').hide();
							} else {
								$(this).val('');
							}
						}
					} else {
						if ($(this).hasClass('formlyPWPlaces')) {
							$(this).show();
							$(this).prev('input').hide();
						} else {
							$(this).val('');
						}
					}
				});
				$('#' + formName).find('.formlyAlert').each(function () {
					$(this).fadeOut(function () {
						$(this).remove()
					});
				});
			});
		});
		this.submit(function (item) {
			var canSubmit = true;
			$(this).find('input').each(function () {
				if ($(this).attr('require')) {
					if (!functions.require(this)) {
						canSubmit = false;
					}
				}
				if ($(this).attr('validate')) {
					if (!functions.validate(this)) {
						canSubmit = false;
					}
				}
				if ($(this).attr('match')) {
					if (!functions.match(this)) {
						canSubmit = false;
					}
				}
			});
			if (!canSubmit) {
				item.preventDefault();
			} else {
				if (callback) {
					item.preventDefault();
					callback($(this).serialize());
				}
			}
		});
		var functions = {
			validateString: function (type, string) {
				if (type == 'email') {
					var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
					if (filter.test(string)) {
						return true;
					} else {
						return false;
					}
				} else if (type == 'http') {
					var filter = /http:\/\/[A-Za-z0-9\.-]{3,}\.[A-Za-z]{2,3}/i
					if (filter.test(string)) {
						return true;
					} else {
						return false;
					}
				}
			},
			validate: function (item) {
				var alertName = formName + $(item).attr('name');
				if ($(item).attr('validate') == 'email') {
					var valid = functions.validateString('email', $(item).val());
					var validType = 'email address';
				} else if ($(item).attr('validate') == 'http') {
					var valid = functions.validateString('http', $(item).val());
					var validType = 'web address';
				}
				if (!valid) {
					if (!$('#' + alertName).is(':visible')) {
						$('#' + formName).find('.formlyAlerts').append('<div class="formlyInvalid formlyAlert" id="' + alertName + '">Invalid ' + validType + '</div>')
						$('#' + alertName).fadeIn();
					}
					var borderColor = $('#' + alertName).css('background-color');
					$(item).css('border-color', borderColor);
					if ($(item).attr('type') == 'password') {
						$(item).next('.formlyPWPlaces').css('border-color', borderColor);
					}
					return false;
				} else {
					$('#' + alertName).fadeOut(function () {
						$(this).remove()
					});
					$(item).css('border-color', '');
					$('.formlyPWPlaces').css('border-color', '');
					return true;
				}
			},
			require: function (item) {
				var alertName = formName + $(item).attr('name');
				var label = $(item).attr('label') + ' ';
				if (label == 'undefined ') {
					label = '';
				}
				if (!$(item).val() || $(item).val() == $(item).attr('place')) {
					if (!$('#' + alertName).is(':visible')) {
						$('#' + formName).find('.formlyAlerts').append('<div class="formlyRequired formlyAlert" id="' + alertName + '">' + label + 'Required</div>')
						$('#' + alertName).fadeIn();
					}
					var borderColor = $('#' + alertName).css('background-color');
					$(item).css('border-color', borderColor);
					if ($(item).attr('type') == 'password') {
						$(item).next('.formlyPWPlaces').css('border-color', borderColor);
					}
					return false;
				} else if ($(item).attr('type') == 'checkbox' && !$(item).is(':checked')) {
					if (!$('#' + alertName).is(':visible')) {
						$('#' + formName).find('.formlyAlerts').append('<div class="formlyRequired formlyAlert" id="' + alertName + '">' + label + 'Required</div>')
						$('#' + alertName).fadeIn();
						$(item).focus();
					}
					var borderColor = $('#' + alertName).css('background-color');
					$(item).css('border-color', borderColor);
					return false;
				} else {
					$('#' + alertName).fadeOut(function () {
						$(this).remove()
					});
					$(item).css('border-color', '');
					$('.formlyPWPlaces').css('border-color', '');
					return true;
				}
			},
			match: function (item) {
				var alertName = formName + $(item).attr('name');
				var label = $(item).attr('label') + ' ';
				if (label == 'undefined ') {
					label = '';
				}
				var toMatch = $(item).attr('match');
				if ($(item).val() != $('#' + formName).find('input[name=' + toMatch + ']').val() || !$(item).val()) {
					if (!$('#' + alertName).is(':visible')) {
						$('#' + formName).find('.formlyAlerts').append('<div class="formlyInvalid formlyAlert" id="' + alertName + '">' + label + 'Does not match</div>')
						$('#' + alertName).fadeIn();
					}
					var borderColor = $('#' + alertName).css('background-color');
					$(item).css('border-color', borderColor);
					if ($(item).attr('type') == 'password') {
						$(item).next('.formlyPWPlaces').css('border-color', borderColor);
					}
					return false;
				} else {
					$('#' + alertName).fadeOut(function () {
						$(this).remove()
					});
					$(item).css('border-color', '');
					$('.formlyPWPlaces').css('border-color', '');
					return true;
				}
			}
		};
	};
})(jQuery);
(function($) {
	var reverse = function(value) {
		return value.split('').reverse().join('');
	};
	var defaults = {
		numberStep: function(now, tween) {
			var floored_number = Math.floor(now),
				target = $(tween.elem);
			target.text(floored_number);
		}
	};
	var handle = function( tween ) {
		var elem = tween.elem;
		if ( elem.nodeType && elem.parentNode ) {
			var handler = elem._animateNumberSetter;
			if (!handler) {
				handler = defaults.numberStep;
			}
			handler(tween.now, tween);
		}
	};
	if (!$.Tween || !$.Tween.propHooks) {
		$.fx.step.number = handle;
	} else {
		$.Tween.propHooks.number = {
			set: handle
		};
	}
	var extract_number_parts = function(separated_number, group_length) {
		var numbers = separated_number.split('').reverse(),
			number_parts = [],
			current_number_part,
			current_index,
			q;
		for(var i = 0, l = Math.ceil(separated_number.length / group_length); i < l; i++) {
			current_number_part = '';
			for(q = 0; q < group_length; q++) {
				current_index = i * group_length + q;
				if (current_index === separated_number.length) {
					break;
				}
				current_number_part = current_number_part + numbers[current_index];
			}
			number_parts.push(current_number_part);
		}
		return number_parts;
	};
	var remove_precending_zeros = function(number_parts) {
		var last_index = number_parts.length - 1,
			last = reverse(number_parts[last_index]);
		number_parts[last_index] = reverse(parseInt(last, 10).toString());
		return number_parts;
	};
	$.animateNumber = {
		numberStepFactories: {
			append: function(suffix) {
				return function(now, tween) {
					var floored_number = Math.floor(now),
						target = $(tween.elem);
					target.prop('number', now).text(floored_number + suffix);
				};
			},
			separator: function(separator, group_length) {
				separator = separator || ' ';
				group_length = group_length || 3;
				return function(now, tween) {
					var floored_number = Math.floor(now),
						separated_number = floored_number.toString(),
						target = $(tween.elem);
					if (separated_number.length > group_length) {
						var number_parts = extract_number_parts(separated_number, group_length);
						separated_number = remove_precending_zeros(number_parts).join(separator);
						separated_number = reverse(separated_number);
					}
					target.prop('number', now).text(separated_number);
				};
			}
		}
	};
	$.fn.animateNumber = function() {
		var options = arguments[0],
			settings = $.extend({}, defaults, options),
			target = $(this),
			args = [settings];
		for(var i = 1, l = arguments.length; i < l; i++) {
			args.push(arguments[i]);
		}
		if (options.numberStep) {
			var items = this.each(function(){
				this._animateNumberSetter = options.numberStep;
			});
			var generic_complete = settings.complete;
			settings.complete = function() {
				items.each(function(){
					delete this._animateNumberSetter;
				});
				if ( generic_complete ) {
					generic_complete.apply(this, arguments);
				}
			};
		}
		return target.animate.apply(target, args);
	};
}(jQuery));
!function(window, undefined){
	"use strict";
	var pathType = false,
		pathUrl = '/static/ysrc/layer/',
		$, win, ready = {
			host: 'http://' + location.host,
			getPath: function(){
				var js = document.scripts, jsPath = js[js.length - 1].src;
				if(pathType){
					return jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
				} else {
					return this.host + pathUrl;
				}
			},
			type: ['dialog', 'page', 'iframe', 'loading', 'tips']
		};
	window.layer = {
		v: '1.8.3',
		ie6: !-[1,] && !window.XMLHttpRequest,
		index: 0,
		path: ready.getPath(),
		use: function(module, callback){
			var i = 0, head = $('head')[0];
			var module = module.replace(/\s/g, '');
			var iscss = /\.css$/.test(module);
			var node = document.createElement(iscss ? 'link' : 'script');
			var id = module.replace(/\.|\//g, '');
			if(iscss){
				node.type = 'text/css';
				node.rel = 'stylesheet';
			}
			node[iscss ? 'href' : 'src'] = /^http:\/\//.test(module) ? module : layer.path + module;
			node.id = id;
			if(!$('#'+ id)[0]){
				head.appendChild(node);
			}
			if(callback){
				if(document.all){
					$(node).ready(callback);
				} else {
					$(node).load(callback);
				}
			}
		},
		ready: function(callback){
			layer.use('skin/layer.css', callback);
		},
		alert: function(msg, icon, fn, yes){
			var isfn = (typeof fn === 'function'), conf = {
				dialog: {msg: msg, type: icon, yes: isfn ? fn : yes},
				area: ['auto', 'auto']
			};
			isfn || (conf.title = fn);
			return $.layer(conf);
		},
		confirm: function(msg, yes, fn, no){
			var isfn = (typeof fn === 'function'), conf = {
				dialog: {msg: msg, type: 4, btns: 2, yes: yes, no: isfn ? fn : no}
			};
			isfn || (conf.title = fn);
			return $.layer(conf);
		},
		msg: function(msg, time, parme, end){
			var conf = {
				title: false,
				closeBtn: false,
				time: time === undefined ? 2 : time,
				dialog: {msg: (msg === '' || msg === undefined) ? '&nbsp;' : msg},
				end: end
			};
			if(typeof parme === 'object'){
				conf.dialog.type = parme.type;
				conf.shade = parme.shade;
				conf.success = function(){layer.shift(parme.rate)};
			} else if(typeof parme === 'function') {
				conf.end = parme
			} else {
				conf.dialog.type = parme;
			}
			return $.layer(conf);
		},
		load: function(parme, icon){
			if(typeof parme === 'string'){
				return layer.msg(parme, icon || 0, 16);
			} else {
				return $.layer({
					time: parme,
					loading: {type : icon},
					bgcolor: icon ? '#fff' : '',
					shade: icon ? [0.1, '#000'] : [0],
					border: (icon === 3 || !icon) ? false : [6, 0.3, '#000'],
					type : 3,
					title : ['',false],
					closeBtn : [0 , false]
				});
			}
		},
		tips: function(html, follow, parme, maxWidth, guide, style){
			var conf = {type: 4, shade: false, success: function(layerE){
				if(!this.closeBtn){
					layerE.find('.xubox_tips').css({'padding-right': 10});
				}
			}, bgcolor:'', tips:{msg: html, follow: follow}};
			parme = parme || {};
			conf.time = parme.time || parme;
			conf.closeBtn = parme.closeBtn || false
			conf.maxWidth = parme.maxWidth || maxWidth;
			conf.tips.guide = parme.guide || guide;
			conf.tips.style = parme.style || style;
			return $.layer(conf);
		}
	};
	var doms = {lay: 'xubox_layer', ifr: 'xubox_iframe', title: '.xubox_title', text: '.xubox_text', page: '.xubox_page'};
	var Class = function(setings){
		var that = this, config = that.config;
		layer.index++;
		that.index = layer.index;
		that.config = $.extend({} , config , setings);
		that.config.dialog = $.extend({}, config.dialog , setings.dialog);
		that.config.page = $.extend({}, config.page , setings.page);
		that.config.iframe = $.extend({}, config.iframe , setings.iframe);
		that.config.loading = $.extend({}, config.loading , setings.loading);
		that.config.tips = $.extend({}, config.tips , setings.tips);
		that.creat();
	};
	Class.pt = Class.prototype;
	Class.pt.config = layer.config || {
		type: 0,
		shade: [0.3, '#000'],
		shadeClose: false,
		fix: true,
		move: '.xubox_title',
		moveOut: false,
		title: ['信息', true],
		offset: ['200px', '50%'],
		area: ['310px', 'auto'],
		closeBtn: [0, true],
		time: 0,
		bgcolor: '#fff',
		border: [6, 0.3, '#000'],
		zIndex: 19891014,
		maxWidth: 400,
		dialog: {btns : 1, btn : ['确定','取消'], type : 8, msg : '', yes : function(index){ layer.close(index);}, no : function(index){ layer.close(index);}
		},
		page: {dom: '#xulayer', html: '', url: ''},
		iframe: {src: 'http://sentsin.com', scrolling: 'auto'},
		loading: {type: 0},
		tips: {msg: '', follow: '', guide: 0, isGuide: true, style: ['background-color:#FF9900; color:#fff;', '#FF9900']},
		success: function(layer){},
		close: function(index){ layer.close(index);},
		end: function(){}
	};
	Class.pt.space = function(html){
		var that = this, html = html || '', times = that.index, config = that.config, dialog = config.dialog,
			ico = dialog.type === -1 ? '' : '<span class="xubox_msg xulayer_png32 xubox_msgico xubox_msgtype' + dialog.type + '"></span>',
			frame = [
				'<div class="xubox_dialog">'+ ico +'<span class="xubox_msg xubox_text" style="'+ (ico ? '' : 'padding-left:20px') +'">' + dialog.msg + '</span></div>',
				'<div class="xubox_page">'+ html +'</div>',
				'<iframe scrolling="'+ config.iframe.scrolling +'" allowtransparency="true" id="'+ doms.ifr +''+ times +'" name="'+ doms.ifr +''+ times +'" onload="this.className=\''+ doms.ifr +'\'" class="'+ doms.ifr +'" frameborder="0" src="' + config.iframe.src + '"></iframe>',
				'<span class="xubox_loading xubox_loading_'+ config.loading.type +'"></span>',
				'<div class="xubox_tips" style="'+ config.tips.style[0] +'"><div class="xubox_tipsMsg">'+ config.tips.msg +'</div><i class="layerTipsG"></i></div>'
			],
			shade = '' , border = '', zIndex = config.zIndex + times,
			shadeStyle = 'z-index:'+ zIndex +'; background-color:'+ config.shade[1] +'; opacity:'+ config.shade[0] +'; filter:alpha(opacity='+ config.shade[0]*100 +');';
		config.shade[0] && (shade = '<div times="'+ times +'" id="xubox_shade' + times + '" class="xubox_shade" style="'+ shadeStyle +'"></div>');
		config.zIndex = zIndex;
		var title = '', closebtn = '', borderStyle = "z-index:"+ (zIndex-1) +";  background-color: "+ config.border[2] +"; opacity:"+ config.border[1] +"; filter:alpha(opacity="+ config.border[1]*100 +"); top:-"+ config.border[0] +"px; left:-"+ config.border[0] +"px;";
		config.border[0] && (border = '<div id="xubox_border'+ times +'" class="xubox_border" style="'+ borderStyle +'"></div>');
		if(config.maxmin && (config.type === 1 || config.type === 2) && (!/^\d+%$/.test(config.area[0]) || !/^\d+%$/.test(config.area[1]))){
			closebtn = '<a class="xubox_min" href="javascript:;"><cite></cite></a><a class="xubox_max xulayer_png32" href="javascript:;"></a>';
		}
		config.closeBtn[1] && (closebtn += '<a class="xubox_close xulayer_png32 xubox_close' + config.closeBtn[0] +'" href="javascript:;" style="'+ (config.type === 4 ? 'position:absolute; right:-3px; _right:7px; top:-4px;' : '') +'"></a>');
		config.title[1] && (title = '<div class="xubox_title"><em>' + config.title[0] + '</em></div>');
		return [shade,
			'<div times="'+ times +'" showtime="'+ config.time +'" style="z-index:'+ zIndex +'" id="'+ doms.lay +''+ times
				+'" class="'+ doms.lay +'">'
				+ '<div style="background-color:'+ config.bgcolor +'; z-index:'+ zIndex +'" class="xubox_main">'
				+ frame[config.type]
				+ title
				+ '<span class="xubox_setwin">'+ closebtn + '</span>'
				+ '<span class="xubox_botton"></span>'
				+ '</div>'+ border + '</div>'
		];
	};
	Class.pt.creat = function(){
		var that = this , space = '', config = that.config, dialog = config.dialog, times = that.index;
		var page = config.page, body = $("body"), setSpace = function(html){
			var html = html || '';
			space = that.space(html);
			body.append($(space[0]));
		};
		if(config.title === false){
			config.title = [];
		} else if(typeof config.title === 'string') {
			config.title = [config.title, true]
		}
		switch(config.type){
			case 0:
				config.title[1] || (config.area = ['auto','auto']);
				$('.xubox_dialog')[0] && layer.close($('.xubox_dialog').parents('.'+ doms.lay).attr('times'));
				break;
			case 1:
				if(page.html !== ''){
					setSpace('<div class="xuboxPageHtml">'+ page.html +'</div>');
					body.append($(space[1]));
				} else if (page.url !== ''){
					setSpace('<div class="xuboxPageHtml" id="xuboxPageHtml'+ times +'">'+ page.html +'</div>');
					body.append($(space[1]));
					$.get(page.url, function(datas){
						$('#xuboxPageHtml'+ times).html(datas.toString());
						page.ok && page.ok(datas);
					});
				} else {
					if($(page.dom).parents(doms.page).length == 0){
						setSpace();
						$(page.dom).show().wrap($(space[1]));
					} else {
						return;
					}
				}
				break;
			case 3:
				config.title = [];
				config.area = ['auto', 'auto'];
				config.closeBtn = ['', false];
				$('.xubox_loading')[0] && layer.close($('.xubox_loading').parents('.'+ doms.lay).attr('times'));
				break;
			case 4:
				config.title = [];
				config.area = ['auto', 'auto'];
				config.fix = false;
				config.border = [0];
				$('.xubox_tips')[0] && layer.close($('.xubox_tips').parents('.'+ doms.lay).attr('times'));
				break;
		};
		if(config.type !== 1){
			setSpace();
			body.append($(space[1]));
		}
		var layerE = that.layerE = $('#'+ doms.lay + times);
		if(config.offset[0].indexOf("px") != -1){
			that.offsetTop = parseFloat(config.offset[0]);
		} else {
			that.offsetTop = parseFloat(config.offset[0])/100 * win.height();
		}
		that.offsetTop = that.offsetTop + config.border[0] + (config.fix ? 0 : win.scrollTop());
		if(config.offset[1].indexOf("px") != -1){
			that.offsetLeft = parseFloat(config.offset[1]) + config.border[0];
		} else {
			config.offset[1] = config.offset[1] === '' ? '50%' : config.offset[1];
			if(config.offset[1] === '50%'){
				that.offsetLeft = config.offset[1];
			}else{
				that.offsetLeft =  parseFloat(config.offset[1])/100 * win.width() + config.border[0];
			}
		};
		layerE.css({left: that.offsetLeft, top: that.offsetTop, width: config.area[0], height: config.area[1]});
		config.fix || layerE.css({position: 'absolute'});
		if(config.title[1] && (config.type !== 3 || config.type !== 4)){
			var confbtn = config.type === 0 ? dialog : config, layerBtn = layerE.find('.xubox_botton');
			confbtn.btn = config.btn || dialog.btn;
			switch(confbtn.btns){
				case 0:
					layerBtn.html('').hide();
					break;
				case 1:
					layerBtn.html('<a href="javascript:;" class="xubox_yes xubox_botton1">'+ confbtn.btn[0] +'</a>');
					break;
				case 2:
					layerBtn.html('<a href="javascript:;" class="xubox_yes xubox_botton2">'+ confbtn.btn[0] +'</a>' + '<a href="javascript:;" class="xubox_no xubox_botton3">'+ confbtn.btn[1] + '</a>');
					break;
			}
		}
		if(layerE.css('left') === 'auto'){
			layerE.hide();
			setTimeout(function(){
				layerE.show();
				that.set(times);
			}, 500);
		}else{
			that.set(times);
		}
		config.time <= 0 || that.autoclose();
		that.callback();
	};
	ready.fade = function(obj, time, opa){
		obj.css({opacity: 0}).animate({opacity: opa}, time);
	};
	Class.pt.set = function(times){
		var that = this, layerE = that.layerE, layerTitle = layerE.find(doms.title);
		var config = that.config, dialog = config.dialog, page = config.page, loading = config.loading;
		that.autoArea(times);
		if(config.title[1]){
			if(config.type === 0){
				layer.ie6 && layerTitle.css({width : layerE.outerWidth()});
			}
		}else{
			config.type != 4 && layerE.find('.xubox_close').addClass('xubox_close1');
		};
		layerE.attr({'type' :  ready.type[config.type]});
		switch(config.type){
			case 0:
				layerE.find('.xubox_main').css({'background-color': '#fff'});
				if(config.title[1]){
					layerE.find(doms.text).css({paddingTop: 18 + layerTitle.outerHeight()});
				}else{
					layerE.find('.xubox_msgico').css({top: 8});
					layerE.find(doms.text).css({marginTop : 11});
				}
				break;
			case 1:
				layerE.find(page.dom).addClass('layer_pageContent');
				config.shade[0] && layerE.css({zIndex: config.zIndex + 1});
				config.title[1] && layerE.find(doms.page).css({top: layerTitle.outerHeight()});
				break;
			case 2:
				var iframe = layerE.find('.'+ doms.ifr), heg = layerE.height();
				iframe.addClass('xubox_load').css({width: layerE.width()});
				config.title[1] ? iframe.css({top: layerTitle.height(), height: heg - layerTitle.height()}) : iframe.css({top: 0, height : heg});
				layer.ie6 && iframe.attr('src', config.iframe.src);
				break;
			case 4:
				var layArea = [0, layerE.outerHeight()], fow = $(config.tips.follow), fowo = {
					width: fow.outerWidth(),
					height: fow.outerHeight(),
					top: fow.offset().top,
					left: fow.offset().left
				}, tipsG = layerE.find('.layerTipsG');
				config.tips.isGuide || tipsG.remove();
				layerE.outerWidth() > config.maxWidth && layerE.width(config.maxWidth);
				fowo.tipColor = config.tips.style[1];
				layArea[0] = layerE.outerWidth();
				fowo.where = [function(){
					fowo.tipLeft = fowo.left;
					fowo.tipTop = fowo.top - layArea[1] - 10;
					tipsG.removeClass('layerTipsB').addClass('layerTipsT').css({'border-right-color': fowo.tipColor});
				}, function(){
					fowo.tipLeft = fowo.left + fowo.width + 10;
					fowo.tipTop = fowo.top;
					tipsG.removeClass('layerTipsL').addClass('layerTipsR').css({'border-bottom-color': fowo.tipColor});
				}, function(){
					fowo.tipLeft = fowo.left;
					fowo.tipTop = fowo.top + fowo.height + 10;
					tipsG.removeClass('layerTipsT').addClass('layerTipsB').css({'border-right-color': fowo.tipColor});
				}, function(){
					fowo.tipLeft = fowo.left - layArea[0] + 10;
					fowo.tipTop = fowo.top;
					tipsG.removeClass('layerTipsR').addClass('layerTipsL').css({'border-bottom-color': fowo.tipColor});
				}];
				fowo.where[config.tips.guide]();
				if(config.tips.guide === 0){
					fowo.top - (win.scrollTop() + layArea[1] + 8*2) < 0 && fowo.where[2]();
				} else if (config.tips.guide === 1){
					win.width() - (fowo.left + fowo.width + layArea[0] + 8*2) > 0 || fowo.where[3]()
				} else if (config.tips.guide === 2){
					(fowo.top - win.scrollTop() + fowo.height + layArea[1] + 8*2) - win.height() > 0 && fowo.where[0]();
				} else if (config.tips.guide === 3){
					layArea[0] + 8*2 - fowo.left > 0 && fowo.where[1]()
				}
				layerE.css({left: fowo.tipLeft, top: fowo.tipTop});
				break;
		};
		if(config.fadeIn){
			ready.fade(layerE, config.fadeIn, 1);
			ready.fade($('#xubox_shade'+ times), config.fadeIn, config.shade[0]);
		}
		that.move();
	};
	Class.pt.autoArea = function(times){
		var that = this, times = times || that.index, config = that.config, page = config.page;
		var layerE = $('#'+ doms.lay + times), layerTitle = layerE.find(doms.title), layerMian = layerE.find('.xubox_main');
		var titHeight = config.title[1] ? layerTitle.innerHeight() : 0, outHeight, btnHeight = 0;
		if(config.area[0] === 'auto' && layerMian.outerWidth() >= config.maxWidth){
			layerE.css({width : config.maxWidth});
		}
		switch(config.type){
			case 0:
				var aBtn = layerE.find('.xubox_botton>a');
				outHeight = layerE.find(doms.text).outerHeight() + 20;
				if(aBtn.length > 0){
					btnHeight = aBtn.outerHeight() +  20;
				}
				break;
			case 1:
				var layerPage = layerE.find(doms.page);
				outHeight = $(page.dom).outerHeight();
				config.area[0] === 'auto' && layerE.css({width : layerPage.outerWidth()});
				if(page.html !== '' || page.url !== ''){
					outHeight = layerPage.outerHeight();
				}
				break;
			case 2:
				layerE.find('iframe').css({width: layerE.outerWidth(), height: layerE.outerHeight() - (config.title[1] ? layerTitle.innerHeight() : 0)});
				break;
			case 3:
				var load = layerE.find(".xubox_loading");
				outHeight = load.outerHeight();
				layerMian.css({width: load.width()});
				break;
		};
		(config.area[1] === 'auto') && layerMian.css({height: titHeight + outHeight + btnHeight});
		$('#xubox_border' + times).css({width: layerE.outerWidth() + 2*config.border[0] , height: layerE.outerHeight() + 2*config.border[0]});
		(layer.ie6 && config.area[0] !== 'auto') && layerMian.css({width : layerE.outerWidth()});
		(config.offset[1] === '50%' || config.offset[1] == '') && (config.type !== 4) ? layerE.css({marginLeft : -layerE.outerWidth()/2}) : layerE.css({marginLeft : 0});
	};
	Class.pt.move = function(){
		var that = this, config = that.config, conf = {
			setY: 0,
			moveLayer: function(){
				if(parseInt(conf.layerE.css('margin-left')) == 0){
					var lefts = parseInt(conf.move.css('left'));
				}else{
					var lefts = parseInt(conf.move.css('left')) + (-parseInt(conf.layerE.css('margin-left')))
				}
				if(conf.layerE.css('position') !== 'fixed'){
					lefts = lefts - conf.layerE.parent().offset().left;
					conf.setY = 0
				}
				conf.layerE.css({left: lefts, top: parseInt(conf.move.css('top')) - conf.setY});
			}
		};
		config.move && that.layerE.find(config.move).attr('move','ok');
		config.move ? that.layerE.find(config.move).css({cursor: 'move'}) : that.layerE.find(config.move).css({cursor: 'auto'});
		$(config.move).on('mousedown', function(M){
			M.preventDefault();
			if($(this).attr('move') === 'ok'){
				conf.ismove = true;
				conf.layerE = $(this).parents('.'+ doms.lay);
				var xx = conf.layerE.offset().left, yy = conf.layerE.offset().top, ww = conf.layerE.width() - 6, hh = conf.layerE.height() - 6;
				if(!$('#xubox_moves')[0]){
					$('body').append('<div id="xubox_moves" class="xubox_moves" style="left:'+ xx +'px; top:'+ yy +'px; width:'+ ww +'px; height:'+ hh +'px; z-index:2147483584"></div>');
				}
				conf.move = $('#xubox_moves');
				config.moveType && conf.move.css({opacity: 0});
				conf.moveX = M.pageX - conf.move.position().left;
				conf.moveY = M.pageY - conf.move.position().top;
				conf.layerE.css('position') !== 'fixed' || (conf.setY = win.scrollTop());
			}
		});
		$(document).mousemove(function(M){
			if(conf.ismove){
				var offsetX = M.pageX - conf.moveX, offsetY = M.pageY - conf.moveY;
				M.preventDefault();
				if(!config.moveOut){
					conf.setY = win.scrollTop();
					var setRig = win.width() - conf.move.outerWidth() - config.border[0], setTop = config.border[0] + conf.setY;
					offsetX < config.border[0] && (offsetX = config.border[0]);
					offsetX > setRig && (offsetX = setRig);
					offsetY < setTop && (offsetY = setTop);
					offsetY > win.height() - conf.move.outerHeight() - config.border[0] + conf.setY && (offsetY = win.height() - conf.move.outerHeight() - config.border[0] + conf.setY);
				}
				conf.move.css({left: offsetX, top: offsetY});
				config.moveType && conf.moveLayer();
				offsetX = null;
				offsetY = null;
				setRig = null;
				setTop = null
			}
		}).mouseup(function(){
				try{
					if(conf.ismove){
						conf.moveLayer();
						conf.move.remove();
					}
					conf.ismove = false;
				}catch(e){
					conf.ismove = false;
				}
				config.moveEnd && config.moveEnd();
			});
	};
	Class.pt.autoclose = function(){
		var that = this, time = that.config.time, maxLoad = function(){
			time--;
			if(time === 0){
				layer.close(that.index);
				clearInterval(that.autotime);
			}
		};
		that.autotime = setInterval(maxLoad , 1000);
	};
	ready.config = {
		end : {}
	};
	Class.pt.callback = function(){
		var that = this, layerE = that.layerE, config = that.config, dialog = config.dialog;
		that.openLayer();
		that.config.success(layerE);
		layer.ie6 && that.IE6(layerE);
		layerE.find('.xubox_close').on('click', function(){
			config.close(that.index);
			layer.close(that.index);
		});
		layerE.find('.xubox_yes').on('click',function(){
			config.yes ? config.yes(that.index) : dialog.yes(that.index);
		});
		layerE.find('.xubox_no').on('click',function(){
			config.no ? config.no(that.index) : dialog.no(that.index);
			layer.close(that.index);
		});
		if(that.config.shadeClose){
			$('#xubox_shade'+ that.index).on('click', function(){
				layer.close(that.index);
			});
		}
		layerE.find('.xubox_min').on('click', function(){
			layer.min(that.index, config);
			config.min && config.min(layerE);
		});
		layerE.find('.xubox_max').on('click', function(){
			if($(this).hasClass('xubox_maxmin')){
				layer.restore(that.index);
				config.restore && config.restore(layerE);
			} else {
				layer.full(that.index, config);
				config.full && config.full(layerE);
			}
		});
		ready.config.end[that.index] = config.end;
	};
	ready.reselect = function(){
		$.each($('select'), function(index , value){
			var sthis = $(this);
			if(!sthis.parents('.'+doms.lay)[0]){
				(sthis.attr('layer') == 1 && $('.'+doms.lay).length < 1) && sthis.removeAttr('layer').show();
			}
			sthis = null;
		});
	};
	Class.pt.IE6 = function(layerE){
		var that = this;
		var _ieTop = layerE.offset().top;
		if(that.config.fix){
			var ie6Fix = function(){
				layerE.css({top : win.scrollTop() + _ieTop});
			};
		}else{
			var ie6Fix = function(){
				layerE.css({top : _ieTop});
			};
		}
		ie6Fix();
		win.scroll(ie6Fix);
		$.each($('select'), function(index , value){
			var sthis = $(this);
			if(!sthis.parents('.'+doms.lay)[0]){
				sthis.css('display') == 'none' || sthis.attr({'layer' : '1'}).hide();
			}
			sthis = null;
		});
	};
	Class.pt.openLayer = function(){
		var that = this;
		layer.autoArea = function(index){
			return that.autoArea(index);
		};
		layer.shift = function(type, rate, stop){
			if(layer.ie6){
				return;
			}
			var config = that.config, layerE = that.layerE, cutWth = 0, ww = win.width(), wh = win.height() + (config.fix ? 0 : win.scrollTop());
			(config.offset[1] == '50%' || config.offset[1] == '') ? cutWth = layerE.outerWidth()/2 : cutWth = layerE.outerWidth();
			var anim = {
				t: {top: that.offsetTop},
				b: {top : wh - layerE.outerHeight() - config.border[0]},
				cl: cutWth + config.border[0],
				ct: -layerE.outerHeight(),
				cr: ww - cutWth - config.border[0]
			};
			switch(type){
				case 'left-top': layerE.css({left: anim.cl, top: anim.ct}).animate(anim.t, rate);
					break;
				case 'top': layerE.css({top: anim.ct}).animate(anim.t, rate);
					break;
				case 'right-top': layerE.css({left: anim.cr, top: anim.ct}).animate(anim.t, rate);
					break;
				case 'right-bottom': layerE.css({left: anim.cr, top: wh}).animate(stop ? anim.t : anim.b, rate);
					break;
				case 'bottom': layerE.css({top: wh}).animate(stop ? anim.t : anim.b, rate);
					break;
				case 'left-bottom': layerE.css({left: anim.cl, top: wh}).animate(stop ? anim.t : anim.b, rate);
					break;
				case 'left': layerE.css({left: -layerE.outerWidth()}).animate({left: that.offsetLeft}, rate);
					break;
			}
		};
		layer.setMove = function(){
			return that.move();
		};
		layer.zIndex = that.config.zIndex;
		layer.setTop = function(layerNow){
			var setZindex = function(){
				layer.zIndex++;
				layerNow.css('z-index', layer.zIndex + 1);
			};
			layer.zIndex = parseInt(layerNow[0].style.zIndex);
			layerNow.on('mousedown', setZindex);
			return layer.zIndex;
		};
	};
	ready.isauto = function(layero, options, offset){
		options.area[0] === 'auto' && (options.area[0] = layero.outerWidth());
		options.area[1] === 'auto' && (options.area[1]  = layero.outerHeight());
		layero.attr({area: options.area + ',' + offset});
		layero.find('.xubox_max').addClass('xubox_maxmin');
	};
	ready.rescollbar = function(index){
		if(doms.html.attr('layer-full') == index){
			if(doms.html[0].style.removeProperty){
				doms.html[0].style.removeProperty('overflow');
			} else {
				doms.html[0].style.removeAttribute('overflow');
			}
			doms.html.removeAttr('layer-full');
		}
	};
	layer.getIndex = function(selector){
		return $(selector).parents('.'+doms.lay).attr('times');
	};
	layer.getChildFrame = function(selector, index){
		index = index || $('.'+ doms.ifr).parents('.'+doms.lay).attr('times');
		return $('#'+ doms.lay + index).find('.'+ doms.ifr).contents().find(selector);
	};
	layer.getFrameIndex = function(name){
		return $(name ? '#'+ name : '.'+ doms.ifr).parents('.'+doms.lay).attr('times');
	};
	layer.iframeAuto = function(index){
		index = index || $('.'+ doms.ifr).parents('.'+doms.lay).attr('times');
		var heg = layer.getChildFrame('body', index).outerHeight(),
			layero = $('#'+ doms.lay + index), tit = layero.find(doms.title), titHt = 0;
		tit && (titHt = tit.height());
		layero.css({height: heg + titHt});
		var bs = -parseInt($('#xubox_border'+ index).css('top'));
		$('#xubox_border'+ index).css({height: heg + 2*bs + titHt});
		$('#'+ doms.ifr + index).css({height: heg});
	};
	layer.iframeSrc = function(index, url){
		$('#'+ doms.lay + index).find('iframe').attr('src', url);
	};
	layer.area = function(index, options){
		var layero = [$('#'+ doms.lay + index), $('#xubox_border'+ index)],
			type = layero[0].attr('type'), main = layero[0].find('.xubox_main'),
			title = layero[0].find(doms.title);
		if(type === ready.type[1] || type === ready.type[2]){
			layero[0].css(options);
			main.css({width: options.width, height: options.height});
			if(type === ready.type[2]){
				var iframe = layero[0].find('iframe');
				iframe.css({width: options.width, height: title ? options.height - title.innerHeight() : options.height});
			}
			if(layero[0].css('margin-left') !== '0px') {
				options.hasOwnProperty('top') && layero[0].css({top: options.top - (layero[1][0] ? parseFloat(layero[1].css('top')) : 0)});
				options.hasOwnProperty('left') && layero[0].css({left: options.left + layero[0].outerWidth()/2 - (layero[1][0] ? parseFloat(layero[1].css('left')) : 0)});
				layero[0].css({marginLeft : -layero[0].outerWidth()/2});
			}
			if(layero[1][0]){
				layero[1].css({
					width: parseFloat(options.width) - 2*parseFloat(layero[1].css('left')),
					height: parseFloat(options.height) - 2*parseFloat(layero[1].css('top'))
				});
			}
		}
	};
	layer.min = function(index, options){
		var layero = $('#'+ doms.lay + index), offset = [layero.position().top, layero.position().left + parseFloat(layero.css('margin-left'))];
		ready.isauto(layero, options, offset);
		layer.area(index, {width: 180, height: 35});
		layero.find('.xubox_min').hide();
		layero.attr('type') === 'page' && layero.find(doms.page).hide();
		ready.rescollbar(index);
	};
	layer.restore = function(index){
		var layero = $('#'+ doms.lay + index), area = layero.attr('area').split(',');
		var type = layero.attr('type');
		layer.area(index, {
			width: parseFloat(area[0]),
			height: parseFloat(area[1]),
			top: parseFloat(area[2]),
			left: parseFloat(area[3])
		});
		layero.find('.xubox_max').removeClass('xubox_maxmin');
		layero.find('.xubox_min').show();
		layero.attr('type') === 'page' && layero.find(doms.page).show();
		ready.rescollbar(index);
	};
	layer.full = function(index, options){
		var layero = $('#'+ doms.lay + index), borders = options.border[0]*2, timer;
		var offset = [layero.position().top, layero.position().left + parseFloat(layero.css('margin-left'))];
		ready.isauto(layero, options, offset);
		if(!doms.html.attr('layer-full')){
			doms.html.css('overflow','hidden').attr('layer-full', index);
		}
		clearTimeout(timer);
		timer = setTimeout(function(){
			layer.area(index, {
				top: layero.css('position') === 'fixed' ? 0 : win.scrollTop(),
				left: layero.css('position') === 'fixed' ? 0 : win.scrollLeft(),
				width: win.width() - borders,
				height: win.height() - borders
			});
		}, 100);
	};
	layer.close = function(index){
		var layero = $('#'+ doms.lay + index), type = layero.attr('type'), shadeNow = $('#xubox_moves, #xubox_shade' + index);
		if(!layero[0]){
			return;
		}
		if(type == ready.type[1]){
			if(layero.find('.xuboxPageHtml')[0]){
				layero[0].innerHTML = '';
				layero.remove();
			}else{
				layero.find('.xubox_setwin,.xubox_close,.xubox_botton,.xubox_title,.xubox_border').remove();
				for(var i = 0 ; i < 3 ; i++){
					layero.find('.layer_pageContent').unwrap().hide();
				}
			}
		}else{
			layero[0].innerHTML = '';
			layero.remove();
		}
		shadeNow.remove();
		layer.ie6 && ready.reselect();
		ready.rescollbar(index);
		typeof ready.config.end[index] === 'function' && ready.config.end[index]();
		delete ready.config.end[index];
	};
	layer.closeLoad = function(){
		layer.close($('.xubox_loading').parents('.'+doms.lay).attr('times'));
	};
	layer.closeTips = function(){
		layer.close($('.xubox_tips').parents('.'+doms.lay).attr('times'));
	};
	layer.closeAll = function(){
		$.each($('.'+doms.lay), function(){
			layer.close($(this).attr('times'));
		});
	};
	ready.run = function(){
		$ = jQuery;
		win = $(window);
		doms.html = $('html');
		layer.use('skin/layer.css');
		$.layer = function(deliver){
			var o = new Class(deliver);
			return o.index;
		};
		(new Image()).src = layer.path + 'skin/default/xubox_ico0.png';
	};
	var require = '../../init/jquery';
	if(window.seajs){
		define([require], function(require, exports, module){
			ready.run();
			exports.layer = [window.layer, window['$'].layer];
		});
	}else{
		ready.run();
	}
}(window);
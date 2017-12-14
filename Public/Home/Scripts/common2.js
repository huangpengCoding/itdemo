/**
 * Created by zhongliang on 14-3-22.
 */

jQuery(function() {
	if ((jQuery.browser.msie && jQuery.browser.version == 6.0) || !jQuery('#headnav')[0]) {

	} else {
		var FixedBox = function(el) {
			this.element = el;
			this.BoxY = getXY(this.element).y;
		}
		FixedBox.prototype = {
			setCss: function() {
				var windowST = (document.compatMode && document.compatMode != "CSS1Compat") ? document.body.scrollTop : document.documentElement.scrollTop || window.pageYOffset;

				if (windowST > this.BoxY) {
					jQuery(this.element).addClass("header_fixed");
				} else {
					jQuery(this.element).removeClass("header_fixed");
				}


			}
		};
		function addEvent(elm, evType, fn, useCapture) {
			if (elm.addEventListener) {
				elm.addEventListener(evType, fn, useCapture);
				return true;
			} else if (elm.attachEvent) {
				var r = elm.attachEvent('on' + evType, fn);
				return r;
			} else {
				elm['on' + evType] = fn;
			}
		}

		function getXY(el) {
			return document.documentElement.getBoundingClientRect && (function() {
				var pos = el.getBoundingClientRect();
				return {
					x: pos.left + document.documentElement.scrollLeft,
					y: pos.top + document.documentElement.scrollTop
				};
			})() || (function() {
				var _x = 0,
					_y = 0;
				do {
					_x += el.offsetLeft;
					_y += el.offsetTop;
				} while (el = el.offsetParent);
				return {
					x: _x,
					y: _y
				};
			})();
		}
		var divA = new FixedBox(document.getElementById("headnav"));
		addEvent(window, "scroll", function() {
			divA.setCss();
		});
	}
	if(jQuery('#ysign')[0]) {
		var _base = jQuery('#ysign');
		_base.empty().hover(function () {
			var _tips = _base.find('.ysign-tips');
			_tips.stop(true, true).delay(500).slideDown(200);
		}, function () {
			var _tips = _base.find('.ysign-tips');
			_tips.stop(true, true).slideUp(200);
		});
		jQuery.ajax({
			url: 'gone-sign.html',
			cache: false,
			dataType: 'json',
			success: function(ret) {
				switch(ret.code) {
					case 2:
						_base.append('<div class="ysign-signed">已签到</div>');
						break;
					case 3:
						_base.append(jQuery('<div>', {
							'class': 'ysign-login',
							'text': '登录领Y豆',
							'onclick': 'jQuery.udblogin()'
						}));
						break;
					case 4:
						_base.append(jQuery('<div>', {
							'class': 'ysign-loading',
							'width': _base.width()
						}));
						_base.append(jQuery('<div>', {
							'class': 'ysign-signin',
							'text': '签到领Y豆',
							'onclick': 'jQuery(this).sign()'
						}));
						break;
				}
				_base.append('<div class="ysign-info">您已连续签到<em>'+ret.keep+'</em>天</div>');
				_base.append('<div class="ysign-tips"><p>每天签到赠送1个Y豆</p><p>连续签到前5天赠送N个Y豆（N=第N天）</p><p>连续签到第6天前，每天赠送5个Y豆</p><p>漏签后，连续签到计数将重新累计</p></div>');
			}
		});
	}
	jQuery('[data-ref]').click(function() {
		var ref = jQuery(this).data('ref');
		jQuery.post('gone-referer.html', {'ref': ref});
	});
});

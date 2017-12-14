var jq=jQuery.noConflict();
jq(function(){
	
	var _userAgent = window.navigator.userAgent.toLowerCase();
	if(_userAgent.indexOf('android')<0 && _userAgent.indexOf('iphone')<0 &&  _userAgent.indexOf('ipad')<0 )
	{ 
	
	if(jq.cookie("onlineSP")==null||jq.cookie("onlineSP")=="0"||jq.cookie("onlineSP")=="")
		{
			jq('.onlineService').show();
			jq('.box_os').hide();		
		}
		else if(jq.cookie("onlineSP")=="1")
		{
			jq('.onlineService').show();
			jq('.box_os').hide();		
		}
	
	}
	else{
		jq('.onlineService').hide();
		jq('.box_os').hide();
		
	}
	
	jq('.onlineService .ico_os').click(function()
	{		
		jq('.onlineService').hide();
		jq('.box_os').show();
		jq.cookie("onlineSP","0",{expires:1,path:"/",domain:"vr186.com"});		
	});
	jq('.os_x').click(function()
	{
		jq('.box_os').hide();
		jq('.onlineService').show();
		jq.cookie("onlineSP","1",{expires:2100000000,path:"/",domain:"vr186.com"});
	});
	$boxOsFun = function(){var st=jq(document).scrollTop();if (!window.XMLHttpRequest) {jq('.box_os').css('top',st+44);jq('.onlineService').css('top',st+44);}};
	jq(window).bind('scroll', $boxOsFun);
	$boxOsFun();
	
	//var feedback_url ='http://sc.chinaz.com/?account/suggestion.php?action=save';
	
	jq('.acbox .ico_pp').hover(function(){
		jq(this).stop().animate({height:'52px'},'fast');
		},function(){
		jq(this).stop().animate({height:'33px'},'fast');
		}
	);
	jq('.acbox .ico_gt').hover(function(){
		jq(this).stop().animate({height:'52px'},'fast');
		},function(){
		jq(this).stop().animate({height:'33px'},'fast');
		}
	);
	
	jq('.onlineService .ico_pp').hover(function(){
		jq(this).stop().animate({width:'87px'},'fast');
		},function(){
		jq(this).stop().animate({width:'39px'},'fast');
		}
	);
	jq('.onlineService .ico_gt').hover(function(){
		jq(this).stop().animate({width:'97px'},'fast');
		},function(){
		jq(this).stop().animate({width:'39px'},'fast');
		}
	);
	
	jq('.ico_gt').click(function(){
		jq("html, body").animate({scrollTop:0}, 1);
	})
	
	
	//分辨率
	if ( jq(window).width()<1200 || screen.width<1200) 
    { 
    	jq('.hydp950,.w_950,.sdmain,.main').css('overflow','hidden');
		jq('.top_bg').css({'overflow':'hidden','width':'950px','margin':'0 auto'});
		jq('.db_bg2').addClass('db_bg2_s');
		jq('.jstd_c .bg_l,.jstd_c .bg_r').css('display','none');
		jq('#js_play .prev').css('left','0');
		jq('#js_play .next').css('right','0');
		jq('#videoplay .prev, #videoplay2 .prev').addClass('prev_s');
		jq('#videoplay .next, #videoplay2 .next').addClass('next_s');
    }else{
    	jq('.hydp950,.w_950,.sdmain,.main').removeAttr('style');
		jq('.top_bg').removeAttr('style');
		jq('.db_bg2').removeClass('db_bg2_s');
		jq('.jstd_c .bg_l,.jstd_c .bg_r').removeAttr('style');
		jq('#js_play .prev').removeAttr('style');
		jq('#js_play .next').removeAttr('style');
		jq('#videoplay .prev, #videoplay2 .prev').removeClass('prev_s');
		jq('#videoplay .next, #videoplay2 .next').removeClass('next_s');
    }

});
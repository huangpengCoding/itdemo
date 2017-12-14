/**
 * 
 */


 jq(function(){
 	
     var range = 50;             //距下边界长度/单位px  
     var elemt = 500;           //插入元素高度/单位px  
     var maxnum = 20;            //设置加载最多次数  
     var num = 1;  
     var totalheight = 0;   
     var main = jq("#portal_block_31_content");     //主体元素  
     
     //alert(range);
     jq(window).scroll(function(){
         var srollPos = jq(window).scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)
         var con = jq('#scbar_txt').val(); //搜索框中的内容
         var module = jq('#module').val();
         var public = jq('#public').val();
         /* console.log("滚动条到顶部的垂直高度: "+jq(document).scrollTop());  
         console.log("页面的文档高度 ："+jq(document).height());  
         console.log('浏览器的高度：'+jq(window).height()); */
         
         totalheight = parseFloat(jq(window).height()) + parseFloat(srollPos);
         if((jq(document).height()-range) <= totalheight) {
         	//ajax请求数据
         	//获取已有的数据记录数
         	if(num == jq('.countline').size()){
         		//main.append("<div style='border:1px solid tomato;margin-top:20px;color:#ac;'>没有可加载的数据</div>");
 				return ;
         	}
         	//alert(con);
         	num = jq('.countline').size();
         	jq.ajax({
         		type:'POST',
         		url:module + '/Index/doAjax',
         		data:'num='+num+'&con='+con,
         		datatype:'json',
         		success:function(data){
         			var str = '';
         			var data = JSON.parse(data);
         			if(data == null){
         				jq('#nodata').remove();
         				main.append("<div id='nodata' style='border:1px solid #ccc;margin-top:20px;color:#ccc;height:30px;line-height:30px;text-align:center;font-size:20px;'>数据已全部加载完成！</div>");
         				return ;
         			}
         			for(var i=0;i<data.length;i++){
         				 str += '<li class="deanshadow deanw714 deanborder deanfff countline">';
         	             str += '<div class="deanpiclic">';
         	             str += '<div class="deanpiclicl">';
         	             str += '<a href="'+module+'/VrNews/single/id/'+data[i].info_detail_id+'" target="_blank"><img src="'+public+'/Admin/xheditor/upload/images/s220170_'+data[i].info_picname+'" title="'+data[i].info_detail_title+'" width="220" height="170"></a>';                			
         	             str +=	'<a href="'+module+'/VrNews/single/id/'+data[i].info_detail_id+'" target="_blank" class="deanhover" style="display: none;"></a>';
         	             str +=	'</div>';
         	             str +=	'<div class="deanpiclicr">';
         	             str +=	'<h2><a href="'+module+'/VrNews/single/id/'+data[i].info_detail_id+'" target="_blank" class="xi2" title="'+data[i].info_detail_title+'">'+data[i].info_detail_title+'</a> </h2>';
         	             str +=  '<div class="clear"></div>';
         	             str +=  '<div class="deanpicsummary">'+data[i].info_detail_abstract+'</div>';
         	             str +=  '<div class="clear"></div>';
         	             str += 	'<div class="deanliicon">';
         	             str +=  '<div class="deanicontype"><a href="'+module+'/VrNews/index/id/'+data[i].info_id+'" class="xi2">'+data[i].info_name+'</a></div>';
         	             str +=  '<div class="deanicontype"><a href="'+module+'/VrNews/keywords/id/'+data[i].info_id+'" class="xi2">'+data[i].info_detail_keywords+'</a></div>';
         	            var d = new Date(data[i].info_detail_createtime * 1000);    //根据时间戳生成的时间对象
         	           	var date = (d.getFullYear()) + "-" + (d.getMonth() + 1) + "-" +(d.getDate()) + " " + (d.getHours()) + ":" + (d.getMinutes()) + ":" + (d.getSeconds());
         	             str +=  '<div class="deanicondate">'+date+'</div>';
         	             str += 	'<div class="deaniconcomment">'+data[i].info_detail_commentnum+'</div>';
         	             str += 	'<div class="clear"></div>';
         	             str +=  '</div>';
         	             str += '<div class="clear"></div>';
         	             str += '<a href="'+module+'/VrNews/single/id/'+data[i].info_detail_id+'" target="_blank" class="deanread">开始阅读</a>';
         	             str += 	'</div>';
         	             str += '<div class="clear"></div>';
         	             str += '</div>';
         	             str += '</li>';
         			}
         			if(str == ''){
         				return ;
         			}else{
         				main.append(str);
         			}
         			
         		},
         		error:function(){
         			alert('数据加载出错！');
         		}
         	});
         }
     });
 });
/**
 * 搜索框使用到的ajax
 */
	jq('#scbar_txt').val('');
	
	jq('body').keyup(function (event){
		if(event.which == 13){
			jq('#scbar_btn').trigger('click');
		}
	});
	jq('#scbar_btn').click(function (){
		var module = jq('#module').val();
	    var public = jq('#public').val();
		var con = jq('#scbar_txt').val();
		var main = jq("#portal_block_31_content");     //主体元素  
		if(con == ''){
			alert('搜索内容不能为空');
			return ;
		}else{
			//删除已经显示的记录条
			jq('.countline').remove();
			jq.ajax({
				type:'POST',
				url:module+'/Index/searchAjax',
				data:'con='+con,
				datatype:'json',
				success:function(data){
					var str = '';
         			var data = JSON.parse(data);
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
				}
			});
		}
	});

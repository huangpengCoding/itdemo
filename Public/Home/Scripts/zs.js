$(function(){
// ajax开始和结束时触发
    $(document).ajaxStart(function(){
        $('#hidden3').show();
        $('#hidden2').hide();
    });
    $(document).ajaxStop(function(){
        $('#hidden3').hide();
        $('#hidden2').show();
    });
    // 添加表情图标
    add_face();
    // 获取聊天内容和在线人员信息
    var zs=setInterval(get_message_list, 2000);
    var zszs=setInterval(get_online_list, 5000);

    // get_content();
    // 点击发送按钮
    $('#send').click(function(){
        var $content=$('#content');
        if ($content.val()!="") {
            if (getCookie('qq')) {
                send_content($content.val(),getCookie('qq'));
            }else{
                var qq=prompt("请输入您的qq","");
                setCookie('qq',qq,1);
                send_content($content.val(),qq);
            }
                // alert(jmz.GetLength($content.text()));
        }else{
            // alert('发送内容不能为空');
            $content.focus();
        }
    });

    // 设置cookie
    function setCookie(c_name,value,expiredays)
    {
        var exdate=new Date()
        exdate.setDate(exdate.getDate()+expiredays)
        document.cookie=c_name+ "=" +escape(value)+
        ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
    }

    // 获取cookeie
    function getCookie(c_name)
    {
    if (document.cookie.length>0)
      {
      c_start=document.cookie.indexOf(c_name + "=")
      if (c_start!=-1)
        {
        c_start=c_start + c_name.length+1
        c_end=document.cookie.indexOf(";",c_start)
        if (c_end==-1) c_end=document.cookie.length
        return unescape(document.cookie.substring(c_start,c_end))
        }
      }
    return ""
    }


    // 自定义发送函数
    function send_content(content,qq){
        // alert(content);
        $.ajax({
            type:"POST",
            url:"add_content",
            dataType:"json",
            data:{
                content:content,
                qq:qq,
            },
            success:function(data){
                if (data.status=='1') {
                    // alertdata.content);
                    // 自定义一个函数,重新获取聊天数据
                    $('#content').val("");
                    $('#content').focus();
                    // $('#span').html('发送成功');
                    // 获取发送的信息和在线人员信息
                    get_online_list();
                    get_message_list();
                }else{
                    alert('发送失败');
                }
            }

        })

    }

                $("#hidden1").ajaxStart(function(){
                   $(this).hide();
                 });
    // 添加表情图标
    function add_face(){
        var html='';
        for(var i=1;i<29;i++){
            html+="<img src='../Public/Home/picture/"+i+".gif' id='"+i+"'>";
        }
        $('#span2').html(html);
    }
    // 点击图标时
    $('img').click(function(){
        var content=$('#content').val()+"{#"+this.id+"#}";
        $('#content').val(content);
    });

    // 获取信息
    function get_message_list(){
        $.ajax({
                    type:"POST",
                    url:"get_content",
                    global:false,
                    dataType:"json",
                    data:{
                        content:'1111111111',
                    },
                    success:function(data){
                        if (data) {
                            var html='';
                            for(var i=0;i<data.length;i++){
                                // html+="<img width='40' style='border-radius:20px; ' src='http://q.qlogo.cn/headimg_dl?bs=qq&dst_uin="+data[i]['qq']+"&fid=blog&spec=100'>";
                                // html+="<span style='border:1px solid red;margin:20px; padding:10px;line-height:550%'>"+data[i]['content']+"</span></br>";
                                if(data[i]['qq']==getCookie('qq')){
                                    html+='<div id="left_right"><img id="face" src="http://q.qlogo.cn/headimg_dl?bs=qq&amp;dst_uin='+data[i]['qq']+'&amp;fid=blog&amp;spec=100" ><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>'+data[i]['content']+'</span></div>'

                                }else{
                                    html+='<div id="left_left"><img id="face" src="http://q.qlogo.cn/headimg_dl?bs=qq&amp;dst_uin='+data[i]['qq']+'&amp;fid=blog&amp;spec=100" ><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>'+data[i]['content']+'</span></div>'
                                }
                            }
                            // for(var i=1;i<20;i++){
                            //     html=html.replace("/{#"+i+"#}/g", "<img src='../../../../Public/Home/picture/"+i+".gif' id='"+i+"'>")
                            // }
                            // eval("/^\\d+" + v + "$/gim")
                            $('#left').html(html);
                        } else {
                            // $('#left').html('出现错误:'+data.content);
                        }
                    },
                    // error:function(jqXHR){
                    //     $('#left').html('发生错误:'+jqXHR.status);
                    // }
                })

    }
    // 获取在线人员
    function get_online_list(){
        $.ajax({
                    type:"POST",
                    global:false,
                    url:"get_online",
                    dataType:"json",
                    data:{
                        content:'1111111111',
                    },
                    success:function(data){
                        var html='';
                        if (data) {
                        $.each(data, function(i,val){
                              html+=val;
                          });
                            $('#right').html(html);
                        } else {
                            // $('#right').html('出现错误');
                        }
                    },
                    // error:function(jqXHR){
                    //     $('#right').html('发送错误:'+jqXHR.status);
                    // }
                })
    }
    // 字符串长度
    var jmz = {};
    jmz.GetLength = function(str) {
        var realLength = 0, len = str.length, charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
            else realLength += 2;
        }
        return realLength;
    };

});
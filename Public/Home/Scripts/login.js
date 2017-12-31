$(function(){

	$("#change_code").click(function() {
		var verifyURL = "/Home/Public/verify";
		var time = new Date().getTime();
		$("#change_img").attr({
			"src" : verifyURL + "/" + time
		});
	});




	$("#change_img").click(function() {
		var verifyURL = "/Home/Public/verify";
		var time = new Date().getTime();
		$("#change_img").attr({
			"src" : verifyURL + "/" + time
		});
	});

	var FLAG_VERIFYED = false;  //验证码是否通过标识
	$("#verifycode").keyup(function() {
		var vcode = $("#verifycode").val()
		console.log(vcode);
		$.post("/Home/Public/check_verify", {
			code : vcode

		}, function(data) {
			if (data == true) {
				//验证码输入正确
				console.log("true");
				FLAG_VERIFYED = true;
			} else {
				//验证码输入错误
				console.log("false");
				FLAG_VERIFYED = false;
			}
		});
	});

	$('#switch_qlogin').click(function(){
		$('#switch_login').removeClass("switch_btn_focus").addClass('switch_btn');
		$('#switch_qlogin').removeClass("switch_btn").addClass('switch_btn_focus');
		$('#switch_bottom').animate({left:'0px',width:'70px'});
		$('#qlogin').css('display','none');
		$('#web_qr_login').css('display','block');

		});
	$('#switch_login').click(function(){

		$('#switch_login').removeClass("switch_btn").addClass('switch_btn_focus');
		$('#switch_qlogin').removeClass("switch_btn_focus").addClass('switch_btn');
		$('#switch_bottom').animate({left:'154px',width:'70px'});

		$('#qlogin').css('display','block');
		$('#web_qr_login').css('display','none');
		});
if(getParam("a")=='0')
{
	$('#switch_login').trigger('click');
}
	});

function logintab(){
	scrollTo(0);
	$('#switch_qlogin').removeClass("switch_btn_focus").addClass('switch_btn');
	$('#switch_login').removeClass("switch_btn").addClass('switch_btn_focus');
	$('#switch_bottom').animate({left:'154px',width:'96px'});
	$('#qlogin').css('display','none');
	$('#web_qr_login').css('display','block');
}

//根据参数名获得该参数 pname等于想要的参数名
function getParam(pname) {
    var params = location.search.substr(1); // 获取参数 平且去掉？
    var ArrParam = params.split('&');
    if (ArrParam.length == 1) {
        //只有一个参数的情况
        return params.split('=')[1];
    }
    else {
         //多个参数参数的情况
        for (var i = 0; i < ArrParam.length; i++) {
            if (ArrParam[i].split('=')[0] == pname) {
                return ArrParam[i].split('=')[1];
            }
        }
    }
}

$(function(){
	$('#p').bind('focus',function(){
		// 用户登录时检测用户账号是否正确
		$.ajax({
			type:"POST",
			url:"../../Login/exist",
			dataType:"json",
			data:{
				username:$("#u").val(),
			},
			success:function(data){
				if (data.already_reg) {
					$('#userCue1').html('<font color="yellowgreen"><b>账号输入正确</b></font>');
				}else{
					$('#userCue1').html('<font color="red"><b>您输入的账号不存在</b></font>');
					// if(data.showapi_res_error=='tzz'){
					// 	$('#userCue1').html('<font color="yellowgreen"><b>您的邮箱可以注册</b></font>');
					// }else{
					// 	if (data.showapi_res_body.prov !='') {
					// 		$('#userCue1').html('<font color="yellowgreen">您好,'+data.showapi_res_body.prov+data.showapi_res_body.city+'的朋友</font>');
					// 	}
					// }
				}

			},
			error:function(jqXHR){
				$('#userCue1').html('发送错误:'+jqXHR.status);
			}
		})

	})
});
pwdmin = 6;
// 当用户输入第二个密码时
function check_password(){
	// alert();

	if ($('#passwd2').val() != $('#passwd').val()) {
		$('#passwd2').focus();
		$('#userCue').html("<font color='red'><b>×两次密码不一致！</b></font>");
		return false;
	}else{
		$('#code').val("").focus();
		$('#userCue').html("<font><b>正在发送验证码...</b></font>");
		// 调用ajax发送验证码
		$.ajax({
			type:"POST",
			url:"../../Login/code",
			dataType:"json",
			data:{
				username:$("#user").val(),
			},
			success:function(data){
				if (data.status) {
					// $('#userCue').html(data.content);
					$('#userCue').html("<font color='yellowgreen'><b>"+data.content+"</b></font>");
				} else {
					$('#userCue').html('出现错误:'+data.content);
				}
			},
			error:function(jqXHR){
				$('#userCue').html('发送错误:'+jqXHR.status);
			}
		})

	}
}

$(document).ready(function() {
	// 打当二个密码框得到焦点时,验证第一个密码框
	$('#passwd2').bind('focus',function(){
		if ($('#passwd').val().length < pwdmin) {
			$('#passwd').focus();
			$('#userCue').html("<font color='red'><b>×密码不能小于" + pwdmin + "位</b></font>");
		}
	});



	// 查询账号是否已经被注册,如果未注册则显示欢迎信息,查询手机的归属地
	$('#user').blur(function(){
		$.ajax({
			type:"POST",
			url:"../../Login/exist",
			dataType:"json",
			data:{
				username:$("#user").val(),
			},
			success:function(data){
				if (data.already_reg) {
					$('#userCue').html('<font color="red"><b>×账号已经被注册,请直接登录</b></font>');
				}else{
					if(data.showapi_res_error=='tzz'){
						$('#userCue').html('<font color="yellowgreen"><b>您的邮箱可以注册</b></font>');
					}else{
						if (data.showapi_res_body.prov !='') {
							$('#userCue').html('<font color="yellowgreen">您好,'+data.showapi_res_body.prov+data.showapi_res_body.city+'的朋友</font>');
						}
					}
				}

			},
			error:function(jqXHR){
				$('#userCue').html('发送错误:'+jqXHR.status);
			}
		})
	});
	// 当注册按钮点击时触发
	$('#reg').click(function() {

		if ($('#user').val() == "") {
			$('#user').focus().css({
				border: "1px solid red",
				boxShadow: "0 0 2px red"
			});
			$('#userCue').html("<font color='red'><b>×用户名不能为空</b></font>");
			return false;
		}



		if ($('#user').val().length < 8 || $('#user').val().length > 20) {

			$('#user').focus().css({
				border: "1px solid red",
				boxShadow: "0 0 2px red"
			});
			$('#userCue').html("<font color='red'><b>×用户名位8-20字符</b></font>");
			return false;

		}else{
			$('#user').focus().css({
			border: "1px solid #D7D7D7",
			boxShadow: "none"
			})
		}


		if ($('#passwd').val().length < pwdmin) {
			$('#passwd').focus();
			$('#userCue').html("<font color='red'><b>×密码不能小于" + pwdmin + "位</b></font>");
			return false;
		}
		if ($('#passwd2').val() != $('#passwd').val()) {
			$('#passwd2').focus();
			$('#userCue').html("<font color='red'><b>×两次密码不一致！</b></font>");
			return false;
		}

		// // var sqq = /^[1-9]{1}[0-9]{4,9}$/   qq;
		// if (!sqq.test($('#qq').val()) || $('#qq').val().length < 5 || $('#qq').val().length > 12) {
		// 	$('#qq').focus().css({
		// 		border: "1px solid red",
		// 		boxShadow: "0 0 2px red"
		// 	});
		// 	$('#userCue').html("<font color='red'><b>×QQ号码格式不正确</b></font>");return false;
		// } else {
		// 	$('#qq').css({
		// 		border: "1px solid #D7D7D7",
		// 		boxShadow: "none"
		// 	});

		// }

		// 验证码
		if ($('#code').val().length  != 6) {

			$('#code').focus().css({
				border: "1px solid red",
				boxShadow: "0 0 2px red"
			});
			$('#userCue').html("<font color='red'><b>验证码为六位数</b></font>");
			return false;

		}
		// 调用ajax注册用户
		$.ajax({
			type:"POST",
			url:"../../Login/reg",
			dataType:"json",
			data:{
				username:$("#user").val(),
				password:$("#passwd").val(),
				code:$("#code").val(),
			},
			success:function(data){
				if (data.status) {
					$('#userCue').html("<font color='yellowgreen'><b>"+data.content+"</b></font>");
					// 注册成功了,禁用所有表单元素
					$('#user').attr('disabled', true);
					$('#passwd').attr('disabled', true);
					$('#passwd2').attr('disabled', true);
					$('#code').attr('disabled', true);
					$('#reg').attr('disabled', true);
				} else {
					$('#userCue').html('出现错误:'+data.content);
				}
			},
			error:function(jqXHR){
				$('#userCue').html('发送错误:'+jqXHR.status);
			}
		})
		$('#regUser').submit();
	});

	// 点击登录触发事件
	$('#log').click(function() {

		if ($('#u').val() == "") {
			$('#u').focus().css({
				border: "1px solid red",
				boxShadow: "0 0 2px red"
			});
			$('#userCue1').html("<font color='red'><b>×用户名不能为空</b></font>");
			return false;
		}
		$('#regUser').submit();
	});
});
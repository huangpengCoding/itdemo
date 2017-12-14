function SSOController() {
	var This=this
	var actionCallBack = {
        success:function(result){},
        error:function(){},
        complete:function(){}
    };

	var loginFrameName = "ssoLoginFrame";
	var loginFormId = "ssoLoginForm";
    var crossDomainForward = null;
    var crossDomainTimer = null;
    var crossUrlCount = 0;
    var formParam = {};
	var loginApi = "/passport/user/login";
    var registerApi = "/passport/user/register"   

    this.verifyCodeUrl = '/passport/user/verifycode'
    this.checkVerifyUrl='/passport/user/loginverifyshow'
    this.checkVerifyCode='/passport/user/verifycheck'
    this.checkUserName='/passport/user/checkusername'
    this.checkNickName='/passport/user/checknickname'
    this.tpRegister='/passport/user/tpregister'
    this.tpBind='/passport/user/tpbind'


    var createIFrame = function(frameName) {
        $(loginFrameName).remove();
        var frame = $("<iframe></iframe>")
        frame.css('display','none')
        frame.attr('id',frameName)
        frame.attr('name',frameName)
        frame.attr('src',"javascript:void(0)")
        frame.appendTo("body")
        return frame
    };
    var createForm = function(formName) {
    	$(loginFormId).remove();
        var form = $("<form></form>")
        form.attr('id',formName)
        form.attr('name',formName)
        form.attr('method','post')
        form.css('display','none')

        for(var name in formParam){
            form.append($("<input type='text' name='"+name+"' value='"+formParam[name]+"' />"))
        }

        form.appendTo("body")
        return form;
    };

    var loginByXMLHttpRequest = function(){

        if (typeof XMLHttpRequest == "undefined") {
            return false
        }
        var _xhr = new XMLHttpRequest();
        if (!"withCredentials" in _xhr) {
            return false
        }
        $.ajax({
            url:loginApi,
            data:formParam,
            method:"post",
            dataType:"json",
            xhrFields: {
                withCredentials: true
            },
            success:function(res){
                This.ssoLoginCallBack(res)
            },
            error:function(){
                formParam.returntype="html"
                loginByIframe();
            }
        });

        return true
    }


    var registerByXMLHttpRequest = function(){

        if (typeof XMLHttpRequest == "undefined") {
            return false
        }
        var _xhr = new XMLHttpRequest();
        // if (!"withCredentials" in _xhr) {
        //     return false
        // }
        $.ajax({
            url:registerApi,
            data:formParam,
            method:"post",
            dataType:"json",
            // xhrFields: {
            //     withCredentials: true
            // },
            success:function(res){
                This.ssoLoginCallBack(res)
            },
            error:function(){
                formParam.returntype="html"
                registerByIframe()
            }
        });

        return true
    }



    var loginByIframe = function() {
        createIFrame(loginFrameName);
        var loginForm = createForm(loginFormId);
        loginForm.attr("action",loginApi);
        loginForm.attr("target",loginFrameName);
        try {
            loginForm.submit()
        } catch(e) {
            $(loginFrameName).remove();
        }
        setTimeout(function() {
            $(loginForm).remove();
        },10);
    }

    var registerByIframe = function() {
        createIFrame(loginFrameName);
        var loginForm = createForm(loginFormId);
        loginForm.attr("action",registerApi);
        loginForm.attr("target",loginFrameName);
        try {
            loginForm.submit()
        } catch(e) {
            $(loginFrameName).remove();
        }
        setTimeout(function() {
            $(loginForm).remove();
        },10);
    }

    //设置站点cookie操作
    this.setCrossDomainCookie=function(urls){
        crossUrlCount=urls.length;
    	for (var i = 0; i < urls.length; i++) {
            url = urls[i];
            $.get(url,function(result){
                crossUrlCount--
                if(crossUrlCount==0){
                    clearTimeout(crossDomainTimer);
                    This.crossDomainResult()
                }
            },'jsonp');
        }
    }

    //ajax登录成功操作
    this.ssoLoginCallBack=function(result){
    	if(result.status==10001){
            crossDomainForward = function(){
               actionCallBack.success(result)
               actionCallBack.complete();
            }
    		this.setCrossDomainCookie(result.data.url);
            crossDomainTimer = setTimeout(function(){
                This.crossDomainResult()
            },5000) 
    	}else{
            actionCallBack.success(result)
            actionCallBack.complete();
        }
    }

    this.crossDomainResult = function() {
        if (typeof crossDomainForward == "function") {
            crossDomainForward()
        }
    };

    //iframe登录/退出后用户中心操作
    this.crossDomainAction = function(callback) {
        if (typeof callback == "function") {
            crossDomainForward=callback;
        }
        crossDomainTimer = setTimeout(function(){
            This.crossDomainResult()
        }, 5000);
        return false
    };

    //iframe登录结果
    this.frameLoginCallBack = function(result) {
        actionCallBack.success(result); 
        actionCallBack.complete()
        $(loginFrameName).remove();
    };

    //登录接口
    //参数：
    // data={
    //     username:"username", //用户名
    //     password:"passwork", //密码
    //     remember:1,          //下次自动登录
    //     callback:function(result){ 
    //         //登录回调方法,登录处理逻辑跟以前一样
    //     }
    // }
    this.login=function(params){
        formParam=params.data;
        formParam.referer=window.location.protocol+"//"+window.location.hostname

		actionCallBack={
            success:params.success,
            error:params.error,
            complete:params.complete
        }


        if (loginByXMLHttpRequest()) {
            return true
        }else{
            formParam.returntype="html"
        	loginByIframe()
        }
    }

    this.register=function(params){
        actionCallBack={
            success:params.success,
            error:params.error,
            complete:params.complete
        }
        formParam=params.data;
        formParam.referer=window.location.protocol+"//"+window.location.hostname

        if (registerByXMLHttpRequest()) {
            return true
        }else{
            formParam.returntype="html"
            registerByIframe()
        }

    }
}
imoocSSO=new SSOController();
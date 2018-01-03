<?php
/**
 * Created by PhpStorm.
 * User: huangpeng3
 * Date: 2017/12/13
 * Time: 下午5:55
 */

namespace Home\Controller;

use Think\Controller;


class LoginController extends Controller
{
    //加载登录模板
    public function index()
    {

        $this->display();
    }

    //用户登录验证
    public function login()
    {
        $user = D('Login');
        $res = $user->checkuser($_POST['username'], $_POST['password']);
        $obj = json_decode($res);
        if ($obj->status) {
            $this->redirect('Index/index');
        } else {
            $this->error($obj->info);
        }
    }

    // 用户注册
    public function reg()
    {
        $reg = D('reg');
        echo $res = $reg->register($_POST['username'], $_POST['password']);
    }

    //查询用户是否已经注册
    public function exist()
    {
        $exist = D('Reg');
        $obj = json_decode($exist->exist($_REQUEST['username']));
        if ($obj->already_reg) {
            $rst['status'] = 0;
            $rst['content'] = "账号已经被注册,请直接登录";
            $rst['already_reg'] = 1;
            echo json_encode($rst);
        } else {
            $rst['status'] = 0;
            $rst['content'] = "账号尚未被注册";
            $rst['already_reg'] = 0;
            echo json_encode($rst);
        }
    }
}
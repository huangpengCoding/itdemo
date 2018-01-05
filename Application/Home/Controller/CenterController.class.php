<?php
/**
 * Created by PhpStorm.
 * User: huangpeng3
 * Date: 2018/1/3
 * Time: 下午6:13
 * 个人中心
 */

namespace Home\Controller;

use Think\Controller;

class CenterController extends Controller
{

    /**
     * 个人资料tab
     */
    public function index()
    {
        $this->verification();
        $this->display();
    }


    /**
     * 验证
     */
    public function verification()
    {
        if (!isset($_SESSION['user_info'])) {
            redirect('/Home/Login/index', 2, '没有登录,前往登录页面');
        }
        if (!isset($_SESSION['user_info']['id'])) {
            redirect('/Home/Login/index', 2, '非法操作,重新登录');
        }

        $system = D('it_system');
        $sys = $system->where('id=1')->find();
        $this->assign('system', $sys);

        $title = M('it_type')->where('pid=0')->order('weight ASC')->select();
        $this->assign('title', $title);

        $user = D('it_user_info');
        $user = $user->where('id=' . $_SESSION['user_info']['id'])->find();
        $this->assign('user', $user);

        if ($user['name']) {
            $name = $user['name'];
        } elseif ($user['phone']) {
            $name = $user['phone'];
        } elseif ($user['email']) {
            $name = $user['name'];
        } else {
            $name = '非法登录';
        }
        $this->assign('name', $name);
    }


    /**
     * 手机设置tab
     */
    public function phone()
    {
        $this->verification();

        $user = D('it_user_info');
        $use = $user->where('id=' . $_SESSION['user_info']['id'])->find();
        if ($use['phone']) {
            $phone = $use['phone'];
        } else {
            $phone = '请绑定手机号';
        }
        $this->assign('phone', $phone);
        $this->display();
    }

    /**
     * 邮箱设置tab
     */
    public function email()
    {
        $this->verification();
        $user = D('it_user_info');
        $user = $user->where('id=' . $_SESSION['user_info']['id'])->find();
        if ($user['email']) {
            $email = $user['email'];
        } else {
            $email = '请绑定邮箱';
        }
        $this->assign('email', $email);
        $this->display();
    }


    /**
     * 修改密码tab
     */
    public function password()
    {
        $this->verification();
        $this->display();
    }

    /**
     * 积分tab
     */
    public function integral()
    {
        $this->verification();
        $user = D('it_user_info');
        $use = $user->where('id=' . $_SESSION['user_info']['id'])->find();
        $this->assign('num', $use);

        $this->display();
    }


    public function changepwd()
    {
        $this->verification();
        $user = D('it_user_info');
        $arr['password'] = md5($_POST['password'] . 'itdemohp');
        $data = $user->where('id=' . $_POST['id'])->save($arr);
        $this->ajaxReturn($data);
    }

}


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
}
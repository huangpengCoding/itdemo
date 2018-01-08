<?php
/**
 * Created by PhpStorm.
 * User: huangpeng3
 * Date: 2018/1/1
 * Time: 上午2:23
 */

namespace Home\Model;

use Think\Model;

class LoginModel extends Model
{
    protected $tableName = 'it_user_info';

    //用户登录验证
    public function checkuser($username, $password)
    {
        //检测账号类型
//        $login_type = $this->phone_or_email($username);
        $login_type = 'phone';
        //检测登录错误是否次数小于3次
        if ($this->check_three($login_type, $username) < 3) {
            $map[$login_type] = $username;
            if ($res = $this->where($map)->select()) {
                //存在用户验证密码是否正确
                if ($res[0]['password'] == md5($password . 'itdemohp')) {
                    //登录成功,写入session,把记录登录错误的计数字段清0
                    $this->change_error_num($login_type, $username, 0);
                    unset($res[0]['password']);
                    $_SESSION['user_info'] = $res[0];
                    return '{"status":true,"info":"登陆成功"}';
                } else {
                    //密码错误,登录错次数+1
                    $this->change_error_num($login_type, $username, 1);
                    return '{"status":false,"info":"密码错误"}';
                }
            } else {
                return "{'status':false,'info':'用户名不存在'}";
            }
        } else {
            return '{"status":false,"info":"密码错误三次,请一段时间后再试"}';
        }
    }

    //改变用户登录错误次数,写入数据库
    public function change_error_num($login_type, $username, $operation = 1)
    {
        $map[$login_type] = $username;
        $this->where($map)->setField('last_error_time', time());
        if ($operation) {
            //登录错误次数+1,当前时间
            $this->where($map)->setInc('error_num', '1');
        } else {
            //登录错误次数清零
            $this->where($map)->setField('ip', get_client_ip());
            $this->where($map)->setField('error_num', 0);
        }
    }

//    // 判断是手机还是邮箱
//    public function phone_or_email($username)
//    {
//        if (preg_match("/^[0-9a-zA-Z]+@(([0-9a-zA-Z]+)[.])+[a-z]{2,4}$/i", $username)) {
//            return 'email';
//        } else {
//            return 'phone';
//        }
//    }

    // 检测用户登录错误次数
    public function check_three($login_type, $username)
    {
        $map = array();
        $map[$login_type] = $username;
        $rst = $this->where($map)->getField('error_num, last_error_time');
        $num = $rst['error_num'];
        $time = $rst['last_error_time'];
        if ($num == 3) {
            //是否超过一小时
            $time_delta = time() - $time;
            if ($time_delta > 3600) {
                $this->where($map)->setField('error_num', 0);
                return 0;
            } else {
                return $num;
            }
        } else {
            return $num;
        }
    }
}
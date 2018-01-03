<?php
/**
 * 用户注册模型
 * Created by PhpStorm.
 * User: huangpeng3
 * Date: 2018/1/1
 * Time: 上午1:54
 */

namespace Home\Model;

use Think\Model;

class RegModel extends Model
{

    protected $tableName = 'it_user_info';

    //用户注册
    public function register($username, $password)
    {
        $user_type = $this->phone_or_email($username);
        $data[$user_type] = $username;
        $data['password'] = md5($password . 'itdemohp');
        if ($this->add($data)) {
            echo '{"status":1,"content":"注册成功,请点击快速登录"}';
        } else {
            echo '{"status":0,"content":"注册失败,请一段时间后再试"}';
        }
    }

    // 判断是手机还是邮箱
    public function phone_or_email($username)
    {
        if (!preg_match("/^[0-9a-zA-Z]+@(([0-9a-zA-Z]+)[.])+[a-z]{2,4}$/i", $username) && strlen($username) == 11 && is_numeric($username)) {
            return 'phone';
        } else {
            return 'email';
        }
    }

    //判断用户是否已经注册
    public function exist($username)
    {
        $user_type = $this->phone_or_email($username);
        $map = array();
        $map[$user_type] = $username;
        if ($this->where($map)->select()) {
            return '{"status":0,"content":"账号已经被注册","already_reg":1}';
        } else {
            return '{"status":1,"content":"账号没有被注册","already_reg":0}';
        }
    }
}


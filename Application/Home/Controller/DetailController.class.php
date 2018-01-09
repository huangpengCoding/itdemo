<?php
/**
 * Created by PhpStorm.
 * User: huangpeng3
 * Date: 2017/12/13
 * Time: 下午4:01
 */
namespace Home\Controller;

use Think\Controller;

class DetailController extends Controller
{
    public function single($id)
    {

        //标题
        $title = M('it_type')->field('id, name')->where('pid=0')->order('weight desc')->select();
        $this->assign('title', $title);

        //查看当前页面下的所有评论

        //热门搜索 专题推荐
        $hot_search = M('it_hot_search')->order('id ASC')->select();
        $this->assign('hot_search', $hot_search);
        $hot_recomment = M('it_special_recomment')->order('id ASC')->select();
        $this->assign('hot_recomment', $hot_recomment);

        //上下一篇
        $preNext = M()->query('( SELECT d.info_detail_id, info_detail_title FROM it_info_detail d WHERE d.info_detail_id < ' . $id . ' ORDER BY d.info_detail_id DESC LIMIT 1 ) UNION ( SELECT d.info_detail_id, info_detail_title FROM it_info_detail d WHERE d.info_detail_id > ' . $id . ' ORDER BY d.info_detail_id ASC LIMIT 1 )');
        $this->assign('preNext', $preNext);

        //热门资源
        $hot_download = M()->query("select det.info_detail_id, det.info_detail_title  from it_hot_download dow left join it_info_detail det on dow.info_detail_id=det.info_detail_id");
        $this->assign('hot_download', $hot_download);


        //system info
        $sys = D('it_system');
        $system = $sys->where('id=1')->find();
        $this->assign('system', $system);

        $this->display();
    }
}
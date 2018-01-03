<?php
namespace Home\Controller;

use Think\Controller;

class IndexController extends Controller
{
    public function index()
    {
        //title
        $title = M('it_type')->where('pid=0')->order('weight ASC')->select();
        $this->assign('title', $title);

        //选中的栏目
        $this->assign('id', 1);

        //热门资源
        $hot_download = M()->query("select det.info_detail_id, det.info_detail_title  from it_hot_download dow left join it_info_detail det on dow.info_detail_id=det.info_detail_id");
        $this->assign('hot_download', $hot_download);

        //轮播图
        $carousel = M('it_index_carousel')->order('priority DESC, id ASC')->select();
        $this->assign('carousel', $carousel);

        //list数据
        $list = M()->table('it_info a,it_info_detail d')->field('a.info_name,info_detail_id,d.info_id,info_detail_title,info_detail_keywords,info_detail_source,info_detail_author,info_detail_viewnum,info_detail_commentnum,info_detail_status,info_detail_createtime,info_detail_abstract,info_picname')->where('a.info_status=2 and d.info_detail_status=2 and a.info_id=d.info_id')->order('info_detail_id DESC')->limit(5)->select();
        $this->assign('list', $list);

        //热门搜索,专题推荐
        $hot_search = M('it_hot_search')->order('id ASC')->select();
        $this->assign('hot_search', $hot_search);
        $hot_recomment = M('it_special_recomment')->order('id ASC')->select();
        $this->assign('hot_recomment', $hot_recomment);

        //system info
        $sys = D('it_system');
        $system = $sys->where('id=1')->find();
        $this->assign('system', $system);

        $this->display();

    }

    public function doAjax()
    {
        $con = isset($_POST['con']) ? $_POST['con'] : '';
        if ($con == '') {
            $where = '';
        } else {
            $where = ' and (d.info_detail_content like "%' . $con . '%" or d.info_detail_title like "%' . $con . '%")';
        }
        $num = $_POST['num'];
        $list = M()->table('it_info a,it_info_detail d')->field('a.info_name,info_detail_id,d.info_id,info_detail_title,info_detail_keywords,info_detail_source,info_detail_author,info_detail_viewnum,info_detail_commentnum,info_detail_status,info_detail_createtime,info_detail_abstract,info_picname')->where('a.info_status=2 and d.info_detail_status=2 and a.info_id=d.info_id ' . $where)->order('info_detail_id DESC')->limit("{$num},5")->select();
        echo json_encode($list);

    }
}
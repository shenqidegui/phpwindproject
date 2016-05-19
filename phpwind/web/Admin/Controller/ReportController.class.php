<?php
namespace Admin\Controller;
use Think\Controller;
class ReportController extends CommonController {
    //举报管理 被举报的帖子
    public function index(){
        
        //创建对象
        $report = M('report');
        // $res = $report -> select();
        // var_dump($res);exit;

       //获取每页显示的数量
       $num = !empty($_GET['num']) ? $_GET['num'] : 5;

        //获取关键字
        if(!empty($_GET['keyword'])){
            //有关键字
            $where = "reason like '%".$_GET['keyword']."%' and type = 'card'";
        }else{
            $where = "type = 'card'";
        }


        // 查询满足要求的总记录数
        $count = $report->where($where)->count();
        // 实例化分页类 传入总记录数和每页显示的记录数
        $Page = new \Think\Page($count,$num);
        //获取limit参数
        $limit = $Page->firstRow.','.$Page->listRows;

         //执行查询
        $reports = $report->where($where)->order('concat(status,regtime) asc')->limit($limit)->select();
        // var_dump($reports);exit;
        // 分页显示输出
        $pages = $Page->show();

        //创建user对象
        $user=M('user');
        // var_dump($reports);exit;
        foreach ($reports as $k => $v) :
            $val = $user -> find($v['uid']);
            $reports[$k]['regtime'] = date('Y-m-d h:i:s',$v['regtime']);
            $reports[$k]['uid'] = $val['username'];

        endforeach;
        //分配变量
        // var_dump($reports);exit;
        $this->assign('reports',$reports);
        $this->assign('pages',$pages);
        //解析模板
        $this->display();
    }

    //忽略举报
    public function ignore(){
                //创建对象
        $report = M('report');
        $data['status'] = 1;
        $res = $report -> where('id='.I('get.id')) -> save($data);
        // echo 0;
        $this->ajaxReturn($res);
    }

    //执行修改
    public function disable(){
         //创建数据表对象
        $report = M('report');
        $data['status'] = 2;
        $res = $report -> where('id='.I('get.id')) -> save($data);
        $this->ajaxReturn($res);
    }


    //被举报的评论
    public function comm(){
        
        //创建对象
        $report = M('report');
        // $res = $report -> select();
        // var_dump($res);exit;

       //获取每页显示的数量
       $num = !empty($_GET['num']) ? $_GET['num'] : 5;

        //获取关键字
        if(!empty($_GET['keyword'])){
            //有关键字
            $where = "reason like '%".$_GET['keyword']."%' and type = 'comment'";
        }else{
            $where = "type = 'comment'";
        }


        // 查询满足要求的总记录数
        $count = $report->where($where)->count();
        // 实例化分页类 传入总记录数和每页显示的记录数
        $Page = new \Think\Page($count,$num);
        //获取limit参数
        $limit = $Page->firstRow.','.$Page->listRows;

         //执行查询
        $reports = $report->where($where)->order('concat(status,regtime) asc')->limit($limit)->select();
        // var_dump($reports);exit;
        // 分页显示输出
        $pages = $Page->show();

        //创建user对象
        $user=M('user');
        // var_dump($reports);exit;
        foreach ($reports as $k => $v) :
            $val = $user -> find($v['uid']);
            $reports[$k]['regtime'] = date('Y-m-d h:i:s',$v['regtime']);
            $reports[$k]['uid'] = $val['username'];

        endforeach;
        //分配变量
        // var_dump($reports);exit;
        $this->assign('reports',$reports);
        $this->assign('pages',$pages);
        //解析模板
        $this->display();
    }

}
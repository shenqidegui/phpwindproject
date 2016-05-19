<?php
namespace Admin\Controller;
use Think\Controller;
class SenController extends CommonController {
    //显示板块列表
    public function index(){

        //创建对象
        $sen = M('sensitive_words');
   
        //查看sql语句
        // echo $sen->_sql();
        // echo $sen->getLastSql();

       //获取每页显示的数量
       $num = !empty($_GET['num']) ? $_GET['num'] : 5;


        //获取关键字
        if(!empty($_GET['keyword'])){
            //有关键字
            $where = "word like '%".$_GET['keyword']."%'";
        }else{
            $where = '';
        }


        // 查询满足要求的总记录数
        $count = $sen->where($where)->count();
        // echo $count;
        // echo '<br>';
        // echo $num;
        // 实例化分页类 传入总记录数和每页显示的记录数
        $Page = new \Think\Page($count,$num);
        //获取limit参数
        $limit = $Page->firstRow.','.$Page->listRows;

         //执行查询
        $sens = $sen->where($where)->limit($limit)->select();
        // echo $sen->_sql();

        // var_dump($Page);die;
        // 分页显示输出
        $pages = $Page->show();
      
        //处理sens字段
        foreach ($sens as $k => $v) {
           $sens[$k]['grade'] = str_replace(array('1','2','3'), array('禁用','审核','替换'),$v['grade']);
        }
        // var_dump($pages);die;
        //分配变量
        $this->assign('sens',$sens);
        $this->assign('pages',$pages);
    	//解析模板
    	$this->display();
    }

    public function insert(){
    	// var_dump($_POST);
    	$sen = M('sensitive_words');
    	$word = trim(I('post.addword'));
    	$_POST['word']=$word;
    	if(empty($_POST['grade'])){
    		$this->error('请选择敏感等级');
    	}
    	// var_dump($_POST);exit;
    	$sen->create();
        //添加数据
        $res = $sen->add();
        if($res){
        	$this->success('添加成功');
        }else{
        	$this->error('添加失败');
        }

    }
    //显示用户的添加页面
    public function save(){
    	$sen = M('sensitive_words');
    	$id = I('get.id');
    	$val = $sen -> find($id);
    	// var_dump($val);exit;
    	$this -> assign('val',$val);
    	//解析模板
    	$this->display();

    }

    public function update(){
    	// var_dump($_POST);
    	$sen = M('sensitive_words');
    	if(empty($_POST['grade'])){
    		$this->error('请选择敏感等级');
    	}
    	if(empty($_POST['word'])){
    		$this->error('请填写敏感词');
    	}
    	$sen->create();
    	$res = $sen -> save();
    	if($res){
    		$this -> success('修改成功', U('Admin/Sen/index'),3);
    	}else{
    		$this -> error('执行失败');
    	}
    }

    public function del(){
    	$sen = M('sensitive_words');
    	$res = $sen -> delete(I('get.id'));
    	if($res){
    		echo 1;
    	}else{
    		echo 0;
    	}
    }


    // public function ajaxcount(){
   	// 	$num = $_GET['num']; 


    // }

}
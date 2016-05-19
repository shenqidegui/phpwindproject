<?php 
namespace Admin\Controller;
use Think\Controller;
class NavController extends CommonController {
	//显示导航列表
    public function index(){
        // echo '后台导航列表';

     //    //创建对象
        $nav = M('nav');
    
     //    //获取每页显示的数量
        $num = !empty($_GET['num']) ? $_GET['num'] : 5;

        //获取关键字
        if (!empty($_GET['keyword'])){
            //有关键字
            $where = "name like '%".$_GET['keyword']."%'";
        }else{
            $where = '';
        }

        //查询满足要求的总记录数
        $count = $nav->where($where)->count();
        // 实例化分页类 传入总数和每页显示的记录数
        $Page = new \Think\Page($count,$num);
        //获取limit参数
        $limit = $Page->firstRow.','.$Page->listRows;

        //执行查询
        $navs = $nav->where($where)->limit($limit)->select();

        //分页显示输出
        $pages = $Page->show();
        
        //分配变量
        $this->assign('navs',$navs);
        $this->assign('pages',$pages);
    	// //解析模板
    	$this->display();
    }

    //显示用户的添加页面
    public function add(){
    	// echo '用户添加';
    	//解析模板
    	$this->display();
    }

    //处理模块的数据添加
    public function insert(){
    	// var_dump($_POST);

        //创建表对象
        $nav = M('nav');
        //创建数据
        $nav->create();
        //执行添加
       if($nav->add()){
             //设置成功后跳转页面的地址，默认的返回页面是$_SERVER['HTTP_REFERER']
            $this->success('新增成功', U('Admin/nav/index'),3);
       }else{
            //错误页面的默认跳转页面是返回前一页，通常不需要设置
            $this->error('新增失败');
       }

    }
    //导航列表的修改
    public function save(){
        // var_dump($_GET);
        $id = I('get.id');
        //创建表对象
        $nav = M('nav');
        //查询当前列表的数据
        $info = $nav->find($id);
        // var_dump($info);die;
        //分配变量
        $this->assign('info',$info);
    //     $this->assign('hobby',$hobby);

        //解析模板
        $this->display();
    }

    //执行修改
    public function update(){
        // var_dump($_POST);
         //创建数据表对象
        $nav = M('nav');    
        //创建数据
        $res = $nav->create();
        //执行修改
       $res =  $nav->save();
       // var_dump($res);die;
        //执行添加
       if($res){
             //设置成功后跳转页面的地址，默认的返回页面是$_SERVER['HTTP_REFERER']
            $this->success('更新成功', U('Admin/nav/index'),3);
       }else{
            //错误页面的默认跳转页面是返回前一页，通常不需要设置
            $this->error('更新失败');
       }
    }
    public function ajaxdel(){
        // var_dump($_GET);
        // 创建表对象
        $nav = M('nav');
        //获取id
        $id = $_GET['id'];
        //执行删除
        $res = $nav->delete($id);
        // 向ajax返回数据
        if($res) {
            echo 1;
        }else{
            echo 0;
        }
    }
}
?>
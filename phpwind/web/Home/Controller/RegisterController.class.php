<?php
namespace Home\Controller;
use Think\Controller;
class RegisterController extends Controller {
    //显示前台注册
    public function index(){
        $this -> display();
    }


    //处理板块的数据添加
    public function insert(){
        //创建表对象
        var_dump($_POST);exit;
        $user = M('user');
        
        // 创建数据
        $user->create();
        //执行添加
       if($user->add()){
             //设置成功后跳转页面的地址，默认的返回页面是$_SERVER['HTTP_REFERER']
            
       }else{
            //错误页面的默认跳转页面是返回前一页，通常不需要设置
            
       }

    }

    //板块的修改
    public function save(){
        // var_dump($_GET);
        $id = I('get.id');
        //创建表对象
        $user = M('user');
        //获取所有板块
        $users = $user->select();
        // var_dump($users);

        //查询当前板块的数据
        $info = $user->find($id);
        // var_dump($info);die;
    
        //分配变量
        $this->assign('info',$info);
        $this->assign('users',$users);

        //解析模板
        $this->display();
    }

    //执行修改
    public function update(){
         //创建数据表对象
        $user = M('user');

         //针对path字段进行获取
        //检查是否为顶级板块
        if($_POST['pid'] == 0){
            $_POST['path'] = '0,';
        }else{
            //查找父级板块的信息
            $info = $user->where('id = '.$_POST['pid'])->find();
            // var_dump($info);
            $_POST['path'] = $info['path'].$info['id'].',';
        }
        var_dump($_POST);die;
        

        //创建数据
        $res = $user->create();
        //执行修改
       $res =  $user->save();
       // var_dump($res);
        //执行添加
       if($res){
             //设置成功后跳转页面的地址，默认的返回页面是$_SERVER['HTTP_REFERER']
            $this->success('更新成功', U('Admin/user/index'),3);
       }else{
            //错误页面的默认跳转页面是返回前一页，通常不需要设置
            $this->error('更新失败');
       }
    }


    public function ajaxdel(){
        // var_dump($_GET);
        //创建表对象
        $user = M('user');
        //获取id
        $id = $_GET['id'];
        //执行删除
        $res = $user->delete($id);

        // 向ajax返回数据
        if($res){
            echo 1;
        }else{
            echo 0;
        }
    }
}
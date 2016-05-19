<?php
namespace Admin\Controller;
use Think\Controller;
class TypeController extends CommonController {
    //显示板块列表
    public function index(){
        // echo '后台板块列表';
        //创建对象
        $plate = M('plate');
        // $res = $plate -> select();
        // var_dump($res);exit;

       //获取每页显示的数量
       $num = !empty($_GET['num']) ? $_GET['num'] : 5;

        //获取关键字
        if(!empty($_GET['keyword'])){
            //有关键字
            $where = "name like '%".$_GET['keyword']."%'";
        }else{
            $where = '';
        }


        // 查询满足要求的总记录数
        $count = $plate->where($where)->count();
        // 实例化分页类 传入总记录数和每页显示的记录数
        $Page = new \Think\Page($count,$num);
        //获取limit参数
        $limit = $Page->firstRow.','.$Page->listRows;

         //执行查询
        $plates = $plate->where($where)->order('concat(path,id) asc')->limit($limit)->select();
        // var_dump($plates);exit;
        // 分页显示输出
        $pages = $Page->show();
        //遍历
        foreach ($plates as $k => $v) {
            //获取要添加|---个数
            $c = count(explode(',',$v['path']))-2;
            $plates[$k]['name'] = str_repeat('|----',$c).$v['name'];

        }
        // var_dump($plates);
        // die;
      
        //分配变量
        $this->assign('plates',$plates);
        $this->assign('pages',$pages);
        //解析模板
        $this->display();
    }

    //显示板块的添加页面
    public function add(){
        //创建对象
        $plate = M('plate');
        //查询所有板块
        $plates = $plate->select();
        // var_dump($plates);
        //分配变量
        $this->assign('plates',$plates);
        //解析模板
        $this->display();
    }

    //处理板块的数据添加
    public function insert(){
        //创建表对象
        $plate = M('plate');
        //针对path字段进行获取
        //检查是否为顶级板块
        if($_POST['pid'] == 0){
            $_POST['path'] = '0,';
        }else{
            //查找父级板块的信息
            $info = $plate->where('id = '.$_POST['pid'])->find();
            // var_dump($info);
            $_POST['path'] = $info['path'].$info['id'].',';
        }

        // 创建数据
        $plate->create();
        //执行添加
       if($plate->add()){
             //设置成功后跳转页面的地址，默认的返回页面是$_SERVER['HTTP_REFERER']
            $this->success('新增成功', U('Admin/Type/index'),3);
       }else{
            //错误页面的默认跳转页面是返回前一页，通常不需要设置
            $this->error('新增失败');
       }

    }

    //板块的修改
    public function save(){
        // var_dump($_GET);
        $id = I('get.id');
        //创建表对象
        $plate = M('plate');
        //获取所有板块
        $plates = $plate->select();
        // var_dump($plates);

        //查询当前板块的数据
        $info = $plate->find($id);
        // var_dump($info);die;
    
        //分配变量
        $this->assign('info',$info);
        $this->assign('plates',$plates);

        //解析模板
        $this->display();
    }

    //执行修改
    public function update(){
         //创建数据表对象
        $plate = M('plate');

         //针对path字段进行获取
        //检查是否为顶级板块
        if($_POST['pid'] == 0){
            $_POST['path'] = '0,';
        }else{
            //查找父级板块的信息
            $info = $plate->where('id = '.$_POST['pid'])->find();
            // var_dump($info);
            $_POST['path'] = $info['path'].$info['id'].',';
        }
        // var_dump($_POST);die;
    
        //创建数据
        $res = $plate->create();
        //执行修改
       $res =  $plate->save();
       // var_dump($res);
       if($res){
             //设置成功后跳转页面的地址，默认的返回页面是$_SERVER['HTTP_REFERER']
            $this->success('更新成功', U('Admin/Type/index'),3);
       }else{
            //错误页面的默认跳转页面是返回前一页，通常不需要设置
            $this->error('更新失败');
       }
    }


    public function dele(){

        // var_dump($_GET);exit;
        //创建表对象
        $plate = M('plate');
        //获取id
        $id = I('get.id');
        $info = $plate -> find($id);

        $res = $plate -> where('pid = '.$info['id']) -> find();
        if(!empty($res)){
            $this->error('他有子板块,放过他吧');
        }else{
            $card = M('card');
            $val = $card -> where('pid = '.$info['id']) -> find();
            if(!empty($val)){
                $this->error('他肚子里有帖子,放过他吧');
            }else{
                //执行删除
                $value = $plate->delete($id);
                if($value != ""){
                    $this->redirect('Admin/Type/index');
                }else{
                    $this->error('删除失败');
                }
                
            }
        }
        
        
        // var_dump($val);
    }
}
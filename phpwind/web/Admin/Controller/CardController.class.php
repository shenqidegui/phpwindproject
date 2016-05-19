<?php 
namespace Admin\Controller;
use Think\Controller;
class CardController extends Controller {
	//显示所有帖子
    public function index(){
        $card = M('card');
        // var_dump($_POST);
        $num = I('post.num');
        $title = I('post.title');
        //模糊查询字段帖子标题title
        $num = I('post.num');
        $map['title'] = array("LIKE","%{$title}%");
        // $map['state'] =array('neq',0);
        // 查询满足要求的总记录数
        $total = $card -> where($map) -> count();
        
        //计算每页的第一条
        if($_GET['p']){
            $order =($_GET['p']-1)*5+1;
        }else{
            $order =1;
        }
 
        $args['title'] = $title;
        //实例化分页类 传入总记录数和每页显示的记录数(5)
        $Page = new \Think\Page($total,5,$args);
        // 进行分页数据查询 注意limit方法的参数要使用Page类的属性
       $limit = $Page -> firstRow.','.$Page -> listRows;
        // $cards = $card -> where($map) -> order('id desc') -> limit($Page -> firstRow.','.$Page -> listRows) -> select();
         $cards = $card
        ->field('card.*,user.username,plate.name platename')
        ->join('left join user on card.uid = user.id')
        ->join('right join plate on card.pid = plate.id')
        -> order('id desc')
        ->where($map)
        ->limit($limit)
        ->select();
        
        foreach ($cards as $k => $v) {
            $cards[$k]['ctime'] = date('Y-m-d h:i:s',$v['ctime']); 
        }

        $show = $Page -> show();
        $this -> assign('order',$order);
        $this -> assign('page',$show);
        $this -> assign('cards',$cards);
        // $this -> assign('user',$user);
        $this -> display();
        
    }
    // public function ajaxdel(){
    //     // var_dump($_GET);
    //     // 创建表对象
    //     $card = M('Card');
    //     $state = M('Card_state');
    //     //获取id
    //     $id = $_GET['id'];
    //     //执行删除
    //     $res = $state->where('cid = "'.$id.'"')->delete();
    //     $res = $card->delete($id);
    //     // 向ajax返回数据
    //     if($res) {
    //         echo 1;
    //     }else{
    //         echo 0;
    //     }
    // } 
}
?>
<?php 
namespace Admin\Controller;
use Think\Controller;
class CardstateController extends Controller {
	//显示所有帖子
    public function index(){
        $cardstate = M('card_state');
    
        $cid = I('post.cid');
        //模糊查询字段帖子标题title
        $map['cid'] = array("LIKE","%{$cid}%");
      
        // $map['state'] =array('neq',0);
        // 查询满足要求的总记录数
        $total = $cardstate -> where($map) -> count();
        
        //计算每页的第一条
        if($_GET['p']){
            $order =($_GET['p']-1)*5+1;
        }else{
            $order =1;
        }
        
        $args['cid'] = $cid;
        //实例化分页类 传入总记录数和每页显示的记录数(5)
        $Page = new \Think\Page($total,5,$args);
        // 进行分页数据查询 注意limit方法的参数要使用Page类的属性
        $limit = $Page -> firstRow.','.$Page -> listRows;
        // $data = $cardstate -> where($map) -> order('cid desc') -> limit($Page -> firstRow.','.$Page -> listRows) -> select();
        $cardstates= $cardstate
        ->field('card_state.*,card.title')
        ->join('left join card on card.id = card_state.cid')
        ->order('id desc')
        ->where($map)
        ->limit($limit)
        ->select();
       // var_dump($cardstates);die;
        
        $show = $Page -> show();
        $this -> assign('order',$order);
        $this -> assign('page',$show);
        $this -> assign('cardstates',$cardstates);
        $this -> display();
        
    }
    

    public function save(){
        $cid = I('get.cid');
        // var_dump($cid);
        $cardstate = M('card_state');
        $cardstates= $cardstate
        ->field('card_state.*,card.title')
        ->join('left join card on card.id = card_state.cid')
        ->where('cid= "'.$cid.'"')
        ->select();
        // $cardstates = $cardstate ->find(cid=>$cid);
        // $cardstates  = $cardstate->where('cid= "'.$cid.'"')->select();

        // var_dump($cardstates);die;
        
        
        $this -> assign('cardstates',$cardstates);
        // $this -> assign('user',$user);
        $this -> display();
    }
    
    //修改帖子状态
    public function update(){
        // var_dump($_POST);
        $cid = $_POST['cid'];
        // $data['title'] = $_POST['title'];
        // $data['is_show'] = $_POST['is_show'];
        // $data['is_hot'] = $_POST['is_hot'];
        // $data['is_top'] = $_POST['is_top'];
        // $data['is_hot'] = $_POST['is_hot'];
        // $data['is_check'] = $_POST['is_check'];
        // dump($data);

        $card_state = M('card_state');
        $res = $card_state->create();
        // var_dump($res);die;
        $res = $card_state->where('cid = "'.$cid.'"')->save();
        // var_dump($res);die;
        // $aaa = $card_state->getLastSql();      
        if($res){
                $this -> success('修改成功',U('Admin/Cardstate/index'),3);
            }else{
                $this -> error('修改失败');
            }         
    }
    
    
    // //删除帖子
    // public function del(){
    //     $id = I('id');
    //     $card = M('card');
        
    //     if($card -> delete($id)){
    //         $this -> success('删除成功');
    //     }else{
    //         $this -> error('删除失败！');
    //     }
    // }
    public function ajaxdel(){
        // var_dump($_GET);
        // 创建表对象
        $card = M('Card');
        $state = M('Card_state');
        //获取id
        $cid = $_GET['cid'];
        //执行删除
        $res = $state->where('cid = "'.$cid.'"')->delete();
        $res = $card->where('id = "'.$cid.'"')->delete();
        // 向ajax返回数据
        if($res) {
            echo 1;
        }else{
            echo 0;
        }
    }
    
}
?>
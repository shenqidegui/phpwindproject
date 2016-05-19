<?php
namespace Admin\Controller;
use Think\Controller;
class IndexController extends CommonController {
    public function index(){
    	// echo '后台首页';

    	//解析模板
    	$this->display();
    }
}
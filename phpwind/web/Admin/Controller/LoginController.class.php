<?php
namespace Admin\Controller;
use Think\Controller;
class LoginController extends Controller {

	public function index(){

		//解析模板
		$this->display();
	}

	public function login(){
		// var_dump($_POST);exit;

		$user = M('user');

		//接受数据
		$username = I('post.username');
		$pwd = md5(I('post.password'));
		// echo $pwd;exit;
		//查询
		$info = $user->where('username = "'.$username.'" and pwd = "'.$pwd.'" and groupid= 0')->find();
		if(empty($info)){
			$info = $user->where('username = "'.$username.'" and pwd = "'.$pwd.'" and groupid= 1')->find();
		}
		// var_dump($info);exit;
		//检测用户是否存在

		if(!empty($info)){
			$_SESSION['uid'] = $info['id'];
			session('username',$info['username']);
			$this->redirect('Admin/index/index');
		}else{
			$this->error('登录失败','',3);
		}
	}
	public function logout(){
		// unset($_SESSION);
		@session_start();
		$_SESSION = array();
		// var_dump($_SESSION);exit;
		if(empty($_SESSION)){
			$this->redirect('Admin/login/index');
		}
	}

}
<?php 

	

	function Uploads($filename){
		//处理图片
		if($_FILES[$filename]['error'] == 0){
		    $upload = new \Think\Upload();// 实例化上传类    
		    $upload->maxSize   =     3145728 ;// 设置附件上传大小    
		    $upload->exts      =     array('jpg', 'gif', 'png', 'jpeg');// 设置附件上传类型    
		    $upload->rootPath  =       './Public';
		    $upload->savePath  =      '/Uploads/'; // 设置附件上传目录   
		    // 上传文件     
		    $info   =   $upload->upload();    
		    if(!$info) {// 上传错误提示错误信息       
		        $this->error($upload->getError());    
		    }else{// 上传成功        
		        // $this->success('上传成功！'); 
		        $str =  ltrim($upload->rootPath,'.').$info[$filename]['savepath'].$info[$filename]['savename'];
		        $_POST[$filename] = $str;
		    }
		}
	}

	// 检测输入的验证码是否正确，$code为用户输入的验证码字符串
	function check_verify($code, $id = ''){    
		$verify = new \Think\Verify();    
		return $verify->check($code, $id);
	}







 ?>
<?php if (!defined('THINK_PATH')) exit();?><!doctype html>
<html>
<head>
<meta charset="UTF-8" />
<title>phpwind 官方论坛 - Powered by phpwind</title>
<meta http-equiv="X-UA-Compatible" content="chrome=1">
<meta name="generator" content="phpwind v9.0.1" />
<meta name="description" content="" />
<meta name="keywords" content="" />
<link rel="stylesheet" href="/Public/home/css/core_3.css" />
<link rel="stylesheet" href="/Public/home/css/style_3.css" />
<link rel="stylesheet" href="/Public/home/css/widthauto_3.css" />
<link rel="stylesheet" href="/Public/home/css/widthauto.css" />
<link rel="stylesheet" href="/Public/home/css/forum.css" />
<link rel="stylesheet" href="/Public/home/css/editor_content.css" />
<script src="/Public/home/js/plugin.client.js"></script>
<!--  -->

<link rel="stylesheet" href="/Public/home/css/core_11.css" />
<link rel="stylesheet" href="/Public/home/css/style_11.css" />
<link rel="stylesheet" href="/Public/home/css/widthauto_11.css" />
<script src="/Public/home/js/wind.js"></script>
<script src="/Public/js/jquery.js"></script>
<link href="/Public/home/css/register_8.css" rel="stylesheet" />

<!--  -->
<style>.main .thread_posts_list .st{font-size:14px;}</style><script>
//全局变量 Global Variables
var GV = {
	JS_ROOT : 'http://www.phpwind.net/res/js/dev/',										//js目录
	JS_VERSION : '20141124',											//js版本号(不能带空格)
	JS_EXTRES : 'http://www.phpwind.net/themes/extres',
	TOKEN : '7c634c22f900c920',	//token $.ajaxSetup data
	U_CENTER : 'http://www.phpwind.net/index.php?m=space',		//用户空间(参数 : uid)
	U_AVATAR_DEF : 'http://www.phpwind.net/res/images/face/face_small.jpg',					//默认小头像
	U_ID : parseInt('0'),									//uid
	REGION_CONFIG : '',														//地区数据
	CREDIT_REWARD_JUDGE : '',			//是否积分奖励，空值:false, 1:true
	URL : {
		LOGIN : 'http://www.phpwind.net/index.php?m=u&c=login',										//登录地址
		QUICK_LOGIN : 'http://www.phpwind.net/index.php?m=u&c=login&a=fast',								//快速登录
		IMAGE_RES: 'http://www.phpwind.net/res/images',										//图片目录
		CHECK_IMG : 'http://www.phpwind.net/index.php?m=u&c=login&a=showverify',							//验证码图片url，global.js引用
		VARIFY : 'http://www.phpwind.net/index.php?m=verify&a=get',									//验证码html
		VARIFY_CHECK : 'http://www.phpwind.net/index.php?m=verify&a=check',							//验证码html
		HEAD_MSG : {
			LIST : 'http://www.phpwind.net/index.php?m=message&c=notice&a=minilist'							//头部消息_列表
		},
		USER_CARD : 'http://www.phpwind.net/index.php?m=space&c=card',								//小名片(参数 : uid)
		LIKE_FORWARDING : 'http://www.phpwind.net/index.php?c=post&a=doreply',							//喜欢转发(参数 : fid)
		REGION : 'http://www.phpwind.net/index.php?m=misc&c=webData&a=area',									//地区数据
		SCHOOL : 'http://www.phpwind.net/index.php?m=misc&c=webData&a=school',								//学校数据
		EMOTIONS : "http://www.phpwind.net/index.php?m=emotion&type=bbs",					//表情数据
		CRON_AJAX : '',											//计划任务 后端输出执行
		FORUM_LIST : 'http://www.phpwind.net/index.php?c=forum&a=list',								//版块列表数据
		CREDIT_REWARD_DATA : 'http://www.phpwind.net/index.php?m=u&a=showcredit',					//积分奖励 数据
		AT_URL: 'http://www.phpwind.net/index.php?c=remind',									//@好友列表接口
		TOPIC_TYPIC: 'http://www.phpwind.net/index.php?c=forum&a=topictype'							//主题分类
	}
};
</script>
<script src="/Public/home/js/wind.js"></script>
<link href="/Public/home/css/register.css" rel="stylesheet" />

	<link href="/Public/home/css/post.css" rel="stylesheet" />

</head>
<body>
<div class="wrap">
<header class="header_wrap">
<div class="head">
	<div id="J_header" class="cc header">
		<div class="logo">
			<a href="/Index/index">
								<!--后台logo上传-->
				<img src="/Public/home/picture/4439b6b579ac496.png" alt="phpwind 官方论坛">
							</a>
		</div>
		<!-------通过Widget扩展调用显示导航------------->
		<?php W('Nav/nav');?>
	
 <?php if($_SESSION['webuser']!= ''): ?><!--  用户信息头像那一部分  -->
	<a rel="nofollow" href="/Personinfo/avatar" class="fr userface" title="修改头像"><img class="J_avatar" src="/Public/uploads/s_<?php echo ($_SESSION['webuser']['icon']); ?>" data-type="middle" width="50" height="50" onerror="this.src='/Public/home/picture/face_small.jpg'" /></a>
	<?php echo W("Notice/Notice");?>
	<!-------------->
	<!--消息下拉菜单-->
	<div id="J_head_msg_pop" tabindex="0" aria-label="消息下拉菜单,按ESC键关闭菜单" class="header_menu_wrap my_message_menu" style="display:none;">
		<div class="header_menu cc">
			<div class="core_arrow_top" style="left:206px;"><em></em><span></span></div>
			<div id="J_head_msg" class="my_message_content"><div class="pop_loading"></div></div>
		</div>
	</div>
	<div class="header_login_later fr">
		<a aria-haspopup="J_head_user_menu" aria-label="个人功能菜单,按pagedown打开菜单,tab键导航,esc键关闭" tabindex="0" rel="nofollow" href="#" id="J_head_user_a" class="header_login_btn username">1</a>
		<div class="fl">
		<div id="J_head_user_menu" role="menu" class="header_menu_wrap my_menu_wrap" style="display:none;">
			<div class="header_menu my_menu cc">
				<div class="core_arrow_top" id="selected" style="left:77px;"><em></em><span></span></div>
				<ul class="ct cc">
					<li><a href="/Zone/index"><em class="icon_space"></em>我的空间</a></li>
					<li><a href="/FriendList/index"><em class="icon_fresh"></em>我的好友</a></li>
					<li><a href="/Messagetext/index"><em class="icon_task"></em>站内信息</a></li>
					<li><a href="/Message/index"><em class="icon_article"></em>我的信息</a></li>
					<li><a href="/Medal/index"><em class="icon_medal"></em>我的勋章</a></li>
				</ul>
				<ul class="ft cc">
					<li><a href="/Personinfo/index"><em class="icon_profile"></em>个人设置</a></li>
					<li><a href="/Login/logout" rel="nofollow"><em class="icon_quit"></em>退出</a></li>
				</ul>
			</div>
		</div>
		</div>
	</div>
	
<?php else: ?>
	<div class="header_login">
		<a rel="nofollow" href="/Login/index" class="mr15">登录</a><a rel="nofollow" href="/Register/index">注册</a>
	</div><?php endif; ?>

		<div class="header_search" role="search">
			<form action="/Home/Register/index" method="post">
				<button  class="search-btn"type="submit" aria-label="搜索">搜索</button>
				<input class="search-txt" type="text" id="s" aria-label="搜索关键词" accesskey="s" placeholder="按帖子标题搜索" x-webkit-speech speech name="title"/>
			<input type="hidden" name="csrf_token" value="7c634c22f900c920"/>
			</form>
		</div>
<a class="header_login_btn search-magnify"  href="#"><span class="header_search_btn">搜索</span></a>
<script src="/Public/home/js/jquery.js"></script>
<script>
    
	/*搜索框的变化*/
    $(function(){

			$(".search-magnify").click(function(event) {

				$(this).hide(); 
				$(".search-txt").focus(); 
				$(".header_search").animate({width: "200px"},200, function() { 
            
				});

				return false;
			});

			$('body').click(function(event){
				var e = event || window.event;
                if ( !$(e.target).is('.header_search,.search-txt,.search-btn') ) {
                
                $(".header_search").animate({width: 0},100, function() {  
				
                });

                $(".search-magnify").show();
              }
        });

    })
	
	
	$(".header_login_later").hover(function(){
		$("#J_head_user_menu").css("display","block");
		$("#J_head_user_menu").css("margin-top","30px");
	},function(){
		$("#J_head_user_menu").mouseover(function(){
			$(this).css("display","block");
		}).mouseout(function(){
			$(this).css("display","none");
		});
	});

</script>
	</div>
</div>
</header>
<div class="tac"></div>
<!----------主题内容---------->

	<div class="main_wrap">
		<div class="box_wrap register cc">
			<h2 class="reg_head">欢迎注册成为phpwind论坛 　 会员</h2>
			<div class="reg_cont_wrap">	
				<div class="reg_cont">
						<!-- form表单 -->
					<form action="<?php echo U('Home/Register/insert');?>" method="post" name="reg" >
					<div class="reg_form">
						<dl class="cc">
							<dt><label for="login_username">用户名：</label></dt>
							<dd><input id="username" name="username" type="text" class="input length_4" /></dd>
							<dd id="loginuser" role="tooltip" aria-hidden="true" class="dd_r"></dd>
						</dl>
						<dl class="cc">
							<dt><label for="login_password">密码：</label></dt>
							<dd><input id="password" name="pwd" type="password" class="input length_4" /></dd>
							<dd id="loginpwd" role="tooltip" aria-hidden="true" class="dd_r"></dd>
						</dl>
						<div id="J_login_qa" style="display:none;"></div>
						<dl class="cc">
							<dt><label for="login_password">确认密码：</label></dt>
							<dd><input id="repassword" name="repwd" type="password" class="input length_4" /></dd>
							<dd id="loginrepwd" role="tooltip" aria-hidden="true" class="dd_r"></dd>
						</dl>
						<div id="J_login_qa" style="display:none;"></div>
						<dl class="cc">
							<dt><label for="login_password">电子邮箱：</label></dt>
							<dd><input id="email" name="email" type="text" class="input length_4" /></dd>
							<dd id="loginemail" role="tooltip" aria-hidden="true" class="dd_r"></dd>
						</dl>
						<div id="J_login_qa" style="display:none;"></div>
						<dl class="cc dl_cd">
							<dt><label for="J_login_code">验证码：</label></dt>
							<dd>
								<input data-id="code" id="code" name="user_code" type="text" class="input length_4 mb5">
								<dd id="logincode" role="tooltip" aria-hidden="true" class="dd_r"></dd>
							</dd>
							<div style="margin-left:125px;margin-top:40px;">
							<img width="240" height="60" id="recode" src="/Home/Register/code" onclick="this.src='/Home/Register/code?'+Math.random()" /><br/>
							<a role="button" href="#" id="J_verify_update_a">点击图片换一个</a>
							</div>
						</dl>
						<dl class="cc">
							<dt>　</dt>
							<dd style="color:red;"><?php echo ($errorinfo); ?></dd>
						</dl>
						<dl class="cc">
							<dt>&nbsp;</dt>
							<dd><button class="btn btn_big btn_submit mr20" type="submit">同意右侧协议并注册</button>
							</dd>
						</dl>
					</div>
					</form>
					
				</div>
			</div>
			<div class="reg_side">
				<div class="reg_side_cont">
					<p class="mb10">已有帐号？</p>
					<p class="mb20"><a rel="nofollow" href="<?php echo U('Home/Login/index');?>" class="btn btn_big">立即登录</a></p>
				</div>
			</div>
		</div>
	</div>
<!--.main-wrap,#main End-->


<div class="tac">
<br />
</div>
<div class="footer_wrap" style="margin-left:-86px">
	<div class="footer">
		<pw-drag id="footer_segment"/>
		<div class="bottom">
		<a href="#">关于phpwind</a><a href="#">联系我们</a><a href="#">问题反馈</a><a href="#">程序建议</a><a href="#" target="_blank">阿里云官方网站</a><a href="#" target="_blank">官方微博</a>		</div>
		<p>Powered by <a href="#" target="_blank" rel="nofollow">phpwind v9.0.1</a> &copy;2003-2015 <a href="#" target="_blank" rel="nofollow">phpwind.com</a> <a href="#" target="_blank" rel="nofollow">浙B2-20070029</a></p>
		<!-- <p><script src='/Public/home/js/c.php' language='JavaScript'></script></p> -->
	</div>
	
	<div id="cloudwind_common_bottom"></div>
	</div>

<!--返回顶部-->
<a href="#" rel="nofollow" role="button" id="back_top" tabindex="-1">返回顶部</a>

</div>

<script>
	
	var password = document.getElementById("password");
	var email = document.getElementById("email");
	var isUser = false;
	var isPwd = false;
	var isrePwd = false;
	var isEmail = false;
	var isCode = false;
	
	$("form[name='reg']").submit(function(){
		checkuser();
		checkpwd();
		checkrepwd();
		checkemail();
		checkcode();
		if(isUser && isPwd && isrePwd && isEmail && isCode){
			return true;
		}else{
			return false;
		}
	});
	
	$("#username").focus(function(){
		$('#loginuser').css('color','#ccc');
		$('#loginuser').html("请输入5-12用户名！");
		$(this).parent().parent().addClass('current');
	});
	
	$("#username").blur(function(){
		$('#username').parent().parent().removeClass('current');
		checkuser();
	});
	
	function checkuser(){
		if($('#username').val().length == 0){
			var info = "用户名不能为空！";
			var color = "red";
			$('#loginuser').html('<span class="tips_icon_error"><span>' + info);
			isUser = false;
			return isUser;
		}
		/*$.ajax({
			url:"/Home/Register/checkedUser",
			type:"POST",
			data:"username=".$("#username").val(),
			success:function(data){
				if(data == 1){
					var info = "用户名不存在！";
					var color = "red";
					$('#loginuser').html('<span class="tips_icon_error"><span>' + info);
					return false;
				}else{
					$('#username').parent().parent().removeClass('current');
					$('#loginuser').html('<span class="tips_icon_success"><span>');
					return true;
				}
			},
			dataType:'josn'
		});*/
		$.post('/Home/Register/checkedUser',{'username':$("#username").val()},function(data){
			if(data == 1){
					var info = "用户名已存在！";
					var color = "red";
					$('#loginuser').html('<span class="tips_icon_error"><span>' + info);
					isUser = false;
				}else{
					$('#loginuser').html('<span class="tips_icon_success"><span>');
					isUser = true;
				}
		},'json');

	}
	
	$("#password").focus(function(){
		$("#loginpwd").css('color','#ccc');
		$("#loginpwd").html('请输入密码！');
		$(this).parent().parent().addClass('current');
	});
	
	$("#password").blur(function(){
		$('#password').parent().parent().removeClass('current');
		checkpwd();
		
	});
	
	function checkpwd(){
		//密码不能为空
		if($('#password').val().length == 0){
			var info = "密码不能为空";
			var color = "red";
			$('#loginpwd').html('<span class="tips_icon_error"><span>' + info);
			isPwd = false;
		}else if(password.value.match(/^\d{3,}$/)){
			var info = "密码等级强度低";
			var color = "red";
			$('#loginpwd').html('<span class="tips_icon_error"><span>' + info);
			isPwd = false;
		}else{
			$('#loginpwd').html('<span class="tips_icon_success"><span>');
			isPwd = true;
		}
	}
	
	$("#repassword").focus(function(){
		$("#loginrepwd").css('color','#ccc');
		$("#loginrepwd").html('请确认密码！');
		$(this).parent().parent().addClass('current');
	});
	
	$("#repassword").blur(function(){
		$('#repassword').parent().parent().removeClass('current');
		checkrepwd();
		
	});
	
	function checkrepwd(){
		//确认密码
		if($('#repassword').val().length == 0){
			var info = "确认密码不能为空！";
			var color = "red";
			$('#loginrepwd').html('<span class="tips_icon_error"><span>' + info);
			isrePwd = false;
		}else if($('#repassword').val() != $('#password').val()){
			var info = "两次密码不一致！";
			var color = "red";
			$('#loginrepwd').html('<span class="tips_icon_error"><span>' + info);
			isrePwd = false;
		}else{
			$('#loginrepwd').html('<span class="tips_icon_success"><span>');
			isrePwd = true;
		}
	}
	
	$("#email").focus(function(){
		$("#loginemail").css('color','#ccc');
		$("#loginemail").html('请输入电子邮箱！');
		$(this).parent().parent().addClass('current');
	});
	
	$("#email").blur(function(){
		$('#email').parent().parent().removeClass('current');
		checkemail();
	});
	
	function checkemail(){
		//确认电子邮箱
		if($("#email").val().length == 0){
			var info = "电子邮箱不能为空！";
			var color = "red";
			$('#loginemail').html('<span class="tips_icon_error"><span>' + info);
			isEmail = false;
		}else if(!email.value.match(/^\w+@\w+(\.\w+){1,3}$/)){
			var info = "电子邮箱的格式不正确！";
			var color = "red";
			$('#loginemail').html('<span class="tips_icon_error"><span>' + info);
			isEmail = false;
		}else{
			$('#loginemail').html('<span class="tips_icon_success"><span>');
			isEmail = true;
		}
	}
	
	$('#code').focus(function(){
		$("#logincode").css('color','#ccc');
		$("#logincode").html('请输入验证码！');
		$(this).parent().parent().addClass('current');
	});
	
	$('#code').blur(function(){
		$('#code').parent().parent().removeClass('current');
		checkcode();
	});
	
	// function checkcode(){
	// 	//验证码不能为空
		
	// 	if($('#code').val().length == 0){
	// 		var info = "验证码不能为空";
	// 		var color = "red";
			
	// 		$('#logincode').html('<span class="tips_icon_error"><span>' + info);
	// 		isCode = false;
	// 	}
			
	// 		$.ajax({
	// 			url:"/Home/Register/checkedCode",
	// 			type:"POST",
	// 			data:$('#code').val(),
	// 			success:function(data){
	// 				if(data == 1){
	// 					var info = "验证码错误！";
	// 					var color = "red";
	// 					$('#code').parent().parent().removeClass('current');
	// 					$('#logincode').html('<span class="tips_icon_error"><span>' + info);
	// 					return false;
	// 				}else{
	// 					$('#code').parent().parent().removeClass('current');
	// 					$('#logincode').html('<span class="tips_icon_success"><span>');
	// 					return true;
	// 				}
	// 			}
	// 		});
		
	// 	$.post('/Home/Register/checkedCode',{'user_code':$("#code").val()},function(data){
	// 			if(data == 1){
	// 					var info = "验证码错误！";
	// 					var color = "red";
	// 					$('#logincode').html('<span class="tips_icon_error"><span>' + info);
	// 					isCode = false;
	// 				}else{
	// 					$('#logincode').html('<span class="tips_icon_success"><span>');
	// 					isCode = true;
	// 				}
	// 	},'json');
		
		
	// }
	
</script>

</body>
</html>
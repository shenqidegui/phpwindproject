<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>PHPwind后台管理系统</title>
		<meta name="keywords" content="Bootstrap模版,Bootstrap模版下载,Bootstrap教程,Bootstrap中文" />
		<meta name="description" content="站长素材提供Bootstrap模版,Bootstrap教程,Bootstrap中文翻译等相关Bootstrap插件下载" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<!-- basic styles -->
		<link href="/Public/admin/assets/css/bootstrap.min.css" rel="stylesheet" />
	<link rel="stylesheet" href="/Public/Admin/assets/css/font-awesome.min.css">
		
		<link rel="stylesheet" href="/Public/admin/assets/css/font-awesome.min.css" />
		<link rel="stylesheet" href="/Public/admin/assets/css/dropzone.css" />
		<!--[if IE 7]>
		  <link rel="stylesheet" href="/Public/admin/assets/css/font-awesome-ie7.min.css" />
		<![endif]-->

		<!-- page specific plugin styles -->
		
		<!-- fonts -->
		
	
		<!-- ace styles -->

		<link rel="stylesheet" href="/Public/admin/assets/css/ace.min.css" />
		<link rel="stylesheet" href="/Public/admin/assets/css/ace-rtl.min.css" />
		<link rel="stylesheet" href="/Public/admin/assets/css/ace-skins.min.css" />

		<!--[if lte IE 8]>
		  <link rel="stylesheet" href="/Public/admin/assets/css/ace-ie.min.css" />
		<![endif]-->

		<!-- inline styles related to this page -->

		<!-- ace settings handler -->

		<script src="/Public/admin/assets/js/ace-extra.min.js"></script>

		<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->

		<!--[if lt IE 9]>
		<script src="/Public/admin/assets/js/html5shiv.js"></script>
		<script src="/Public/admin/assets/js/respond.min.js"></script>
		<![endif]-->
	</head>

	<body>
		<div class="navbar navbar-default" id="navbar">
			<script type="text/javascript">
				try{ace.settings.check('navbar' , 'fixed')}catch(e){}
			</script>

			<div class="navbar-container" id="navbar-container">
				<div class="navbar-header pull-left">
					<a href="#" class="navbar-brand">
						<small>
							<i class="icon-leaf"></i>
							后台管理系统
						</small>
					</a><!-- /.brand -->
				</div><!-- /.navbar-header -->

				<div class="navbar-header pull-right" role="navigation">
					<ul class="nav ace-nav">
						<li class="grey">
							<a data-toggle="dropdown" class="dropdown-toggle" href="#">
								<i class="icon-tasks"></i>
								<span class="badge badge-grey">4</span>
							</a>

							<ul class="pull-right dropdown-navbar dropdown-menu dropdown-caret dropdown-close">
								<li class="dropdown-header">
									<i class="icon-ok"></i>
									还有4个任务完成
								</li>

								<li>
									<a href="#">
										<div class="clearfix">
											<span class="pull-left">软件更新</span>
											<span class="pull-right">65%</span>
										</div>

										<div class="progress progress-mini ">
											<div style="width:65%" class="progress-bar "></div>
										</div>
									</a>
								</li>

								<li>
									<a href="#">
										<div class="clearfix">
											<span class="pull-left">硬件更新</span>
											<span class="pull-right">35%</span>
										</div>

										<div class="progress progress-mini ">
											<div style="width:35%" class="progress-bar progress-bar-danger"></div>
										</div>
									</a>
								</li>

								<li>
									<a href="#">
										<div class="clearfix">
											<span class="pull-left">单元测试</span>
											<span class="pull-right">15%</span>
										</div>

										<div class="progress progress-mini ">
											<div style="width:15%" class="progress-bar progress-bar-warning"></div>
										</div>
									</a>
								</li>

								<li>
									<a href="#">
										<div class="clearfix">
											<span class="pull-left">错误修复</span>
											<span class="pull-right">90%</span>
										</div>

										<div class="progress progress-mini progress-striped active">
											<div style="width:90%" class="progress-bar progress-bar-success"></div>
										</div>
									</a>
								</li>

								<li>
									<a href="#">
										查看任务详情
										<i class="icon-arrow-right"></i>
									</a>
								</li>
							</ul>
						</li>

						<li class="purple">
							<a data-toggle="dropdown" class="dropdown-toggle" href="#">
								<i class="icon-bell-alt icon-animated-bell"></i>
								<span class="badge badge-important">8</span>
							</a>

							<ul class="pull-right dropdown-navbar navbar-pink dropdown-menu dropdown-caret dropdown-close">
								<li class="dropdown-header">
									<i class="icon-warning-sign"></i>
									8条通知
								</li>

								<li>
									<a href="#">
										<div class="clearfix">
											<span class="pull-left">
												<i class="btn btn-xs no-hover btn-pink icon-comment"></i>
												新闻评论
											</span>
											<span class="pull-right badge badge-info">+12</span>
										</div>
									</a>
								</li>

								<li>
									<a href="#">
										<i class="btn btn-xs btn-primary icon-user"></i>
										切换为编辑登录..
									</a>
								</li>

								<li>
									<a href="#">
										<div class="clearfix">
											<span class="pull-left">
												<i class="btn btn-xs no-hover btn-success icon-shopping-cart"></i>
												新订单
											</span>
											<span class="pull-right badge badge-success">+8</span>
										</div>
									</a>
								</li>

								<li>
									<a href="#">
										<div class="clearfix">
											<span class="pull-left">
												<i class="btn btn-xs no-hover btn-info icon-twitter"></i>
												粉丝
											</span>
											<span class="pull-right badge badge-info">+11</span>
										</div>
									</a>
								</li>

								<li>
									<a href="#">
										查看所有通知
										<i class="icon-arrow-right"></i>
									</a>
								</li>
							</ul>
						</li>

						<li class="green">
							<a data-toggle="dropdown" class="dropdown-toggle" href="#">
								<i class="icon-envelope icon-animated-vertical"></i>
								<span class="badge badge-success">5</span>
							</a>

							<ul class="pull-right dropdown-navbar dropdown-menu dropdown-caret dropdown-close">
								<li class="dropdown-header">
									<i class="icon-envelope-alt"></i>
									5条消息
								</li>

								<li>
									<a href="#">
										<img src="/Public/admin/assets/avatars/avatar.png" class="msg-photo" alt="Alex's Avatar" />
										<span class="msg-body">
											<span class="msg-title">
												<span class="blue">Alex:</span>
												不知道写啥 ...
											</span>

											<span class="msg-time">
												<i class="icon-time"></i>
												<span>1分钟以前</span>
											</span>
										</span>
									</a>
								</li>

								<li>
									<a href="#">
										<img src="/Public/admin/assets/avatars/avatar3.png" class="msg-photo" alt="Susan's Avatar" />
										<span class="msg-body">
											<span class="msg-title">
												<span class="blue">Susan:</span>
												不知道翻译...
											</span>

											<span class="msg-time">
												<i class="icon-time"></i>
												<span>20分钟以前</span>
											</span>
										</span>
									</a>
								</li>

								<li>
									<a href="#">
										<img src="/Public/admin/assets/avatars/avatar4.png" class="msg-photo" alt="Bob's Avatar" />
										<span class="msg-body">
											<span class="msg-title">
												<span class="blue">Bob:</span>
												到底是不是英文 ...
											</span>

											<span class="msg-time">
												<i class="icon-time"></i>
												<span>下午3:15</span>
											</span>
										</span>
									</a>
								</li>

								<li>
									<a href="inbox.html">
										查看所有消息
										<i class="icon-arrow-right"></i>
									</a>
								</li>
							</ul>
						</li>

						<li class="light-blue">
							<a data-toggle="dropdown" href="#" class="dropdown-toggle">
								<img class="nav-user-photo" src="/Public/admin/assets/avatars/user.jpg" alt="Jason's Photo" />
								<span class="user-info">
									<small>欢迎光临,</small>
									Jason
								</span>

								<i class="icon-caret-down"></i>
							</a>

							<ul class="user-menu pull-right dropdown-menu dropdown-yellow dropdown-caret dropdown-close">
								<li>
									<a href="#">
										<i class="icon-cog"></i>
										设置
									</a>
								</li>

								<li>
									<a href="/Index/person">
										<i class="icon-user"></i>
										个人资料
									</a>
								</li>

								<li class="divider"></li>

								<li>
									<a href="/Public/logout">
										<i class="icon-off"></i>
										退出
									</a>
								</li>
							</ul>
						</li>
					</ul><!-- /.ace-nav -->
				</div><!-- /.navbar-header -->
			</div><!-- /.container -->
		</div>

		<div class="main-container" id="main-container">
			<script type="text/javascript">
				try{ace.settings.check('main-container' , 'fixed')}catch(e){}
			</script>

			<div class="main-container-inner">
				<a class="menu-toggler" id="menu-toggler" href="#">
					<span class="menu-text"></span>
				</a>
				<!-- 左边控制台 -->
				<div class="sidebar" id="sidebar">
					<script type="text/javascript">
						try{ace.settings.check('sidebar' , 'fixed')}catch(e){}
					</script>

					<div class="sidebar-shortcuts" id="sidebar-shortcuts">
						<div class="sidebar-shortcuts-large" id="sidebar-shortcuts-large">
							<button class="btn btn-success">
								<i class="icon-signal"></i>
							</button>

							<button class="btn btn-info">
								<i class="icon-pencil"></i>
							</button>

							<button class="btn btn-warning">
								<i class="icon-group"></i>
							</button>

							<button class="btn btn-danger">
								<i class="icon-cogs"></i>
							</button>
						</div>

						<div class="sidebar-shortcuts-mini" id="sidebar-shortcuts-mini">
							<span class="btn btn-success"></span>

							<span class="btn btn-info"></span>

							<span class="btn btn-warning"></span>

							<span class="btn btn-danger"></span>
						</div>
					</div><!-- #sidebar-shortcuts -->


					<!-- 控制台遍历 -->
					<ul class="nav nav-list">
						<li class="active">
							<a href="">
								<i class="icon-dashboard"></i>
								<span class="menu-text"> 控制台 </span>
							</a>
						</li>

						<!-- 用户管理 -->
						<li>
							<a href="#" class="dropdown-toggle">
								<i class="icon-desktop"></i>
								<span class="menu-text"> 用户管理 </span>

								<b class="arrow icon-angle-down"></b>
							</a>

							<ul class="submenu">
								<li>
									<a href="">
										<i class="icon-double-angle-right"></i>
										用户列表
									</a>
								</li>

								<li>
									<a href="">
										<i class="icon-double-angle-right"></i>
										添加用户
									</a>
								</li>
							</ul>
						</li>

						<!-- 权限管理 -->
						<li class="">
							<a href="#" class="dropdown-toggle">
								<i class="icon-desktop"></i>
								<span class="menu-text"> 权限管理 </span>

								<b class="arrow icon-angle-down"></b>
							</a>

							<ul style="display: none;" class="submenu">
								<li class="">
									<a href="#" class="dropdown-toggle">
										<i class="icon-double-angle-right"></i>

										用户组权限
										<b class="arrow icon-angle-down"></b>
									</a>

									<ul style="display: none;" class="submenu">
										<li>
											<a href="">
												<i class="icon-leaf"></i>
												会员组
											</a>
										</li>
										
										<li>
											<a href="">
												<i class="icon-leaf"></i>
												游客组
											</a>
										</li>
										
										<li>
											<a href="">
												<i class="icon-leaf"></i>
												管理组
											</a>
										</li>
										
										
									</ul>
								</li>

							</ul>
						</li>

						<!-- 导航管理 -->
						<li class="">
							<a class="dropdown-toggle" href="#">
								<i class="icon-list"></i>
								<span class="menu-text"> 导航管理 </span>

								<b class="arrow icon-angle-down"></b>
							</a>

							<ul class="submenu" style="display: none;">
								<li>
									<a href="<?php echo U('Admin/Nav/index');?>">
										<i class="icon-double-angle-right"></i>
										浏览导航信息
									</a>
								</li>

								<li>
									<a href="<?php echo U('Admin/Nav/add');?>">
										<i class="icon-double-angle-right"></i>
										添加导航信息
									</a>
								</li>
							</ul>
						</li>

						<!-- 板块管理 -->
						<li class="">
							<a class="dropdown-toggle" href="/home/project/ThinkPHP/Type/index">
								<i class="icon-list"></i>
								<span class="menu-text"> 版块管理 </span>

								<b class="arrow icon-angle-down"></b>
							</a>

							<ul class="submenu" style="display: none;">
								<li>
									<a href="">
										<i class="icon-double-angle-right"></i>
										浏览所有版块
									</a>
								</li>

								<li>
									<a href="">
										<i class="icon-double-angle-right"></i>
										添加根版块
									</a>
								</li>
                                
							</ul>
						</li>
						
						<!-- 帖子管理 -->
						<li class="">
							<a class="dropdown-toggle" href="#">
								<i class="icon-edit"></i>
								<span class="menu-text"> 帖子管理 </span>

								<b class="arrow icon-angle-down"></b>
							</a>

							<ul class="submenu" style="display: none;">
								<li>
									<a href="">
										<i class="icon-double-angle-right"></i>
										浏览帖子
									</a>
								</li>
								
							</ul>
						</li>

						<!-- 评论管理 -->
						<li>
							<a class="dropdown-toggle" href="#">
								<i class="icon-edit"></i>
								<span class="menu-text"> 评论管理 </span>

								<b class="arrow icon-angle-down"></b>
							</a>

							<ul class="submenu">
								<li>
									<a href="">
										<i class="icon-double-angle-right"></i>
										浏览回复信息
									</a>
								</li>
							</ul>
						</li>

						<!-- 帖子审核 -->
						<li>
							<a class="dropdown-toggle" href="#">
								<i class="icon-edit"></i>
								<span class="menu-text"> 帖子审核 </span>

								<b class="arrow icon-angle-down"></b>
							</a>

							<ul class="submenu">
								<li>
									<a href="">
										<i class="icon-double-angle-right"></i>
										主题审核
									</a>
								</li>

								<li>
									<a href="">
										<i class="icon-double-angle-right"></i>
										回复审核
									</a>
								</li>
							</ul>
						</li>

						<!-- 数据统计 -->
						<li>
							<a class="dropdown-toggle" href="#">
								<i class="icon-edit"></i>
								<span class="menu-text"> 数据统计 </span>

								<b class="arrow icon-angle-down"></b>
							</a>

							<ul class="submenu">
								<li>
									<a href="">
										<i class="icon-double-angle-right"></i>
										数据统计浏览
									</a>
								</li>
							</ul>
						</li>

						<!-- 举报管理 -->
						<li>
							<a class="dropdown-toggle" href="#">
								<i class="icon-edit"></i>
								<span class="menu-text"> 举报管理 </span>

								<b class="arrow icon-angle-down"></b>
							</a>

							<ul class="submenu">
								<li>
									<a href="">
										<i class="icon-double-angle-right"></i>
										浏览被举报的帖子
									</a>
								</li>

								<li>
									<a href="">
										<i class="icon-double-angle-right"></i>
										浏览被举报的评论
									</a>
								</li>
							</ul>
						</li>

						<!-- 广告管理 -->
						<li class="">
							<a class="dropdown-toggle" href="#">
								<i class="icon-list"></i>
								<span class="menu-text"> 广告管理 </span>

								<b class="arrow icon-angle-down"></b>
							</a>

							<ul class="submenu" style="display: none;">
								<li>
									<a href="">
										<i class="icon-double-angle-right"></i>
										广告列表
									</a>
								</li>

								<li>
									<a href="">
										<i class="icon-double-angle-right"></i>
										广告添加
									</a>
								</li>
							</ul>
						</li>

						<!-- 连接管理 -->
						<li>
							<a class="dropdown-toggle" href="#">
								<i class="icon-list"></i>
								<span class="menu-text"> 链接管理 </span>

								<b class="arrow icon-angle-down"></b>
							</a>

							<ul class="submenu">
								<li>
									<a href="">
										<i class="icon-double-angle-right"></i>
										浏览链接
									</a>
								</li>

								<li>
									<a href="">
										<i class="icon-double-angle-right"></i>
										添加链接
									</a>
								</li>
							</ul>
						</li>

						<!-- 日历 -->
						<li>
							<a href="">
								<i class="icon-calendar"></i>

								<span class="menu-text">
									日历
									<!--<span class="badge badge-transparent tooltip-error" title="2&nbsp;Important&nbsp;Events">
										<i class="icon-warning-sign red bigger-130"></i>
									</span>-->
								</span>
							</a>
						</li>		
					</ul><!-- /.nav-list -->

					<div class="sidebar-collapse" id="sidebar-collapse">
						<i class="icon-double-angle-left" data-icon1="icon-double-angle-left" data-icon2="icon-double-angle-right"></i>
					</div>

					<script type="text/javascript">
						try{ace.settings.check('sidebar' , 'collapsed')}catch(e){}
					</script>
				</div>
				<!-- 中间后台首页展示内容(待添加) -->

<div id="page-wrapper" style="float:left;width:800px;">
    <div class="row">
        <div class="col-lg-12">
            <h1 class="page-header">导航列表的修改</h1>
        </div>
        <!-- /.col-lg-12 -->
    </div>
   <div class="row">
                   <div class="col-lg-12">
                       <div class="panel panel-default">
                           <div class="panel-heading">
                               Basic Form Elements
                           </div>
                           <div class="panel-body">
                               <div class="row">
                                   <div class="col-lg-6">
                                       <form role="form" action="<?php echo U('Admin/Nav/update');?>" method="post" enctype="multipart/form-data">
                                           <input type="hidden" name="id" value="<?php echo ($info["id"]); ?>">
                                           <div class="form-group">
                                               <label>模块名</label>
                                               <input value="<?php echo ($info["name"]); ?>" name="name" placeholder="请输入新的模块名" class="form-control">
                                           </div>
                                           
                                           <div class="form-group">
                                               <label>路径</label>
                                               <input value="<?php echo ($info["url"]); ?>" type="text" name="url" placeholder="请输入新的模块路径" class="form-control">
                                           </div>
                                           <div class="form-group">
                                             <label>序列号</label>
                                             <label class="radio-inline">
                                                 <input type="radio" checked="" value="1" id="optionsRadiosInline1" name="num" <?php if($info['num'] == 1): ?>checked<?php endif; ?>>1
                                             </label>
                                             <label class="radio-inline">
                                                 <input type="radio" value="2" id="optionsRadiosInline2" name="num" <?php if($info['num'] == 2): ?>checked<?php endif; ?>>2
                                             </label>
                                             <label class="radio-inline">
                                                 <input type="radio" value="3" id="optionsRadiosInline3" name="num" <?php if($info['num'] == 3): ?>checked<?php endif; ?>>3
                                             </label>
                                             <label class="radio-inline">
                                                 <input type="radio" checked="" value="4" id="optionsRadiosInline1" name="num" <?php if($info['num'] == 4): ?>checked<?php endif; ?>>4
                                             </label>
                                             <label class="radio-inline">
                                                 <input type="radio" value="5" id="optionsRadiosInline2" name="num" <?php if($info['num'] == 5): ?>checked<?php endif; ?>>5
                                             </label>
                                             <label class="radio-inline">
                                                 <input type="radio" value="6" id="optionsRadiosInline3" name="num" <?php if($info['num'] == 6): ?>checked<?php endif; ?>>6
                                             </label>
                                             <label class="radio-inline">
                                                 <input type="radio" value="7" id="optionsRadiosInline3" name="num" <?php if($info['num'] == 7): ?>checked<?php endif; ?>>7
                                             </label>
                                             <label class="radio-inline">
                                                 <input type="radio" value="8" id="optionsRadiosInline3" name="num" <?php if($info['num'] == 8): ?>checked<?php endif; ?>>8
                                             </label>

                                         </div>
                                           <button class="btn btn-warning" type="reset">重置</button>
                                           <button class="btn btn-info" type="submit">提交</button>
                                       </form>
                                   </div>
                             <!--   http://localhost/Class/s43/project/index.php/Admin/User/add.html
                               http://localhost/Class/s43/project/index.php/Admin/User/add.shtml
                               lamp43/Admin/User/add
                               lamp43/Admin/User/add.html -->
                               </div>
                               <!-- /.row (nested) -->
                           </div>
                           <!-- /.panel-body -->
                       </div>
                       <!-- /.panel -->
                   </div>
                   <!-- /.col-lg-12 -->
               </div>
</div>

				<div class="ace-settings-container" id="ace-settings-container">
					<div class="btn btn-app btn-xs btn-warning ace-settings-btn" id="ace-settings-btn">
						<i class="icon-cog bigger-150"></i>
					</div>

					<div class="ace-settings-box" id="ace-settings-box">
						<div>
							<div class="pull-left">
								<select id="skin-colorpicker" class="hide">
									<option data-skin="default" value="#438EB9">#438EB9</option>
									<option data-skin="skin-1" value="#222A2D">#222A2D</option>
									<option data-skin="skin-2" value="#C6487E">#C6487E</option>
									<option data-skin="skin-3" value="#D0D0D0">#D0D0D0</option>
								</select>
							</div>
							<span>&nbsp; 选择皮肤</span>
						</div>

						<div>
							<input type="checkbox" class="ace ace-checkbox-2" id="ace-settings-navbar" />
							<label class="lbl" for="ace-settings-navbar"> 固定导航条</label>
						</div>

						<div>
							<input type="checkbox" class="ace ace-checkbox-2" id="ace-settings-sidebar" />
							<label class="lbl" for="ace-settings-sidebar"> 固定滑动条</label>
						</div>

						<div>
							<input type="checkbox" class="ace ace-checkbox-2" id="ace-settings-breadcrumbs" />
							<label class="lbl" for="ace-settings-breadcrumbs">固定面包屑</label>
						</div>

						<div>
							<input type="checkbox" class="ace ace-checkbox-2" id="ace-settings-rtl" />
							<label class="lbl" for="ace-settings-rtl">切换到左边</label>
						</div>

						<div>
							<input type="checkbox" class="ace ace-checkbox-2" id="ace-settings-add-container" />
							<label class="lbl" for="ace-settings-add-container">
								切换窄屏
								<b></b>
							</label>
						</div>
					</div>
				</div><!-- /#ace-settings-container -->
			</div><!-- /.main-container-inner -->

			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse">
				<i class="icon-double-angle-up icon-only bigger-110"></i>
			</a>
		</div><!-- /.main-container -->



		<!-- basic scripts -->



		<script src="/Public/admin/assets/js/jquery-2.0.3.min.js"></script>
		<script src="/Public/admin/assets/js/jquery-1.10.2.min.js"></script>
		<script type="text/javascript">
			window.jQuery || document.write("<script src='assets/js/jquery-2.0.3.min.js'>"+"<"+"script>");
		</script>
		<script type="text/javascript">
			 window.jQuery || document.write("<script src='assets/js/jquery-1.10.2.min.js'>"+"<"+"script>");
		</script>
		<script type="text/javascript">
			if("ontouchend" in document) document.write("<script src='assets/js/jquery.mobile.custom.min.js'>"+"<"+"script>");
		</script>
		<script src="/Public/admin/assets/js/bootstrap.min.js"></script>
		<script src="/Public/admin/assets/js/typeahead-bs2.min.js"></script>

		<!-- page specific plugin scripts -->
		<script src="/Public/admin/assets/js/excanvas.min.js"></script>
		<script src="/Public/admin/assets/js/jquery-ui-1.10.3.custom.min.js"></script>
		<script src="/Public/admin/assets/js/jquery.ui.touch-punch.min.js"></script>
		<script src="/Public/admin/assets/js/jquery.slimscroll.min.js"></script>
		<script src="/Public/admin/assets/js/jquery.easy-pie-chart.min.js"></script>
		<script src="/Public/admin/assets/js/jquery.sparkline.min.js"></script>
		<script src="/Public/admin/assets/js/flot/jquery.flot.min.js"></script>
		<script src="/Public/admin/assets/js/flot/jquery.flot.pie.min.js"></script>
		<script src="/Public/admin/assets/js/flot/jquery.flot.resize.min.js"></script>

		<!-- ace scripts -->

		<script src="/Public/admin/assets/js/ace-elements.min.js"></script>
		<script src="/Public/admin/assets/js/ace.min.js"></script>

		<!-- inline scripts related to this page -->
	</body>
</html>
/**
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-����Ϣ����
 * @Author	: linhao87@gmail.com
 * @Depend	: wind.js��jquery.js(1.7 or later), global.js, ajaxForm, draggable
 * $Id$
 */

;
(function(){
	var lock = false;
	
	//�����˽��
	$(document).on('click', 'a.J_send_msg_pop', function(e){
		e.preventDefault();
		var send_msg_pop = $('#J_send_msg_pop'),
				url = $(this).attr('href'),
				name = $(this).data('name');
				
		if(send_msg_pop.length) {
			//�����Ѵ���

			//��չ�ע ��˿ѡ��
			$('#J_users_pop').hide().find('input:checked').prop('checked', false);
			
			//��λ global
			Wind.Util.popPos(send_msg_pop);
			send_msg_pop.focus();
			
			//д�������û�
			if(name) {
				send_msg_pop.find('ul.J_user_tag_ul').html('<li><a href="javascript:;"><span class="J_tag_name">'+ name +'</span><del title="'+ name +'" class="J_user_tag_del">��</del><input type="hidden" value="'+ name +'" name="usernames[]"></a></li>');
			}else{
				send_msg_pop.find('ul.J_user_tag_ul').html('');
			}
			
			//����ʼ��
			$('#J_send_msg_form').resetForm();	
		}else{
			//����δ����
			if(lock) {
				return false;
			}
			lock = true;

			//global.js
			Wind.Util.ajaxMaskShow();

			$.post(url, {
				username : name
			}, function(data){
				lock = false;
				//global.js
				if(Wind.Util.ajaxTempError(data)) {
					return false;
				}
				
				Wind.use('ajaxForm', function(){
					//global.js
					Wind.Util.ajaxMaskRemove();

					$('body').append(data);
					var send_msg_pop = $('#J_send_msg_pop'),
							msg_pop_textarea = $('#J_msg_pop_textarea'),
							msg_pop_btn = send_msg_pop.find('button:submit');
				
					//�û�����ǩ������֤�����Ƿ��Ѵ���
					if($.isFunction(window.userTag)) {
						userTag();
					}else{
						Wind.js(GV.JS_ROOT+ 'pages/common/userTag.js?v='+ GV.JS_VERSION);
					}

					Wind.use('draggable', function(){
						send_msg_pop.draggable( { handle : '.J_drag_handle'} );
					});

					//��λ global
					Wind.Util.popPos(send_msg_pop);
					Wind.Util.buttonStatus(msg_pop_textarea, msg_pop_btn);
					Wind.Util.ctrlEnterSub(msg_pop_textarea, msg_pop_btn);
					
					send_msg_pop.focus();
					operation();

					//�������
					var insert_emotions = $('a.J_insert_emotions');
					if(insert_emotions.length) {
						Wind.js(GV.JS_ROOT+ 'pages/common/insertEmotions.js?v='+ GV.JS_VERSION, function(){
							insert_emotions.on('click', function(e){
								e.preventDefault();
								insertEmotions($(this), msg_pop_textarea, send_msg_pop);
							});
						});
					}

					//��֤��
					var verify_code = $('#J_verify_code');
					if(verify_code.length) {
						Wind.Util.getVerifyTemp({wrap : verify_code});
					}

				});
			}, 'html');
		}

	});
	
	//�����ڲ���
	function operation(){
		var send_msg_pop = $('#J_send_msg_pop'),								//����
				msg_pop_btn = send_msg_pop.find('button:submit'),		//�ύ��ť
				get_follows = $('#J_get_follows'),									//������ť
				users_url = get_follows.attr('href'),								//��ַ
				users_pop = $('#J_users_pop'),											//�����û�����
				users_wrap = $('#J_users_wrap');										//�û��б�
		
		//�ر�
		$('#J_send_msg_close').on('click', function(e){
			e.preventDefault();
			send_msg_pop.hide().find('.J_tips_btn').remove();
			$('#J_emotions_pop').hide();
		});
		
		//����
		var follows_load = false,
			fans_load = false;
		
		//��ȡ��ע
		get_follows.on('click', function(e){
			e.preventDefault();
			var $this = $(this);
			users_pop.toggle();
			
			if(!follows_load) {
				$.post(users_url, {
					'type' : 'follows'
				}, function(data){
					users_wrap.html('<div class="follow_list" id="J_list_follows">�ҵĹ�עΪ��</div><div class="follow_list" id="J_list_fans" style="display:none;"><div class="pop_loading"></div></div>');
					var list_follows = $('#J_list_follows');

					if(data.state == 'success') {
						var li_arr = [];
						$.each(data['data'], function(i, o){
							li_arr.push('<li title="'+ o.username +'"><label><input type="checkbox" value="'+ o.username +'">'+ o.username +'</label></li>');
						});
						
						list_follows.html('<ul class="">'+ li_arr.join('') +'</ul>');

					}else if(data.state == 'fail'){
						list_follows.html('<div class="not_content_mini"><i></i>�ҵĹ�עΪ��</div>');
					}

					follows_load = true;		//��ע�ѻ�ȡ
				}, 'json');
			}
		});
		
		//�л���ע ��˿
		$('#J_users_select').on('change', function(){
			var $this = $(this),
				v = $this.val();
			$('#J_list_'+ v).show().siblings().hide();
			if(v == 'fans') {
				if(!fans_load){
					//��˿δ��ȡ������
					$.post(users_url, {
						'type':'fans'
					}, function(data){
						var li_arr = [], list_fans = $('#J_list_fans');
						if(data.state == 'success') {
							$.each(data['data'], function(i, o){
								li_arr.push('<li title="'+ o.username +'"><label><input type="checkbox" value="'+ o.username +'">'+ o.username +'</label></li>');
							});
							
							if(li_arr.length) {
								list_fans.html('<ul>'+ li_arr.join('') +'</ul>');
							}else{
								list_fans.html('<div class="not_content_mini"><i></i>�ҵķ�˿Ϊ��</div>');
							}
							
							fans_load = true;		//��˿�ѻ�ȡ
						}else if(data.state == 'fail'){
							list_fans.html('<div class="not_content_mini"><i></i>�ҵķ�˿Ϊ��</div>');
						}
					}, 'json');
				}
				
			}
		});
		
		//ѡ���˿��ע
		var user_tag_ul = $('ul.J_user_tag_ul');
		users_wrap.on('change', 'input:checkbox', function(){
			var $this = $(this),
				input_has = user_tag_ul.find('input[value="'+ this.value +'"]')
			if($this.prop('checked')) {
				if(!input_has.length) {
					user_tag_ul.append('<li><a href="javascript:;"><span class="J_tag_name">'+ this.value +'</span><del class="J_user_tag_del" title="'+ this.value +'">��</del><input type="hidden" name="usernames[]" value="'+ this.value +'"></a></li>');
				}
			}else{
				input_has.parents('li').remove();
			}
		});
		
		//ɾ���û���ǩ
		user_tag_ul.on('click', 'del.J_user_tag_del', function(e){
			e.preventDefault();
			users_wrap.find('input[value="'+ $(this).attr('title') +'"]').prop('checked', false);
		});
		
		//�رշ�˿��ע�б�
		users_pop.on('click', '.J_close_users', function(e){
			e.preventDefault();
			users_pop.hide();
		});
		
		
		//�ύ
		$('#J_send_msg_form').ajaxForm({
			dataType : 'json',
			beforeSubmit : function(){
				//global.js
				Wind.Util.ajaxBtnDisable(msg_pop_btn);
			},
			success : function(data){
				//global.js
				Wind.Util.ajaxBtnEnable(msg_pop_btn);
				
				if(data.state === 'success') {
					Wind.Util.resultTip({
						follow: msg_pop_btn,
						msg: '���ͳɹ�',
						zindex: 12,
						callback: function(){
							send_msg_pop.hide();
						}
					});
				}else if(data.state === 'fail'){
					Wind.Util.formBtnTips({
						error : true,
						wrap : $('#J_send_msg_btn').parent(),
						msg : data.message
					});
				}
			}
		})
	};

})();
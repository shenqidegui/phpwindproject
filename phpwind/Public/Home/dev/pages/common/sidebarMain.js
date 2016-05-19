/**
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-����
 * @Author	: linhao87@gmail.com
 * @Depend	: core.js��jquery.js(1.7 or later)
 * $Id$
 */

//��
;(function(){
	var punch_main_tip = $('#J_punch_main_tip'),		//�ҵĴ���ʾ
		punch_wrap = $("#J_punch_widget"),//��Ԫ��
		punch_btn = punch_wrap.find('#J_punch_mine'),//�򿨰�ť
		mouseleave = false,
		p_lock = false;

	punch_btn.on('click', function(e){
		//��
		e.preventDefault();
		var $this = $(this);

		if(punch_wrap.hasClass('punch_widget_disabled')) {
			return false;
		}else{
			punch_wrap.addClass('punch_widget_disabled');
			$.post($this.data('uri'), function(data){
				var d = data.data;
				if(data.state == 'success') {
					$this.text('����'+ d.behaviornum +'���');
					Wind.Util.resultTip({
						msg : '��ϲ���' +d.reward,
						follow : $this
					});
				}else if(data.state == 'fail'){
					punch_wrap.removeClass('punch_widget_disabled');
					Wind.Util.resultTip({
						error : true,
						msg : data.message
					});
				}
			}, 'json').fail(function(){
				punch_wrap.removeClass('punch_widget_disabled');
			});
		}
	}).on('mouseenter', function(){
		var $this = $(this);
		mouseleave = false;
		if(punch_wrap.hasClass('punch_widget_disabled') || $this.data('role') == 'space') {
			return false;
		}else{
			if(punch_main_tip.children().length) {
				punch_main_tip.removeClass('dn');
			}else{
				$.post($this.data('tips'), function(data){
					if(data.state == 'success') {
						var punch_data = data.data;
						punch_main_tip.html('<div class="tips"><div class="core_arrow_top"><em></em><span></span></div>�������ȡ'+ punch_data.todaycNum + punch_data.cUnit + 	
punch_data.cType +'<br />�������ȡ'+ punch_data.tomorrowcNum + punch_data.cUnit + punch_data.cType +'<br />������ÿ������'+ punch_data.step +'������'+ punch_data.max)
						if(!mouseleave){
								punch_main_tip.removeClass('dn');
						}
					}
				}, 'json');
			}
			
		}
	}).on('mouseleave', function(){
		mouseleave = true;
		punch_main_tip.addClass('dn');
	});

	//��ta��
	var p_lock = false;
	$('#J_punch_friend').on('click', function(e){
		e.preventDefault();
		var $this = $(this),
			punch_friend_pop = $('#J_punch_friend_pop');
		if(punch_friend_pop.length){
			//״̬����
			$('#J_friend_selected').empty();
			punch_friend_pop.find('dd.J_friend_item').removeClass('in');

			//��λ global.js
			Wind.Util.popPos(punch_friend_pop);

			//������ʾ
			punch_friend_pop.show();
		}else{
			Wind.Util.ajaxMaskShow();
			if(p_lock) {
				return false;
			}
			p_lock = true;

			$.post($this.data('uri'), function(data){
				Wind.Util.ajaxMaskRemove();
				p_lock = false;
				if(Wind.Util.ajaxTempError(data, $this)) {
					return false;
				}

				$('body').append(data);
				Wind.use('ajaxForm', function(){
					punchFriend();
				});
			}, 'html');
		}
		
	});

	function punchFriend(){
		var punch_friend_pop = $('#J_punch_friend_pop'),
			friend_selected = $('#J_friend_selected'),
			punch_friend_sub = $('#J_punch_friend_sub'),
			max = punch_friend_pop.data('max');							//���ѡ��

		//��λ global.js
		Wind.Util.popPos(punch_friend_pop);

		//��ק
		Wind.use('draggable', function(){
			punch_friend_pop.draggable( { handle : '.J_drag_handle'} );
		});

		//�ر�
		$('a.J_punch_close').on('click', function(e){
			e.preventDefault();
			punch_friend_pop.hide();
		});

		//ȫ�����ѷ�ҳ
		if(friend_selected.length) {
			loopFriends($('#J_punch_dt_all'), 1);
		}
		
		//չ�� ����
		$('dt.J_friend_dt').on('click', function(){
			var $this = $(this),
					parent = $this.parent();
			parent.toggleClass('current').siblings().removeClass('current');

			loopFriends($this, 0)
		});

		punch_friend_pop.on('click', 'dd.J_friend_item', function(){
			//ѡ�����
			var $this = $(this),
				id = $this.data('id'),
				item = $('dd.J_friend_item[data-id='+ id +']');

			if($this.hasClass('disabled')) {
				return false;
			}

			if(!$this.hasClass('in') && friend_selected.children().length < max) {
				friend_selected.append('<li id="J_friend_'+ id +'"><input type="hidden" name="friend[]" value="'+ id +'" /><a href="#">'+ $this.text() +'<span data-id="'+ id +'" class="J_friend_del">��</span></a></li>')
				item.addClass('in');

				punch_friend_sub.prop('disabled', false).removeClass('disabled');
			}else{
				item.removeClass('in');
				$('#J_friend_'+ id).remove();

				if(!friend_selected.children().length) {
					punch_friend_sub.prop('disabled', true).addClass('disabled');
				}
			}
		}).on('click', '.J_friend_del', function(){
			//ɾ��ѡ��
			$(this).parents('li').fadeOut('fast', function(){
				$(this).remove();

				if(!friend_selected.children().length) {
					punch_friend_sub.prop('disabled', true).addClass('disabled');
				}
			});
			$('dd.J_friend_item[data-id='+ $(this).data('id') +']').removeClass('in');
			
		}).on('click', 'a', function(e){
			e.preventDefault();
		});

		//�ύ
		$('#J_punch_friend_form').ajaxForm({
			dataType : 'json',
			success : function(data){
				if(data.state == 'success') {
					var _data = data.data;
					if(_data) {
						punch_friend_pop.remove();
						var tip = $('<div class="pop_deep J_tips_new"><div class="core_pop"><div class="hd" style="cursor: move;"><a class="close J_pop_mimi_close" href="">�ر�</a><strong>�򿨽���</strong></div>\
	<div class="ct"><dl class="cc">\
		<dt class="reward"></dt><dd class="reward_cont">\
		<p class="b">��ϲ������'+ _data.usernames +'�򿨳ɹ���</p>\
		<p>������<strong id="J_task_reward" class="org">'+ _data.reward +'</strong></p></dd>\
	</dl></div>\
	</div></div>');
						tip.appendTo('body').delay(3000).fadeOut('fast', function(){
							$(this).remove();
						});

						//global.js
						Wind.Util.popPos($('div.J_tips_new'));

						//�ر���ʾ
						$('a.J_pop_mimi_close').on('click', function(e){
							e.preventDefault();
							$(this).parents('.J_tips_new').remove();
						});
					}

				}else{
					//global.js
					Wind.Util.resultTip({
						error : true,
						msg : data.message
					});
				}
			}
		});
		
	}

	function loopFriends(dt, page){
		if(dt.data('load')) {
			//������
			return;
		}
		page++;
		Wind.Util.ajaxMaskShow();
		$.post(dt.data('url'), {page : page}, function(data){
			Wind.Util.ajaxMaskRemove();
			if(data.state == 'success') {
				if(data['data']) {
					//���з�ҳ����
					var arr = [];
					$.each(data['data'], function(i, o){
						var cls = '';

						if($('#J_friend_'+i).length) {
							cls = 'in';
						}else if(o['disable'] == 'disabled'){
							cls = 'disabled';
						}
						
						arr.push('<dd data-id="'+ i +'" data-name="friend" class="J_friend_item '+ cls +'">'+ o.username +'</dd>')
					});
					
					dt.parent().append(arr.join(''));


					//+1
					loopFriends(dt, page);
				}else{
					//��ӱ�ʶ
					dt.data('load', true);
				}
			}else{
				Wind.Util.resultTip({
					error : true,
					elem : dt,
					follow : true,
					msg : data.message
				});
			}
		}, 'json');
	}
	
})();


//������ʶ����
(function(){
	//����ܸ���Ȥ����
	var friend_maybe = $('#J_friend_maybe'),
		friend_maybe_list = $('#J_friend_maybe_list'),			//�б�
		friend_url = friend_maybe_list.data('url'),			//�б���µ�ַ
		maybe_others = $('#J_friend_maybe_others').text();		//ʣ������ textarea


		//�鿴��ͬ����
		friend_maybe_list.on('click', 'a.J_friend_view', function(e){
			e.preventDefault();
			var $this = $(this),
				uid = $(this).data('uid'),
				related = $('#J_friend_related_' + uid),		//�����Ĺ�ͬ������
				items = $this.parents('.J_friend_maybe_items');
				
			if(!related.length) {
				//��û��dom
				items.append('<div id="J_friend_related_'+ uid +'" class="related J_friend_related" style="display:none;" data-load="false"><span class="tips_loading">������...</span><div>');
				related = $('#J_friend_related_' + uid);
			}

			if(!related.is(':visible')) {
				//չʾ��ͬ������
				var all_views = $('div.J_friend_related:visible').prev().find('a.J_friend_view');
				all_views.text(all_views.text().replace('��','��'));
				$('div.J_friend_related:visible').slideUp();

				related.slideDown();
				$this.text($this.text().replace('��', '��'));

				//δ��������
				if(!related.data('load')) {
					related.data('load', true)
					$.post(this.href, function(data){
						if(Wind.Util.ajaxTempError(data)) {
							related.data('load', false);
							return false;
						}

						related.data('load', true).html(data);
						related.slideDown();
						$this.text($this.text().replace('��', '��'));
					}, 'html');
				}
			}else{
				related.slideUp();
				$this.text($this.text().replace('��', '��'));
			}
			
		});

		//�ӹ�ע
		var lock = false;
		friend_maybe_list.on('click', 'a.J_friend_maybe_follow', function(e){
			e.preventDefault();
			var $this = $(this);

			if(lock) {
				return false;
			}
			lock = true;
			
			Wind.Util.ajaxMaskShow();
			$.post(this.href, {
				uid: $this.data('uid')
			}, function(data){
				Wind.Util.ajaxMaskRemove();
				if(data.state == 'success') {
					if($('.J_friend_maybe_items').length <= 1) {
						//��ע�����һ��
						friend_maybe.fadeOut();
						return;
					}

					//�����б�
					$this.parents('.J_friend_maybe_items').html('<div class="pop_loading"></div>');

					$.post(friend_url, function(data){
						if(Wind.Util.ajaxTempError(data)) {
							return false;
						}



						friend_maybe_list.html(data);

						Wind.Util.avatarError(friend_maybe_list.find('img.J_avatar'));
					}, 'html');
				}else if(data.state == 'fail') {
					Wind.Util.resultTip({
						error : true,
						elem : $this,
						follow : true,
						msg : data.message
					});
				}

				lock = false;
			}, 'json');
		});

})();
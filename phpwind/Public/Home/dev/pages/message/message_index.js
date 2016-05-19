/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-˽��&��Ϣ
 * @Author	: linhao87@gmail.com
 * @Depend	: jquery.js(1.7 or later),
 * $Id: message_index.js 28797 2013-05-24 05:46:01Z hao.lin $
 */
 
;(function(){
	//ie6 hover
	if($.browser.msie && $.browser.version < 7) {
		$('#J_notice_list > .J_notice_item').hover(function(){
			$(this).addClass('ct_ie6');
		}, function(){
			$(this).removeClass('ct_ie6');
		});
	}

	var checkbox = $('input.J_check_all, input.J_check'),
		check_op = $('.J_check_op');			//����������

	var op_bar = $('.J_op_bar'),				//�������������
		op_manage = $('.J_op_manage'),			//������������
		checks = $('.J_notice_item input.J_check');		//

	//��ʾ��������
	$('a.J_msg_manage_show').on('click', function(e) {
		e.preventDefault();
		op_bar.show();
		checks.show();

		op_manage.hide();
	});

	//ȡ����������
	$('a.J_msg_manage_hide').on('click', function(e){
		e.preventDefault();
		op_bar.hide();
		checks.hide();
		check_op.css('visibility', 'hidden');
		checkbox.prop('checked', false);

		op_manage.show();
	});


	//ѡ�����ʾ����
	
	
	checkbox.removeAttr('checked');
	$('input.J_check_all, input.J_check').on('change', function(){
		//��ʱ
		setTimeout(function(){
			var checkboxes = $('input.J_check:checked');
			if(checkboxes.length) {
				check_op.css('visibility', 'visible');
				var unreads = [];
				checkboxes.each(function(){
					var unread = $(this).closest('.J_notice_item').find('.J_unread');
					if(unread.length){
						unreads.push(unread);
					}
				})
				if(unreads.length){
					check_op.find('a:eq(1)').show();
				}else{
					check_op.find('a:eq(1)').hide();
				}
			}else{
				check_op.css('visibility', 'hidden');
			}
		}, 0);
		
	});

	//ɾ��
	$('a.J_msg_del').on('click',function(e) {
		e.preventDefault();
		var $this = $(this);
		Wind.Util.ajaxConfirm({
			elem : $this,
			href : $this.prop('href'),
			msg : $this.data('msg') ? $this.data('msg') : 'ȷ��ɾ��ѡ�е�֪ͨ��',
			callback : function(){
				var item = $this.parents('.J_notice_item');
				if($this.data('type') == 'msg') {
					//˽��ҳ
					unReadCount(item.find('a.J_unread'), $('#J_unread_count'));
				}

				item.fadeOut(function(){
					//�����
					if(!item.siblings('.J_notice_item').length) {
						location.reload();
					}

					$(this).remove();
				});


			}
		});
	});

	//������
	$('a.J_addblack').on('click',function(e) {
		e.preventDefault();
		var $this = $(this),
			type = $this.data('type'),
			type_text = (type == 'msg' ? '֪ͨ' : '˽��');

		$.post(this.href, function(data){
			if (data.state === 'success') {
				Wind.Util.resultTip({
					elem : $this,
					follow : true,
					msg : '�Ѱ� '+ $this.data('user') +' ��������������������յ�Ta��' + type_text
				});

				//������ת
				$this.replaceWith('<a href="'+ $this.data('referer') +'">�鿴������</a>');
			}else if(data.state === 'fail') {
				Wind.Util.resultTip({
					error : true,
					elem : $this,
					follow : true,
					msg : data.message
				});
			}
		}, 'json');

	});


	//����ͳ��
	function unReadCount(items, count){
		var read_c = parseInt(count.text());		//ԭδ������

		var c = 0;
		for(i=0, len=items.length; i<len; i++) {
			c = c + $(items[i]).data('count');
		};

		var result = read_c - c;
		if(result == 0) {
			count.remove();
		}else{
			count.text(result);
		}
						
		items.remove();

		Wind.Util.resultTip({
			msg : '�����ɹ�'
		});
	}

	//˽������
	var search_btn = $('#J_msg_search_btn');

	Wind.Util.buttonStatus($('#J_msg_search_input'), search_btn);

	Wind.use('ajaxForm', function(){
		$('#J_msg_search_form').ajaxForm({
			dataType : 'json',
			success : function(data){
				if(data.state == 'success') {
					location.href = decodeURIComponent(data.referer);
				}else if(data.state == 'fail') {
					Wind.Util.formBtnTips({
						error : true,
						wrap : search_btn.parents('.content_nav'),
						msg : data.message
					});
				}
			}
		});
	})

})();
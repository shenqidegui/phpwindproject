/**
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-��ݵ�¼
 * @Author	: linhao87@gmail.com
 * @Depend	: core.js��jquery.js(1.7 or later), global.js, dialog, jquery.Form, jquery.draggable
 * $Id$
 */

;
(function () {
	var qlogin_pop = $('#J_qlogin_pop'),
		qlogin_tip = $('#J_qlogin_tip'),					//��ݵ�¼��ʾ
		qlogin_username = $('#J_qlogin_username'),
		qlogin_qa = $('#J_qlogin_qa'),							//��֤��������
		$qa_html = $('<dl id="J_qa_wrap" class="cc">\
						<dt>��ȫ����</dt>\
						<dd><select id="J_login_question" name="question" class="select_4"></select></dd>\
					</dl>\
					<dl class="cc">\
						<dt>���Ĵ�</dt>\
						<dd><input name="answer" type="text" class="input length_4" value=""></dd>\
	</dl>');
	
	var user_checked = false;									//�û�����֤�Ƿ�ͨ��
	qlogin_username.on('blur', function(){
		//ʧ����֤�û���
		var $this = $(this);
		user_checked = false;
		if($.trim($this.val())){
			$.post($(this).data('check'), {username : $(this).val()}, function(data){
				if(data.state == 'success') {
					qlogin_tip.hide();
					user_checked = true;
					if(data.message.safeCheck){

						//д����֤����
						var q_arr = [];
						$.each(data.message.safeCheck, function(i, o){
							q_arr.push('<option value="'+ i +'">'+ o +'</option>');
						});

						$qa_html.find('#J_login_question').html(q_arr.join(''));
						qlogin_qa.html($qa_html).show();

						//_statu = data.message._statu;
					}else{
						qlogin_qa.html('');
					}
				}else if(data.state == 'fail'){
					qlogin_tip.html('<span class="tips_icon_error">'+ data.message +'</span>').slideDown();
					user_checked = false;
				}
			}, 'json');
		}
	});

	/* ��ֹie6���� */
	setTimeout(function(){
		qlogin_username.focus();
	}, 0);

	//�Զ�������
	qlogin_qa.on('change', '#J_login_question', function(){
		if($(this).val() == '-4') {
			$('#J_qa_wrap').after('<dl id="J_myquestion_wrap" class="cc"><dt><label>�Զ�������</label></dt><dd><input id="J_login_myquestion" type="text" name="myquestion" value="" class="input length_4"></dd><dd class="dd_r" id="J_u_login_tip_myquestion"></dd></dl>');
		}else{
			$('#J_myquestion_wrap').remove();
		}
	});
	
	//�����¼
	var qlogin_btn = $('#J_qlogin_login'),
		qlogin_form = $('#J_qlogin_form'),
		referer = qlogin_form.data('referer');
	qlogin_form.on('submit', function(e){
		e.preventDefault();
		if(user_checked) {
			//�û�����֤ͨ��
			qlogin_form.ajaxSubmit({
				dataType : 'json',
				data : {
					backurl : referer ? referer : window.location.href		//��ת��ַ
				},
				beforeSubmit : function(){
					Wind.Util.ajaxBtnDisable(qlogin_btn);
				},
				success : function(data, statusText, xhr, $form){
					if(data.state === 'success') {
						if(data.message.check) {
							//������֤����
							$.post(data.message.check.url, function (data) {
								if(Wind.Util.ajaxTempError(data)) {
									return false;
								}
								
								//���ص�¼����
								qlogin_pop.hide();
								
								Wind.use('dialog', function (){
									Wind.Util.ajaxBtnEnable(qlogin_btn);
									Wind.dialog.html(data, {
										id: 'J_login_question_wrap',
										isDrag: true,
										isMask: false,
										callback: function(){
											$('#J_login_question_wrap input:text:visible:first').focus();
										}
									});
								});

							}, 'html');
						}else{
							window.location.href = decodeURIComponent(data.referer);
						}
					}else{
						Wind.Util.ajaxBtnEnable(qlogin_btn);
						if(data.message.qaE) {
							//�ش�ȫ����
							return;
						}
						qlogin_tip.html('<span class="tips_icon_error"><span>' + data.message).slideDown();;
					}
				}
			});
		}else{
			qlogin_username.focus();
		}
	});
	
	//�ر�
	$('#J_qlogin_close').on('click', function(e){
		e.preventDefault();
		qlogin_pop.hide();
	});

	Wind.use('ajaxForm');
})();
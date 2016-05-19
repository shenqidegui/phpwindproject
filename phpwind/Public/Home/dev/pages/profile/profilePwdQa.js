/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-����-�޸�����
 * @Author	: linhao87@gmail.com
 * @Depend	: jquery.js(1.7 or later), global.js
 * $Id$
 */
 
;(function(){
	var new_pwd = $('#J_newPwd'),
			old_pwd = $("#J_old_pwd"),
			tip_new_pwd = $('#J_tip_newPwd'),
			pw_edit = $("#J_pw_edit"),
			btn = pw_edit.find('button:submit');
		
	//�۽�ʱĬ����ʾ
	var focus_tips = {
		passwd: '������ԭ����',
		oldPwd : '������ԭ����',
		newPwd : new_pwd.data('tips'),
		rePwd : '��������һ����������д������',
		email : '',
		myquestion : '',
		answer : '�������'
	};
	
	//����ǿ��
	var passwordRank = {
		1 : '<span class="pwd_strength_1"></span>��',
		2 : '<span class="pwd_strength_2"></span>��',
		3 : '<span class="pwd_strength_3"></span>��',
		4 : '<span class="pwd_strength_4"></span>ǿ'
	};
	
	pw_edit.resetForm();
	pw_edit.validate({
		//debug : true,
		errorPlacement: function(error, element) {
			//������ʾ����
			$('#J_tip_'+ element[0].name).html(error);
		},
		errorElement: 'span',
		errorClass : 'tips_icon_error',
		validClass		: 'tips_icon_success',
		onkeyup : false,
		focusInvalid : false,
		rules: {
			passwd: {
				required	: true/*,
				remote : {
					url : old_pwd.data('checkurl'),
					type : 'post',
					dataType: "json",
					data : {
						pwd :  function(){
							return old_pwd.val();
						}
					},
					complete: function(jqXHR){
						if(jqXHR.status == '200') {
							var data = $.parseJSON(jqXHR.responseText);
							if(data.state == 'fail' && data.referer) {
								//���Թ���
								setTimeout(function(){
									location.href = data.referer;
								}, 1000);
							}
						}
					}
				}*/
			},
			oldPwd: {
				required	: true,
				remote : {
					url : old_pwd.data('checkurl'),
					type : 'post',
					dataType: "json",
					data : {
						pwd :  function(){
							return old_pwd.val();
						}
					},
					complete: function(jqXHR){
						if(jqXHR.status == '200') {
							var data = $.parseJSON(jqXHR.responseText);
							if(data.state == 'fail' && data.referer) {
								//���Թ���
								setTimeout(function(){
									location.href = decodeURIComponent(data.referer);
								}, 1000);
							}
						}
					}
				}
			},
			newPwd : {
				required : true,
				remote : {
					url : new_pwd.data('pwdcheck'),		//��֤����
					dataType: "json",
					type : 'post',
					data : {
						pwd : function(){
							return new_pwd.val();
						}
					}
				}
			},
			rePwd : {
				required : true,
				equalTo : '#J_newPwd'
			},
			email : {
				required : true,
				email : true
			},
			myquestion : {
				required : true
			},
			answer : {
				required : true
			}
		},
		highlight	: false,
		unhighlight	: function(element, errorClass, validClass) {
			var tip_elem = $('#J_tip_'+ element.name);

			if(element.value){
				tip_elem.html('<span class="'+ validClass +'" data-text="text"><span>');
			}
		},
		onfocusin	: function(element){
			var name = element.name;
			$('#J_tip_'+ name).html('<span class="reg_tips" data-text="text">'+ focus_tips[name] +'</span>');
			
			if(name == 'newPwd') {
				//���������ǿ����֤
				
				$(element).off('keyup').on('keyup', function(e){
					
					//����tab��
					if(e.keyCode !== 9) {

						$.post($(this).data('pwdstrong'), {
							pwd : new_pwd.val()
						}, function(data){

							if(data.state === 'success') {
								tip_new_pwd.html(passwordRank[data.message['rank']]);
							}else if(data.state === 'fail'){
								tip_new_pwd.html('');
							}
						}, 'json');

					}
					
				});
			}
		},
		onfocusout	:  function(element){
			var _this = this;
			
			if(element.name == 'email') {
				//����ƥ��������ʱ����
				/*setTimeout(function(){
					_this.element(element);
				}, 150);*/
			}else{
			
				if(element.name === 'password'){
					//��ֹ�ظ���
					$(element).off('keyup');
					
					//ʧ����ʶ
					reg_tip_password.data('blur', 'blur');
				}
	
			}
			
		},
		messages: {
			passwd: {
				required	: '��¼���벻��Ϊ��'
			},
			oldPwd : {
				required	: '��¼���벻��Ϊ��',
				remote : 'ԭ�������' //ajax��֤Ĭ����ʾ
			},
			newPwd : {
				required : '�����벻��Ϊ��',
				remote : '���벻��Ҫ��' //ajax��֤Ĭ����ʾ
			},
			rePwd : {
				required : 'ȷ�����벻��Ϊ��',
				equalTo : '������������벻һ�¡�����������'
			},
			email : {
				required : '���䲻��Ϊ��',
				email : '��������ȷ�ĵ��������ַ',
				remote : '�õ��������ѱ�ע�ᣬ�����������' //ajax��֤Ĭ����ʾ
			},
			myquestion : {
				required	: '��ȫ���ⲻ��Ϊ��'
			},
			answer : {
				required	: '�𰸲���Ϊ��'
			}
		},
		submitHandler:function(form) {
			$(form).ajaxSubmit({
				dataType : 'json',
				beforeSubmit: function(){
					Wind.Util.ajaxBtnDisable(btn);
				},
				success : function(data){
					Wind.Util.ajaxBtnEnable(btn);
					if(data.state === 'success') {
						Wind.Util.formBtnTips({
							msg : data.message,
							wrap: btn.parent(),
							callback : function(){
								window.location.href = decodeURIComponent(data.referer);
							}
						});
					}else if(data.state === 'fail'){
						Wind.Util.formBtnTips({
							error : true,
							wrap: btn.parent(),
							msg : data.message
						});
					}
				}
			});
		}
	});
	
	//��ȫ�����л�
	var question_dl = $('#J_question_dl'),
		question_custom = $('#J_question_custom'),		//�Զ�������
		answer_dl = $('#J_answer_dl'),
		answer = $('#J_answer');
		
	$('#J_question_list').on('change', function(){
		var v = $(this).val();
		
		question_dl.hide();
		if(v == '-1' || v == '-2' || v == '-3') {
			//���޸� ȡ��
			answer_dl.hide();
			question_dl.hide();
			question_custom.val('1');
			answer.val('1');
		}else{
			answer_dl.show();
			answer.val('').focus();
		}
		
		if(v == '-4') {
			//�Զ�������
			question_dl.show();
			answer.val('');
			question_custom.val('').focus();
		}
	});
	
})();
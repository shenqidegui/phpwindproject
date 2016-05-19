/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-����-����
 * @Author	: linhao87@gmail.com
 * @Depend	: jquery.js(1.7 or later), ajaxForm, validate
 * $Id$
 */
 
Wind.use('ajaxForm', 'validate', function(){
	//�۽�ʱĬ����ʾ
	var sin_max = undefined;
	if($('#J_bbs_sign').length) {
		if(SING_MAX_LENGTH) {
			sin_max = parseInt(SING_MAX_LENGTH);
		}
	}

	var focus_tips = {
		homepage : '��������Ч��URL��ַ����http://��ͷ',
		profile : '������������250��',
		bbs_sign : ( sin_max ? '������������'+ sin_max +'��' : '' )
	};
	
	$("form.J_profile_form").validate({
		errorPlacement: function(error, element) {
			//������ʾ����
			$('#J_profile_tip_'+ element[0].name).html(error);
		},
		errorElement: 'span',
		focusInvalid : false,
		errorClass : 'tips_icon_error',
		validClass		: 'tips_icon_success',
		onkeyup : false,
		rules: {
			homepage: {
				url	: true
			},
			profile : {
				maxlength : 250
			},
			bbs_sign : {
				maxlength : sin_max
			},
			mobile : {
				number : true
			},
			telphone : {
				telphone : true
			},
			zipcode : {
				zipcode : true
			}
		},
		highlight	: false,
		unhighlight	: function(element, errorClass, validClass) {
			var tip_elem = $('#J_profile_tip_'+ element.name);
			tip_elem.html('');
		},
		onfocusin	: function(element){
			var id = element.name;
			$('#J_profile_tip_'+ id).html(focus_tips[id]);
		},
		onfocusout : function(element){
			$('#J_profile_tip_'+ element.name).html('');
		},
		messages: {
			homepage : {
				url : '��������Ч��URL��ַ'
			},
			profile : {
				maxlength : '���ֻ������250��'
			},
			bbs_sign : {
				maxlength : '���ֻ������'+ sin_max +'��'
			},
			mobile : {
				number : '��ʽ���󣬽�֧������'
			},
			telphone : {
				number : '��ʽ���󣬽�֧������'
			}
		},
		submitHandler:function(form) {
			//�ύ
			var btn = $(form).find('button:submit');
			$(form).ajaxSubmit({
				dataType : 'json',
				beforeSubmit : function(){
					Wind.Util.ajaxBtnDisable(btn);
				},
				success : function(data){
					Wind.Util.ajaxBtnEnable(btn);
					if(data.state === 'success') {
						Wind.Util.formBtnTips({
							wrap : btn.parent(),
							msg : data.message
						});
					}else if(data.state === 'fail'){
						Wind.Util.formBtnTips({
							error : true,
							wrap : btn.parent(),
							msg : data.message
						});
					}
				}
			});
		}
	});
	
	//�����׺ƥ�� jquery.emailAutoMatch
	Wind.use('emailAutoMatch', function(){
		$('#J_profile_email').emailAutoMatch();
	});


	//����ǩ��ubb����
	var ubbdemo_pop = $('#J_ubbdemo_pop');
	$('#J_ubbdemo').on('click', function(e){
		e.preventDefault();
		Wind.Util.popPos(ubbdemo_pop);

		Wind.use('draggable', function(){
			ubbdemo_pop.draggable({ handle : '.J_pop_handle'});
		});
	});
 
	$('#J_ubbdemo_close').on('click', function(e){
		e.preventDefault();
		ubbdemo_pop.hide();
	});

});
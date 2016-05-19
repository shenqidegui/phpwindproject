/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-����-���ֳ�ֵ
 * @Author	: linhao87@gmail.com
 * @Depend	: jquery.js(1.7 or later), global.js, RECHARGEҳ�涨��
 * $Id$
 */
 
;(function(){
	var recharge_select = $('#J_recharge_select'),
			recharge_amount = $('#J_recharge_amount');		//���

	try {
		var data = $.parseJSON(RECHARGE);
	}catch(e){
		$.error(e);
	}

	//ҳ������
	rechargeChange(recharge_select.val(), recharge_select.children(':selected').text());

	//�л���ֵ��
	recharge_select.on('change', function(){
		rechargeChange($(this).val(), $(this).children(':selected').text());
	});

	//������
	recharge_amount.on('keyup', function(){
		if(/^\d+(\.\d{0,2})?$/.test($(this).val())) {
			rechargeCount($(this).val(), data[recharge_select.val()]['rate'], recharge_select.children(':selected').text())
		}else{
			$('#J_recharge_count').html('���������֣�С�������λ');
		}
		
	});

	//֧����ʽ
	$('#J_payment_list a').on('click', function(e){
		e.preventDefault();
		$(this).parent().addClass('current').siblings().removeClass('current');

		//���ر�
		$('#J_payment_type').val($(this).data('val'));
	});

	//�ύ
	$('#J_recharge_form').ajaxForm({
		dataType : 'json',
		success : function(data){
			if(data.state == 'success') {
				//֧����ת
				window.location.href = (data.data.url.replace(/&amp;/g,"&"));//todo
				//window.location.href = data.referer;
			}else if(data.state == 'fail'){
				//global.js
				Wind.Util.resultTip({
					error : true,
					msg : data.message
				});
			}
		}
	});

	//�л���ʾ
	function rechargeChange(v, text){
		//��ֵ����
		$('#J_recharge_rate').text(data[v]['rate'] + text);

		//���ٳ�ֵ
		$('#J_recharge_min').text(data[v]['min']);

		//�ɻ��
		rechargeCount(recharge_amount.val(), data[v]['rate'], text);
	}

	//�ɻ��ͳ��
	//�ɻ��ͳ��
	function rechargeCount(v, rate, text){
		if(v) {
			$('#J_recharge_count').html('<span class="red">'+ (v * rate) +'</span>'+ text);
		}else{
			$('#J_recharge_count').html('');
		}
		
	}
	
})();
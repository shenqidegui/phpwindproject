/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-����-�ҵĻ���
 * @Author	: linhao87@gmail.com
 * @Depend	: jquery.js(1.7 or later), dialog, jquery.form, jquery.draggable, ��profile_layout.htm����
 * $Id$
 */
 
;(function(){
	
	try {
		var EXCHANGE_DATA = EXCHANGE;			//����ת������
				TRANSFER_DATA = TRANSFER;			//����ת������
				CREDITNAME_DATA = CREDITNAME,	//������
				CREDITUNIT_DATA = CREDITUNIT;	//���ֵ�λ
	}catch(e){
		$.error(e);
	}

	var credit_transfer_wrap = $('#J_credit_transfer_wrap'),		//ת�˵���
			credit_change_wrap = $('#J_credit_change_wrap'),				//ת������
			credit_form = $('form.J_credit_form');									//��

	//��ק���
	credit_change_wrap.draggable( { handle : '.J_pop_handle'} );
	credit_transfer_wrap.draggable( { handle : '.J_pop_handle'} );

	//ת��
	var transfer_name = $('#J_transfer_name'),									//������
			transfer_input = credit_transfer_wrap.find('input.J_input_number'),
			transfer_min_tip = $('#J_transfer_min_tip'),
			transfer_count = $('#J_transfer_count');


	//���ת��
	$('a.J_credit_transfer').on('click', function(e){
		e.preventDefault();
		var id = $(this).data('id'),
				min = TRANSFER_DATA[id]['min'],
				rate = TRANSFER_DATA[id]['rate'];

		//������
		credit_form.resetForm();
		
		transfer_name.text(CREDITNAME_DATA[id]);
		$('#J_transfer_id').val(id);

		//������
		$('#J_transfer_rate').text(rate +'%');

		Wind.Util.popPos(credit_transfer_wrap);
		credit_change_wrap.hide();
		credit_transfer_wrap.find('input:text:visible').first().focus();

		//ͳ��
		transferCount(transfer_input.val(), min, rate);

		//������
		transfer_input.on('keyup', function(){
			var selected = exchange_select.children(':selected');
			transferCount($(this).val(), min, rate);
		});

	});

	//ת��ͳ��
	function transferCount(v, min, rate){
		if(v === '') {
			v = 0;
		}else{
			v = parseInt(v);
		}

		if(v < min){
			//С����ͽ��
			transfer_min_tip.show();
			$('#J_transfer_min').text(min);
			transfer_count.text('');
		}else{
			transfer_min_tip.hide();
			
			var rate_v = Math.floor(v * (rate/100));
			transfer_count.text(v+ ' + '+ rate_v +'(������)='+ (v + rate_v) + transfer_name.text());
		}
		
	}

	

	//ת��
	var exchange_select = $('#J_exchange_select'),
			exchange_input = credit_change_wrap.find('input.J_input_number');

	//���ת��
	$('a.J_credit_change').on('click', function(e){
		e.preventDefault();
		
		var id = $(this).data('id');

		$('#J_orgin_credit').text(CREDITNAME_DATA[id]);
		$('#J_exchange_id').val(id);

		//ת��Ϊ����
		var arr = [];
		$.each(EXCHANGE_DATA[id], function(i, o){
			arr.push('<option value="'+ o.credit2 +'" data-rate1="'+ o.value1 +'" data-rate2="'+ o.value2 +'">'+ CREDITNAME_DATA[o.credit2] +'</option>');
		});
		exchange_select.html(arr.join(''));

		//��λ global.js
		Wind.Util.popPos(credit_change_wrap);

		//ת������
		var selected = exchange_select.children(':selected');
		exchangeRate(id, selected.text(), selected.data('rate1'), selected.data('rate2'));
		credit_transfer_wrap.hide();

		//ת������ �л�ת��
		exchange_select.off('change').on('change', function(){
			var selected = exchange_select.children(':selected');
			exchangeRate(id, selected.text(), selected.data('rate1'), selected.data('rate2'));
		});

		//��������
		exchange_input.on('keyup', function(){
			var selected = exchange_select.children(':selected');
			exchangeCount($(this).val(), selected.data('rate1'), selected.data('rate2'));
		});
	});

	//ת����������
	function exchangeRate(id_orign, text, rate1, rate2){
		$('#J_exchange_rate').text(rate1 + CREDITUNIT_DATA[id_orign] + CREDITNAME_DATA[id_orign] +' = '+ rate2 + CREDITUNIT_DATA[exchange_select.val()] + text);
		
		$('#J_exchange_to').text(text);

		exchangeCount(credit_change_wrap.find('input.J_input_number').val(), rate1, rate2);
	}

	//ת���ܼ�
	var exchange_count = $('#J_exchange_count'),
			parity_wrap = $('#J_exchange_parity'),
			exchange_num = $('#J_exchange_num');
	function exchangeCount(v, rate1, rate2, parity){
		exchange_input.focus();
		if(rate1 > 1 && v%rate1 !== 0) {
			exchange_count.text('');
			parity_wrap.show();
			exchange_num.text(rate1);
		}else{
			exchange_count.text((v/rate1) * rate2);
			parity_wrap.hide();
		}
	}

	//�ر�
	$('a.J_close').on('click', function(e){
		e.preventDefault();
		$('#J_credit_transfer_wrap, #J_credit_change_wrap').hide();
	});

	//�ύ
	var btn = credit_form.find('button:submit');
	credit_form.ajaxForm({
		dataType : 'json',
		beforeSubmit : function(){
			Wind.Util.ajaxBtnDisable(btn);
		},
		success : function(data, statusText, xhr, $form){
			Wind.Util.ajaxBtnEnable(btn);
			if(data.state == 'success') {
				Wind.Util.formBtnTips({
					wrap : btn.parent(),
					msg : '�����ɹ�',
					callback : function(){
						window.location.reload();
					}
				});
			}else if(data.state == 'fail') {
				Wind.Util.formBtnTips({
					error : true,
					wrap : btn.parent(),
					msg : data.message
				});
			}
		}
	});
	
})();
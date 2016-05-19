/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-����-��������
 * @Author	: linhao87@gmail.com
 * @Depend	: jquery.js(1.7 or later), ajaxForm
 * $Id$
 */
 
Wind.use('ajaxForm', function(){
	//��������
	var work_op_wrap = $('#J_work_op_wrap'),				//��ӱ༭��
		work_form = $('#J_work_form'),							//��
		work_company = $('#J_work_company'),				//��λ
		edit_id = $('#J_edit_id'),										//�༭id
		work_add = $('#J_work_add'),
		work_none = $('#J_work_none');
	
	
	//��ӹ���
	work_add.on('click', function(e){
		e.preventDefault();
		work_op_wrap.insertAfter($('#J_work_list > li:eq(0)')).show().siblings(':hidden').show();
		work_form.resetForm();
		work_form.attr('action', URL_WORK_ADD);			//�޸��ύ��ַ
		work_company.focus();
		edit_id.val('');
		work_add.hide();
		work_none.hide();
	});
	
	//��ӹ���_��
	$('#J_work_none > a').on('click', function(e){
		e.preventDefault();
		work_none.hide();
		work_add.trigger('click');
	});
	
	//�����༭
	$('a.J_work_edit').on('click', function(e){
		e.preventDefault();
		var $this = $(this),
			parent = $this.parents('li');
		
		parent.hide();
		parent.siblings(':hidden').show();
		work_add.show();
		work_op_wrap.insertAfter(parent).show();
		work_form.attr('action', URL_WORK_EDIT);		//�޸��ύ��ַ
		work_company.val($this.data('company'));		//д�빫˾��
		edit_id.val($this.data('id'));								//�༭id
		
		//д������
		$('#J_starty').val($this.data('starty'));
		$('#J_startm').val($this.data('startm'));
		$('#J_endy').val($this.data('endy'));
		$('#J_endm').val($this.data('endm'));
		
		work_company.focus();
	});
	
	//�����ύ
	work_form.ajaxForm({
		dataType : 'json',
		success : function(data){
			if(data.state === 'success') {
				work_op_wrap.hide();
				window.location.reload();
			}else if(data.state === 'fail'){
				Wind.Util.resultTip({
					error : true,
					msg : data.message
				});
			}
		}
	});
	
	//ɾ������ global.js
	$('a.J_work_del').on('click', function(e){
		e.preventDefault();
		Wind.Util.ajaxConfirm({
			href : $(this).attr('href'),
			elem : $(this)
		});
	});
	
	//ȡ��
	$('#J_work_cancl').on('click', function(e){
		e.preventDefault();
		work_op_wrap.siblings(':hidden').show();
		work_op_wrap.hide();
		work_add.show();
		work_none.show();
	});
});
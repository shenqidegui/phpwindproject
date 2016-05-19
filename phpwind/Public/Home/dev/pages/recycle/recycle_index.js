/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-ǰ̨����
 * @Author	: linhao87@gmail.com
 * @Depend	: jquery.js(1.7 or later), ��ҳ�涨��
 * $Id$
 */
 
;(function(){
	//��ѡ������
	$('input.J_check_all, input.J_check').removeAttr('checked');

	//�ύ&�Ƿ�ѡ����
	$('button.J_form_sub_check').on('click', function(e){
		e.preventDefault();
		var $this = $(this),
			form = $this.parents('form.J_form_ajax'),
			checked = form.find('input.J_check:checked');		//ѡ�е���

		if(!checked.length) {
			//ѡ��Ϊ��
			Wind.Util.resultTip({
				error : true,
				follow : $this,
				msg : '��ѡ��Ҫ��������'
			});
		}else{
			//�ύ
			var action = $this.data('action');
			form.ajaxSubmit({
				url : action ? action : form.attr('action'),			//��ť�Ƿ��Զ����ύ��ַ
				dataType : 'json',
				success : function(data){
					if(data.state == 'success') {
						Wind.Util.resultTip({
							msg : '�����ɹ�',
							follow : $this,
							callback : function(){
								window.location.reload();
							}
						});
					}else if(data.state == 'fail') {
						Wind.Util.resultTip({
							error : true,
							follow : $this,
							msg : data.message
						});
					}
				}
			});
		
		}
	});
	
	//�ٱ�ɸѡ
	$('#J_report_select').on('change', function(){
		$(this).parent().submit();
	});
	
})();
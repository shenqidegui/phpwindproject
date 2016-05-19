/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-ѫ��
 * @Author	: linhao87@gmail.com
 * @Depend	: jquery.js(1.7 or later), MEDAL_JSON��ҳ�涨��
 * $Id: medal.js 21606 2012-12-11 11:33:10Z hao.lin $
 */
 
$(function(){
	//����ģ��
	var template = '<div role="alertdialog" aria-labelledby="alert_title" class="pop_deep J_medel_pop" id="J_medel_pop__ID" tabindex="0" style="display:none;">\
	<div style="min-width:200px" class="core_pop">\
		<div class="hd J_drag_handle" style="cursor: move;">\
			<a class="close J_close" href="#">�ر�</a>\
			<strong>ѫ��˵��</strong>\
		</div>\
		<div class="ct J_content"><div class="pop_loading"></div></div>\
	</div>\
</div>';
		
	//�鿴&��ȡѫ��
	$('#J_medal_card_wrap').on('click', 'a.J_medal_card', function(e){
		e.preventDefault();
		var $this = $(this),
			role = $this.data('role'),
			id = $this.data('id'),
			//data = medel_data[id],
			pop_item = $('#J_medel_pop_'+id);
			//logid = (data.logid !== '' ? data.logid : '');		//ѫ������ ��ȡ�ύ����
		$('.J_medel_pop').hide();
		
		if(pop_item.length) {
			//�����Ѵ���
			//global.js
			Wind.Util.popPos(pop_item);
		}else{
			//��������
			$('body').append(template.replace('_ID', id));
			var pop_item = $('#J_medel_pop_'+id);

			//global.js
			Wind.Util.popPos(pop_item);
			Wind.use('draggable', function(){
				pop_item.draggable({handle : '.J_drag_handle'});
			});

			$.post(this.href, function(data){
				if(Wind.Util.ajaxTempError(data)) {
					pop_item.remove();
					return false;
				}

				pop_item.find('.J_content').html(data);
				Wind.Util.popPos(pop_item);
				var ta = pop_item.find('textarea:visible');
				if(ta.length) {
					Wind.Util.buttonStatus(ta, pop_item.find('button:submit'));
				}

				//�󶨹ر�
				pop_item.find('.J_close').on('click', function(e){
					e.preventDefault();
					$(this).parents('.J_medel_pop').hide();
				});

				//���ύ
				var medal_pop_form = $('form.J_medal_pop_form');
				medal_pop_form.on('submit', function(e){
					e.preventDefault();
					var btn = $(this).find('button:submit');
					
					$(this).ajaxSubmit({
						url : btn.data('action'),
						/*data : {
							id : $this.data('subid'),														//����
						logid : (logid ? logid : $this.data('logid')),			//��ȡ
						csrf_token : GV.TOKEN
					},*/
						dataType	: 'json',
						beforeSubmit: function(arr, $form, options) {
							Wind.Util.ajaxBtnDisable(btn);
						},
						success		: function(data, statusText, xhr, $form) {
							if(data.state === 'success') {
								Wind.Util.resultTip({
									msg : data.message,
									callback : function(){
										window.location.reload();
									}
								});
							}else if(data.state === 'fail'){
								Wind.Util.ajaxBtnEnable(btn);
								Wind.Util.resultTip({
									error : true,
									msg : data.message
								});
							}
						}
					});
			
				});

			});
			
		}

	});
	
});
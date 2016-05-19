/**
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-�ٱ�
 * @Author	: linhao87@gmail.com
 * @Depend	: core.js��jquery.js(1.7 or later), dialog, jquery.form
 * $Id$
 */

;(function(){
	
	//����ٱ�
	$('#J_posts_list').on('click', 'a.J_report', function(e){
		e.preventDefault();
		var $this = $(this);

		var report_pop = $('#J_report_pop');
		if(report_pop.length) {
			report_pop.find('textarea').focus();
			return false;
		}

		//global.js
		Wind.Util.ajaxMaskShow();

		$.post(this.href, {type_id: $this.data('typeid')}, function(data){
			//global.js
			Wind.Util.ajaxMaskRemove();

			//��֤ģ�巴�� gloabl.js
			if(Wind.Util.ajaxTempError(data)) {
				return false;
			}

			Wind.dialog.closeAll();
			Wind.dialog.html(data, {
				id: 'J_report_pop',
				position: 'fixed',			//�̶���λ
				title: '�ٱ�',
				isMask: false,			//������
				isDrag: true,
				callback: function(){
					var report_form = $('#J_report_form'),
						textarea = report_form.find('textarea');
					//��ť״̬ global.js
					Wind.Util.buttonStatus(textarea, report_form.find('button:submit'));
					textarea.focus();
					
					$('#J_report_typeId').val($this.data('pid'));
					
					//����
					$('#J_pick_list > a').on('click', function(e){
						e.preventDefault();
						$(this).addClass('current').siblings('.current').removeClass('current');
					});
					
					//�ٱ��ύ
					var btn = report_form.find('button:submit');

					Wind.use('ajaxForm', function(){
						report_form.ajaxForm({
							dataType: 'json',
							beforeSubmit: function(){
								Wind.Util.ajaxBtnDisable(btn);
							},
							success: function(data){
								Wind.Util.ajaxBtnEnable(btn);

								Wind.Util.formBtnTips({
									error : (data.state=='success' ? false : true),
									wrap : btn.parent(),
									msg : data.message,
									callback : function(){
										if(data.state=='success')
										Wind.dialog.closeAll();
									}
								});
							}
						});
					});
					
				}
			});
				
		});
	});
})();
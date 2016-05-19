/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-����-Ȩ��
 * @Author	: linhao87@gmail.com
 * @Depend	: jquery.js(1.7 or later), global.js
 * $Id$
 */
 
Wind.use('ajaxForm', function(){
	//�����ʾ
	$.each($('a.J_right_toggle'), function(i, o){
		var $this = $(this),
			list = $('#'+ $this.data('id'));
		//global.js
		Wind.Util.clickToggle({
			elem : $this,
			list : list,
			callback : function(elem, list){
				list.css({
					left : $this.offset().left
				}).siblings('.J_right_menus').hide();
			}
		});
	});
	
	//�л���ǰ�û���
	var change_group = $('#J_change_group'),
		change_group_pop = $('#J_change_group_pop');
	
	change_group.on('click', function(e){
		e.preventDefault();
		
		Wind.Util.popPos(change_group_pop);
	});
	
	//�ر�
	$('#J_change_group_close').on('click', function(e){
		e.preventDefault();
		change_group_pop.hide();
	});
	
	//�ύ
	var change_group_sub = $('#J_change_group_sub');
	$('#J_change_group_form').ajaxForm({
		dataType : 'json',
		beforeSubmit : function(){
			Wind.Util.ajaxBtnDisable(change_group_sub);
		},
		success : function(data){
			Wind.Util.ajaxBtnEnable(change_group_sub);

			if(data.state == 'success') {
				Wind.Util.formBtnTips({
					wrap : change_group_sub.parent(),
					msg : '�л��ɹ�',
					callback : function(){
						window.location.reload();
					}
				});
			}else if(data.state == 'fail') {
				Wind.Util.formBtnTips({
					error : true,
					wrap : change_group_sub.parent(),
					msg : data.message
				});
			}
		}
	});
	
});
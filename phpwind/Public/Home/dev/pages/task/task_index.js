/*!
 * PHPWind PAGE JS
 * ��̨-����ǰ̨
 * Author: linhao87@gmail.com
 */
 
;(function(){

	//��ȡ��ť
	$('a.J_task_get_btn').on('click', function(e){
		e.preventDefault();
		var $this = $(this);
		$.getJSON($this.attr('href'), function(data){

			if(data.state === 'success') {
			
				var dialog = Wind.dialog.html($('#J_task_ta').text(), {
					className	: 'pop_deep',	//����class
					position	: 'fixed',			//�̶���λ
					isMask		: false,			//������
					onShow		: function(){
						$('#J_task_link').attr('href', data.message.url);	//�����ַ
						$('#J_task_name').text(data.message.title);			//����
						$('#J_task_reward').text(data.message.reward);		//����
						
						//�رյ���
						$('#J_task_pop_close').on('click', function(e){
							e.preventDefault();
							$('#J_task_'+ $this.data('id')).fadeOut('fast', function(){
								$(this).remove();
								if(!$('#J_task_list').children().length) {
									location.reload();
								}
							});
							dialog.close();
						});
					}
				});

			}else if(data.state === 'fail') {
				Wind.Util.resultTip({
					error : true,
					msg : data.message
				});
			}
		});
	});
	
})();
/*!
 * PHPWind PAGE JS
 * ��̨-�������
 * Author: linhao87@gmail.com
 */
 
 ;(function(){
	var	task_main = $('#J_task_main');
	
	//�л�ѡ��
	$('#J_task_radio input:radio').on('change', function(e){
		var $this = $(this);
		getTaskForum($this.data('url'), $this.data('key'), $this.data('param'));
	});
	
	//ҳ�������ж�
	var checked = $('#J_task_radio input:radio:checked');
	if(checked.length) {
		getTaskForum(checked.data('url'), checked.data('key'), checked.data('param'));
		
		//��ǰtab
		var tab_item = checked.parents('.J_tab_item');
		$('#'+ tab_item.data('id')).click();
	}
	
	
	//�����Ӧ���
	function getTaskForum(url, key, param){
		var task_forum = $('tbody.J_task_forum');
		
		$('#J_key').val(key);
		
		if(!url) {
			task_forum.remove();
			return false;
		}

		$.post(url, {'var' : param}, function(data){
			if(data) {
				task_forum.remove();
				task_main.before(data);
			}
		}, 'html');
		
	}
	
	//�л�����
	var reward_select = $('#J_reward_select');
	
	//�л��¼�
	reward_select.on('change', function(){
		var $this = $(this),
			op_selected = $this.children(':selected');
			
		getReward(op_selected.data('id'), op_selected.data('url'), op_selected.data('param'));
	});
	
	//ҳ�������¼�
	if(reward_select.val()) {
		var reward_selected = $('#J_reward_select > option:selected');
		getReward(reward_selected.data('id'), reward_selected.data('url'), reward_selected.data('param'));
	}
	
	//��ȡ����htmlƬ��
	function getReward(id, url, param){
		var reward_forum = $('tbody.J_reward_forum');
		
		//��
		if(!url) {
			reward_forum.remove();
			return false;
		}

		$.post(url, {'var' : param}, function(data){
			if(data) {
				reward_forum.remove();
				task_main.after(data);
			}
		}, 'html');
	}
	
	//����checkbox
	var checked_all = $('#J_checked_all');
	$('input:checkbox').on('change', function(){
		if($('input.J_check:checked').length === $('input.J_check').length) {
			checked_all.val('1');
		}else{
			checked_all.val('');
		}
	});
	
 })();
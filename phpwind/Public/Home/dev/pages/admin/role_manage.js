/*!
 * PHPWind PAGE JS
 * ��̨-�����ɫ
 * Author: linhao87@gmail.com
 */

Wind.use('dialog', 'ajaxForm', function () {
	
	//�༭_���õ�ǰȨ��
	if (ROLE_AUTH_CONFIG) {
		$.each(ROLE_AUTH_CONFIG, function (i, o) {
			$('ul.J_ul_check input:checkbox[value = "' + o + '"]').attr('checked', true);
		});
		countCheckbox();
	}
	
	//���н�ɫȨ�޸���
	var checkbox_list = $('ul.J_ul_check input:checkbox');
	
	$('#J_role_select').change(function () {
		var $this = $(this),
		select_item = ROLE_LIST_CONFIG[$this.children('option:selected').text()];
		if (select_item) {
			checkbox_list.removeAttr('checked');
			$.each(select_item, function (i, o) {
				$('ul.J_ul_check input:checkbox[value = "' + o + '"]').attr('checked', true);
			});
			countCheckbox();
		}
	});
	
	//��ѡ��ȫѡͳ��
	function countCheckbox() {
		var th_check, //ȫѡ��
		checkbox_num, //�б�ѡ������
		checked_checkbox_num; //�б�ѡ�еĸ�ѡ������
		
		//�����н�ɫ����Ȩ��
		$.each($('ul.J_ul_check'), function (i, o) {
			var name = $(this).data('name');
			th_check = $('input#J_role_' + name); //��ȡ��Ӧȫѡ��
			checkbox_num = $(this).find('input:checkbox').length; //��ѡ������
			checked_checkbox_num = $(this).find('input:checkbox:checked').length; //ѡ�еĸ�ѡ������
			if (checkbox_num !== checked_checkbox_num) {
				th_check.removeAttr('checked');
			} else {
				th_check.attr('checked', true);
			}
		});
	}
});

/*

 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ��̨-Ȩ�޸��� �ύ
 * @Author	: linhao87@gmail.com
 * @Depend	: core.js��jquery.js(1.7 or later), ajaxForm
 * $Id: forumTree_table.js 15724 2012-08-10 10:20:09Z hao.lin $
 */
;(function () {
	var tr_first = $('#J_client_tbody > tr:first'), //��һ��
		status,
		id;

	clientLoop(tr_first);

	//��ѭ״̬
	function clientLoop(tr){
		if(!tr.length) {
			return;
		}
		status = tr.find('.J_status'),
		id = status.data('id');

		$.ajax({
			url : CLIENT_URL,
			type : 'post',
			data : {
				clientid : id
			},
			dataType : 'json',
			success : function(data){
				if(data.state == 'success') {
					status.text('����');
				}else if(data.state == 'fail'){
					status.html('<span style="color:#ff0000">ʧ��</span>');
				}

				clientLoop(tr.next());
			},
			error : function(){
				
			}
		});
	}
})();
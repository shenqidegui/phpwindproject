/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-ͶƱ��
 * @Author	: linhao87@gmail.com, TID
 * @Depend	: jquery.js(1.7 or later), global.js
 * $Id$
 */


;(function(){
	//ͶƱ�ύ
	Wind.use('ajaxForm', function(){
		$('#J_read_vote_form').ajaxForm({
			dataType : 'json',
			success : function(data){
				if(data.state === 'success') {
					Wind.Util.resultTip({
						msg : data.message,
						callback : function(){
							Wind.Util.reloadPage(window);
						}
					});
				}else if(data.state === 'fail'){
					Wind.Util.resultTip({
						error : true,
						msg : data.message
					});
				}
			}
		});
	});
	


	//�鿴������Ա
	var vote_temp = '<div tabindex="0" class="core_pop_wrap J_vote_u" id="_ID" style="position:absolute;">\
	<div class="core_pop">\
		<div class="pop_vote_member">\
			<div class="pop_top">\
				<a href="" class="pop_close J_vote_u_close">�ر�</a>\
				<strong>������Ա</strong>\
			</div>\
			<div class="pop_cont">\
				<div class="pop_loading J_loading"></div>\
				<ul class="cc J_vote_u_list" style="display:none;"></ul>\
			</div>\
			<div class="pop_bottom">\
				<button type="button" class="btn J_vote_u_close">�ر�</button>\
			</div>\
		</div>\
	</div>\
</div>';
	var vote_lock = false;
	$('a.J_vote_list_show').on('click', function(e){
		e.preventDefault();
		var $this = $(this),
			item = $('#J_vote_u_'+ $this.data('key'));
		if(item.length) {

			//�б��Ѵ�������ʾ
			item.show().focus();

			//��λ
			uListPos($this, item);

		}else{
			//�б�����
			$('body').append(vote_temp.replace('_ID', 'J_vote_u_'+ $this.data('key')));
			var _item = $('#J_vote_u_'+ $this.data('key'));

			//��λ
			uListPos($this, _item);

			_item.focus().on('click', '.J_vote_u_close', function(e){
				//�ر�
				e.preventDefault();
				_item.hide();
			}).on('mouseenter', function(){
				vote_lock = true;
			}).on('mouseleave', function(){
				vote_lock = false;
				_item.focus();
			}).on('blur', function(){
				//ʧ������
				if(!vote_lock) {
					_item.hide();
				}
			});

			//��ȡ����
			$.getJSON($this.attr('href'), function(data){
				if(data.state == 'success') {
					var _data = data.data, u_arr = [];

					if(_data) {
						$.each(_data, function(i, o){
							u_arr.push('<li><a href="'+ GV.U_CENTER + '&uid=' + i +'" target="_blank" title="'+ o +'">'+ o +'</a></li>');
						});
						_item.find('.J_loading').hide().siblings('.J_vote_u_list').show().html(u_arr.join(''));
					}else{
						_item.find('.J_loading').parent().html('<div class="not_content_mini"><i></i>���޲�����Ա</div>');
					}
				}else if(data.state == 'fail'){
					Wind.Util.resultTip({
						error : true,
						msg : data.message
					});
				}
			});
		}
	});

	function uListPos(elem, list){
		list.css({
			left : elem.offset().left,
			top : elem.offset().top + elem.innerHeight()
		});
	}

	//ͶƱ��ѡ����
	var vote_item = $('ul.J_vote_item'),										//ͶƱ��
		vote_checkbox = vote_item.find('input:checkbox'),			//ͶƱ��
		vote_max = parseInt(vote_item.data('max'));						//��ѡ��
	if(vote_max) {
		//�������������
		vote_checkbox.on('change', function(){

			//ѡ�����Ƿ���ڶ�ѡ��
			if(vote_checkbox.filter('input:checkbox:checked').length === vote_max) {
				$.each(vote_checkbox, function(){
					if(!$(this).prop('checked')) {
						//δѡ�������
						$(this).prop('disabled', true);
					}
				});
			}else{
				vote_checkbox.filter(':disabled').prop('disabled', false);
			}
		});
	}
})();
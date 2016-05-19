/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-ͶƱ
 * @Author	: luomingqu@gmail.com
 * @Depend	: jquery.js(1.7 or later), ��ҳ�涨��
 * $Id: vote_index.js 14800 2012-08-01 11:48:56Z hejin $
 */
 
;(function(){
	var forum_data = {},											//�������
			vote_forum_ct = $('#J_vote_forum_ct'),					//��鵯���б���
			vote_post_to_cate = $('#J_vote_post_to_cate'),				//������_����
			vote_post_to_forum = $('#J_vote_post_to_forum'),		//������_���
			vote_forum_submit = $('#J_vote_forum_submit'),			//ȷ��
			forum_ul,
			fid = '';

	if(!forum_data.data) {
		//����ͶƱ�������
		$.getJSON(URL_FORUM_LIST, function(data){
			if(data.state == 'success') {
				forum_data.data = $.parseJSON(data.data);

				//ѭ��д���������
				var cate_data = forum_data.data['cate'],		//��������
						cate_arr = [];
				for(i in cate_data) {
					cate_arr.push('<li tabindex="0" role="option" class="J_cate_item" data-cid="'+ i +'">'+ cate_data[i] +'</li>');
				}
				vote_forum_ct[0].innerHTML = '<div class="source_forum" tabindex="0" role="combobox" aria-owns="J_vote_forum_list" aria-label="ѡ�����"><h4>ѡ�����</h4><ul id="J_vote_forum_list">'+ cate_arr.join('') +'</ul></div><div class="target_forum" tabindex="0" role="combobox" aria-owns="J_vote_forum_ul" aria-label="ѡ����"><h4>ѡ����</h4><ul id="J_vote_forum_ul"></ul></div>'
				forum_ul = document.getElementById('J_vote_forum_ul');
			}
		});
	}


	//�������
	vote_forum_ct.on('click keydown', 'li.J_cate_item', function(e) {
		if(e.type === 'keydown' && e.keyCode !== 13) {
			return;
		}
		var current_cid = $(this).data('cid');

		$(this).addClass('current').siblings().removeClass('current');
		vote_post_to_cate.text($(this).text());																		//������_����
		vote_post_to_forum.text('');																				//������_���
		vote_forum_submit.addClass('disabled').prop('disabled', 'disabled');										//ȷ����ť������

		//ѭ��д��������
		
		var data_forum = forum_data.data['forum'][current_cid],
				forum_arr = [];
		for(i in data_forum) {
			forum_arr.push('<li tabindex="0" role="option" class="J_forum_item" data-fid="'+ i +'">'+ data_forum[i] +'</li>');
		}
		forum_ul.innerHTML = forum_arr.join('');
		forum_ul.parentNode.focus();

	});

	//������
	vote_forum_ct.on('click keydown', 'li.J_forum_item', function(e) {
		if(e.type === 'keydown' && e.keyCode !== 13) {
			return;
		}else {
			e.preventDefault();
		}
		fid = $(this).data('fid');
		$(this).addClass('current').siblings('.current').removeClass('current');
		vote_post_to_forum.text($(this).text().replace(/-/g, ''));								//������_���
		vote_forum_submit.removeClass('disabled').removeProp('disabled');						//ȷ����ť����
		if(e.type === 'keydown') {
			vote_forum_submit.focus();
		}
	});

	//��ת����ҳ
	vote_forum_submit.on('click', function(e) {
		e.preventDefault();
		var $this = $(this),
				href = $this.data('url') +'&fid='+ fid + '&special=1',
				vote_forum_join = $('#J_vote_forum_join');

		if(vote_forum_join.prop('checked')) {
			//������
			$.post(vote_forum_join.data('url'), {fid : fid}, function(data){
				location.href = href;
			}, 'json');
		}else{
			location.href = href;
		}
		
	});

	//�ر�
		$('#J_vote_forum_close').on('click', function(e){
			e.preventDefault();
			$('#J_vote_forum_pop').hide();
		});

})();
/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-ͶƱ
 * @Author	: linhao87@gmail.com
 * @Depend	: jquery.js(1.7 or later), ��ҳ�涨��
 * $Id: vote_index.js 21606 2012-12-11 11:33:10Z hao.lin $
 */
 
Wind.use('ajaxForm', function(){
	var vote_list_ul = $('ul.J_vote_list_ul');
	
	//����
	$('a.J_vote_down').on('click', function(e) {
		e.preventDefault();
		var $this = $(this),
			role = $this.data('role'),
			tid = $this.data('tid'),
			item = $('#J_vote_list_'+ tid);

		$this.parent().hide().siblings('.J_vote_options').show();
		item.find('.J_dn').fadeIn();
		item.find('ul').addClass('ul_line');

	});
	
	//����
	$('a.J_vote_up').on('click', function(e){
		e.preventDefault();
		var $this = $(this),
			dl = $this.parents('dl'),
			tid = $this.data('tid'),
			item = $('#J_vote_list_'+ tid);
		
		item.find('.J_dn').hide();
		item.find('ul').removeClass('ul_line');
		$this.parent().hide().siblings('.J_vote_more').show();

		//ê�㶨λ ����
		var doc = $(document),
			doc_sc = doc.scrollTop(),
			header_h = $('#J_header').height();

		if(dl.offset().top <= doc_sc+header_h) {
			location.hash = 'vote' + tid;

			//���»�ȡ�����߶Ȳ���ȥheader��
			doc_sc = doc.scrollTop();
			doc.scrollTop(doc_sc - header_h);
		}
		
	});
	
	//���ͶƱ�� ��������
	vote_list_ul.on('click', function(e){
		var $this = $(this),
			elem_hide = $this.find('.J_dn:hidden');

		$this.parent().siblings('.J_vote_more').children('a.J_vote_down').click();
	});
	
	//�б��ύ
	$('button.J_vote_list_sub').on('click', function(e){
		e.preventDefault();

		$('#J_vote_form_'+ $(this).data('tid')).ajaxSubmit({
			dataType : 'json',
			success : function(data){
				if(data.state === 'success') {
					Wind.Util.resultTip({
						msg : 'ͶƱ�ɹ�',
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
	
	//ͶƱ��ѡ����
	$.each(vote_list_ul, function(i, o){
		var $this = $(this),
			vote_checkbox = $this.find('input:checkbox'),			//ͶƱ��
			vote_max = parseInt($this.data('max'));					//��ѡ��
			
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
	});
	
	
});
/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-���˿ռ�
 * @Author	: linhao87@gmail.com
 * @Depend	: jquery.js(1.7 or later), dialog, jquery.form, tabs, jquery.draggable
 * $Id$
 */
 
Wind.use('ajaxForm', function(){
	var body = $('body'),
			style_orgin = body.attr('style'),		//ԭ��ʽ
			bg_saved = body.css('backgroundImage');
	if(bg_saved.indexOf('images/bg.png') > 0) {
		//����Ĭ�ϱ���
		bg_saved = '';
	}
	//�Ķ�ȫ��
		
	//�ռ�����
	$('#J_space_set').on('click', function(e){
		e.preventDefault();
		var $this = $(this);
		$.post($this.attr('href'), function(data){
			if(Wind.Util.ajaxTempError(data)) {
				return false;
			}
			Wind.dialog.html(data, {
				id : 'J_space_pop',
				position	: 'fixed',	//�̶���λ
				//isMask		: false,	//������
				onClose : function(){
					//�Ƴ��Զ��屳����ʽ
					body.attr('style', style_orgin ? style_orgin : '');
					
					//�Ƴ�ģ��Ԥ��iframe
					$('iframe.J_space_preview').remove();
				},
				callback	: function(){
					//��ק jquery.draggable
					Wind.use('draggable', function(){
						$('#J_space_pop').draggable( { handle : '.pop_top'} );
					});
					
					//tab
					Wind.use('tabs', function(){
						$('#J_space_pop_nav').tabs('#J_space_pop_content > div');
					});
					
					//��������У��
					var domain = $('#J_domain'),
						root = $('#J_root'),
						check_domain = $('#J_check_domain');
					Wind.Util.buttonStatus(domain, check_domain);
					var domain_pass = false;
					check_domain.on('click', function(e){
						e.preventDefault();
						var $this = $(this);
						
						$.post($this.data('url'), {domain : domain.val(), root : root.val()}, function(data){
							if(data.state == 'success') {
								//��ʾ global.js
								Wind.Util.resultTip({
									msg : 'У��ͨ��',
									follow : $this
								});
							}else if(data.state == 'fail'){
								Wind.Util.resultTip({
									error : true,
									msg : data.message,
									follow : $this
								});
							}
						}, 'json');
					});
					
					//ģ������_��ҳ
					var temp_list = $('#J_temp_list'),													//ģ���б�
						temp_page = $('#J_temp_page'),												//ģ�巭ҳ�б�
						page_total = temp_page.children().length,								//��ҳ��
						temp_prev = $('#J_temp_prev'),												//��һ��
						temp_next = $('#J_temp_next'),												//��һ��
						li_height = temp_list.children().outerHeight(true),
						step_height = li_height * 2,														//һ���ƶ��߶�
						lock = false;																			//�ƶ����� Ĭ�Ϸ�
					
					//ģ��_���
					temp_list.on('click', 'a', function(e){
						e.preventDefault();
						var id = $(this).data('id'),
							url = $(this).attr('href');
							
						if(!$(this).hasClass('current')) {
							$(this).parent().addClass('current').siblings().removeClass('current');
							$('#J_styleid').val(id);
							
							var space_preview = $('#J_iframe_preview_'+ id);
							$('iframe.J_space_preview').hide();
							
							if(space_preview.length) {
								//iframe�Ѵ��� ��ʾ
								space_preview.show();
							}else{
								//iframe���������� ����
								$.post(url, function(data){
									//global.js
									if(Wind.Util.ajaxTempError(data)) {
										return false;
									}
										
									$('<iframe class="J_space_preview" id="J_iframe_preview_'+ id +'" frameborder="0" src="'+ url +'" style="position:absolute;left:0;top:0;z-index:8;border:0;width:100%;height:100%;padding:0;margin:0;display:none;" scrolling="no" />').appendTo(body);
							
									var $iframe = $('#J_iframe_preview_'+ id);
									$iframe[0].contentWindow.location.href = url;
									$iframe.load(function(){
										$iframe.show();
										var body = $iframe[0].contentWindow.document.body;
										$iframe.css({
											height : $(body).height()
										});
									});
									
								});
							}

						}
					});
					
					//ģ��_���ҳ��
					temp_page.children('a').on('click', function(e){
						e.preventDefault();
						var $this = $(this);
							
						if(!$this.hasClass('current')) {
							var index = $this.index();

							tempMove(index);
						}
					});
					
					//ģ��_����ҳ
					$('a.J_temp_pn').on('click', function(e){
						e.preventDefault();
						if(lock) {
							return;
						}
						lock = true;
						var $this = $(this),
							role = $this.data('role');
							current_index = temp_page.children('.current').index();			//��ǰҳ����

						if(role === 'next') {
							//�ж��Ƿ�Ϊ���һҳ
							if(current_index !== page_total-1) {
								tempMove(current_index + 1);
							}else{
								lock = false;
							}
						}else{
							//�ж��Ƿ�Ϊ��һҳ
							if(current_index !== 0) {
								tempMove(current_index - 1);
							}else{
								lock = false;
							}
						}
					});
					//ģ�����
					function tempMove(page_index){
						
						//��ǰ�����һ��������
						var li_index = 6*(page_index+1) - 1;

						//�жϴ���src�Ƿ����
						if(!temp_list.children(':eq('+ li_index +')').find('img').attr('src')) {
							
							//������ѭ��д���ַ
							var li_lt = temp_list.children(':lt('+ parseInt(li_index+1) +')');
							$.each(li_lt, function(i, o){
								var img = $(this).find('img')
								if(img.data('src')) {
									img.attr('src', img.data('src')).data('src', false);
								}
							});
						}
						
						//�ƶ�
						temp_list.css({
							marginTop : -step_height * page_index
						});

						lock = false;
						
						//current״̬
						temp_page.children(':eq('+ page_index +')').addClass('current').siblings().removeClass('current');
					}

					
					//����ͼƬ
					var input_repeat = $('#J_bg_repeat_input'),					//����ƽ�� input
						input_attachment = $('#J_bg_attachment_input'),		//�����̶� input
						input_position = $('#J_bg_position_input');				//�������� input
					
					//��������
					$('#J_bg_position > a').on('click', function(e){
						e.preventDefault();
						$(this).addClass('current').siblings().removeClass('current');
						
						//�������ñ�������css
						var css_arr = getBgCss($(this).data('val'));
						
						//д��input
						input_repeat.val(css_arr[0]);
						input_attachment.val(css_arr[1]);
						
						body.css({
							backgroundRepeat : css_arr[0],
							backgroundAttachment : css_arr[1]
						});
					});
					
					//���뷽ʽ
					$('#J_bg_align > a').on('click', function(e){
						e.preventDefault();
						$(this).addClass('current').siblings().removeClass('current');
						
						//д��input
						input_position.val($(this).data('val'));
						
						body.css({
							backgroundPosition : $(this).data('val') +' top'
						});
					});
					
					//�ϴ��Զ���ͼ
					var custom_thumb = $('#J_custom_thumb'),
							space_bg_preview = $('#J_space_bg_preview'),
							space_bg_cancl = $('#J_space_bg_cancl');		//ȡ������ͼƬ
					Wind.use('uploadPreview', function(){
						custom_thumb.uploadPreview({
							maxWidth : 160,
							maxHeight : 500,
							message : '�ϴ���ͼƬ��С���ܳ���'
						});
					});
					

					//���б�����ʾȡ����ť

					if(bg_saved) {
						space_bg_cancl.show();
					}
					
					//�ϴ��ؼ��л�
					custom_thumb.on('change', function(){
						setTimeout(function(){
							//�������ñ�������css
							var css_arr = getBgCss($('#J_bg_position > a.current').data('val'));
							body.css({
								backgroundImage : 'url(' +space_bg_preview.attr('src')+ ')',
								backgroundPosition : $('#J_bg_align > a.current').data('val') +' top',
								backgroundRepeat : css_arr[0],
								backgroundAttachment : css_arr[1]
							});
						}, 100);
						
					});

					//ȡ������
					space_bg_cancl.on('click', function(e){
						e.preventDefault();
						//�����ָ�
						//body.attr('style', style_orgin ? style_orgin : '');
						body.css({
							backgroundImage : ''
						});

						//�����
						$('#J_space_bg_saved').val('');

						//ͼƬ�Ƴ�
						space_bg_preview.removeAttr('src');
						
						$(this).hide();
					});
					
					//�ύ������Ϣ
					$('#J_editspace_sub').on('click', function(e){
						e.preventDefault();
						var spacename = $('#J_spacename'),
							descrip = $('#J_descrip'),
							spacename_length = $.trim(spacename.val()).length,
							descrip_length = $.trim(descrip.val()).length,
							edit_tip = $('#J_edit_tip');
						
						$('#J_spacename, #J_descrip').on('keyup', function(){
							edit_tip.hide();
						});
						
						if(spacename_length > 20) {
							edit_tip.html('<div class="tips red" style="margin-top:5px;margin-bottom:-8px;">�ռ��������20�֣��ѳ���'+ (spacename_length - 20) +'��</div>').show();
							spacename.focus();
							return false;
						}
						
						if(descrip_length > 250) {
							edit_tip.html('<div class="tips red" style="margin-top:5px;margin-bottom:-8px;">�ռ������250�֣��ѳ���'+ (descrip_length - 250) +'��</div>').show();
							descrip.focus();
							return false;
						}
						
						$(this).parents('form').ajaxSubmit({
							dataType : 'json',
							success : function(data){
								if(data.state == 'success') {
									Wind.Util.resultTip({
										msg : '���óɹ�',
										callback : function(){
											window.location.reload();
										}
									});
								}else if(data.state == 'fail'){
									Wind.Util.resultTip({
										error : true,
										msg : data.message
									});
								}
							}
						});
					});
					
					//�ύ
					$('form.J_space_pop_form').ajaxForm({
						dataType : 'json',
						success : function(data){
							if(data.state == 'success') {
								Wind.Util.resultTip({
									msg : '���óɹ�',
									callback : function(){
										window.location.reload();
									}
								});
							}else if(data.state == 'fail'){
								Wind.Util.resultTip({
									error : true,
									msg : data.message
								});
							}
						}
					});
					
				}
			});

		}, 'html');
		
	});
	
	//�жϷ��ر�������css
	function getBgCss(v){
		var repeat, atta
		
		if(v == 'repeat') {
			//ƽ��
			repeat = 'repeat';
			atta = 'scroll';
		}else if(v == 'fixed'){
			//����
			repeat = 'no-repeat';
			atta = 'fixed';
		}else{
			//����
			repeat = 'no-repeat';
			atta = 'scroll';
		}
		return [repeat, atta];
	}


	//��ע ȡ��
	var lock = false;
	$('a.J_space_follow').on('click', function(e){
		if(!GV.U_ID) {
			return;
		}
		e.preventDefault();
		var $this = $(this),
			role = $this.data('role'),
			url = (role == 'follow' ? SPACE_FOLLOW : SPACE_UNFOLLOW);

		if(lock) {
			return false;
		}
		lock = true;

		Wind.Util.ajaxMaskShow();
		$.post(url, {uid : $this.data('uid')}, function(data){
			Wind.Util.ajaxMaskRemove();
			if(data.state == 'success') {
				if(role == 'follow') {
					$this.html('ȡ����ע').data('role', 'unfollow');
					$this.addClass('unfollow');
				}else{
					$this.html('<em></em>�ӹ�ע').data('role', 'follow');
					$this.removeClass('unfollow');
				}

				$('#J_user_card_'+ $this.data('uid')).remove();
			}else if(data.state == 'fail') {
				Wind.Util.resultTip({
					elem : $this,
					error : true,
					msg : data.message,
					follow : true
				});
			}
			lock = false;
		}, 'json');
	});

});
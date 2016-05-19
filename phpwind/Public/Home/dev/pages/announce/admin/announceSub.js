/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ��̨-�����ύ
 * @Author	: linhao87@gmail.com
 * @Depend	: jquery.js(1.7 or later), windeditor, ajaxForm
 * $Id: medal_manage.js 4949 2012-02-28 03:16:33Z hao.lin $
 */
 
 ;(function(){
	
 	Wind.use('windeditor', 'ajaxForm',function() {
		$('#J_textarea').windeditor({
			editor_path	: window.GV.JS_ROOT + 'windeditor/',
			plugins		: ['bbcode']
		});

		//���Ǳ༭�� �ĳ�submit�¼���ajaxform�������ͬcommon.js
		var btn = $('#J_announce_sub');
		$('#J_announce_form').on('submit', function(e) {
				e.preventDefault();
				var form = $(this);

				form.ajaxSubmit({
					dataType	: 'json',
					beforeSubmit: function(arr, $form, options) {
						var text = btn.text();
						
						//��ť�İ���״̬�޸�
						btn.text(text +'��...').prop('disabled',true).addClass('disabled');
					},
					success		: function(data, statusText, xhr, $form) {
						var text = btn.text();
					
						//��ť�İ���״̬�޸�
						btn.removeClass('disabled').text(text.replace('��...', '')).parent().find('span').remove();
					
						if( data.state === 'success' ) {
							$( '<span class="tips_success">' + data.message + '</span>' ).appendTo(btn.parent()).fadeIn('slow').delay( 1000 ).fadeOut(function() {
								if(data.referer) {
									//���ش���ת��ַ
									window.location.href = decodeURIComponent(data.referer);
								}else {
									reloadPage(window);
								}
							});
						}else if( data.state === 'fail' ) {
							$( '<span class="tips_error">' + data.message + '</span>' ).appendTo(btn.parent()).fadeIn( 'fast' );
							btn.removeProp('disabled').removeClass('disabled');
						}
					}
				});
			});

	});
	
 })();
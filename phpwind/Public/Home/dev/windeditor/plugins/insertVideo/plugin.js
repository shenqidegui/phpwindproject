/*
 * PHPWind WindEditor Plugin
 * @Copyright 	: Copyright 2011, phpwind.com
 * @Descript	: �ϴ���Ƶ���
 * @Author		: chaoren1641@gmail.com
 * @Depend		: jquery.js(1.7 or later)
 * $Id: windeditor.js 4472 2012-02-19 10:41:01Z chris.chencq $			:
 */
;(function ( $, window, undefined ) {

	var WindEditor = window.WindEditor;

	var pluginName = 'insertVideo',
		dialog = $('\
			<div class="edit_menu" style="display:none;">\
				<div class="edit_menu_video">\
					<div class="edit_menu_top"><a href="" class="edit_menu_close">�ر�</a><strong>������Ƶ</strong></div>\
					<div class="edit_menu_cont">\
						<dl class="cc">\
							<dt>��ַ��</dt>\
							<dd><input type="text" class="input length_5 J_input_net_video"></dd>\
						</dl>\
						<dl class="cc">\
							<dt>�ߴ磺</dt>\
							<dd><input type="number" class="input length_1 mr5" min="50" value="480" id="J_input_video_width"><span class="mr20">��</span><input type="number" min="50" id="J_input_video_height" value="400" class="input length_1 mr5"><span>��</span></dd>\
						</dl>\
						<dl class="cc">\
							<dt>���ã�</dt>\
							<dd><label><input type="checkbox">�Զ�չ��</label></dd>\
						</dl>\
					</div>\
					<div class="edit_menu_bot">\
						<button type="button" class="edit_menu_btn">ȷ��</button><button class="edit_btn_cancel" type="button">ȡ��</button>\
					</div>\
				</div>\
			</div>');

	WindEditor.plugin(pluginName,function() {
		var _self = this;
		var editorDoc = _self.editorDoc = _self.iframe[0].contentWindow.document,
			plugin_icon = $('<div class="wind_icon" data-control="'+ pluginName +'"><span class="'+ pluginName +'" title="������Ƶ"></span></div>').appendTo(  _self.pluginsContainer  );
			plugin_icon.on('click',function() {
				if($(this).hasClass('disabled')) {
					return;
				}
				if(!$.contains(document.body,dialog[0]) ) {
					dialog.appendTo( document.body );
				}
				_self.showDialog(dialog);
			});

			//�����Ĺر��¼�
			dialog.find('a.edit_menu_close,button.edit_btn_cancel').on('click',function(e) {
				e.preventDefault();
				_self.hideDialog();
			});

			var themeName = _self.options.theme,
				img_path = _self.options.editor_path + 'themes/' + themeName + '/';
			//����������Ƶ
			dialog.find('.edit_menu_btn').on('click',function(e) {
				e.preventDefault();
				var input = dialog.find('.J_input_net_video');
				var url = $.trim(input.val());
				if( !url || url.indexOf('http')!== 0 ) {
					alert('·����ʽ����ȷ������������');
					input.focus();
					return;
				}
				var width = $('#J_input_video_width').val(),
					height = $('#J_input_video_height').val(),
					is_auto = + dialog.find(':checkbox').prop('checked');

				_self.insertHTML('<p><img class="j_editor_video_content" style="border:1px dashed #ccc;background:#fffeee url('+ img_path +'video_48.png) center center no-repeat;" width="'+ width +'px" height="'+ height +'px" src="'+ img_path +'blank.gif" data-url="'+ url +'"  data-url="'+ url +'" data-width="'+ width +'" data-height="'+ height +'" data-auto="'+ is_auto +'"/></p>').hideDialog();
			});


			function wysiwyg() {
				//var reg = /\[flash\s*(?:=\s*(\d+)\s*,\s*(\d+)\s*)?\]\s*(((?!")[\s\S])+?)(?:"[\s\S]*?)?\s*\[\/flash\]/ig;
				var reg = /\[flash=(\d+)\s*,(\d+)\s*,(\d+)\s*\]([\s\S]*?)\[\/flash\]/ig;
				var	html = $(editorDoc.body).html();
				if(!reg.test(html)) {
					return;
				}
				html = html.replace(reg,function(all, $1, $2,$3,$4) {
					var width = $1,
						height = $2,
						auto_play = $3,
						url = $4;
					return '<p><img class="j_editor_video_content" style="border:1px dashed #ccc;background:#fffeee url('+ img_path +'video_48.png) center center no-repeat;" width="'+ width +'px" height="'+ height +'px" src="'+ img_path +'blank.gif" data-url="'+ url +'" data-width="'+ width +'" data-height="'+ height +'" data-auto="'+ auto_play +'"/></p>';
				});
				$(editorDoc.body).html(html);
			}

			//���ز��ʱ��ubbת���ɿɼ�������
			$(_self).on('ready',function() {
    			wysiwyg();
    		});

			//�л��ɿɼ�������ģʽʱ���html
			$(_self).on('afterSetContent',function(event,viewMode) {
				wysiwyg();
			});

			//�л��ɴ���ģʽ�����ύʱ
			$(_self).on('beforeGetContent',function() {
				$(editorDoc.body).find('img.j_editor_video_content').each(function() {
					var url = $(this).data('url'),
						is_autoplay = $(this).data('auto'),
						width = $(this).data('width'),
						height = $(this).data('height');
					$(this).replaceWith('[flash='+ width +','+ height +','+ is_autoplay +']'+ url +'[/flash]');
				});
			});
	});


})( jQuery, window);
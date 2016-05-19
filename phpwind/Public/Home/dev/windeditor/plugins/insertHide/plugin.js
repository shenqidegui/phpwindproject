/*
 * PHPWind WindEditor Plugin
 * @Copyright 	: Copyright 2011, phpwind.com
 * @Descript	: �����������ز��
 * @Author		: chaoren1641@gmail.com
 * @Depend		: jquery.js(1.7 or later)
 * $Id: windeditor.js 4472 2012-02-19 10:41:01Z chris.chencq $			:
 */
;(function ( $, window, undefined ) {

	var WindEditor = window.WindEditor;
	var credit = EDIT_CONFIG.enhide.credit;
	var creditSelect = '';
	for(i in credit) {
		creditSelect += '<option value="'+ i +'">'+ credit[i] +'</option>';
	}
	var pluginName = 'insertHide',
		dialog = $('<div class="edit_menu" style="display:none;">\
					<div class="edit_menu_hide">\
						<div class="edit_menu_top"><a href="" class="edit_menu_close">�ر�</a><strong>������������</strong></div>\
						<div class="edit_menu_cont">\
							<ul>\
								<li><label><input name="hide_type" type="radio" value="1" checked="checked">�ظ��ſɼ�</label></li>\
								<li><input name="hide_type" type="radio" value="2">\
								<select class="mr5 J_unit">'+ creditSelect +'</select>\
								�û�����<input type="number" class="input length_1 mr5 J_price">ʱ����ʾ</li>\
							</ul>\
							<textarea></textarea>\
						</div>\
						<div class="edit_menu_bot">\
							<button type="button" class="edit_menu_btn">ȷ��</button><button type="button" class="edit_btn_cancel">ȡ��</button>\
						</div>\
					</div>\
				</div>');

	WindEditor.plugin(pluginName,function() {
		var _self = this;
		var editorDoc = _self.editorDoc = _self.iframe[0].contentWindow.document,
		editorToolbar = _self.toolbar,
		//toolbar�е�icon����
		icon_ul = editorToolbar.find('ul');

		//�Զ������λ��,�嵽insertBlockquote����
		var plugin_icon = $('<div class="wind_icon" data-control="'+ pluginName +'" unselectable="on"><span unselectable="on" class="'+ pluginName +'" title="������������"></span></div>').appendTo( _self.pluginsContainer );
		plugin_icon.on('click',function() {
			if($(this).hasClass('disabled')) {
				return;
			}
			//�����ѡȡ���ݣ��򲻵���
			var node	= _self.getRangeNode('div.content_hidden'),
				html = _self.getRangeHTML();
			if(node && node.length) {
				node.find('h5').remove();
				node.replaceWith(node.html());
			}else {
				if(!$.contains(document.body,dialog[0]) ) {
					dialog.appendTo( document.body );
				}
				if(html && $.trim(html) !== "<P></P>") {
					dialog.find('textarea').val(html).hide();
				}else {
					dialog.find('textarea').val('').show();
				}
				_self.showDialog(dialog);
			}
		});

		//�����Ĺر��¼�
		dialog.find('a.edit_menu_close,button.edit_btn_cancel').on('click',function(e) {
			e.preventDefault();
			_self.hideDialog();
		});

		//�������
		var head = editorDoc.head || editorDoc.getElementsByTagName( "head" )[0] || editorDoc.documentElement;
		var style = "<style>\
			.content_hidden {border:1px dashed #95c376;padding:10px 40px;margin:5px 0;background:#f8fff3;}.content_hidden h5 {font-size:12px;color:#669933;margin-bottom:5px;}</style>";
		$(head).append(style);

		dialog.find('.edit_menu_btn').on('click',function(e) {
			e.preventDefault();
			var textarea = dialog.find('textarea');
			var type = $('input[name=hide_type]:checked').val();
			if(textarea.val() === '') {
				alert('������Ҫ���ص���������');return;
			}
			//script xss
			var snap = $('<div />').text(textarea.val());
			var html;
			if(type == '1') {
				html = '<div class="content_hidden"><h5>�ظ��ſɼ�������</h5>'+ snap.html() +'</div>';
			}else {
				var price = dialog.find('input.J_price').val() || 0;
				var numPatt = new RegExp('^[1-9][0-9]*$');
				if(!numPatt.test(price)){
					price = 0;
				}
				var unit = dialog.find('.J_unit option:selected').val();
				html = '<div class="content_hidden" data-price="'+ (price || 0) +'" data-unit="'+ unit +'"><h5>'+ credit[unit] +'���ڵ���'+ price +'ʱ����ʾ������</h5>'+ snap.html() +'</div>';
			}
			_self.insertHTML(html).hideDialog();
		});


		//�л��ɿɼ�������ģʽʱ���html
		function wysiwyg() {
			var postReg = /\[post]([\s\S]*?)\[\/post\]/ig;
			var hideReg = /\[hide=(\d+)\,(\w+)\s*\]([\s\S]*?)\[\/hide\]/ig;
			var html = $(editorDoc.body).html();
			html = html.replace(postReg,function(all,$1) {
				return '<div class="content_hidden"><h5>�ظ��ſɼ�������</h5>'+ $1 +'</div>';
			})
			html = html.replace(hideReg,function(all, $1, $2,$3) {
				return '<div class="content_hidden" data-price="'+ $1 +'" data-unit="'+ $2 +'" ><h5>'+ credit[$2] +'���ڵ���'+ $1 +'ʱ����ʾ������</h5>'+ $3 +'</div>';
			});
			$(editorDoc.body).html(html);
		}

		//���ز��ʱ��ubbת���ɿɼ�������
		$(_self).on('ready',function() {
			wysiwyg();
		});

		$(_self).on('afterSetContent',function(event,viewMode) {
			wysiwyg();
		});

		$(_self).on('beforeGetContent',function() {
			$(editorDoc.body).find('div.content_hidden').each(function() {
				$(this).find('h5').remove();
				var price = $(this).data('price');
				var unit = $(this).data('unit');
				if(price && unit) {
					$(this).replaceWith('[hide='+ price +','+ unit +']'+ this.innerHTML +'[/hide]');
				}else {
					$(this).replaceWith('[post]'+ this.innerHTML +'[/post]');
				}

			});
		});

		//�ؼ�����ť�Ŀ���
    	$(_self.editorDoc.body).on('mousedown',function(e) {
    		if( $(e.target).closest('div.content_hidden').length ) {
    			plugin_icon.removeClass('disabled').addClass('activate');
    		}else {
    			_self.enableToolbar();
    			plugin_icon.removeClass('activate');
    		}
    	});
	});


})( jQuery, window);
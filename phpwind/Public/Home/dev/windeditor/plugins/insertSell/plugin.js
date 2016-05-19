/*
 * PHPWind WindEditor Plugin
 * @Copyright 	: Copyright 2011, phpwind.com
 * @Descript	: �������ݳ��۲��
 * @Author		: wengqianshan@me.com
 * @Depend		: jquery.js(1.7 or later)
 * $Id: windeditor.js 4472 2012-02-19 10:41:01Z chris.chencq $			:
 */
;(function ( $, window, undefined ) {
	var SellManage = function(editor){
		this.editor = editor;
		this.credit = window.EDIT_CONFIG.sell.credit;//����������Ϣ
		this.creditSelect = '';//option����
		this.maxSell = EDIT_CONFIG.sell.price || 0;//���������ֵ
		this.maxIncome = EDIT_CONFIG.sell.income || 0;//������ֵ
		this.editAction = false;//�Ƿ�༭״̬
		this.editNode = null;//��ǰ�༭�Ľڵ� .content_sell
		this.sellData = null;//�Ƿ������ó��ۣ����ú�{price: 1, unit: "1"} ��content_sell�� data-price ��data-unit
		for(i in this.credit) {
			this.creditSelect += '<option value="'+ i +'">'+ this.credit[i] +'</option>';
		}
		this.dialog = $('<div class="edit_menu" style="display:none;">\
						<div class="edit_menu_hide">\
							<div class="edit_menu_top"><a href="" class="edit_menu_close">�ر�</a><strong>�����������</strong></div>\
							<div class="edit_menu_cont">\
								<ul>\
									<li>������������ۼ�'+ this.maxSell +'�������������'+ this.maxIncome +'</li>\
									<li>�ۼۣ�<input name="price" type="number" size="2" id="J_sell_price" class="input length_1 mr5 J_price" max="'+ this.maxSell +'" min="0">\
									<select class="mr5 J_unit">'+ this.creditSelect +'</select>\
									<span id="B_sell_bm"></span></li>\
								</ul>\
								<textarea></textarea>\
							</div>\
							<div class="edit_menu_bot">\
								<button type="button" class="edit_menu_btn">ȷ��</button><button type="button" class="edit_btn_cancel">ȡ��</button>\
							</div>\
						</div>\
					</div>');
	};
	SellManage.prototype = {
		init: function(){
			var _self = this;
			//�����Ĺر��¼�
			this.dialog.find('a.edit_menu_close,button.edit_btn_cancel').on('click',function(e) {
				e.preventDefault();
				_self.editor.hideDialog();
			});
			//��������
			this.dialog.find('.edit_menu_btn').on('mousedown',function(e) {
				e.preventDefault();
				var price = $('#J_sell_price').val();
				var textarea = _self.dialog.find('textarea');
				var unit = _self.dialog.find('.J_unit option:selected').val();
				var text = $('<div />').text(textarea.val()).html(); ////script xss
				var name = _self.credit[unit];
				if(isNaN(price) || parseInt(price) < 0 || price == '') {
					alert('��������ȷ������');
					$('#J_sell_price').focus();
					return;
					//price = 0;
				}
				if(parseInt(price) > _self.maxSell) {
					alert('����ۼ�Ϊ'+ _self.maxSell + ',���ܴ���' + _self.maxSell + 'Ŷ��');
					$('#J_sell_price').focus();
					return;
				}
				if(textarea.is(':visible') && text === '') {
					alert('������Ҫ���۵���������');return;
				}
				//����۸�/����
				_self.sellData = {
					price: price,
					unit: unit
				};
				var node = _self.renderSell({
					price: price,
					unit: unit,
					text: text
				});
				if(_self.editAction === true){
					_self.editSell(_self.editNode, node);
					_self.editor.hideDialog();
					_self.editAction = false;
					_self.editNode = null;
				}else{
					_self.editor.insertHTML(node).hideDialog();
				}
				//����price
				var body = _self.editor.editorDoc.body;
				$(".content_sell", body).attr("data-price", price);//no data('', '')
				$(".J_price_info", body).html(price + name);
			});
			//=====
		},
		// ���ݽ���������(��Ϊ��)���Ƿ���ʾtextarea, 1��ʾ(Ĭ��),0����ʾ;
		showPanel: function(data, isShowTextarea){
			if(!$.contains(document.body, this.dialog[0]) ) {
				this.dialog.appendTo( document.body );
			}
			var textarea = this.dialog.find('textarea');
			var j_price  = this.dialog.find('.J_price');
			var j_unit = this.dialog.find('.J_unit');
			if(data){
				var text = data.text || "";
				var price = data.price || 0;
				var unit = data.unit || 0;
				//���ó�ʼֵ
				textarea.val(text);
				j_price.val(price);
				j_unit.find("option[value="+unit+"]").attr("selected", "selected");
			}else{
				textarea.val('');
			}
			//�Ƿ���ʾtextarea��Ĭ����ʾ
			if(isShowTextarea === 0){
				textarea.hide();
			}else{
				textarea.show();
			}
			this.editor.showDialog(this.dialog);
		},
		//data����price��unit��text,���ɶ���,����DOM����
		renderSell: function(data){
			if(data !== null){
				var price = data.price || 0,
					unit = data.unit || 0,
					text = data.text || '',
					name = this.credit[unit],
					content = '<div class="content_sell" data-price="'+ price +'" data-unit="'+ unit +'"><a class="icon_delete J_sell_delete" href="#" title="ȡ�����ݳ���"></a><a class="icon_edit J_sell_edit" href="#" title="�༭��������"></a><h6>�������۵����� <span class="content_sell_price_info">(�ۼ�<span class="J_price_info">'+ price + name +'</span>)</span></h6>'+ text +'</div>';
				return content;
			}
		},
		editSell: function($old, $new){
			$old.replaceWith($new);
		},
		//��ȡһ�γ������ݵĴ��ı�
		getText: function($ele){
			var cnode = $ele.clone();
			cnode.find("h6, .J_sell_delete, .J_sell_edit").remove();
			var text = cnode.text();
			return text || '';
		}
	};



	if(!window.EDIT_CONFIG) {
		$.error('EDIT_CONFIGû�ж��壬�����ϴ���Ҫ�ṩ���ö���');
		return;
	}
	var WindEditor = window.WindEditor;
	var pluginName = 'insertSell';

	WindEditor.plugin(pluginName,function() {
		var _self = this;
		var sellManage = new SellManage(_self);
			sellManage.init();
		//sellManage.showPanel({price:3, unit: 1}, 0);

		var editorDoc = _self.editorDoc = _self.iframe[0].contentWindow.document,
		editorToolbar = _self.toolbar,
		//toolbar�е�icon����
		icon_ul = editorToolbar.find('ul');
		//�Զ������λ��,�嵽insertBlockquote����
		var plugin_icon = $('<div class="wind_icon" data-control="'+ pluginName +'" unselectable="on"><span unselectable="on" class="'+ pluginName +'" title="�����������"></span></div>').appendTo( _self.pluginsContainer );
		plugin_icon.on('mousedown',function(e) {
			e.preventDefault();
			if($(this).hasClass('disabled')) {
				return;
			}
			//�༭����ʱ��ȡĬ��ֵ
			var elems = $(editorDoc).find("body").find(".content_sell");//+body���IEbug
			if(elems.length > 0 && !sellManage.sellData) {
				var elem_0 = elems.eq(0);
				sellManage.sellData = {
					price: elem_0.attr("data-price"),
					unit: elem_0.attr("data-unit")
				};
			}
			//�����ѡȡ���ݣ��򲻵���
			var node	= _self.getRangeNode('div.content_sell'),
				html = _self.getRangeHTML();
			if(node && node.length) {
				//TODO ����������sellManage.editAction = true,����ע���Ǳ༭��Ϊ
				sellManage.editAction = true;
				sellManage.editNode = node;
				var price = sellManage.sellData ? sellManage.sellData.price : node.data('price');
				var unit = sellManage.sellData ? sellManage.sellData.unit : node.data('unit');
				var text = sellManage.getText(node);
				sellManage.showPanel({
					price: price,
					unit: unit,
					text: text
				});
			}else {
				if(html && $.trim(html) !== '<P>&nbsp;</P>'){
					if(sellManage.sellData === null){
						sellManage.showPanel({
							text: html
						}, 0);
					}else{
						var node = sellManage.renderSell({
							price: sellManage.sellData.price,
							unit: sellManage.sellData.unit,
							text: html
						});
						_self.insertHTML(node);
					}
				}else{
					if(sellManage.sellData){
						sellManage.showPanel(sellManage.sellData);
					}else{
						sellManage.showPanel();
					}
				}
			}
		});
		//UBBת��
		var credit = window.EDIT_CONFIG.sell.credit;//����������Ϣ
		function wysiwyg() {
			var reg = /\[sell=(\d+)\,(\w+)\s*\]([\s\S]*?)\[\/sell\]/ig;
				html = $(editorDoc.body).html();
			html = html.replace(reg,function(all, $1, $2,$3) {
				var price_info = $1 + credit[$2];
				return '<div data-price="'+ $1 +'" data-unit="'+ $2 +'" class="content_sell"><a class="icon_delete J_sell_delete" href="#" title="ȡ�����ݳ���"></a><a class="icon_edit J_sell_edit" href="#" title="�༭��������"></a><h6>�������۵����� <span class="content_sell_price_info">(�ۼ�<span class="J_price_info">'+ price_info +'</span>)</span></h6>'+ $3 +'</div>';
			});
			$(editorDoc.body).html(html);
		}

		//���ز��ʱ��ubbת���ɿɼ�������
		$(_self).on('ready',function() {
			wysiwyg();
		});

		//�л��ɿɼ�������ģʽʱ���html
		$(_self).on('afterSetContent',function(event,html) {
			wysiwyg();
		});

		$(_self).on('beforeGetContent',function() {
			$(editorDoc.body).find('div.content_sell').each(function() {
				$(this).find('h6, .J_sell_edit, .J_sell_delete').remove();
				var price = $(this).data('price');
				var unit = $(this).data('unit');
				$(this).replaceWith('[sell='+ price +','+ unit +']'+ this.innerHTML +'[/sell]');
			});
		});

		//�ؼ�����ť�Ŀ���
    	$(_self.editorDoc.body).on('mousedown',function(e) {
    		if( $(e.target).closest('div.content_sell').length ) {
    			plugin_icon.removeClass('disabled').addClass('activate');
    		}else {
    			_self.enableToolbar();
    			plugin_icon.removeClass('activate');
    		}
    	});
    	//����������ı༭��ɾ������
    	$(_self.editorDoc.body).on('mouseenter.' + pluginName, '.content_sell', function(){
    		$(this).addClass("content_sell_cur");
    	});
    	$(_self.editorDoc.body).on('mouseleave.' + pluginName, '.content_sell', function(){
    		$(this).removeClass("content_sell_cur");
    	});
    	//�༭����
    	$(_self.editorDoc.body).on('mousedown', '.J_sell_edit', function(e){
    		e.preventDefault();
    		var target = $(e.target);
    		var node = target.closest('.content_sell');
    		sellManage.editAction = true;
    		sellManage.editNode = node;

    		var price = sellManage.sellData ? sellManage.sellData.price : node.data('price');
    		var unit = sellManage.sellData ? sellManage.sellData.unit : node.data('unit');
    		var text = sellManage.getText(node);
    		sellManage.showPanel({
    			price: price,
    			unit: unit,
    			text: text
    		});
    	});
    	//ȡ������
    	$(_self.editorDoc.body).on('mousedown', '.J_sell_delete', function(e){
    		e.preventDefault();
    		var target = $(e.target);
    		var wrap = target.closest('.content_sell');
    		var text = sellManage.getText(wrap);
    		Wind.dialog.confirm("ȡ�����۸����ݣ�", function(){
    			wrap.replaceWith(text);
    		})
    	});
	});


})( jQuery, window);
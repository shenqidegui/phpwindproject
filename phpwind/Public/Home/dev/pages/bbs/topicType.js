 /**
 * PHPWind util Library 
 * @Copyright Copyright 2012, phpwind.com
 * @Descript: ������൯�����
 * @Author	: wengqianshan@me.com
 * @Depend	: core.js��jquery.js(1.7 or later)
 * $Id: 
 */
/**
 * �����������js
 * fid	���id
 * url	�ӿ�
 * callback	�ص�
 */
;(function($, window){
	var ShowTopicPop = function(options){
		this.fid = options.fid;//���ID��������
		this.url = options.url;
		this.callback = options.callback;//�ص����ᴫ����ѡ�еķ�������
		this.tmpl = '<div class="pop_cont">\
						<div class="tac" id="J_topictype_pop">\
						</div>\
					</div>\
					<div class="pop_bottom">\
						<button type="button" class="btn btn_submit" id="J_btn_topictype_ok">�ύ</button>\
						<button type="button" class="btn" id="J_btn_topictype_cancel">ȡ��</button>\
					</div>';	
		this.wrap = null;//��������������
		this.data = null;//��������
	};
	ShowTopicPop.prototype = {
		init: function(){
			var _this = this;
			//����
			Wind.use('dialog', function(){
				_this.showDialog();
				_this.wrap = $("#J_topictype_pop");
				//��������
				_this.getData();
				//select��chang�¼�
				_this.wrap.on('change', 'select', function(){
					//select������ֵ
					var sIndex = $(this).data('index');
					var oIndex = $(this).find("option:selected").data('index');
					//�����ǰû��ѡ�񣬾�ɾ�������select
					if(oIndex === undefined){
						$(this).nextAll('select').remove();
						return;
					}
					var selects = _this.wrap.find('select');
					var len = selects.length;
					var dIndex = selects.index(this);
					//�Ƿ�Ҫ�½�select��ֻ�е�select�ĸ���С�ڵ��ڵ�ǰ������ֵ+1��ʱ�����Ҫ�´���
					var ifCreate = len <= (dIndex + 1);
					
					//��λ��ǰ����
					//console.log($(_this).data("data")[oIndex])
					if($(this).data("data") && $(this).data("data")[oIndex]){
						var currData = $(this).data("data")[oIndex].items;
						if(currData === undefined || currData.length < 1){
							$(this).nextAll('select').remove();
							return;
						}
						_this.showNext(currData, sIndex, ifCreate);
					}
				});
				//��ȷ����ť����¼�����ѡ�е����ݴ����������
				_this.wrap.parent().parent().on('click', '#J_btn_topictype_ok', function(e){
					var selects = _this.wrap.find('select');
					var data = [];
					var need = false;//��������Ƿ�ѡ�����
					selects.each(function(){
						var option = $(this).find("option:selected");
						if(option.text() === "��ѡ�����" && option.val() == 0){
							need = true;
						}
						data.push({
							name: option.text(),
							val: option.val()
						})
					})
					if(need === true){
						alert('��ѡ�����');
					}else{
						_this.callback(data);
						_this.hideDialog();
					}
				});
				_this.wrap.parent().parent().on('click', '#J_btn_topictype_cancel', function(e){
					_this.hideDialog();
				});
			});
		},
		//��ʾ����
		showDialog: function(){
			var _this = this;
			Wind.dialog.html(_this.tmpl, {
				type: 'html',
				width: 280,
				title: '��ѡ���������'
			});
		},
		//�رյ���
		hideDialog: function(){
			Wind.dialog.closeAll();
		},
		//��ȡ����
		getData: function(){
			var _this = this;
			$.post(this.url, {fid: this.fid}, function(data){
				var state = data.state;
				if(state === 'success'){
					var data = data.data;
					_this.data = data;
					_this.render(_this.data);
				}
			}, 'json');
		},
		//����һ��select
		render: function(data, index){
			this.wrap.append(this.createSelect(data, index));
		},
		//�������ݺ���������select�ڵ�
		createSelect: function(data, index){
			var index = index || 0;
			var select = $('<select data-index="'+index+'" style="margin:5px;"></select>');
			var select_0 = select[0];
			select.data('data', data);
			//ֻ�е�һ������ʾ��ѡ����� �²�:����!!�����Ҫ֧�����޼�����Ҫȥ������ж�
			if(index === 0){
				select_0.add(new Option('��ѡ�����', 0));
			}
			$(data).each(function(key){
				var option = new Option(this.title, this.val);
				//��option�������������¼�ʱ��
				$(option).data('index', key);
				if(this.selected){
					$(option).attr("selected", true);
				}
				select_0.add(option);
			});
			return select;
		},
		//��������
		showNext: function(data, index, ifCreate){
			if(!this.data){
				return false;
			}
			//��������½�select���ͰѺ����selectȫ��ɾ��
			if(!ifCreate){
				var select = this.wrap.find('select').eq(index);
				select.nextAll('select').remove();
			}
			this.render(data, index + 1)
			
		}
	};
	window.ShowTopicPop = ShowTopicPop;
})(jQuery, window);	
/**
 * PHPWind ui_libs Library
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: �����ʼ��Զ�ƥ��
 * @Author	: linhao87@gmail.com
 * @Depend	: core.js��jquery.js(1.7 or later)
 * $Id: emailAutoMatch.js 21812 2012-12-13 10:03:22Z hao.lin $
 */
 
;(function ($, window, document, undefined) {
	var pluginName = 'emailAutoMatch';
	var defaults = {
		 //δ����@ǰ������ƥ����
		emailDefaultArr : ['@aliyun.com', '@qq.com', '@163.com', '@yahoo.com.cn', '@hotmail.com', '@gmail.com'],
		
		//����@��ȫ��ƥ����
		emailAllArr : ['qq.com', '163.com', 'yahoo.com.cn', 'hotmail.com', 'gmail.com', 'yahoo.com', 'yahoo.cn', '126.com', 'yeah.com', 'live.com', 'aliyun.com'],
		
		//�б�����
		listWrapper : '#J_email_list'
	};
	
	var list_wrapper = $('<div style="position:absolute;background:#fff;z-index:10;" class="mail_down" id="J_email_list"></div>');
	
	function Plugin(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);
		this.emailDefault = this.options.emailDefaultArr;
		this.emailAll = this.options.emailAllArr;
		this.init();
	}
	
	Plugin.prototype = {
		init : function () {
			var _this = this,
				element = _this.element,
				options = _this.options,
				wrapper = $(_this.options.listWrapper),
				current_index;

			element.attr('autocomplete', 'off');
			
			//ƥ����hover״̬
			wrapper.on('mouseenter', 'li', function(){
				$(this).addClass('current');
			}).on('mouseleave', 'li', function(){
				$(this).removeClass('current');
			});
			
			
			//���ƥ����
			wrapper.on('click', 'a', function(e){
				e.preventDefault();
				element.val($(this).text());
			});
			
			
			element.on('focus click', function () {
				//����۽�����ʾ��ƥ���б�
				if(list_wrapper.children() && !list_wrapper.is(':visible') && $.trim(element.val()).length >= 2) {
					list_wrapper.show();
					_this.wrapPos(list_wrapper, element);
				}
			})
			.on('keyup', function (e) {
				//��������
			
				var v = $.trim(element.val()); //����ֵ
				
				//���������ַ�
				if (v.length < 2) {
					list_wrapper.hide();
					return;
				}
				
				//��������
				if(RegExp(/[^\x00-\xff]/).test(v)) {
					list_wrapper.hide();
					return;
				}
				
				//����@���ų��ִ���
				var k = 0;
				$.each(v, function (i, o) {
					if (o === '@') {
						k++;
					}
				});
				
				//@���ų������μ����� ��ƥ��
				if (k >= 2) {
					list_wrapper.hide();
					return;
				}

				
				var item_length = list_wrapper.find('ul > li').length; //ƥ���������
					current_index = list_wrapper.find('li.current').data('index'); //current���indexֵ
				
				if (e.keyCode === 38) {
					//��������
					
					if(!current_index || current_index <= 1) {
						//û��ѡ����
						current_index = item_length;
					}else{
						//��ѡ����
						current_index--;
					}
					
				}else if(e.keyCode === 40){
					//��������
					
					if(!current_index || current_index >= item_length) {
						current_index = 1;
					}else{
						current_index++;
					}
					
				}else{
					var li_arr = [];
					
					if (!/@/.test(v) || /@$/.test(v)) {
						//��û����@�������@
						
						$.each(_this.emailDefault, function (i, o) {
							li_arr.push('<li id="J_match_'+ (i+1) +'" data-index="'+ (i+1) +'"><a href="#">' + v.replace(/@/, '') + o + '</a></li>');
						});
						
					} else {
						//����@��
						
						var atText = /@.*/.exec(v), //�����@�����Ժ�����ݣ�����@
							reg = atText[0].toLowerCase().replace(/@/, ''); //�滻@����ı�
						
						
						var j = 0;
						
						//ѭ��ƥ�������׺
						$.each(_this.emailAll, function (i, o) {
						
							if (RegExp('^'+ reg).test(o)) {
								//ƥ�����
								j++;
								li_arr.push('<li id="J_match_'+ Number(j) +'" data-index="'+ Number(j) +'"><a href="#">' + /.*@/.exec(v) + o + '</a></li>');
							}
							
						});
						
					}
					
					
					//��ƥ��������ʾ�б�
					if (li_arr.length) {
						list_wrapper.html('<ul>' + li_arr.join('') + '</ul>').appendTo('body').show();
						list_wrapper.on('click', 'a', function(e){
							e.preventDefault();
							element.val($(this).text());
						});
						_this.wrapPos(list_wrapper, element);
					} else {
						list_wrapper.remove();
					}
				}
				
				//���¼��ƶ�ѡ����
				if(current_index) {
					$('#J_match_' +current_index).addClass('current').siblings().removeClass('current');
				}
				
			})
			.on('keypress', function(e){
				//���س�����current��
				if(e.keyCode === 13 && current_index) {
					e.preventDefault();
					element.val($('#J_match_' +current_index).text());
					element.blur();
				}
			})
			.on('blur', function(){
				setTimeout(function(){
					list_wrapper.hide();
				}, 150);
			});

			//���������б���ֹ��λ����
			$(document).on('scroll', function(){
				if(list_wrapper.is(':visible')) {
					list_wrapper.hide();
				}
			});
			
		},
		wrapPos : function(wrap, elem){
			wrap.css({
				left : elem.offset().left,
				top : elem.offset().top + elem.innerHeight() +2,
				width : elem.innerWidth() + 2
			});
		}
		
	};
	
	
	$.fn[pluginName] = Wind[pluginName] = function (options) {
		return this.each(function () {
			new Plugin($(this), options);
		});
	};
	
})(jQuery, window, document);

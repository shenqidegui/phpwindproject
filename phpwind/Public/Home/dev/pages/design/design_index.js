/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-ҳ�����
 * @Author	: linhao87@gmail.com
 * @Depend	: jquery(1.8), global, draggable, ajaxForm
 * $Id: message_index.js 5804 2012-03-12 08:58:35Z hao.lin $
 */

;(function(){

	//��ʼ����
	var designUtil = {},
		mod_wrap = $('div.J_mod_wrap'),
		layout_edit = $('#J_layout_edit'),
		mode_edit = $('#J_mode_edit'),
		mode_edit_tit = $('#J_mode_edit_tit'),
		mode_edit_btn = $('#J_mode_edit_btn'),
		mod_tit_edit = $('#J_mod_tit_edit'),
		design_move_temp = $('#J_design_move_temp'),									//�ƶ�ģ��
		move_lock = true,																							//�ƶ�����
		layout_id,
		structure,
		layout_sample = $('#J_layout_sample'),
		layout_a = $('#J_layout_sample a'),
		module_a = $('#J_tab_type_ct a'),
		module_url = null,																						//ģ�������ַ
		mudule_box,
		moduleid = '',
		title_clone = '',										//����html_���
		menu_pop = $('div.J_menu_pop'),						//�˵�����
		doc = $(document),
		$body = $('body'),
		design_zindex = 100000;											//�����ͳһzֵ

	var layout_edit_pop = $('#J_layout_edit_pop'),											//����
		layout_edit_nav = $('#J_layout_edit_nav'),											//��������
		layout_edit_contents = $('#J_layout_edit_contents');						//��������
		design_name = $('#J_design_name'),															//������
		design_del = $('#J_design_del');																//ɾ��

	var moduleid_input = $('#J_moduleid'),						//ֵͬmoduleid ���ڵ���ҳ���ڵ�js��ȡ
		uniqueid = $('#J_uniqueid').val(),
		pageid = $('#J_pageid').val(),
		dtype = $('#J_type').val(),
		uri = $('#J_uri').val();

	var tabnav_data = $('#J_tabnav_data');

	var tabct_data = $('#J_tabct_data'),
		tabct_push = $('#J_tabct_push');			//����tab content

	var layout_temp = {
		//�ṹhtml
		'100' : '<div role="structure__ID" data-lcm="100" class="box_wrap design_layout_style J_mod_layout" style="display:none;">\
			<h2 role="titlebar" class="design_layout_hd cc J_layout_hd"><span>100%</span></h2>\
			<div class="design_layout_ct J_layout_item"></div></div>',
		'1_1' : '<div role="structure__ID" data-lcm="1_1" class="box_wrap design_layout_style J_mod_layout design_layout_1_1" style="display:none;">\
			<h2 role="titlebar" class="design_layout_hd cc J_layout_hd"><span>1:1</span></h2>\
			<div class="design_layout_ct"><div class="design_layout_1_1_left J_layout_item"></div><div class="design_layout_1_1_right J_layout_item"></div></div></div>',
		'1_2' : '<div role="structure__ID" data-lcm="1_2" class="box_wrap design_layout_style J_mod_layout design_layout_1_2" style="display:none;">\
			<h2 role="titlebar" class="design_layout_hd cc J_layout_hd"><span>1:2</span></h2>\
			<div class="design_layout_ct"><div class="design_layout_1_2_left J_layout_item"></div><div class="design_layout_1_2_right J_layout_item"></div></div></div>',
		'2_1' : '<div role="structure__ID" data-lcm="2_1" class="box_wrap design_layout_style J_mod_layout design_layout_2_1" style="display:none;">\
			<h2 role="titlebar" class="design_layout_hd cc J_layout_hd"><span>2:1</span></h2>\
			<div class="design_layout_ct"><div class="design_layout_2_1_left J_layout_item"></div><div class="design_layout_2_1_right J_layout_item"></div></div></div>',
		'1_3' : '<div role="structure__ID" data-lcm="1_3" class="box_wrap design_layout_style J_mod_layout design_layout_1_3" style="display:none;">\
			<h2 role="titlebar" class="design_layout_hd cc J_layout_hd"><span>1:3</span></h2>\
			<div class="design_layout_ct"><div class="design_layout_1_3_left J_layout_item"></div><div class="design_layout_1_3_right J_layout_item"></div></div></div>',
		'3_1' : '<div role="structure__ID" data-lcm="3_1" class="box_wrap design_layout_style J_mod_layout design_layout_3_1" style="display:none;">\
			<h2 role="titlebar" class="design_layout_hd cc J_layout_hd"><span>3:1</span></h2>\
			<div class="design_layout_ct"><div class="design_layout_3_1_left J_layout_item"></div><div class="design_layout_3_1_right J_layout_item"></div></div></div>',
		'2_3' : '<div role="structure__ID" data-lcm="2_3" class="box_wrap design_layout_style J_mod_layout design_layout_2_3" style="display:none;">\
			<h2 role="titlebar" class="design_layout_hd cc J_layout_hd"><span>2:3</span></h2>\
			<div class="design_layout_ct"><div class="design_layout_2_3_left J_layout_item"></div><div class="design_layout_2_3_right J_layout_item"></div></div></div>',
		'3_2' : '<div role="structure__ID" data-lcm="3_2" class="box_wrap design_layout_style J_mod_layout design_layout_3_2" style="display:none;">\
			<h2 role="titlebar" class="design_layout_hd cc J_layout_hd"><span>3:2</span></h2>\
			<div class="design_layout_ct"><div class="design_layout_3_2_left J_layout_item"></div><div class="design_layout_3_2_right J_layout_item"></div></div></div>',
		'1_1_1' : '<div role="structure__ID" data-lcm="1_1_1" class="box_wrap design_layout_style J_mod_layout design_layout_1_1_1" style="display:none;">\
			<h2 role="titlebar" class="design_layout_hd cc J_layout_hd"><span>1:1:1</span></h2>\
			<div class="design_layout_ct"><div class="design_layout_1_1_1_left J_layout_item"></div><div class="design_layout_1_1_1_cont J_layout_item"></div><div class="design_layout_1_1_1_right J_layout_item"></div></div></div>',
		'1_1_1_1' : '<div role="structure__ID" data-lcm="1_1_1_1" class="box_wrap design_layout_style J_mod_layout design_layout_1111" style="display:none;">\
			<h2 role="titlebar" class="design_layout_hd cc J_layout_hd"><span>1:1:1:1</span></h2>\
			<div class="design_layout_ct"><div class="design_layout_1111_left J_layout_item"></div><div class="design_layout_1111_left J_layout_item"></div><div class="design_layout_1111_right J_layout_item"></div><div class="design_layout_1111_right J_layout_item"></div></div></div>',
		'2_3_3' : '<div role="structure__ID" data-lcm="2_3_3" class="box_wrap design_layout_style J_mod_layout design_layout_233" style="display:none;">\
			<h2 role="titlebar" class="design_layout_hd cc J_layout_hd"><span>2:3:3</span></h2>\
			<div class="design_layout_ct"><div class="design_layout_233_left J_layout_item"></div><div class="design_layout_233_cont J_layout_item"></div><div class="design_layout_233_right J_layout_item"></div></div></div>',
		'3_3_2' : '<div role="structure__ID" data-lcm="3_3_2" class="box_wrap design_layout_style J_mod_layout design_layout_332" style="display:none;">\
			<h2 role="titlebar" class="design_layout_hd cc J_layout_hd"><span>3:3:2</span></h2>\
			<div class="design_layout_ct"><div class="design_layout_332_left J_layout_item"></div><div class="design_layout_332_cont J_layout_item"></div><div class="design_layout_332_right J_layout_item"></div></div></div>',
		'1_4_3' : '<div role="structure__ID" data-lcm="1_4_3" class="box_wrap design_layout_style J_mod_layout design_layout_143" style="display:none;">\
			<h2 role="titlebar" class="design_layout_hd cc J_layout_hd"><span>1:4:3</span></h2>\
			<div class="design_layout_ct"><div class="design_layout_143_left J_layout_item"></div><div class="design_layout_143_cont J_layout_item"></div><div class="design_layout_143_right J_layout_item"></div></div></div>',
		'3_4_1' : '<div role="structure__ID" data-lcm="3_4_1" class="box_wrap design_layout_style J_mod_layout design_layout_341" style="display:none;">\
			<h2 role="titlebar" class="design_layout_hd cc J_layout_hd"><span>3:4:1</span></h2>\
			<div class="design_layout_ct"><div class="design_layout_341_left J_layout_item"></div><div class="design_layout_341_cont J_layout_item"></div><div class="design_layout_341_right J_layout_item"></div></div></div>',
		'tab' : '<div role="structure__ID" data-lcm="tab" class="box_wrap design_layout_style J_mod_layout J_tab_wrap" style="display:none;">\
			<div role="titlebar" class="design_layout_hd design_layout_tab cc J_layout_hd"><ul class="J_tabs_nav">\
				<li class="current"><a href="" data-id="tab_1">��Ŀ1</a></li><li><a href="" data-id="tab_2">��Ŀ2</a></li>\
			</ul></div>\
			<div class="J_tabs_ct"><div class="design_layout_ct J_tabct_tab_1 J_layout_item" tabid="tab_1"></div>\
			<div class="design_layout_ct J_tabct_tab_2 J_layout_item" tabid="tab_2" style="display:none;"></div></div></div>'
	},
	insert_holder = $('<div id="J_insert_holder" class="insert_holder"></div>'),		//����λ����ʾ��
	layout_class_mapping = {
		//�ṹĬ��classӳ��
		'100' : 'design_layout_style J_mod_layout',
		'1_1' : 'design_layout_style J_mod_layout design_layout_1_1',
		'1_2' : 'design_layout_style J_mod_layout design_layout_1_2',
		'2_1' : 'design_layout_style J_mod_layout design_layout_2_1',
		'1_3' : 'design_layout_style J_mod_layout design_layout_1_3',
		'3_1' : 'design_layout_style J_mod_layout design_layout_3_1',
		'2_3' : 'design_layout_style J_mod_layout design_layout_2_3',
		'3_2' : 'design_layout_style J_mod_layout design_layout_3_2',
		'1_1_1' : 'design_layout_style J_mod_layout design_layout_1_1_1',
		'1_1_1_1' : 'design_layout_style J_mod_layout design_layout_1111',
		'2_3_3' : 'design_layout_style J_mod_layout design_layout_233',
		'3_3_2' : 'design_layout_style J_mod_layout design_layout_332',
		'1_4_3' : 'design_layout_style J_mod_layout design_layout_143',
		'3_4_1' : 'design_layout_style J_mod_layout design_layout_341',
		'tab' : 'design_layout_style J_mod_layout J_tab_wrap'
	},
	//ģ���ʹ��classӳ��
	module_class_mapping = 'mod_boxA mod_boxB mod_boxC mod_boxD mod_boxE mod_boxF mod_boxG mod_boxH mod_boxI';

	//�뿪ҳ����ʾ
	window.onbeforeunload = function() {
		return '��ȷ��Ҫ�˳�ҳ�����״̬��ȷ���˳������޸ĵ����ݽ����ᱣ�档';
	};

	designUtil = {
		commonFn : function (){
			//�����ڹ�������&���

			//ʰɫ��
			var color_pick = $('.J_color_pick');
			if(color_pick.length) {
				Wind.use('colorPicker', function() {
					color_pick.each(function() {
						var bg_elem = $(this).find('.J_bg');

						$(this).colorPicker({
							zIndex : design_zindex,
							default_color : 'url("'+ GV.URL.IMAGE_RES +'/transparent.png")',
							callback:function(color) {
								bg_elem.css('background',color);
								$(this).next('.J_hidden_color').val(color.length === 7 ? color : '');
							}
						});
					});
				});
			}

			//����
			var design_date = $('input.J_design_date');
			if(design_date.length) {
				Wind.use('datePicker',function() {
					design_date.each(function(){
						$(this).datePicker({
							time : true
						});
					});

					$('#calroot').css('zIndex', design_zindex);
				});

			}

			//��������
			if($('.J_design_font_config').length) {
				Wind.use('colorPicker', function() {
					$('.J_design_font_config').each(function() {
						var elem = $(this).find('.J_design_color_pick');
						var panel = elem.parent('.J_design_font_config');
						var bg_elem = $(this).find('.J_bg');

						elem.colorPicker({
							zIndex : design_zindex,
							default_color : 'url("'+ GV.URL.IMAGE_RES +'/transparent.png")',
							callback:function(color) {
								bg_elem.css('background',color);

								var v = ( color.length === 7 ? color : '' );
								panel.find('.J_case').css('color', v);
								panel.find('.J_hidden_color').val(v);
							}
						});
					});

					//�Ӵ֡�б�塢�»��ߵĴ���
					$('.J_bold,.J_italic,.J_underline').on('click',function() {
						var panel = $(this).parents('.J_design_font_config');
						var c = $(this).data('class');
						if( $(this).prop('checked') ) {
							panel.find('.J_case').addClass(c);
						}else {
							panel.find('.J_case').removeClass(c);
						}
					});

				});
			}

			//ȫѡ
			var design_check_all = $('input.J_design_check_all');
			if(design_check_all.length) {
				var check_wrap = design_check_all.parents('table'),
						checks = check_wrap.find('input.J_design_check');
				//���ȫѡ
				design_check_all.off('change').on('change', function(){
					if(this.checked) {
						checks.prop('checked', true);
					}else{
						checks.prop('checked', false);
					}
				});

				//�������
				checks.on('change', function(){
					if(this.checked) {
						if(checks.filter(':checked').length == checks.length) {
							design_check_all.prop('checked', true);
						}
					}else{
						design_check_all.prop('checked', false);
					}
				});
			}

			//�������
			if($('a.J_region_change').length) {
				Wind.use('region', function(){
					$('a.J_region_change').region({
						zindex : design_zindex,
						regioncancl : true
					});
				});
			}

			//ͼƬԤ��
			var input_prev = layout_edit_pop.find('input.J_upload_preview');
			if(input_prev.length) {
				Wind.use('uploadPreview',function() {
					input_prev.uploadPreview();
				});
			}

		},
		eachModCoreY : function(wrap){
			//ѭ���ṹģ�����ĵ�Y����
			var childs = wrap.children('.J_mod_box, .J_mod_layout'),
				arr = [];

			childs.each(function(i, o){
				var off_top = $(this).offset().top,
					y_core = off_top + $(this).height()/2;
				arr.push(y_core);
			});

			wrap.data('ycore', arr);
		},
		insertJudge : function(elem, top){
			//ģ�����λ���ж�
			var _this = this;

			if(elem.find('.J_mod_box, .J_mod_layout').length) {
				var _ycore = elem.data('ycore'),								//��ǰ����ṹ����
					insert_wrap = elem,
					minus_arr = [],
					child_index;

				if(!_ycore) {
					return;
				}

				var selecter = '.J_mod_box, .J_mod_layout';
				//��ȡ���ĵ��ֵ
				for(i=0,len=_ycore.length; i<len; i++) {
					minus_arr.push(Math.abs(top-_ycore[i]));
				}
				//��ȡ��Сֵ����
				var mini = Math.min.apply(null, minus_arr);	//��Сֵ
				for(i=0,len=minus_arr.length; i<len; i++) {
					if(minus_arr[i] == mini){
						child_index = i;
						break;
					}
				}

				var taget_el = elem.children(selecter).eq(child_index);

				if(top > _ycore[child_index]) {
					insert_holder.insertAfter(taget_el);
				}else{
					insert_holder.insertBefore(taget_el);
				}
			}else{
				elem.append(insert_holder);
			}

			//���¼�������ṹ����
			_this.eachModCoreY(elem);
		},
		layoutFormSub : function (content, role){
			//�ṹ�����ύ
			var _this = this;

			//form��ӱ�ʶ
			content.children('form').attr('data-role', role);

			//�ύ
			$('form.J_design_layout_form').ajaxForm({
				dataType : 'json',
				data : {
					structure : structure ? structure : ''
				},
				beforeSubmit : function(){
					//global.js
					Wind.Util.ajaxBtnDisable(_this.getPopBtn());
				},
				success : function(data, statusText, xhr, $form){
					if(data.state == 'success') {
						var btn = _this.getPopBtn();
						//global.js
						Wind.Util.ajaxBtnEnable(btn);

						_this.popHide();
						Wind.Util.resultTip({
							msg : '�����ɹ�',
							zIndex : design_zindex
						});

						//�ύ��tab��������
						layout_edit_nav.find('a').data('load', false);
						layout_edit_contents.children(':not(:visible)').html('<div class="pop_loading"></div>');

						var layout = $('#'+ layout_id),																		//�༭�Ľṹ
							role = $form.data('role');																		//�༭�������ɫ

						if(role == 'layouttitle') {
							//д�����
							var layout_hd = layout.children('.design_layout_hd, J_layout_hd'),
								tit = data['html']['tab'];

							layout_hd.attr('style', data['html']['background']);

							if(structure == 'tab') {
								layout_hd.find('ul').html(tit);
								var tab_ct_child = layout.find('.J_tabs_ct').children();
								tab_ct_child.hide();

								//ƥ��tab
								_this.layoutTabMatch(layout);

							}else{
								if(tit) {
									layout_hd.show().html(tit);
								}else{
									//���ر���
									layout_hd.hide();
								}

							}
						}else if(role == 'layoutstyle') {
							//д����ʽ
							var prev_style = layout.prev('style'),
									layout_style = '<style type="text/css" class="_tmp">#'+ data.html.styleDomId[0] +'{'+ data.html.styleDomId[1] +'}#'+ data.html.styleDomId[0] +' a{'+ data.html.styleDomIdLink[1] +'}</style>';
							if(prev_style.length) {
								//����style��ǩ
								prev_style.replaceWith(layout_style);
							}else{
								layout.before(layout_style);
							}

							if(data.html.styleDomClass) {
								//д��class
								layout.attr('class', layout_class_mapping[layout.data('lcm')]+' '+data.html.styleDomClass);
							}

						}

					}else if(data.state == 'fail') {
						Wind.Util.formBtnTips({
							error : true,
							msg : data.message,
							wrap : btn.parent()
						});
					}

				}
			});

		},
		layoutMoveReset : function(layout_move){
			//���ýṹ
			layout_move.removeAttr('style').attr({
				'id' : layout_move.data('randomid'),
				'style' : layout_move.data('orgstyle')		//�ָ���ʽ
			});
		},
		layoutTabMatch : function(layout) {
			//tab�ṹ��������ƥ��
			try{
				var hd = layout.children('.design_layout_hd, J_layout_hd').children('ul'),
					hd_a = hd.find('a'),
					ct = layout.find('.J_tabs_ct'),
					ct_child = layout.find('.J_tabs_ct').children();

				//����������ڵ�����
				ct.children().each(function(){
					var ct_tabid = $(this).attr('tabid');

					if(!hd.find('a[data-id='+ ct_tabid +']').length) {
						//�����ڶ�Ӧ��tab��
						$(this).remove();
					}
				});
				
				for(i=0,len=hd_a.length;i<len;i++) {
					var $this = $(hd_a[i]),
						tab_id = $this.data('id'),
						tab_index = $this.parents('li').index(),
						ct_child_item = ct_child.filter(':eq('+ tab_index +')');

					if(ct_child_item.attr('tabid') !== tab_id) {
						//��ƥ�� ɾ��������ƥ��
						ct.append('<div style="display:none;" class="design_layout_ct J_layout_item" tabid="'+ tab_id +'"></div>');
					}
				};

				//���°�tab���
				hd.removeData('plugin_tabs');
				layout.find('.J_tabs_nav').first().tabs(layout.find('div.J_tabs_ct').first().children('div'));

			}catch(e){
				$.error(e);
			}

		},
		layoutTitEditPos : function (elem, tar){
			//�ṹ&����༭�� ��λ��ʾ
			var lcm = tar.data('lcm');
			if(lcm == 'tab') {
				elem.data('structure', 'tab');
			}else{
				elem.data('structure', '');
			}

			elem.css({
				left : tar.offset().left + tar.outerWidth() - elem.width(),
				top : tar.offset().top
			}).data('id', tar.attr('id')).show();

		},
		moveTemp : function(move_elem, left, top){
			var _this = this;
			//�ƶ�ģ��ṹ

			//��ȡ�ƶ����ĵ�Ԫ��
			var elem_point = document.elementFromPoint(left, top - $(document).scrollTop());
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

			var $elem_point = $(elem_point),
				wrap_parent = $elem_point.parents('.J_mod_wrap');

			if($elem_point.hasClass('insert_holder')) {
				return;
			}

			if($elem_point.hasClass('J_mod_wrap')) {

				if(!module_url) {
					//�ƶ��ṹ
					_this.insertJudge($elem_point, top);
				}else{
					//�ƶ�ģ��
					if(!$elem_point.find('div.J_mod_layout').length) {
						//�ṹΪ��
						return;
					}
				}

			}else if(wrap_parent.length){


				var item_parent = $elem_point.parents('.J_layout_item').first(),
					lay_parent = $elem_point.parents('.J_mod_layout').first();

				if($elem_point.hasClass('J_layout_item')) {
					//�������J_layout_item��

					if(module_url){
						//�ƶ�ģ����Ϊ��
						if(!$elem_point.children('.J_mod_box, .J_mod_layout').length) {
							_this.insertJudge($elem_point, top);
						}

					}else{
						var parents_mod_layout_len = $elem_point.parentsUntil('div.J_mod_wrap').filter('.J_mod_layout').length,	//���е�J_mod_layout����
								move_mod_layout_len = move_elem.find('.J_mod_layout').length;																				//�ƶ�ģ�����J_mod_layout����
						if(parents_mod_layout_len < 2 && move_mod_layout_len < 1){
							//�����С��2����û��ģ������

							//λ���ж�
							_this.insertJudge($elem_point, top);

							//���¼�������ṹ����
							//eachModLayout($elem_point.parents('div.J_mod_wrap'));
						}else{
							//����2�� ��λ���ϲ�
							var par_item = $elem_point.parents('.J_layout_item');
							if(par_item.parentsUntil('div.J_mod_wrap').filter('.J_mod_layout').length < 2) {
								_this.insertJudge(par_item, top);
							}
						}
					}
					return;
				}else if(item_parent.length){
					if(!module_url){
						var _len = $elem_point.parentsUntil('div.J_mod_wrap').filter('.J_mod_layout').length;
						if(_len >= 2) {
							return;
						}
					}
					_this.insertJudge(item_parent, top);
					return;
				}else{
					if(!module_url){
						if(!$elem_point.hasClass('insert_holder')) {
							_this.insertJudge($elem_point.parents('.J_mod_wrap'), top);
						}
					}
				}

			}else{
				var _mod_wrap = insert_holder.parents('.J_mod_wrap');	//���Ƴ����Զ�������

				//�������
				insert_holder.remove();
			}
		},
		popHide : function(type){
			//���ص������ָ�����Ϊloading

			layout_edit_pop.hide();

			if(type == 'loading') {
				layout_edit_contents.children().html('<div class="pop_loading"></div>');
			}else if(type == 'error') {
				Wind.Util.resultTip({
					error : true,
					msg : '�ύ�������Ժ�ˢ������'
				});
			}
			
			this.popTabReset();
		},
		popTabReset : function(){
			//��������

			//�����ΪloadingЧ��
			layout_edit_contents.children().html('<div class="pop_loading"></div>');

			//tab����ѵ����ʶ
			layout_edit_nav.find('a').data('load', false);
		},
		updatePopList : function(btn, updatemod, hidepop){
			//���µ����б�����
			var _this = this;
			if(btn) {
				Wind.Util.ajaxBtnDisable(btn);
			}


			try{
				$.post(layout_edit_nav.children('.current').children().attr('href'), {
					moduleid : moduleid,
					pageid:pageid
				}, function(data){
					//global.js
					Wind.Util.ajaxMaskRemove();

					if(btn) {
						Wind.Util.ajaxBtnEnable(btn);
					}

					if(Wind.Util.ajaxTempError(data)) {
						return false;
					}
					//�����б�
					var current_content = layout_edit_contents.children(':visible');
					current_content.html(data);

					if(btn) {
						Wind.Util.formBtnTips({
							wrap : btn.parent(),
							msg : '�����ɹ�'
						});
					}

					//current_content.find('.J_scroll_fixed').scrollFixed();
					_this.commonFn();

					//�Ƿ����ģ��
					if(updatemod && mudule_box.children(':not(.J_mod_layout)').length) {
						updateModuleList(moduleid, mudule_box, hidepop);
					}
				});
			}catch(e){
				$.error(e);
			}
		},
		getPopBtn : function(){
			//��ȡ�����ύ��ť
			return layout_edit_contents.children(':visible').find('button:submit');
		}
	};

	$.ajaxSetup({
		error : function(jqXHR, textStatus, errorThrown){
			if(errorThrown) {
				Wind.Util.ajaxMaskRemove();
				designUtil.popHide('error');
			}
		}
	})

	//���б༭ģ�� ѭ���ṹ����
	var mod_wrap_len = mod_wrap.length;
	var J_mod_layout = $('.J_mod_layout');
	for(i=0,len=J_mod_layout.length;i<len;i++){
		designUtil.eachModCoreY($(J_mod_layout[i]).parent());

	}

	//���б༭ģ�� ѭ��ģ������
	var saved_layout_items = $('.J_layout_item');
	for(i=0, len=saved_layout_items.length;i<len;i++){
		var item = $(saved_layout_items[i]);
		if(item.find('.J_mod_box').length){
			designUtil.eachModCoreY(item);
		}
	}

	//��ֹ����Ԫ�ر���ק
	$('#J_layout_sample a, #J_tab_type_ct a').each(function(){
		this.ondragstart = function (e) {
			return false;
		};
	});

	//ie ��ֹ�����뿪ҳ����ʾ
	$('#J_design_top_ct a').on('click', function(e){
		e.preventDefault();
	});

	//ȥ��ê��
	if(location.hash) {
		location.hash = '';
	}

	Wind.use('tabs', function(){
		$('#J_design_top_nav').tabs($('#J_design_top_ct > div'));
		$('#J_tab_type_nav').tabs($('#J_tab_type_ct > div'));
		layout_edit_nav.tabs(layout_edit_contents.children('div'));
	});




//����

	//����ṹ��
	var leftx,topx;
	layout_a.on('mousedown', function(e) {

		//����
		move_lock = false;

		module_url = undefined;

		//��ʾ�ƶ�ģ��
		design_move_temp.show().css({
			left : e.pageX - 20,
			top : e.pageY - 20
		}).data('name', $(this).data('name'));

		//��ֹ����ѡ�������϶�
		layout_sample.css({
			'overflowY': 'hidden'
		});

		$body.addClass('move');

		//����϶�
		doc.off('mousemove').on('mousemove', function(e){
			if(!move_lock) {
				leftx = e.pageX,
				topx = e.pageY;

				//ģ�嶨λ
				design_move_temp.show().css({
					left : leftx + 5,	//+5���� ��ֹpoint��λ���϶���
					top : topx + 5
				});

				designUtil.moveTemp(design_move_temp, leftx, topx);

			}
		});

	});


	//���ģ��
	var model;
	module_a.on('mousedown', function(e){
		//�ж��Ƿ��нṹ
		if(!$('div.J_mod_layout').length) {
			$body.removeClass('move');
			Wind.Util.resultTip({
				error : true,
				msg : 'ѡ��ṹ���������ģ�飬����ѡ��ṹ',
				zindex : design_zindex
			});
			return false;
		}

		module_url = this.href;
		model = this.id;
		//����
		move_lock = false;

		//��ʾ�ƶ�ģ��
		design_move_temp.show().css({
			left : e.pageX - 20,
			top : e.pageY - 20
		});
		$body.addClass('move');

		//����϶�
		doc.off('mousemove').on('mousemove', function(e){
			if(!move_lock) {
				leftx = e.pageX,
				topx = e.pageY;

				//ģ�嶨λ
				design_move_temp.show().css({
					left : leftx + 5,
					top : topx + 5
				});

				designUtil.moveTemp(design_move_temp, leftx, topx);

			}
		});

	}).on('click', function(e){
		e.preventDefault();
	});

	//����ģ�� ����
	$('a.J_nav_import').on('click', function(e){
		e.preventDefault();

		if(confirm('�����Ḳ��֮ǰ��ҳ�����ݣ������ؿ��ǣ�')) {
			Wind.Util.ajaxMaskShow(design_zindex);
			$.post(this.href, function(data){
				if(data.state == 'success') {
					window.onbeforeunload = null;
					Wind.Util.reloadPage(window);
				}else if(data.state == 'fail'){
					Wind.Util.resultTip({
						error : true,
						msg : data.message
					});
				}
			}, 'json');
		}
	});


	//���̧�� ȡ���ƶ�; iframe���޷���ȡ
	doc.on('mouseup', function(e){
		move_lock = true;
		$body.removeClass('move');

		doc.off('mousemove');

		layout_sample.css({
			'overflowY': 'auto'
		});

		var wrap = $('#J_insert_holder').parent(),
				insert_holder_visible = $('#J_insert_holder:visible'),
				layout_move = $('#J_layout_move');												//���еĽṹ

		if(insert_holder_visible.length) {
			//��ռλģ��
			$('#J_mod_box').remove();

			if(layout_move.length) {
				//�ƶ����нṹ
				layout_move.attr({
					'id' : layout_move.data('randomid'),
					'style' : layout_move.data('orgstyle')		//�ָ���ʽ
				});
				layout_move.hide().insertAfter(insert_holder_visible).fadeIn('200');
				insert_holder_visible.remove();

				//eachModLayout();
				//eachModCoreY(layout_move.parent())
			}else{
				if(module_url) {
					//����ģ��
					layout_item = insert_holder.parent('.J_layout_item');

					//��������ģ����
					insert_holder_visible.after('<div id="J_mod_box" style="display:none;"></div>')

					try{
						$.post(MODULE_ADD_TAB, {
							model : model,
							pageid : pageid
						}, function(data){
							if(data.state == 'success') {
								menu_pop.hide();

								design_name.text('ģ�����');
								design_del.text('ɾ����ģ��').data('role', 'module');

								design_del.hide();
								//global.js
								Wind.Util.popPos(layout_edit_pop);

								layout_edit_nav.children().hide();
								var _data = data.data,
									nav_temp = false;
								for(i=0,len=_data.length; i<len; i++) {
									if(_data[i] == 'template') {
										nav_temp = true;
										break;
									}
								}

								getModule(layout_item, model, nav_temp);
							}else if(data.state == 'fail') {
								Wind.Util.resultTip({
									error : true,
									zindex : design_zindex,
									msg : data.message
								});
							}

							module_url = null;
						}, 'json');
					}catch(e){
						$.error(e);
						designUtil.popHide('error');
					}

					insert_holder.remove();

				}else{
					//�����½ṹ
					var randomid = randomSix(),
							name = design_move_temp.data('name');
					$(layout_temp[name].replace(/_ID/, randomid)).insertAfter(insert_holder).fadeIn('200').attr('id', randomid);
					insert_holder_visible.remove();

					if(name == 'tab') {
						var $randomid = $('#'+ randomid);
						$randomid.find('.J_tabs_nav').first().tabs($randomid.find('div.J_tabs_ct').first().children('div'));
					}

				}

			}

		}else{
			//�ָ�ԭ�ṹλ��
			designUtil.layoutMoveReset(layout_move);
		}

		//������ק
		design_move_temp.hide();

	}).on('keyup', function(e){
		//��esc
		if(e.keyCode === 27) {
			var layout_move = $('#J_layout_move');

			//��������ק�ṹ
			if(layout_move.length) {
				designUtil.layoutMoveReset(layout_move);
			}

			//���ÿյ���ק��
			if(!move_lock) {
				design_move_temp.hide();
				insert_holder.remove();
			}

			if(layout_edit_pop.is(':visible')) {
				//�رյ���
				designUtil.popHide('loading')
			}
		}

	});

	//����6λ�����ĸ
	function randomSix(){
		var cha = '';
		for(i=1;i<=6;i++){
			cha += String.fromCharCode(Math.floor( Math.random() * 26) + "a".charCodeAt(0));
		}
		return cha;
	}

	//��ȡģ��
	function getModule(layout_item, model, nav_temp){
		var current_nav = $('#J_moduleproperty_add'),							//��ǰtab��
			current_content = layout_edit_contents.children(':eq('+ current_nav.index() +')');			//��ǰ������

		designUtil.popTabReset();
		current_nav.show().click();

		try{
			$.post(module_url, {
				pageid :pageid,
				model : model,
				struct : layout_item.parents('.J_mod_layout').attr('id')
			}, function(data){
				if(Wind.Util.ajaxTempError(data)) {
					return false;
				}

				current_content.html(data);
				if(nav_temp) {
					$('#J_property_add').text('��һ��');
				}

				//jquery.scrollFixed
				//current_content.find('.J_scroll_fixed').scrollFixed();
				designUtil.commonFn();

				var btn = designUtil.getPopBtn();
				//�ύ
				$('form.J_design_module_form').ajaxForm({
					dataType : 'json',
					beforeSubmit : function(){
						Wind.Util.ajaxBtnDisable(btn);
					},
					success : function(data, statusText, xhr, $form){
						if(data.state == 'success') {
							moduleid = data.data;
							moduleid_input.val(moduleid);

							//д��ģ��html
							$.post(MODULE_BOX_UPDATE, {moduleid : moduleid}, function(data){
								Wind.Util.ajaxBtnEnable(btn);
								if(Wind.Util.ajaxTempError(data)) {
									designUtil.popHide('loading');
									return false;
								}
								mudule_box = $('#J_mod_box');
								mudule_box.html(data).show();
								mudule_box.attr({
									'id' : 'J_mod_'+ moduleid,
									'data-id' : moduleid,
									'data-model' : model,
									'class' : 'mod_box J_mod_box'
								});

								if(nav_temp) {
									//����ģ��tab
									var tabnav_template = $('#J_tabnav_template');
									tabnav_template.show().click().siblings().hide();
									tabnav_template.children('a').click();
								}else{
									designUtil.popHide('loading');
									Wind.Util.resultTip({
										msg : '�����ɹ�',
										zIndex : design_zindex
									});
								}

							});
						}else if(data.state == 'fail'){
							Wind.Util.ajaxBtnEnable(btn);
							Wind.Util.formBtnTips({
								error : true,
								msg : data.message,
								wrap : btn.parent()
							});
						}
					}
				});

			});
		}catch(e){
			$.error(e);

			designUtil.popHide('error');
		}
	}

	//��ק����ӵĽṹ
	mod_wrap.off('mousedown').on('mousedown', '.J_layout_hd', function(e){
			var wrap = $(this).parent(),
					wrap_left = wrap.offset().left,
					wrap_top = wrap.offset().top,
					org_style = wrap.attr('style');			//ԭ��ʽ

			//������Ӳ��϶�
			if(e.target.tagName.toLowerCase() == 'a') {
				return false;
			}

			move_lock = false;

			wrap.css({
				width : wrap.width(),
				position : 'absolute',
				zIndex : 1,
				opacity : 0.6,
				left :wrap_left,
				top : e.pageY + 2
			}).data({
				'randomid' : wrap.attr('id'),
				'orgstyle' : org_style ? org_style : ''
			}).attr('id', 'J_layout_move');
			$body.addClass('move');

			var dis_left = e.pageX - wrap_left,
				dis_top = e.pageY - wrap_top;

			doc.off('mousemove').on('mousemove', function(e){
				if(move_lock) {
					return false;
				}

				leftx = e.pageX,
				topx = e.pageY;

				//ģ�嶨λ
				wrap.css({
					left : e.pageX - dis_left,
					top : e.pageY + 2
				});

				designUtil.moveTemp(wrap, leftx, topx);
			});
		});


//�ṹ&����&ģ��༭ ��ʾ����
	//�ṹ�༭
	mod_wrap.on('mouseenter', 'div.J_mod_layout, .design_layout_style', function(e){
		//e.stopPropagation();
		var $this = $(this),
				tar = $(e.target);

		if(!move_lock) {
			return false;
		}

		//����ģ��
		var mod_box = tar.parents('.J_mod_box');
		if(mod_box.length) {
			modEditPos(mod_box);
		}

		//���ṹ
		var layout_box = tar.parents('.J_mod_layout');
		if(layout_box.length) {
			designUtil.layoutTitEditPos(layout_edit, layout_box);
		}

		//���ṹ
		if(tar.is('.J_mod_layout')) {
			designUtil.layoutTitEditPos(layout_edit, $this);
		}

	}).on('mouseleave', 'div.J_mod_layout, .design_layout_style', function(e){
		e.stopPropagation();
		if(!move_lock) {
			return false;
		}
		var rel_tar = $(e.relatedTarget);
		if(!rel_tar.is('#J_layout_edit')) {
			//�ƽ����ṹ
			if(rel_tar.is('.J_mod_layout')) {
				designUtil.layoutTitEditPos(layout_edit, rel_tar);
			}else if(rel_tar.parents('div.J_mod_layout').length) {
				designUtil.layoutTitEditPos(layout_edit, rel_tar.parents('div.J_mod_layout'));
			}else{
				layout_edit.hide();
			}
		}

	});

	layout_edit.on('mouseleave', function(){
		layout_edit.hide();
	});

	//����༭
	$('div.J_mod_title').hover(function(e){
		designUtil.layoutTitEditPos(mod_tit_edit, $(this));
	}, function(e){
		var rel_tar = $(e.relatedTarget);
		if(!rel_tar.is(mod_tit_edit)) {
			mod_tit_edit.hide();
		}
	});

	mod_tit_edit.on('mouseleave', function(){
		mod_tit_edit.hide();
	});

	//ģ��༭
	$(document).on('mouseenter', 'div.J_mod_box', function(e){
		e.stopPropagation();

		if (move_lock) {
			modEditPos($(this));
			mode_edit_btn.data({
				'id': $(this).data('id'),
				'model' : $(this).data('model')
			});
		}
	});

	mode_edit.on('mouseleave', function(e){
		mode_edit.hide();
	});

	//ģ��༭�� ��λ��ʾ
	function modEditPos(tar){
		if(!tar.data('id')) {
			return ;
		}
		mode_edit.css({
			width : tar.outerWidth(),
			height : tar.outerHeight(),
			left : tar.offset().left,
			top : tar.offset().top
		}).show();
	}


	var layouttitle = $('#J_layouttitle'),
			layoutstyle = $('#J_layoutstyle');
	layout_edit_pop.draggable( { handle : '.J_drag_handle'} );

	//����ṹ�༭
	layout_edit.on('click', function(e){
		e.preventDefault();
		var $this = $(this),
			index = layouttitle.index(),
			content = layout_edit_contents.children(':eq('+ index +')'),
			role = layouttitle.children().data('role'),
			edit_data = {},
			title;

			structure = $this.data('structure');

		menu_pop.hide();

		designUtil.popTabReset();

		layout_id = $this.data('id'),
		design_name.text('�ṹ����');
		design_del.text('ɾ���ýṹ').data('role', 'layout').show();
		//btn = $this;
		layout_edit_nav.children().children().data('load', false);


		Wind.Util.popPos(layout_edit_pop);

		layouttitle.click().show().children().attr('data-submit', false);	//Ĭ��δ�ύ
		layouttitle.siblings().hide();
		layoutstyle.show();

		edit_data['name'] = layout_id;
		edit_data['pageid'] = pageid;
		edit_data['title'] = $('#'+layout_id).children('.J_layout_hd').text();;

		if(structure == 'tab') {
			//tab�ṹ����
			var tab_arr = [];
			$('#'+ layout_id + ' .J_tabs_nav li').each(function(){
				tab_arr.push($(this).children('a').data('id'));
			})
			edit_data['tab'] = tab_arr;
			edit_data['title'] = undefined;
		}

		try{
			$.post(LAYOUT_EDID_TITLE, edit_data, function(data){
				if(Wind.Util.ajaxTempError(data)) {
					return false;
				}
				content.html(data);

				//jquery.scrollFixed
				//content.find('.J_scroll_fixed').scrollFixed();

				designUtil.layoutFormSub(content, role);
				designUtil.commonFn();

				title_clone = content.find('div.J_mod_title_cont').clone().html();		//����±����html����

			});
		}catch(e){
			$.error(e);
			designUtil.popHide('error');
		}
	});

	//���ģ��༭
	mode_edit_btn.on('click', function(e){
		e.preventDefault();
		var $this = $(this);

		menu_pop.hide();

		//tab����
		designUtil.popTabReset();

		design_name.text('ģ�����');
		moduleid = $this.data('id');
		moduleid_input.val(moduleid);
		model = $this.data('model');
		mudule_box = $('#J_mod_' + moduleid);
		design_del.text('ɾ����ģ��').data('role', 'module');

		//�ж�tab��ʾ
		Wind.Util.ajaxMaskShow(design_zindex);
		
		try{
			$.post(MODULE_EDIT_JUDGE, {
				moduleid : moduleid,
				pageid:pageid
			}, function(data){
				if(data.state == 'success') {


					layout_edit_nav.children().hide();
					//��ʾtab��
					var tab_arr = data.data;
					if(tab_arr.length) {
						for(i=0,len=tab_arr.length; i<len; i++) {
							$('#J_tabnav_' + tab_arr[i]).show();

							//�Ƿ���ʾ ɾ��ģ��
							if(tab_arr[i] == 'delete') {
								design_del.show();
							}else{
								design_del.hide();
							}
						};
					}

					//global.js
					Wind.Util.popPos(layout_edit_pop);

					var current_nav = layout_edit_nav.children(':visible').first();
					current_nav.click();
					var current_content = layout_edit_contents.children(':visible').first();

					//��ȡ��һ��tab����
					$.post(current_nav.children().attr('href'), {
						moduleid : moduleid,
						pageid:pageid
					}, function(data){
						if(Wind.Util.ajaxTempError(data)) {
							designUtil.popHide();
							return false;
						}
							Wind.Util.ajaxMaskRemove();

							current_content.html(data);
							current_nav.children().data('load', true);

							//jquery.scrollFixed
							//current_content.find('.J_scroll_fixed').scrollFixed();

							designUtil.commonFn();

							if(current_nav.children().data('type') == 'title') {
								//ģ�������Ӹ���
								title_clone = current_content.find('div.J_mod_title_cont').clone().html();
							}
					});

				}else{
					//global.js
					Wind.Util.ajaxMaskRemove();
					Wind.Util.resultTip({
						error : true,
						msg : data.message
					});
				}
			}, 'json');
		}catch(e){
			$.error(e);
			designUtil.popHide('error');
		}

	});

	//����༭
	mod_tit_edit.on('click', function(e){
		e.preventDefault();
		var id = $(this).data('id');
		Wind.Util.ajaxMaskShow(design_zindex);
		
		try{
			$.post(this.href, {name : id, pageid : pageid}, function(data){
				Wind.Util.ajaxMaskRemove();
				if(Wind.Util.ajaxTempError(data)) {
					designUtil.popHide();
					return false;
				}
					var moduletitle = $('#J_moduletitle'),
							current_content = layout_edit_contents.children(':eq('+ moduletitle.index() +')');
					design_name.text('����༭');
					design_del.hide();
					moduletitle.show().addClass('current').siblings().hide();
					current_content.html(data).show().siblings().hide();

					Wind.Util.popPos(layout_edit_pop);

					$('#J_design_tit_form').ajaxForm({
						dataType : 'json',
						beforeSubmit : function(){
							Wind.Util.ajaxMaskShow(design_zindex);
						},
						success : function(data){
							Wind.Util.ajaxMaskRemove();
							if(data.state == 'success') {
								layout_edit_pop.hide();
								$('#' + id).html(data.html);
							}else{
								Wind.Util.resultTip({
									error : true,
									msg : data.message,
									zindex : design_zindex
								});
							}
						}
					});
			}, 'html');
		}catch(e){
			$.error(e);
			designUtil.popHide('error');
		}
	});


	//�������tab
	layout_edit_nav.find('a').on('click', function(e){
		e.preventDefault();
		var $this = $(this),
				role = $this.data('role'),
				type = $this.data('type'),
				index = $this.parent().index(),
				current_content = layout_edit_contents.children(':eq('+ index +')');		//��ǰ������

		if(!$this.data('load')) {
			//��û����
			//current_content.html('<div class="pop_loading"></div>');

			try{
				if(role == 'layoutstyle') {
					//�ṹ��ʽ
					$.post(LAYOUT_EDID_STYLE, {name : layout_id}, function(data){
						if(Wind.Util.ajaxTempError(data)) {
							return false
						}
							current_content.html(data);

							//jquery.scrollFixed
							//current_content.find('.J_scroll_fixed').scrollFixed();

							$this.data('load', true);
							designUtil.layoutFormSub(current_content, role, '');
							designUtil.commonFn();
					});
				}else if(role == 'module') {
					//ģ��tab
					$.post(this.href, {moduleid : moduleid}, function(data){
						if(Wind.Util.ajaxTempError(data, undefined, design_zindex)) {
							designUtil.popHide('loading');
							return false;
						}

							current_content.html(data);

							if(current_content.find('#J_design_temp_tpl').length) {
								//Wind.use('rangeInsert');
							}

							//jquery.scrollFixed
							//current_content.find('.J_scroll_fixed').scrollFixed();

							//ģ��ģ�� global.js
							Wind.Util.buttonStatus($('#J_design_temp_name'), $('#J_design_temp_sub'));

							$this.data('load', true);
							designUtil.commonFn();

							if(type == 'title') {
								title_clone = current_content.find('div.J_mod_title_cont').clone().html();		//����±����html����
							}

					});
				}
			}catch(e){
				$.error(e);
				designUtil.popHide('error');
			}
		}

		//layout_edit_contents.children(':eq('+ $this.parent().index() +')').children()
	});

	//�رձ༭
	$('#J_layout_edit_close').on('click', function(e){
		e.preventDefault();
		designUtil.popHide();
	});

	//ɾ���ṹ&ģ��
	design_del.on('click', function(e){
		e.preventDefault();
		var role = $(this).data('role');
		if(role == 'layout') {
			//ɾ���ṹ
			var layout = $('#'+ layout_id);

			if(layout.find('.J_mod_box').children().length || layout.find('.J_mod_layout').length) {
				alert('������ոýṹ�µ�ģ����ӽṹ');
				return false;
			}

			layout.remove();

			designUtil.popHide('loading');
		}else{
			//ɾ��ģ��
			if(confirm('��ȷ��Ҫɾ����ģ����ɾ���󽫲��ɻָ���')) {
				//global.js
				Wind.Util.ajaxMaskShow(design_zindex);

				try{
					$.post(MODULE_BOX_DEL, {moduleid: moduleid}, function(data){
						//global.js
						Wind.Util.ajaxMaskRemove();

						if(data.state == 'success') {
							//�Ƴ�
							mudule_box.remove();
						}else{
							//global.js
							Wind.Util.resultTip({
								error : true,
								msg : data.message
							});
						}
						designUtil.popHide('loading');
					}, 'json');
				}catch(e){
					$.error(e);
					designUtil.popHide('error');
				}

			}
		}

	});

	//�ֱ�����
	layout_edit_contents.on('click', 'input.J_set_part', function(){
		var $this = $(this),
				last = $this.parents('dd').children(':last'),
				prev_last = last.prev();
		if($this.prop('checked')) {
			last.show();
			prev_last.hide();
		}else{
			last.hide();
			prev_last.show();
		}
	});


	//����ģ���б�����
	function updateModuleList(moduleid, mudule_box, hidepop, apply){
		//���б�����
		var box = mudule_box.find('.mod_box'),		//ģ����������
			clone = mudule_box.clone();
		mudule_box.html('<div class="pop_loading"></div>');
		
		try{
			$.post(MODULE_BOX_UPDATE, {moduleid : moduleid}, function(data){
				//global.js
				if(apply == 'apply') {
					Wind.Util.ajaxBtnEnable($('button.J_module_apply'));
				}else{
					var btn = designUtil.getPopBtn();
					Wind.Util.ajaxBtnEnable(btn);
				}

				if(Wind.Util.ajaxTempError(data)) {
					//����
					mudule_box.html(clone);
					Wind.Util.formBtnTips({
						error : true,
						wrap : btn.parent(),
						msg : data.message
					});
					return;
				}

				//�����б�
				$('#J_module_data_back').click();

				//�ɹ�
				if(hidepop) {
					designUtil.popHide('loading');
					Wind.Util.resultTip({
						msg : '�����ɹ�',
						zindex : design_zindex
					});
				}

				mudule_box.html(data);
				//ͷ��
				var avatars = mudule_box.find('img.J_avatar');
				if(avatars.length) {
					Wind.Util.avatarError(avatars);
				}

			});
		}catch(e){
			$.error(e);
		}
	}


	//ģ�����
	layout_edit_contents.on('click', 'a.J_data_edit', function(e){
		//��ʾ���ݱ༭
		e.preventDefault();
		var id = $(this).data('id'),
				//current_edit = $('#J_module_data_'+ id),					//��ǰ�༭����
				module_data_list = $('#J_module_data_list'),			//��ʾ�����б�
				module_data_edit = $('#J_module_data_edit');			//��ʾ���ݱ༭��

		module_data_list.hide();
		module_data_edit.show();
		$.post(this.href, function(data){
			//global.js
			if(Wind.Util.ajaxTempError(data)) {
				return false;
			}
			module_data_edit.html(data);
			designUtil.commonFn();
		});

	}).on('click', 'button.J_mod_title_add', function(e){
		//����±���
		e.preventDefault();
		var wrap = $(this).parents('.pop_cont');		//Ĭ����
		$('<a style="margin:5px;" class="fr J_mod_title_del" href="">ɾ���˱���</a><div class="J_mod_title_cont">'+title_clone +'</div>').insertBefore(wrap.children(':last')).find('input, .J_color_pick >em').val('').removeAttr('style');

		wrap.parent().scrollTop(9999);
	}).on('click', 'a.J_mod_title_del', function(e){
		//ɾ������
		e.preventDefault();
		$(this).next().remove();$(this).remove();
	}).on('click', '.J_pages_wrap a', function(e){
		//���ͷ�ҳ
		e.preventDefault();

		//��ҳǰ����
		var clone = tabct_push.clone();

		tabct_push.html('<div class="pop_loading"></div>');

		$.post(this.href)
		.done(function(data){
			if(Wind.Util.ajaxTempError(data)) {
				tabct_push.html(clone.html());
				return false;
			}

			tabct_push.html(data);
			designUtil.commonFn();
		});
	}).on('click', 'a.J_data_push', function(e) {
		//����
		e.preventDefault();
		var role = $(this).data('role');
		//global.js
		Wind.Util.ajaxMaskShow(design_zindex);

		$.post(this.href, function(data) {
			if (data.state == 'success') {
				//���µ����б�
				designUtil.updatePopList(null, false);

				if(role == 'pass') {
					//ͨ��
					tabnav_data.children().data('load', false);
					tabct_data.html('<div class="pop_loading"></div>');
				}

			} else if (data.state == 'fail') {
				//global.js
				Wind.Util.ajaxMaskRemove();
				Wind.Util.resultTip({
					error: true,
					msg: data.message,
					zindex : design_zindex
				});
			}
		}, 'json');
	}).on('click', 'a.J_design_data_ajax', function(e){
		//����ajax����
		e.preventDefault();
		var noupdate = $(this).data('noupdate');		//�Ƿ����ģ���б�

		//global.js
		Wind.Util.ajaxMaskShow(design_zindex);

		$.post(this.href, function(data){
			if(data.state == 'success') {
				//���µ����б�
				designUtil.updatePopList(null, noupdate ? false : true, false);
			}else if(data.state == 'fail'){
				//global.js
				Wind.Util.ajaxMaskRemove();
				Wind.Util.resultTip({
					error : true,
					msg : data.message,
					zindex : design_zindex
				});
			}
		}, 'json');
	}).on('click', '#J_design_temp_sub', function(e){
		//ģ��ģ�屣��
		e.preventDefault();
		var $this = $(this),
			temp_name = $('#J_design_temp_name');

		//global.js
		Wind.Util.ajaxMaskShow(design_zindex);

		$.post($this.data('action'), {
			tpl : $('textarea[name=tpl]').val(),
			tplname : $('#J_design_temp_name').val(),
			moduleid : moduleid
		}, function(data){
			//global.js
			Wind.Util.ajaxMaskRemove();

			if(data.state == 'success') {
				temp_name.val('');
				$this.prop('disabled', true).addClass('disabled');
				//global.js
				Wind.Util.resultTip({
					msg : '����ɹ�',
					follow : $this,
					zindex : design_zindex
				});
			}else if(data.state == 'fail'){
				//global.js
				Wind.Util.resultTip({
					error : true,
					msg : data.message,
					follow : $this,
					zindex : design_zindex
				});
			}
		}, 'json');
	}).on('click', 'div.J_sign_items', function(e){
		//���ģ��ģ������ codemirror��ͻ
		//$('#J_design_temp_tpl').rangeInsert(this.innerHTML);
	}).on('change', '#J_select_model_type', function(e){
		//ģ������ ����ģ��
		var select_model = $('#J_select_model'),
				data = DESIGN_MODELS[this.value],
				arr = [];
		if(data) {
			for (i = 0, len = data.length; i<len; i++) {
				arr.push('<option value="'+ data[i].model +'">'+ data[i].name +'</option>')
			}
			select_model.html(arr.join('')).show();

			if (select_model.val()) {
				updateProperty(select_model.val());
			}
 		}else{
			select_model.hide().html('');
		}
	}).on('change', '#J_select_model', function(e){
		//��������ģ��
		updateProperty(this.value);
	}).on('click', '#J_module_update', function(e){
		//����
		e.preventDefault();
		var $this = $(this);
		Wind.Util.ajaxBtnDisable($this);
		$.post($this.data('url'), {
			moduleid : moduleid
		}, function(data){
			Wind.Util.ajaxBtnEnable($this);
			if(data.state == 'success') {
				Wind.Util.ajaxMaskShow(design_zindex);
				designUtil.updatePopList();
			}else if(data.state == 'fail') {
				Wind.Util.resultTip({
					error : true,
					follow : $this,
					zindex : design_zindex,
					msg : data.message
				});
			}
		}, 'json');
	});

	//���¼�������ģ��
	function updateProperty(model){
		Wind.Util.ajaxMaskShow(design_zindex);
		try{
			$.post(layout_edit_nav.find('li.current > a').attr('href'), {
				moduleid : moduleid,
				model : model
			}, function(data){
				Wind.Util.ajaxMaskRemove();
				if (Wind.Util.ajaxTempError(data)) {
					return false;
				}

				layout_edit_contents.children(':visible').html(data);
				designUtil.commonFn();
			}, 'html');
		}catch(e){
			$.error(e)
		}
	}

	//���������б�
	layout_edit_contents.on('click', '#J_module_data_back', function(e){
		e.preventDefault();
		$('#J_module_data_list').show();
		$('#J_module_data_edit').hide().html('<div class="pop_loading"></div>');
	});

	//ģ��༭�ύ
	layout_edit_contents.on('click', 'button.J_module_sub', function(e){
		e.preventDefault();
		var $this = $(this),
				form = $this.parents('form'),
				role = $this.data('role'),
				action = $this.data('action'),
				update = $this.data('update'),			//���¶���
				apply = form.data('apply');

		form.ajaxSubmit({
			url : action ? action : form.attr('action'),
			dataType : 'json',
			beforeSubmit : function(){
				if(!apply) {
					Wind.Util.ajaxBtnDisable($this);
				}
			},
			success : function(data, statusText, xhr, $form){
				if(apply) {
					Wind.Util.ajaxBtnEnable(form.find('button.J_module_apply'));
				}

				if(data.state == 'success') {
					//�ύ��tab��������
					layout_edit_nav.find('a').data('load', false);
					layout_edit_contents.children(':not(:visible)').html('<div class="pop_loading"></div>');

					if(update == 'mod'){
						//����ģ���б�
						if(apply) {
							updateModuleList(moduleid, mudule_box, false, 'apply');
						}else{
							updateModuleList(moduleid, mudule_box, true);
						}

					}else if(update == 'title'){
						//�༭����

						var modtit = mudule_box.children('h2');
						if(modtit.length) {
							modtit.replaceWith(data.html);
						}else{
							mudule_box.prepend(data.html);
						}

						if(!apply) {
							Wind.Util.ajaxBtnEnable($this);
							designUtil.popHide('loading');
							Wind.Util.resultTip({
								msg : data.message
							});
						}

					}else if(update == 'style'){
						//�༭��ʽ

						//�Ƴ��ϵ�style
						mudule_box.find('style').remove();

						//д��style ��ʽ
						mudule_box.prepend('<style type="text/css" class="_tmp">#'+ data.html.styleDomId[0] +'{'+ data.html.styleDomId[1] +'}#'+ data.html.styleDomId[0] +' a{'+ data.html.styleDomIdLink[1] +'}</style>');

						//����class
						if(data.html.styleDomClass) {
							mudule_box.removeClass(module_class_mapping).addClass(data.html.styleDomClass)
							//mudule_box.attr('class', 'box J_mod_box '+ data.data.styleDomClass);
						}

						if(!apply) {
							Wind.Util.ajaxBtnEnable($this);
							designUtil.popHide('loading');
							Wind.Util.resultTip({
								msg : data.message
							});
						}
					}else{
						if(update == 'pop') {
							//���µ����б�
							designUtil.updatePopList($this, false);
						}else if(update == 'all') {
							//���µ���&ģ���б�
							designUtil.updatePopList($this, true, false);
						}
					}

					//Ӧ�óɹ���ʾ
					if(apply) {
						Wind.Util.formBtnTips({
							wrap : $this.parent(),
							msg : data.message
						});
					}
				}else if(data.state == 'fail'){
					//global.js
					Wind.Util.ajaxBtnEnable($this);
					Wind.Util.formBtnTips({
						error : true,
						wrap : $this.parent(),
						msg : data.message
					});
				}

				form.data('apply', false);
			}
		});
	});

	//Ӧ��
	layout_edit_contents.on('click', 'button.J_module_apply', function(e){
		e.preventDefault();
		$(this).parents('form').data('apply', true);
		$(this).siblings('.J_module_sub').click();
		Wind.Util.ajaxBtnDisable($(this))
	});


	//���Ͻǲ˵�
	Wind.Util.hoverToggle({
		elem : $('#J_design_top_arrow'),		//hoverԪ��
		list : $('#J_design_top_list')
	});


	//����
	var savedata = {}, dialog_html = '';
	savedata['pageid'] = pageid;
	savedata['uri'] = uri;
	savedata['uniqueid'] = uniqueid;
	savedata['compile'] = document.getElementById('J_compile').value;

	//�������
	$('#J_design_submit').on('click', function(){
		var $this = $(this);
		$('#J_mod_box').remove();

		//��ȡ�ύ����
		var ii = 0;
		for(i=0;i<mod_wrap.length;i++){
			var clone = $(mod_wrap[i]).clone(),
				box = clone.find('div.J_mod_box');
			clone.find('div.J_mod_layout').removeAttr('style');			//����style���ύ
			clone.find('style').remove();														//�õ�style��ǩ

			if($.browser.msie) {
				//jQuery1.8 sizzlejs���� ������ sizset=""����
				var elem_sizset = clone.find('[sizset]');
				
				if(elem_sizset.length) {
					elem_sizset.removeAttr('sizset');
				}
			}
			
			//�滻ģ������
			for(k=0;k<box.length;k++) {
				var _id = $(box[k]).data('id');
				if(_id) {
					if($.browser.msie) {
						var el_module = document.createElement('design');
						el_module.id = 'D_mod_'+ _id;
						el_module.setAttribute('role', 'module');
						$(box[k]).html(el_module);
					}else{
						$(box[k]).html('<design id="D_mod_'+ _id +'" role="module"></design>');
					}
				}
			}

			var html = clone.html();

			if($.browser.msie) {
				//jQuery1.8 sizzlejs���� ie�»����� sizcache***="" ���������
				html = html.replace(/sizcache\d+="(?:null|\d|.+)"/g, '');
			}

			savedata['segment['+ mod_wrap[i].id +']'] = html;
			if(html) {
				ii++;
			}
		}

		if(dtype == 'unique') {
			dialog_html = '<div class="pop_cont">�Ƿ�Ӧ��������ͬ��ҳ�棿</div>\
				<div class="pop_bottom">\
					<button class="btn btn_submit mr10 J_design_check" data-value="nounique" type="button">��</button>\
					<button class="btn J_design_check" data-value="isunique" type="button">��</button>\
				</div>';
		}/*else if(dtype == 'read'){
			dialog_html = '<div class="pop_cont">����ѡ��Ӧ����������һ��</div>\
				<div class="pop_bottom">\
					<button class="btn btn_submit J_design_check" data-value="" type="button">�����Ķ�ҳ</button>\
					<button class="btn btn_submit J_design_check" data-value="forum" type="button">��ǰҳ�������</button>\
					<button class="btn btn_submit J_design_check" data-value="read" type="button">��ǰҳ</button>\
				</div>';
		}*/else{
			dialog_html = '';
		}


		if(dialog_html){
			Wind.use('dialog', function(){
				Wind.dialog.html(dialog_html, {
					isMask	: true,
					zIndex : design_zindex,
					callback : function(){
						$('button.J_design_check').on('click', function(e){
							e.preventDefault();
							savedata.type = $(this).data('value');
							Wind.dialog.closeAll();
							save($this, savedata);
						});
					}
				});
			})

		}else{
			//delete savedata.uniqueid;
			savedata.type = dtype;
			save($this, savedata);
		}

	});

	//���淽��
	function save(elem, savedata){
		Wind.Util.ajaxMaskShow(design_zindex);
		try{
			$.ajax({
				url : elem.data('action'),
				type : 'post',
				dataType : 'json',
				data : savedata,
				success : function(data){
					//global.js
					Wind.Util.ajaxMaskRemove();

					if(data.state == 'success') {
						if(data.referer) {
							window.onbeforeunload = null;
							location.href = decodeURIComponent(data.referer);
						}
					}else{
						//global.js
						Wind.Util.resultTip({
							error : true,
							msg : data.message
						});
					}
				}
			});
		}catch(e){
			$.error(e);
		}
	}


	//�˳�
	$('#J_design_quit').on('click', function(e){
		e.preventDefault();
		if(confirm('��ȷ��Ҫ�˳�ҳ�����״̬��ȷ���˳������޸ĵ����ݽ����ᱣ�档')) {
			$.post(this.href, {pageid: pageid, uri : uri}, function(data){
				if(data.state == 'fail') {
					Wind.Util.resultTip({
						error : true,
						msg : data.message
					});
					return;
				}
				window.onbeforeunload = null;
				location.href = decodeURIComponent(data.referer);
			}, 'json');
		}
 	});

	//�˳� ģ��Ȩ��
	$('#J_design_quit_direct').on('click', function(e){
		e.preventDefault();
		$.post(this.href, {pageid: pageid, uri : uri}, function(data){
			window.onbeforeunload = null;
			location.href = data.referer;
		}, 'json');
	});

	//�˵���������
	//�ر�
	$('a.J_pop_close').on('click', function(e){
		e.preventDefault();
		menu_pop.hide();
	});
	//��ק
	menu_pop.draggable( { handle : '.J_drag_handle'} );


	//�ָ�����
	$('#J_design_restore').on('click', function(e){
		e.preventDefault();
		if(confirm('��ȷ��Ҫ�ָ�Ϊ��һ���汾�ı��ݽ����')) {
			restoreLoop(this.href, 1);
		}
	});

	//ѭ�����󱸷���Ϣ
	function restoreLoop(url, step){
		try{
			$.post(url, {pageid: pageid, step : step}, function(data){
				if(data.state == 'success') {
					var status = parseInt(data.data[0]);
					if(status < 7) {

						//global.js
						Wind.Util.resultTip({
							msg : data.data[1]
						});

						restoreLoop(url, step+1);
					}else{
						Wind.Util.resultTip({
							msg : '�ָ��ɹ���',
							callback : function(){
								window.onbeforeunload = null;
								//global.js
								location.reload();
							}
						});
					}
				}else if(data.state == 'fail'){
					Wind.Util.resultTip({
						error : true,
						msg : data.message
					});
				}
			}, 'json');
		}catch(e){
			$.error(e);
		}
	}


/*
 * ����
*/
	var design_export_pop = $('#J_design_export_pop');
	$('#J_design_export').on('click', function(e){
		e.preventDefault();

		Wind.Util.popPos(design_export_pop);
	});
	$('#J_design_export_btn').on('click', function(e){
		e.preventDefault();
		var v = design_export_pop.find('input:radio:checked').val();
		window.open(this.href +'&pageid='+ pageid+'&charset='+v);
	});


/*
 * ����
*/
	var design_import_pop = $('#J_design_import_pop');
	$('#J_design_import').on('click', function(e){
		e.preventDefault();
		Wind.Util.popPos(design_import_pop);
	});

	//�����ύ
	$('#J_design_import_form').ajaxForm({
		dataType : 'json',
		beforeSubmit : function (arr, $form, options) {
			//global.js
			Wind.Util.ajaxBtnDisable($form.find('button:submit'));
		},
		data : {
			pageid : pageid
		},
		success : function (data, statusText, xhr, $form) {
			//global.js
			var btn = $form.find('button:submit')
			Wind.Util.ajaxBtnEnable(btn);

			if(data.state == 'success') {
				Wind.Util.resultTip({
					elem : btn,
					follow : true,
					msg : '����ɹ�',
					zindex : design_zindex,
					callback : function(){
						window.onbeforeunload = null;
						//global.js
						Wind.Util.reloadPage(window);
					}
				});
			}else if(data.state == 'fail'){
				//global.js
				Wind.Util.resultTip({
					elem : btn,
					follow : true,
					error : true,
					msg : data.message,
					zindex : design_zindex
				});
			}
		}
	});


/*
 * ����
*/
	$('#J_design_cache').on('click', function(e){
		e.preventDefault();
		Wind.Util.ajaxMaskShow();
		$.post(this.href, {pageid : pageid}, function(data){
			Wind.Util.ajaxMaskRemove();
			if(data.state == 'success') {
				Wind.Util.resultTip({
					msg : '���³ɹ�',
					callback : function(){
						window.onbeforeunload = null;
						//global.js
						Wind.Util.reloadPage(window);
					}
				});
			}else if(data.state == 'fail'){
				//global.js
				Wind.Util.resultTip({
					error : true,
					msg : data.message
				});
			}
		}, 'json');
	});


/*
 * ���
*/
	$('#J_design_clear').on('click', function(e){
		e.preventDefault();
		if(confirm('��ȷ��Ҫ���ҳ���ϵ�����ģ�飿��պ󽫲��ɻָ���')) {
			Wind.Util.ajaxMaskShow();
			$.post(this.href, {pageid : pageid, design : 1}, function(data){
				Wind.Util.ajaxMaskRemove();
				if(data.state == 'success') {
					mod_wrap.html('');
					location.reload();
				}else if(data.state == 'fail') {
					Wind.Util.resultTip({
						error : true,
						msg : data.message
					});
				}
			}, 'json');
		}
	});

/*
 * �༭ģʽ������ѭ����
*/
	designLockLoop();
	function designLockLoop(){
		try{
			$.post(DESIGN_LOCK, {pageid: pageid}, function(data){
				if(data.state == 'success') {
					setTimeout(function(){
						designLockLoop();
					}, 60000);
				}
			}, 'json');
		}catch(e){
			$.error(e);
		}
	}

/*
 * �ر�С��ʿ
*/
	var mini_tips = $('#J_mini_tips'),
		tip_cookie = Wind.Util.cookieGet('designMiniTips');
	if(tip_cookie !== 'closed') {
		//cookie����������ʾ
		mini_tips.show();
	}

	$('#J_mini_tips_close').on('click', function(e){
		e.preventDefault();
		mini_tips.hide();
		//����cookie
		Wind.Util.cookieSet('designMiniTips','closed','365',document.domain);
	});


})();
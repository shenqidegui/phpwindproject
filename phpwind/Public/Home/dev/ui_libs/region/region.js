/**
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ��̨-�������
 * @Author	: linhao87@gmail.com
 * @Depend	: core.js��jquery.js(1.7 or later), jquery.form, REGION_JSONҳ�涨�壬GV.REGION_CONFIG headȫ�ֱ���
 * $Id$
 */
;(function ( $, window, document, undefined ) {
	var pluginName = 'region',
		defaults = {
			type : 'region',		//����(������ѧУ) Ĭ�ϵ���
			regioncancl : false
		},
		region_pl = $('<div class="pop_region_list">\
					<ul id="J_region_pop_province" class="cc"></ul>\
					<div class="hr"></div>\
					<ul id="J_region_pop_city" class="cc">\
						<li><span>��ѡ��</span></li>\
					</ul>\
					<div class="hr"></div>\
					<ul id="J_region_pop_district" class="cc">\
						<li><span>��ѡ��</span></li>\
					</ul>\
					<div id="J_school_wrap" style="display:none;"></div>\
			</div>'),
		pop_temp = '<div class="core_pop_wrap" id="J_region_pop">\
				<div class="core_pop">\
					<div style="width:600px;">\
						<div class="pop_top">\
							<a href="#" class="pop_close J_region_close">�ر�</a>\
							<strong>ѡ�����</strong>\
						</div>\
						<div class="pop_cont">\
							<div id="J_region_pl" class="pop_loading"></div>\
						</div>\
						<div class="pop_bottom tac">\
							<button type="submit" class="btn btn_submit mr10 disabled J_region_pop_ok" disabled="disabled">ȷ��</button><button type="button" class="btn J_region_close">�ر�</button>\
						</div>\
					</div>\
				</div>\
			</div>';

	function Plugin(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);
		this.init();
	}

	Plugin.prototype = {
		init : function() {
			var _this = this,
				options = this.options,
				elem = this.element,
				type = options.type,
				onevent = (type == 'region' ? 'click' : 'focus');

			//�޸�ģ��
			if(type == 'school') {
				region_pl.find('#J_school_wrap').html(setSchool.school_temp).show();
			}else{
				region_pl.find('#J_school_wrap').html('').hide();
			}

			elem.on(onevent, function (e) {
				e.preventDefault();
				var wrap = elem.parents('.J_region_set');

				_this.regionInit(elem.data('pid'), elem.data('cid'), elem.data('did'), elem.data('rank'), wrap, type);

				if(GV.REGION_CONFIG.load) {
					//���������ѻ�ȡ���ٴ�ѡ��ѧУ
					setSchool.init(elem);
				}
			});

			//ȡ��
			$('a.J_region_cancl').on('click', function(e){
				e.preventDefault();
				var wrap = $(this).parents('.J_region_set');
				wrap.find('.J_province, .J_city, .J_district').text('');
				wrap.find('input.J_areaid').val('');
				elem.removeData('pid cid did');
				$(this).hide();
			});

		},
		regionInit : function(pid, cid, did, rank, wrap, type){
			var _this = this,
				region_pop = $('#J_region_pop'),
				zindex = _this.options.zindex;

			if(region_pop.length) {
				//���ص�����ʾ
				region_pop.show();

				_this.hideRank(rank);
				_this.getChild(region_pop, rank, type);

				if(pid) {
					$('#J_province_'+ pid).addClass('current').siblings().removeClass('current');					//����ѡ�е�ǰʡ
						_this.getCity(pid, cid, did);									//����ѡ�е�ǰ��
				}else{
					//����
					$('#J_region_pop_province > li').removeClass('current');
					$('#J_region_pop_city, #J_region_pop_district').html('<li><span>��ѡ��</span></li>');
					_this.btnDisable();
				}

				//global.js
				Wind.Util.popPos(region_pop);

				//ȷ��
				_this.subOk(wrap, region_pop);
			}else{
				//��װ��ӵ���
				$('body').append(pop_temp);

				var region_pop = $('#J_region_pop');
				if(zindex) {
					region_pop.css('zIndex', zindex);
				}

				if ($.browser.msie && $.browser.version < 7) {
					Wind.use('bgiframe',function() {
						region_pop.bgiframe();
					});
				}

				//global.js
				Wind.Util.popPos(region_pop);

				//��ȡ��������
				$.ajax({
					url : GV.URL.REGION,
					type : 'post',
					dataType : 'json',
					success : function(data){
						if(data) {
							GV.REGION_CONFIG = data;

							$('#J_region_pl').replaceWith(region_pl);
							
							var region_pop_province = $('#J_region_pop_province'),
									region_pop_city = $('#J_region_pop_city');

							//д��ʡ��html
							region_pop_province.html(_this.showProvince());

							_this.hideRank(rank);

							if(pid) {
								//��Ĭ��ֵ
								$('#J_province_'+ pid).addClass('current').siblings().removeClass('current');
								_this.getCity(pid, cid, did);
							}
								
							//��ʾ
							region_pop.show(0, function(){
								//���뵯���϶����
								Wind.use('draggable',function() {
									region_pop.draggable( { handle : '.pop_top'} );
								});
							});

							_this.getChild(region_pop, rank, type);
							_this.regionClose(region_pop);

							//ȷ��
							_this.subOk(wrap, region_pop);

							//global.js
							Wind.Util.popPos(region_pop);

							//����ѧУ����
							if(type == 'school') {
								GV.REGION_CONFIG.load = true;
								setSchool.init($('input.J_plugin_school:focus'));
							}
						}
					},
					error : function(){
						region_pop.remove();
						Wind.Util.resultTip({
							error : true,
							msg : '��������ʧ�ܣ�',
							follow : _this.element
						});
					}
				});

			}
						
		},
		showProvince : function(){
			//��ʾʡ
			var province_arr = [];

			//ѭ��ʡ����
			$.each(GV.REGION_CONFIG, function(i, o){
				province_arr.push('<li id="J_province_'+ i +'" data-id="'+ i +'" data-child="city" data-role="province"><a href="#" class="J_item">'+ o.name +'</a></li>');
			});
					
			return province_arr.join('');
		},
		getCity : function(pid, cid, did){
			//��ȡ����
			var _this = this,
				pop_city = $('#J_region_pop_city'),
				arr= [],
				data = GV.REGION_CONFIG[pid]['items'];

			//��������
			$('#J_region_pop_district').html('<li><span>��ѡ��</span></li>');

			if(!data) {
				//û�г�������
				pop_city.html('<li><span>��ѡ��</span></li><li><em class="gray">������Ϣ������������ϵ����Ա</em></li>');
				return;
			}

			$.each(data, function(i, o){
				arr.push('<li id="J_city_'+ i +'" data-id="'+ i +'" data-child="district" data-role="city"><a href="#" class="J_item">'+ o.name +'</a></li>');
			});
					
			//д�����
			pop_city.html('<li class="current" data-id=""><a href="#" class="J_item">��ѡ��</a></li>'+ arr.join(''));
					
			if(cid){
				//�������
				$('#J_city_'+ cid).addClass('current').siblings().removeClass('current');
				_this.getDistrict(data[cid]['items'], did);
			}

		},
		getDistrict : function (data, did){
			//��ȡ����
			var arr= [],
				pop_district = $('#J_region_pop_district');

			if(!data) {
				pop_district.html('<li><span>��ѡ��</span></li><li><em class="gray">������Ϣ������������ϵ����Ա</em></li>');
				return;
			}

			$.each(data, function(i, o){
				arr.push('<li id="J_district_'+ i +'" data-id="'+ i +'" data-child="" data-role="district"><a href="#" class="J_item" data-role="district">'+ o +'</a></li>');
			});
			pop_district.html('<li class="current" data-id=""><a href="#" class="J_item">��ѡ��</a></li>'+ arr.join(''));
					
			if(did){
				//������ǰ����
				$('#J_district_'+ did).addClass('current').siblings().removeClass('current');
			}

		},
		getChild : function (wrap, rank, type){
			var _this = this;
			//���������ȡ�¼�����
			wrap.on('click', 'a.J_item', function(e){
				e.preventDefault();
				var $this = $(this),
						li = $this.parent(),
						ul = li.parents('ul'),
						id = li.data('id'),
						child = li.data('child');
				
				li.addClass('current').siblings('li.current').removeClass('current');
						
				if($this.data('role') == 'district') {
					if(type !== 'school') {
						//ѧУ �ύ������
						_this.btnRemoveDisable();
					}
					return;
				}

				if(rank == 'province' && type == 'region') {
					//ֱ��ʡ
					_this.btnRemoveDisable();
					return;
				}

				_this.btnDisable();



				if(!id) {
					//�������ѡ��
					ul.nextAll('ul').html('<li><span>��ѡ��</span></li>');
				}else{
					//���ʡ
					var data, arr = [];
							
					if(child == 'city') {
						_this.getCity(id);
					}else if(child == 'district'){
						data = GV.REGION_CONFIG[$('#J_region_pop_province > li.current').data('id')]['items'][id]['items'];
						_this.getDistrict(data);
					}

				}
				
			});
		},
		btnDisable : function (){
			//ȷ�ϲ��ɵ�
			$('button.J_region_pop_ok').addClass('disabled').attr('disabled', 'disabled');
		},
		btnRemoveDisable : function (){
			//ȷ�Ͽɵ�
			$('button.J_region_pop_ok').removeClass('disabled').removeAttr('disabled');
		},
		subOk : function (wrap, pop){
			//ȷ��
			var _this = this;
			if(wrap.length) {
				var elem = this.element;
				var region_change = wrap.find('a.J_region_change');
					$('button.J_region_pop_ok').off('click').on('click', function(e){
						e.preventDefault();
						var current_lis = pop.find('ul > li.current');
						
						current_lis.each(function(i, o){
							wrap.find('.J_'+ $(this).data('role')).text($(this).text());
						});

						elem.data({
							pid : $(current_lis[0]).data('id'),
							cid : $(current_lis[1]).data('id'),
							did : $(current_lis[2]).data('id')
						});

						wrap.find('input.J_areaid').val($('#J_region_pop_district > li.current').data('id'));
						pop.hide();

						var regioncancl = _this.options.regioncancl;
						if(regioncancl) {
							//��ʾȡ��
							wrap.find('a.J_region_cancl').show();
						}
					});
			}
		},
		regionClose : function (wrap){
			//�ر�
			wrap.on('click', '.J_region_close', function(e){
				e.preventDefault();
				wrap.hide();
			});
		},
		hideRank : function (rank){
			//����ʡ�м���
			var region_pop_city = $('#J_region_pop_city'),
					region_pop_district = $('#J_region_pop_district');

			if(rank == 'province') {
				region_pop_city.hide().next().hide();
				region_pop_district.hide();

				if(this.options.type == 'region') {
					$('#J_region_pop_province').next().hide();
				}
			}else{
				region_pop_city.show().next().show();
				region_pop_district.show();
			}
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Plugin($(this), options));
			}
		});
	}

})( jQuery, window ,document);
/**
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨ȫ�ֹ���js
 * @Author	:
 * @Depend	: wind.js��jquery.js(1.7 or later)
 * $Id: global.js 28908 2013-05-30 02:11:03Z hao.lin $
 */

/*
 * ȫ�ֹ�������
*/
Wind.Util = {
	ajaxBtnDisable : function(btn){
		//��ť�ύ������
		var textnode = document.createTextNode('��...');
		btn[0].appendChild(textnode);
		btn.prop('disabled', true).addClass('disabled').data('sublock', true);
	},
	ajaxBtnEnable : function(btn, disabled){
		//��ť�ύ����
		var org_html = btn.html();
		btn.html(org_html.replace(/(��...)$/, '')).data('sublock', false);

		if(disabled == 'disabled') {
			//Ĭ�ϲ�����
			btn.prop('disabled', true).addClass('disabled');
		}else{
			//Ĭ�Ͽ���
			btn.prop('disabled', false).removeClass('disabled');
		}
	},
	ajaxConfirm : function(options) {
		//���е�ȷ���ύ������ɾ��������������ȣ�
		var _this = this,
			elem = options.elem,				//���Ԫ��
			href = elem.data('uri') ? elem.data('uri') : options.href,				//ajax��ַ
			msg = options.msg,					//��ʾ����
			callback = options.callback;		//�ص�

		var params = {
			message : msg ? msg : 'ȷ��Ҫɾ����',
			type : 'confirm',
			isMask : false,
			follow : elem,
			onOk : function () {
				_this.ajaxMaskShow();
				$('body').trigger('setCustomPost', [elem]);
				$.post(href, function (data) {
					_this.ajaxMaskRemove();
					if (data.state === 'success') {
						if (callback) {
							//�ص�����
							callback();
						} else {
							//Ĭ��ˢ��
							if (data.referer) {
								location.href = decodeURIComponent(data.referer);
							} else {
								location.reload();
							}
						}
					} else if (data.state === 'fail') {
						Wind.Util.resultTip({
							error : true,
							msg : data.message,
							follow : elem
						});
					}
				}, 'json');
			}
		}
		Wind.use('dialog', function(){
			Wind.dialog(params);
		});
	},
	ajaxMaskShow : function(zindex){
		//��ʾajax����ȫҳ����
		var $maskhtml = $('<div id="J_ajaxmask" class="top_loading" style="display:none;">������...</div>'),
			header = $('#J_header'),
			pos,
			top,
			doc_srh = $(document).scrollTop();

		this.ajaxMaskRemove();

		$maskhtml.appendTo('body');

		if($.browser.msie && $.browser.version < 7) {
			//ie6�Ķ�λ
			pos = 'absolute';
			top = header.length ? header.height() + doc_srh : doc_srh;
		}else{
			pos = 'fixed';
			top = header.length ? header.height() : 0;
		}

		$maskhtml.css({
			position : pos,
			zIndex : zindex ? zindex : 12,
			top : top
		}).show();

	},
	ajaxMaskRemove : function(){
		//�Ƴ�ajax����ȫҳ����
		$('#J_ajaxmask').remove();
	},

	ajaxTempError : function(data, follow, zindex) {
		//ajax����ģ��html�����ж�

		//������
		if($.trim(data) === '') {
			return false;
		}

		try{
			var error = false,
				logout = false;

			if(data.indexOf('J_html_error') > 0) {
				//errorҳ ģ��
				var start = data.indexOf('<li id="J_html_error">'),
					end = data.indexOf('</li>');
				error = data.substring(start+22, end);
			}else if(data.indexOf('J_u_login_username') > 0) {
				//��¼ҳ
				logout  = true;
			}

			if(error) {
				//����ģ��
				Wind.Util.ajaxMaskRemove();

				Wind.Util.resultTip({
					error : true,
					msg : error,
					follow : follow,
					zindex : zindex ? zindex : undefined
				});
				return true;
			}else if(logout){
				location.reload();
				return true;
			}else{
				//success
				return false;
			}
		}catch(e){
			$.error(e);
		}
	},
	avatarError : function(avatars){
		//ͷ��Ĵ�����
		avatars.each(function() {
			this.onerror = function() {
				this.onerror = null;
				this.src = GV.URL.IMAGE_RES + '/face/face_' + $(this).data('type') + '.jpg';//���ͷ��
				this.setAttribute('alt','Ĭ��ͷ��');
			}
			this.src = this.src;
		});
	},
	buttonStatus : function(input, btn){
		//��ť״̬ ����&������
		var timer;

		//Ĭ��Ϊ��ť����״̬
		if(!input.val() || ($.browser.msie && input.val() == input.attr('placeholder'))) {
			btn.addClass('disabled').prop('disabled', true);
		}

		//�۽�
		input.on('focus.b keydown.b', function(){
			var $this = $(this),
				tagname = input[0].tagName.toLowerCase(),
				type_input = false;

			//���������Ƿ����Ա��ؼ���div
			if(tagname == 'textarea' || tagname == 'input') {
				type_input = true;
			}

			timer && clearInterval(timer);

			//��ʱ����ʼ
			timer = setInterval(function(){
				var trim_v = $.trim( type_input ? $this.val() : $this.text() );

				if(trim_v.length) {
					//������
					btn.removeClass('disabled').prop('disabled', false);
				}else{
					//������
					btn.addClass('disabled').prop('disabled', true);
				}
			}, 200);

		});

		//����ʧ���������ʱ
		input.on('blur.b', function(){
			clearInterval(timer);
		});
	},
	clickToggle : function (options) {
		//�����ʾ����
		var elem = options.elem,						//����Ԫ��
			list = options.list,						//�����б�
			callback = options.callback,				//��ʾ��ص�
			callbackHide = options.callbackHide,		//���غ�ص�
			lock = false;								//����������Ĭ�Ϸ�
			(function() {
				elem.on('keydown click', function(e) {
					var $this = $(this);
					//��a��ǩ��� tabIndex���۽���
					if($this[0].tagName.toLowerCase() !== 'a') {
						$this.attr('tabindex', '0');
					}
					//�������
					if( (e.type === 'keydown' && e.keyCode === 13) || e.type === 'click') {
						e.preventDefault();

						if(list.is(':visible')) {
							list.hide();
						}else{
							list.show();
						}
						
					}else {
						$('.J_dropDownList').hide();
						if(e.type === 'keydown' && e.keyCode === 40) {
							list.attr('tabindex','0').addClass('J_dropDownList').show();
							list.focus();
						}
					}
					//�ص�
					if(!list.filter(':hidden').length) {
						lock = false;
						callback && callback(elem, list);
					}
				});
				$(document.body).on('mousedown',function(e) {
					//�жϵ������ �����б�
					if(list.is(':visible') && e.target!=list[0] && !$.contains(list[0],e.target) && !$.contains(elem[0],e.target)) {
						list.hide();
						elem.focus();
						callbackHide && callbackHide(elem, list);
					}
				});
				list.on('keydown',function(e) {
					if(e.keyCode === 27) {
		                list.hide();
		                elem.focus();
		            }
				});
				list.on('mouseenter', function(e){
					//�����룬����
					lock = true;
				}).on('mouseleave', function(){
					//����뿪������Ԫ�ؾ۽����������
					elem.focus();
					lock = false;
				});
			})();
	},
	creditReward : function(){
		//��ʾ���ֽ���, ����Ҫ�жϻ��ֽ����Ĳ�������� Wind.Util.creditReward()����
		var _this = this;
		var reward_temp = '<div id="J_credittxt_pop" class="pop_credittxt_tips"><strong>$name$</strong>$credit$</div>';
		$.post(GV.URL.CREDIT_REWARD_DATA, function(data){
			if(data.state == 'success') {
				var _data = data.data;
				if(_data) {

					var arr = [];
					for(i=0,len=_data['credit'].length; i<len; i++) {
						arr.push('<span>'+ _data['credit'][i][0] +'<em>'+ _data['credit'][i][1] +'</em></span>');
					}

					$('body').append(reward_temp.replace('$name$', _data['name']).replace('$credit$', arr.join('')));

					var credittxt_pop = $('#J_credittxt_pop');
					_this.popPos(credittxt_pop);

					setTimeout(function(){
						credittxt_pop.fadeOut(function(){
							credittxt_pop.remove();
						});
					}, 3000);
				}
			}
		}, 'json');
	},
	cookieGet : function (name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' '){
				c = c.substring(1,c.length);
			}
			if (c.indexOf(nameEQ) == 0){
				return c.substring(nameEQ.length,c.length);
			}
		};

		return null;
	},
	cookieSet : function(name,value,days,domain) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+days*24*60*60*1000);
			var expires = '; expires='+date.toGMTString();
		}else{
			var expires = '';
		}
		document.cookie = name+"="+value+expires+"; domain="+domain+"; path=/";
	},
	ctrlEnterSub : function(elem, btn) {
		//ctrl+enter �ύ
		elem.on('keydown', function(e) {
			if (e.ctrlKey && e.keyCode === 13) {
				//��ֹ��Wind.Util.buttonStatus������ͻ
				elem.blur();

				btn.click();
			}
		});
	},
	flashPluginTest : function(version){
		var flash_install = false,
				flash_v = null;

		if(!$.browser.msie) {
			var b_plug = navigator.plugins;
			if (b_plug) {
				for (var i=0; i < b_plug.length; i++) {
					if (b_plug[i].name.toLowerCase().indexOf("shockwave flash") >= 0) {
						flash_v = b_plug[i].description.substring(b_plug[i].description.toLowerCase().lastIndexOf("flash ") + 6, b_plug[i].description.length);
						flash_install = true;
					}
				}
				if(flash_install) {
					flash_v = parseInt(flash_v.split('.')[0]);
				}
			}
			
		}else{
			if (window.ActiveXObject) {
				var flash_install = false;
				for (var ii = 20; ii >= 2; ii--) {
					try {
						var fl = eval("new ActiveXObject('ShockwaveFlash.ShockwaveFlash." + ii + "');");
						if (fl) {
							flash_v = ii;
							flash_install = true;
							break;
						}
					}catch(e){

					}
				}
			}
		}

		if(!flash_install || flash_v < version){
			return false;
		}else{
			return true;
		}
	},
	formBtnTips : function(options){
		var error = options.error ? true : false,
				wrap = options.wrap,
				msg = options.msg,
				callback = options.callback;

		wrap.find('.J_tips_btn').remove();
		if(error) {
			//ʧ��
			wrap.append('<span class="tips_icon_error J_tips_btn">'+ msg +'</span>');
		}else{
			//�ɹ�
			$('<span class="tips_icon_success J_tips_btn">'+ msg +'</span>').appendTo(wrap).delay(3000).fadeOut('200', function(){
				$(this).remove();

				//�ص�
				callback && callback();
			});
		}

	},
	getVerifyTemp : function(options){
		//��֤��ģ��
		var _this = this,
			wrap = options.wrap,				//��֤������
			afterClick = options.afterClick,	//�����һ����ص�
			clone = options.clone;				//��ȡʧ�ܺ�ָ�����

		if(!wrap.length) {
			return;
		}

		wrap.html('<span class="tips_loading tips_ck_loading">��֤��loading</span>');

		$.ajax({
			url : GV.URL.VARIFY,
			data: { csrf_token : GV.TOKEN },
			dataType : 'json',
			success : function(data){
				if(data.state == 'success') {
					wrap.html(data.html);
				}else if(data.state == 'fail') {
					if(clone) {
						//�ָ�ԭ����
						wrap.html(clone.html());
					}else{
						//����
						wrap.html('<a href="#" role="button" id="J_verify_update_a">���»�ȡ</a>');
					}

					_this.resultTip({
						error : true,
						elem : $('#J_verify_update_a'),
						follow : true,
						msg : data.message
					});
				}
			},
			error : function(){
				wrap.html('��֤������ʧ�ܣ�<a href="#" role="button" id="J_verify_update_a">���»�ȡ</a>');
			}
		});

		wrap.off('click').on('click', '#J_verify_update_a', function(e){
			//��һ��
			e.preventDefault();

			if(wrap.find('.tips_loading').length) {
				//����ε��
				return false;
			}

			var clone = wrap.clone();
			wrap.html('<span class="tips_loading tips_ck_loading">��֤��loading</span>');
			_this.getVerifyTemp({
				wrap : wrap,
				clone : clone
			});

			afterClick && afterClick();
		}).on('click', '#J_verify_update_img', function(e){
			//���ͼƬ
			$('#J_verify_update_a').click();
		});
	},
	hashPos : function(){
		//ê�㶨λ �߶�
		var hash = location.hash.replace('#', '');
		if(hash.indexOf('hashpos') < 0 ) {
			//��ƥ��
			return;
		}
		var elem = $('#'+hash),					//êԪ��
			elem_ot = elem.offset().top,
			doc_st = $(document).scrollTop(),	//
			hh = $('#J_header').height();		//ͷ���߶�

		if(elem_ot - doc_st < hh) {
			//êԪ�ر�ͷ����ס
			$(document).scrollTop(elem_ot - hh);
		}

	},
	hoverToggle : function(options) {
		//hover��ʾ��������
		try{
			var elem = options.elem,																//����Ԫ��
					list = options.list,																//�����б�
					delay = (options.delay ? options.delay : 200);			//��ʱ

			var timeout;

			elem.on('mouseenter keydown', function (e) {
				//���ϰ�����
				if(e.type === 'keydown' && e.keyCode !== 40) {
					//������ǰ���down����return
					return;
				}else {
					e.preventDefault();
				}

				//������ʱ
				timeout && clearTimeout(timeout);

				timeout = setTimeout(function () {
					list.show();

					//�ص�����������Ԫ��
					options.callback && options.callback(elem, list);
				}, delay);
			}).on('mouseleave keydown', function (e) {
				//���ϰ�����
				if(e.type === 'keydown' && e.keyCode !== 27) {
					//������ǰ���ESC����return
					return;
				}else {
					e.preventDefault();
				}
				//����뿪
				timeout && clearTimeout(timeout);

				timeout = setTimeout(function () {
					list.hide();
				}, delay);
			});

			list.on('mouseenter', function (e) {
				//������ʱ
				timeout && clearTimeout(timeout);
			}).on('mouseleave keydown', function (e) {
				//���ϰ�����
				if(e.type === 'keydown' && e.keyCode !== 27) {
					//������ǰ���ESC����return
					return;
				}else {
					e.preventDefault();
					elem.focus();
				}
				timeout = setTimeout(function () {
					list.hide();
					if(e.type === 'keydown') {
						elem.focus();
					}
				}, delay);
			});
		}catch(e){
				$.error(e);
		}
	},
	reloadPage : function (win) {
		//ǿ��ˢ��
		var location = win.location;
		location.href = location.pathname + location.search;
	},
	resultTip : function (options) {
		//ǰ̨�ɹ���ʾ
		var elem = options.elem || options.follow,			//������ť, ������options.follow
			error = options.error,											//��ȷ�����
			msg = options.msg,													//����
			follow = options.follow,										//�Ƿ������ʾ
			callback = options.callback,								//�ص�
			zindex = (options.zindex ? options.zindex : 10),			//zֵ
			cls = (error ? 'warning' : 'success'),			//����class
			_this = this;

		var html = '<span class="pop_showmsg"><span class="' + cls + '">' + msg + '</span></span>';

		//�Ƴ��ظ�
		$('#J_resulttip').remove();
		_this.rt_timer && clearTimeout(_this.rt_timer);

		Wind.use('dialog', function(){
			Wind.dialog.html(html, {
				id : 'J_resulttip',
				className : 'pop_showmsg_wrap',
				isMask : false,
				zIndex : zindex,
				callback : function(){
					var resulttip = $('#J_resulttip');

					if(follow){
						//Ԫ���Ϸ���λ
						var elem_offset_left = elem.offset().left,
							pop_width = resulttip.innerWidth(),
							win_width = $(window).width(),
							left;

						if(win_width - elem_offset_left < pop_width) {
							left = win_width - pop_width
						}else{
							left = elem_offset_left - (pop_width - elem.innerWidth())/2;
						}

						var top = elem.offset().top - resulttip.height() - 15;

						resulttip.css({
							left: left,
							top: top > 0 ? top : elem.offset().top+elem.height() + 15
						});

					}

					_this.rt_timer = setTimeout(function(){
						resulttip.fadeOut(function () {
							resulttip.remove();

							//�ص�
							callback && callback();
						});
					}, 1500);
				}
			});
		})
	},
	showVerifyPop : function(subButton){
		//������֤��

		if(subButton.data('checked')) {
			//�Ѿ���֤��
			Wind.dialog.closeAll();
			return false;
		}

		var _this = this;
		Wind.use('dialog', function(){
			Wind.dialog.html('<form method="post" action="" id="J_head_question_form">\
				<div class="pop_cont" style="width:400px;">\
					<dl>\
						<dt>��֤�룺</dt>\
						<dd><input type="text" name="code" class="input length_4" id="J_verify_input"><div id="J_verify_code"></div></dd>\
					</dl>\
				</div>\
				<div class="pop_bottom">\
					<button class="btn btn_submit" type="submit" id="J_verify_sub">�ύ</button>\
				</div>\
				</form>', {
				id : 'J_verify_pop',
				//cls : 'pop_login core_pop_wrap',
				position : 'fixed',
				isMask : true,
				isDrag : true,
				title : '��֤��',
				callback : function(){
					_this.getVerifyTemp({
						wrap: $('#J_verify_code')				//��֤������
					});

					//�ύ��֤��
					var check_sub = $('#J_verify_sub');
					var form = $("#J_verify_pop").find('form').eq(0);
					form.submit(function(e){
						e.preventDefault();
						Wind.Util.ajaxBtnDisable(check_sub);

						$.post(GV.URL.VARIFY_CHECK, {code : $('#J_verify_input').val()}, function(data){
							if(data.state == 'success') {
								//��֤ͨ�� ��ӱ�ʶ �����ύ
								subButton.data('checked', true).click();
								//Wind.dialog.closeAll();
							}else if(data.state == 'fail') {
								Wind.Util.ajaxBtnEnable(check_sub);
								_this.formBtnTips({
									error : true,
									wrap : check_sub.parent(),
									msg : data.message
								});
							}
						}, 'json');
					});
				}
			});

		});

		return true;
	},
	popPos : function(wrap){
		//�������ж�λ
		var top,
			win_height = $(window).height(),
			wrap_height = wrap.outerHeight();

		if(win_height < wrap_height) {
			top = 0;
		}else{
			top = ($(window).height() - wrap.outerHeight())/2;
		}

		wrap.css({
			top : top + $(document).scrollTop(),
			left : ($(window).width() - wrap.innerWidth())/2
		}).show();
	},
	postTip : function(options){
		//������ʾ ���ٷ�������Ϣ��˽��
		var elem = options.elem,			//��λԪ��
			msg  = options.msg,				//��ʾ��Ϣ
			zindex = options.zindex ? options.zindex : 1,		//zֵ
			callback = options.callback;		//�ص�

		var tip = $('<div id="J_posttip_success" class="my_message_success" style="display:none;z-index:'+ zindex +';">'+ msg +'</div>');
		tip.remove();

		tip.appendTo('body').css({
			left : elem.offset().left + (elem.width() - tip.width())/2,
			top : elem.offset().top + (elem.height() - tip.height())/2
		}).fadeIn().delay(1500).fadeOut(function(){
			$(this).remove();
			//�ص�
			callback && callback();
		});

	},
	quickLogin : function(referer){
		var _this = this;
		//��ݵ�¼
		if(GV.U_ID) {
			//�ѵ�¼
			return;
		}

		var qlogin_pop = $('#J_qlogin_pop');
		if(qlogin_pop.length) {
			//�ѵ���

			//global.js
			qlogin_pop.show();

			$('#J_qlogin_username').focus();
			$('#J_qlogin_form').data('referer', referer).resetForm();		//��¼����ת��ַ
		}else{
			Wind.Util.ajaxMaskShow();

			//δ��¼����ȡ��¼html, QUICK_LOGIN head.htm
			$.post(GV.URL.QUICK_LOGIN, function(data){
				_this.ajaxMaskRemove();

				if(Wind.Util.ajaxTempError(data)) {
					return false;
				}
				Wind.use('dialog', function(){

						Wind.dialog.html(data, {
							id : 'J_qlogin_pop',
							cls : 'pop_login core_pop_wrap',
							position : 'fixed',
							isMask : false,
							isDrag : true,
							width :350,
							callback : function(){
								var qlogin_pop = $('#J_qlogin_pop');

								if(data.indexOf('J_qlogin_username') < 0) {
									//��¼�������ˣ��������δ��¼ҳ
									window.location.href = referer;
									return false;
								}

								$('#J_qlogin_username').focus();

								//��¼����ת��ַ
								$('#J_qlogin_form').data('referer', referer);

								Wind.Util.getVerifyTemp({
									wrap : $('#J_verify_code')
								});

								Wind.js(GV.JS_ROOT +'pages/common/quickLogin.js?v='+ GV.JS_VERSION);

							}
						});

				});

			}, 'html');
		}
	}
};



(function () {

	//ǰ̨post���ݷ��� pdata
	$('body').on('setCustomPost', function(event, elem) {
		if(elem.attr('data-pdata')) {
			try{
				var pdata = $.parseJSON(elem.attr('data-pdata').replace(/'/g, '"'));
				$.ajaxSetup({
					data: function(){
						pdata.csrf_token = GV.TOKEN;
						return pdata;
					}()
				})
			}catch(e){
				$.error(e);
			}
		}
	});

	//ȫ��ajax����
	$.ajaxSetup({
		data : {
			csrf_token : GV.TOKEN
		},
		beforeSend:function(jqXHR, settings) {
			//����������һ������ô����ͬ��������Ϊajax�������м���������
			var url = settings.url,
				local_url = location.href,
				url_re = /^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/;
			var url_matches = url_re.exec( url ) || [];
			var local_matches = url_re.exec( local_url ) || [];

			var main_reg = /[\w-]+\.(com|net|org|gov|cc|biz|info|cn)(\.(cn|hk))*$/,
				url_main = main_reg.exec(url_matches[3]) || [],
				local_main = main_reg.exec(local_matches[3]) || [1];

			if(url_matches[3] !== local_matches[3] && url_main[0] == local_main[0]) {
				//������ 
				if($.browser.msie) {
					//ie �¿��򱨴�no transport
					$.support.cors = true;
				}
				settings.url = settings.url.replace(url_matches[3],local_matches[3]);
			}else{
				return;
			}
			jqXHR.setRequestHeader('X-Requested-With','XMLHttpRequest');
		},
		error : function(jqXHR, textStatus, errorThrown){
			//����ʧ�ܴ���
			if(errorThrown) {
				//�Ƴ�ajax��������
				Wind.Util.ajaxMaskRemove();

				//�Ƴ���ť�ύ��״̬
				var btn = $('button.disabled:submit');
				for(i=0, len = btn.length; i<len; i++) {
					if($(btn[i]).data('sublock')) {
						Wind.Util.ajaxBtnEnable($(btn[i]));
						break;
					}
				}

				$.error(errorThrown);
			}
		}
	});

	if($.browser.msie) {
		//ie ��������
		$.ajaxSetup({
			cache : false
		});
	}

	//��֧��placeholder������¶�placeholder���д���
	if(document.createElement('input').placeholder !== '') {
		$('head').append('<style>.placeholder{color: #aaa;}</style>');
		$('[placeholder]').focus(function() {
			var input = $(this);

			if(input.val() == input.attr('placeholder')) {
				input.val('');
				input.removeClass('placeholder');
			}
		}).blur(function() {
			var input = $(this);
			//������
			if(this.type === 'password') {
				return false;
			}
			if(input.val() == '' || input.val() == input.attr('placeholder')) {
				input.addClass('placeholder');
				input.val(input.attr('placeholder'));
			}
		}).blur().parents('form').submit(function() {
			$(this).find('[placeholder]').each(function() {
				var input = $(this);
				if(input.val() == input.attr('placeholder')) {
					input.val('');
				}
			});
		});
	}

	//�Ƿ�༭ģʽ
	window.DESIGN_MODE = ( document.getElementById('J_top_design') ? true : false );


	//������¼
	var username = $('#J_username'),
		sidebar_login_btn = $('#J_sidebar_login');
	if (username.length) {

		Wind.use('ajaxForm', function () {

			var password = $('#J_password');

			$("#J_login_form").ajaxForm({
				dataType : 'json',
				beforeSubmit : function (arr, $form, options) {
					Wind.Util.ajaxBtnDisable(sidebar_login_btn);
					$('#J_login_tips').remove();
				},
				success : function (data, statusText, xhr, $form) {

					if (data.state === 'success') {
						if (data.message.check.url) {
							//��֤����
							
							Wind.use('dialog', function(){
								$.post(data.message.check.url, function (data) {
									//���������������ʾ����
									Wind.Util.ajaxBtnEnable(sidebar_login_btn);
									if(Wind.Util.ajaxTempError(data)) {
										return;
									}

									Wind.dialog.html(data, {
										id: 'J_login_question_wrap',
										isDrag: true,
										isMask: false,
										onClose: function(){
											sidebar_login_btn.focus();
										}
									})

									//��ý���
									var question_wrap = $('#J_login_question_set_wrap, #J_login_question_wrap');

									question_wrap.find('input:text:visible:first').focus();

									Wind.Util.getVerifyTemp({
										wrap: $('#J_verify_code') //��֤������
									});
								}, 'html');
							});
							
						} else {
							window.location.href = decodeURIComponent(data.referer);
						}

					} else {
						Wind.Util.ajaxBtnEnable(sidebar_login_btn);
						$('<div id="J_login_tips" style="display:none;"><div class="tips"><div class="tips_icon_error">'+ data.message +'</div></div></div>').appendTo($('#J_sidebar_login_dt')).fadeIn(200).delay(3000).fadeOut();
					}
				}

			});

		});

	}

	//ie6 hoverͷ��
	var ava_ie6 = $('#J_ava_ie6');
	if(ava_ie6.length && $.browser.msie && $.browser.version < 7) {
		ava_ie6.hover(function(){
			ava_ie6.addClass('hover');
		}, function(){
			ava_ie6.removeClass('hover');
		});
	}

	//�жϴ�����ݵ�¼
	if(!GV.U_ID) {
		$(document).on('click', 'a.J_qlogin_trigger, button.J_qlogin_trigger', function(e){
			e.preventDefault();
			var referer = $(this).data('referer');					//��¼����ת����ˢ��
			Wind.Util.quickLogin(referer ? this.href : '');
		});
	}

	//select�ؼ������������
	var date_select = $('.J_date_select');
	if (date_select.length) {
		Wind.use('dateSelect', function () {
			date_select.dateSelect();
		});
	}

	//ȫѡ
	if ($('.J_check_wrap').length) {
		//��������ȫѡ��
		$.each($('input.J_check_all'), function (i, o) {
			var $o = $(o),
				check_wrap = $o.parents('.J_check_wrap'), //��ǰ�����������и�ѡ��ĸ���ǩ
				check_all = check_wrap.find('input.J_check_all'), //��ǰ������������(ȫѡ)��ѡ��
				check_items = check_wrap.find('input.J_check'); //��ǰ������������(��ȫѡ)��ѡ��

			//���ȫѡ��
			$o.change(function (e) {
				if ($(this).attr('checked')) {
					//ȫѡ
					check_items.attr('checked', true);

					if (check_items.filter(':checked').length === check_items.length) {
						check_all.attr('checked', true); //����ȫѡ��
					}

				} else {
					//ȡ��ȫѡ
					check_items.removeAttr('checked');
					check_all.removeAttr('checked');
				}
			});

			//���(��ȫѡ)��ѡ��
			check_items.change(function () {
				if ($(this).attr('checked')) {

					if (check_items.filter(':checked').length === check_items.length) {
						check_all.attr('checked', true); //����ȫѡ��
					}

				} else {
					check_all.removeAttr('checked'); //ȡ��ȫѡ
				}
			});

		});
	}


	var header = $('#J_header'), //ͷ��
		header_wrap = header.parent(), //ͷ��ͨ��
		header_pos = header_wrap.css('position'), //ͷ��ͨ����λ��ʽ
		head_msg_pop = $('#J_head_msg_pop'); //ͷ����Ϣ����

	//���ͷ���û���
	var head_user_a = $('#J_head_user_a');
	if(head_user_a.length) {
		Wind.Util.clickToggle({
			elem : head_user_a,				//���Ԫ��
			list : $('#J_head_user_menu'),			//�����˵�
			callback : function(elem, list) {
				if (header_pos == 'static') {
					//Ĭ�϶�λ ����ҳ
					list.css({
						position : 'absolute',
						top : elem.offset().top + elem.height() + 15
					});
				}

				$('#J_head_pl_user').off('click').on('click', function(e){
					e.preventDefault();
					list.hide();
				});
			}
		});
	}


	//ͷ��js
	var head_msg_btn = $('#J_head_msg_btn');//��Ϣ��ť
	if(!DESIGN_MODE && (head_msg_btn.length || GV.U_ID)) {
		//ͷ����Ϣ
		Wind.Util.clickToggle({
			elem : head_msg_btn,
			list : head_msg_pop,
			callback : function(elem, list){
				//��λ ��ʾ
				var _this = this;
				list.css({
					position : ($.browser.version < 7 ? 'absolute' : 'fixed'),
					left : header.width() + header.offset().left - head_msg_pop.outerWidth(),
					top : head_msg_btn.offset().top+head_msg_btn.height()+7 - $(document).scrollTop()
				});

				//headMsg�Ƿ��Ѽ���
				Wind.js(GV.JS_ROOT+ 'pages/common/headMain.js?v='+ GV.JS_VERSION);

				//�����Ϣ���ֵ�ͼƬ �����б�
				$('#J_head_pl_hm').off('click').on('click', function(e){
					e.preventDefault();
					list.hide();
					
					$('#J_emotions_pop').hide();
					$('#J_hm_home').show().siblings().remove();
				});
			},
			callbackHide : function(elem, list){
				//��ʾ��Ϣ��ҳ�б�
				$('#J_emotions_pop').hide();
				$('#J_hm_home').show().siblings().remove();
			}
		});

		//ͷ������
		var head_forum_post = $('#J_head_forum_post'),	//ͷ��������ť
			head_forum_pop = $('#J_head_forum_pop');		//ͷ�������б�
		Wind.Util.clickToggle({
			elem : head_forum_post,
			list : head_forum_pop,
			callback : function(){
				//wind.js�����ظ�����
				Wind.js(GV.JS_ROOT +'pages/common/headMain.js?v='+ GV.JS_VERSION);

				var position,
					top,
					header_pos = $('#J_header').parent().css('position');

				if(header_pos == 'static') {
					//����ҳ
					position = 'absolute';
				}else{
					if($.browser.msie && $.browser.version < 7) {
						position = 'absolute';
					}else{
						position = 'fixed';
					}
				}

				if(position == 'absolute') {
					top = head_forum_post.offset().top + head_forum_post.height();
				}else{
					top = head_forum_post.offset().top + head_forum_post.height() - $(document).scrollTop();
				}

				$('#J_head_forum_pop').css({
					position : position,
					top : top
				});
			}
		});
	}


	//����ѫ�¹���
	var medal_widget_ul = $('#J_medal_widget_ul');
	if(medal_widget_ul.length){
		var sidebar_medal_ta = $('#J_sidebar_medal_ta'),
				sidebar_medal_text = $(sidebar_medal_ta.text()),			//�����ı�
				sidebar_medal_ul_len = medal_widget_ul.children().length,	//��ʾ����
				sidebar_medal_arr = [];

		sidebar_medal_text.each(function(i, o){
			//�޳��սڵ�
			if(o.nodeType == 1) {
				var $o = $(o),
					cls = $o.attr('class') ? $o.attr('class') : '';
				sidebar_medal_arr.push('<li class="'+  cls +'">'+ $o.html() +'</li>');
			}
		});


		//���������б�ɼ���
		if(sidebar_medal_arr.length > sidebar_medal_ul_len) {
			Wind.use('lazySlide', function(){
				$('#J_medal_widget').lazySlide({
					step_length : sidebar_medal_ul_len,
					html_arr : sidebar_medal_arr
				});
			});
		}

	}

	//���̷�ҳ
	var page_wrap = $('.J_page_wrap');
	if(page_wrap.length && page_wrap.data('key') && !DESIGN_MODE) {
		$(document).on('keyup', function(e){
			var focus_el = $(':focus');
				
			if(focus_el.length) {
				var lowercase = focus_el[0].tagName.toLowerCase();
				if(lowercase == 'textarea' || lowercase == 'input') {
					//����۽����������ȡ����ҳ
					return;
				}
			}

			if(e.keyCode == 37) {
				var prev = page_wrap.find('a.J_pages_pre');
				if(prev.length) {
					location.href = prev.attr('href');
				}
			}else if(e.keyCode == 39) {
				var next = page_wrap.find('a.J_pages_next');
				if(next.length) {
					location.href = next.attr('href');
				}
			}
		});
	}

	//ê�㶨λ
	if(!DESIGN_MODE) {
		Wind.Util.hashPos();
	}

	//��¼�ж� ���ֽ���
	if(GV.CREDIT_REWARD_JUDGE) {
		Wind.Util.creditReward();
	}

	//��������ַ���
	$('dt.J_sidebar_forum_toggle').on('click', function(){
		var this_dl = $(this).parent();
		this_dl.toggleClass('current');
		this_dl.siblings('dl.current').removeClass('current');
	});

	//����ģ���ַ���
	$('.J_sidebar_box_toggle').on('click', function(){
		var par = $(this).parent();
		par.toggleClass('my_forum_list_cur');
	});
	
	//inputֻ����������
	$('input.J_input_number').on('keyup', function(){
		var v = $(this).val();
		$(this).val(v.replace(/\D/g,''));
	});

	//ϲ�����
	var like_btn = $('.J_like_btn');
	if (like_btn.length && GV.U_ID && !DESIGN_MODE) {
		Wind.js(GV.JS_ROOT+ 'pages/common/likePlus.js?v='+ GV.JS_VERSION, function () {
			likePlus(like_btn);
		});
	}

	//����Ϣ_����
	var send_msg_btn = $('a.J_send_msg_pop');
	if(send_msg_btn.length && GV.U_ID && !DESIGN_MODE) {
		Wind.js(GV.JS_ROOT+ 'pages/common/sendMsgPop.js?v='+ GV.JS_VERSION);
	}

	//�������
	var date_btns = $("input.J_date");
	if(date_btns.length) {
		Wind.use('datePicker',function() {
			date_btns.datePicker();
		});
	}

	//tab���
	var tab_wrap = $('.J_tab_wrap');
	if(tab_wrap.length) {
		Wind.use('tabs', function(){
			tab_wrap.each(function(){
				$(this).find('.J_tabs_nav').first().tabs($(this).find('div.J_tabs_ct').first().children('div'));
			});
		});
	}

	//�û������ǩ���
	if ($('.J_user_tag_wrap').length && !DESIGN_MODE) {
		Wind.js(GV.JS_ROOT+ 'pages/common/userTag.js?v=' + GV.JS_VERSION);
	}

	//Ĭ��ͷ��
	var avas = $('img.J_avatar');
	if(avas.length) {
		Wind.Util.avatarError(avas);
	}

	//���ܼ�iframe
	var ad_iframes_div = $('div.J_ad_iframes_div'),
			ad_iframes_len = ad_iframes_div.length;
	if(ad_iframes_len && !DESIGN_MODE) {
		var ad_isf = Wind.Util.flashPluginTest() ? '1' : '0';
		for(i=0; i<ad_iframes_len; i++) {
			var ad_item = $(ad_iframes_div[i]),
					ad_iframe = document.createElement('iframe');
			$(ad_iframe).attr({
				src : ad_item.data('src')+'&isf='+ad_isf,
				frameborder	: '0',
				scrolling	: 'no',
				height		: ad_item.data('height'),
				width		: ad_item.data('width')
			});

			ad_item.replaceWith(ad_iframe);
		}
	}



	//��֤��ģ���滻
	var verify_code = $('#J_verify_code');
	if(verify_code.length) {
		Wind.Util.getVerifyTemp({wrap : verify_code});
	}

	//�����Զ�ƥ��
	var email_match = $('input.J_email_match');
	if(email_match.length) {
		email_match.attr('autocomplete', 'off');
		Wind.use('emailAutoMatch', function(){
			email_match.emailAutoMatch();
		});
	}

	//�ٱ�
	var report = $('a.J_report');
	if(report.length && GV.U_ID && !DESIGN_MODE) {
		Wind.js(GV.JS_ROOT+ 'pages/common/report.js?v='+ GV.JS_VERSION);
	}

	//�������
	var region_set = $('.J_region_set');
	if(region_set.length) {
		Wind.use('region', function(){
			$('a.J_region_change').region();
		});
	}

	//����-������ʶ&��
	if(!DESIGN_MODE && ($('#J_friend_maybe').length || $('#J_punch_mine').length)) {
		Wind.js(GV.JS_ROOT + 'pages/common/sidebarMain.js?v=' + GV.JS_VERSION);
	}

	//�ƻ����� ȫ��ִ������
	if(GV.URL.CRON_AJAX) {
		var cron_img = new Image();
		cron_img.src=GV.URL.CRON_AJAX;
	}

	//�������
	var insert_emotions = $('a.J_insert_emotions');
	if(insert_emotions.length && !DESIGN_MODE) {
		Wind.js(GV.JS_ROOT+ 'pages/common/insertEmotions.js?v='+ GV.JS_VERSION, function(){
			insert_emotions.on('click', function(e){
				e.preventDefault();
				insertEmotions($(this), $($(this).data('emotiontarget')));
			});
		});
	}

	//textarea�� @ ����
	if(!DESIGN_MODE) {
		$(document).on('focus', '.J_at_user_textarea', function(){
			var elem = $(this);
			Wind.js(GV.JS_ROOT + 'pages/common/userAt.js?v=' + GV.JS_VERSION, function(){
				userAutoTips({elem:elem[0]});
			});
		});
	}

	//ͼƬ�ϴ�Ԥ��
	if($("input.J_upload_preview").length) {
		Wind.use('uploadPreview',function() {
			$("input.J_upload_preview").uploadPreview();
		});
	}

	//�õ�Ƭ
	var gallery_list = $('ul.J_gallery_list');
	if(gallery_list.length && !DESIGN_MODE) {
		Wind.use('gallerySlide', function(){
			gallery_list.gallerySlide();
		});
	}

	//���븴��_��Ԫ��
	var clipboard_input = $('a.J_clipboard_input'); //���ư�ť
	if(clipboard_input.length) {
		if(!$.browser.msie && !Wind.Util.flashPluginTest(9)) {
			if(confirm('�����������δ��װflash��������븴�Ʋ����ã����ȷ������')) {
				location.href = 'http://get.adobe.com/cn/flashplayer/';
			};
			return;
		}

		Wind.use('textCopy', function() {
			for(i=0, len=clipboard_input.length; i<len; i++) {
				var item = $(clipboard_input[i]);
				item.textCopy({
					content : $('#' + item.data('rel')).val()
				});
			}
		});
	}

})();

$.error = function(message) {
	//��д$.error
	//TODO:�ĳɸ�������Ĵ�����Ϣ����
	console.error(message);
};

//�������
(function(){
	var an_slide_auto = $('ul.J_slide_auto'),
		an_lock = false,											//��������
		an_timer,
		step_h = an_slide_auto.children().height(),
		an_h = an_slide_auto.height();								//����߶�

	an_slide_auto.hover(function(){
		//�����룬����
		an_lock = true;
	}, function(){
		//�����룬���� ִ��
		an_lock = false;
		anMove();
	});
	anMove();

	function anMove(){
		clearTimeout(an_timer);
		if(an_lock || an_h == step_h) {
			//�����򲻳���2��ʱ��ִ��
			return false;
		}
		var mgtop = parseInt(an_slide_auto.css('marginTop').replace('px', '')),
			mgtop_remove = Math.abs(mgtop) + step_h;

		an_timer = setTimeout(function(){
			if(!an_lock) {
				an_slide_auto.animate({'marginTop' : -mgtop_remove}, function(){
					if(mgtop_remove >= an_h) {
						//����
						an_slide_auto.css('marginTop', 0);
					}
					anMove();
				});
			}
		}, 5000);
	}
})();

//�ص�����
(function () {
    var back_top_btn = $('#back_top');
    if ($.browser.msie && $.browser.version < 7) {
        back_top_btn.remove();
        return; //ie6��֧�ֻص�����
    }
    if (back_top_btn.length) {
        var scrollTimer;
        $(window).scroll(function () {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(function () {
                var scrollTop = $(this).scrollTop();
                if (scrollTop > 400) {
                    back_top_btn.fadeIn();
                } else {
                    back_top_btn.fadeOut();
                }
            }, 100);
        });
        back_top_btn.on('click', function (e) {
            e.preventDefault();
            $('body,html').animate({
                scrollTop: 0
            }, 400);
        });
    }
})();

//ios/android����mouse�¼� by kejun https://gist.github.com/3358036
;(function ($) {
    $.support.touch = 'ontouchend' in document;

    if (!$.support.touch) {
        return;
    }

    var eventMap = {
        click: 'touchend',
        mousedown: 'touchstart',
        mouseup: 'touchend',
        mousemove: 'touchmove'
    };

    var simulateEvent = function (eventType) {
        $.event.special[eventType] = {
            setup: function () {
                var el = $(this);
                el.bind(eventMap[eventType], $.event.special[eventType].handler);
                if (this.nodeName === 'A' && eventType === 'click') {
                    this.addEventListener('click', function (e) {
                        e.preventDefault();
                    }, false);
                }
            },
            teardown: function () {
                $(this).unbind(eventMap[eventType], $.event.special[eventType].handler);
            },
            handler: function (e) {
                var touch = e.originalEvent.changedTouches[0];
                e.type = eventType;
                e.pageX = touch.pageX;
                e.pageY = touch.pageY;
                e.clientX = touch.clientX;
                e.clientY = touch.clientY;
                $.event.handle.call(this, e);
            }
        };
    };

    $.fn.delegate = function (selector, types, data, fn) {
        var params = data;
        if (typeof data === 'function') {
            fn = data;
            params = null;
        }
        var handler = function (e) {
            if (this.nodeName === 'A' && e.type === 'click') {
                this.addEventListener('click', function (e) {
                    e.preventDefault();
                }, false);
            }
            fn.apply(this, arguments);
        };
        return this.live(types, params, handler, selector);
    };

    $.each(['click', 'mousedown', 'mousemove', 'mouseup'],

    function (i, name) {
        simulateEvent(name);
    });

})(jQuery);


//С��Ƭ
(function(){
	var user_card_show = $('a.J_user_card_show'),
		card_wrap = '<div class="pop_card J_pop_card" id="_ID"><div class="arrow J_card_arrow"><em></em><span></span><strong></strong></div><div class="pop_loading J_pop_loading"></div></div>';
	
	var lock_hide = false, //��������, true��ʾ������
		timeout;
	
	//�����û�����ͷ�񴥷�
	var i = 0;
	$(document).on('mouseenter', 'a.J_user_card_show', function(e){
		e.preventDefault();
		i += 1;
		var $this = $(this),
			uid = $this.data('uid'),
			uname = $this.data('username'),
			param = $this.data('param'); //��Ƭ��ʶ����

		if(uid === 0) {
			//�ο�
			return false;
		}

		if(!param) {
			param = uid ? uid : 'c' + i;
			$this.data('param', param);
		}
		
		var card_item = $('#J_user_card_'+ param);

		lock_hide = true;
		
		clearTimeout(timeout);
		timeout = setTimeout(function(){
			//����������С��Ƭ
			$('div.J_pop_card').hide();
			
			if(card_item.length) {
				//�Ѵ�������ʾ
				card_item.show();
				cardPos($this, card_item);
			}else{
				//������������
				$('body').append(card_wrap.replace('_ID', 'J_user_card_'+ param));
				var card = $('#J_user_card_'+ param);
				cardPos($this, card);

				$.post(GV.URL.USER_CARD, {
					username : uname,
					uid : uid
				}, function(data){
					if(Wind.Util.ajaxTempError(data)) {
						card.remove();
						return;
					}

					card.find('.J_pop_loading').replaceWith(data);
					cardPos($this, card);
				}, 'html');
			
			}
			
		}, 300);
		
	}).on('mouseleave', 'a.J_user_card_show', function(e){
		//�뿪
		clearTimeout(timeout);		//����ajax
		lock_hide = false;				//��������
		
		var $this = $(this),
			card = $('#J_user_card_'+ $this.data('param'));

		timeout = setTimeout(function(){
			if(!lock_hide){
				card.hide();
			}
		}, 300);
	});
	
	$(document).on('mouseenter', 'div.J_pop_card', function(){
		//����С��Ƭ
		lock_hide = true;
	}).on('mouseleave', 'div.J_pop_card', function(){
		//�뿪С��Ƭ
		var $this = $(this);
		lock_hide = false;
		
		setTimeout(function(){
			if(!lock_hide){
				$this.hide();
			}
		}, 300);
	});

	//��λ
	function cardPos(elem, wrap){
		var left,																			//��Ƭˮƽλ��
				top,
				cls = 'arrow',														//����class����
				_cls = 'arrow_bottom',										//����class����
				elem_offset_left = elem.offset().left,
				elem_offset_top = elem.offset().top,
				wrap_width = wrap.outerWidth(),						//��Ƭ���
				wrap_height = wrap.outerHeight() + 15,		//��Ƭ�߶� 15Ϊ���Ǹ߶�
				win_width = $(window).width(),
				arror_left = elem.innerWidth() / 2 - 9;		//С����ˮƽλ��
			
		//�ж��Ҳ����Ƿ��㹻
		if(win_width - elem_offset_left < wrap_width) {
			left = win_width - wrap_width;
			arror_left = elem_offset_left - left + elem.innerWidth() / 2 - 9;
		}else{
			left = elem_offset_left;
		}
		
		//�жϴ����·��߶��Ƿ��㹻
		var elem_window_top = elem_offset_top - $(document).scrollTop(),										//����Ԫ�ص����ڶ�������
			elem_window_bottom = $(window).height() - elem_window_top - elem.innerHeight();			//����Ԫ�ص����ڵײ�����
		
		//Ĭ����ʾ���Ϸ�
		top = elem.offset().top + elem.innerHeight() + 10;
		
		if(wrap_height > elem_window_bottom && wrap_height <= elem_window_top) {
			//��ʾ���Ϸ�
			top = elem_offset_top - wrap_height;
			cls = 'arrow_bottom';
			_cls = 'arrow'
		}
		
		//С��Ƭλ��
		wrap.css({
			left : left,
			top: top
		});
		
		//С����λ��
		wrap.find('.J_card_arrow').css({
			left : arror_left
		}).removeClass(_cls).addClass(cls);
		
		//д˽��
		if($('a.J_send_msg_pop').length && !DESIGN_MODE) {
			Wind.js(GV.JS_ROOT+ 'pages/common/sendMsgPop.js?v='+ GV.JS_VERSION);
		}
		
		//��ע��ȡ��
		var lock = false;
		$('a.J_card_follow').off('click').on('click', function(e){
			if(lock) {
				return false;
			}
			lock = true;
			e.preventDefault();
			var $this = $(this);
			$.post(this.href, {
				uid: $this.data('uid')
			}, function(data){
				if(data.state == 'success') {
					$this.parent('.J_follow_wrap').hide().siblings('.J_follow_wrap').show();
				}else if(data.state == 'fail') {
					//global.js
					Wind.Util.resultTip({
						error : true,
						msg : data.message
					});
				}
				lock = false;
			}, 'json');
		});
	}


})();

//��������
(function(){
	var lock = false;
	$('a.J_link_apply').on('click', function(e){
			e.preventDefault();
			var $this = $(this);

			if($('#J_link_apply_pop').length) {
				return false;
			}

			if(lock == true) {
				return false;
			}
			lock = true;

			$.post(this.href, function(data){
				if(Wind.Util.ajaxTempError(data)) {
					return false;
				}

				Wind.use('dialog', function(){
					Wind.dialog.html(data, {
						id : 'J_link_apply_pop',
						title : '��������',
						//cls : 'pop_login core_pop_wrap',
						position : 'fixed',
						isMask : false,
						isDrag : true,
						width : 450,
						callback : function(){
							var link_apply_btn = $('#J_link_apply_btn');
							Wind.use('ajaxForm', function(){
								$('#J_link_apply_form').ajaxForm({
									beforeSubmit : function(){
										Wind.Util.ajaxBtnDisable(link_apply_btn);
									},
									dataType : 'json',
									success : function(data){
										if(data.state == 'success') {
											Wind.Util.formBtnTips({
												wrap : link_apply_btn.parent(),
												msg : data.message,
												callback : function(){
													Wind.dialog.closeAll();
												}
											});
										}else if(data.state == 'fail') {
											Wind.Util.formBtnTips({
												error : true,
												wrap : link_apply_btn.parent(),
												msg : data.message
											});
										}
										Wind.Util.ajaxBtnEnable(link_apply_btn);
									}
								});
							});
							

							lock = false;
						}
					});
				});
			}, 'html');
		});

})();
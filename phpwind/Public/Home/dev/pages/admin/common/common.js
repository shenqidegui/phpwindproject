/*
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ��̨ȫ�ֹ���js����footer.htmģ�����ã�
 * @Author	: chaoren1641@gmail.com linhao87@gmail.com
 * @Depend	: core.js��jquery.js(1.7 or later)
 * $Id: common.js 28795 2013-05-24 05:28:06Z hao.lin $		:
 */
;(function() {
	//ȫ��ajax����
	$.ajaxSetup({
		complete: function(jqXHR) {
			//��¼ʧЧ����
		   if(jqXHR.responseText.state === 'logout') {
		   	location.href = GV.URL.LOGIN;
		   }
  	},
  	data : {
  		csrf_token : GV.TOKEN
  	},
		error : function(jqXHR, textStatus, errorThrown){
			//����ʧ�ܴ���
			alert(errorThrown ? errorThrown : '����ʧ��');
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
		$('[placeholder]').focus(function() {
			var input = $(this);
			if(input.val() == input.attr('placeholder')) {
				input.val('');
				input.removeClass('placeholder');
			}
		}).blur(function() {
			var input = $(this);
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


	//�ύ��ť�Ƿ�̶��ײ�
	setBtnWrap();
	/*$(window).on('resize', function(){
		setBtnWrap(true);
	});*/
	function setBtnWrap(reset){
		if(parent.Wind && parent.Wind.dialog) {
			//���˵���
			return ;
		}

		if($('body').height() <= $(window).height()) {
			$('div.btn_wrap').removeClass('btn_wrap');
		}else{
			if(reset) {
				var par = $('button.J_ajax_submit_btn:last').parent().parent();
				if(!par.attr('class')) {
					//classһ��Ϊ��
					par.addClass('btn_wrap');
				}
			}
		}
	}

	//iframeҳ��f5ˢ��
	$(document).on('keydown', function(event){
		var e = window.event || event;
		if(e.keyCode == 116) {
			e.keyCode = 0;

			var $doc = $(parent.window.document),
					id = $doc.find('#B_history .current').attr('data-id'),
					iframe = $doc.find('#iframe_'+ id);
			if(iframe[0].contentWindow) {
				//common.js
				reloadPage(iframe[0].contentWindow);
			}

			//!ie
			return false;
		}

	});

	//���м���dialog������a���ӣ��Զ���������href
	if( $('a.J_dialog').length ) {
		Wind.use('dialog',function() {
			$('.J_dialog').on( 'click',function(e) {
				e.preventDefault();
				var _this = $(this);
				Wind.dialog.open( $(this).prop('href') ,{
					onClose : function() {
						_this.focus();//�ر�ʱ�ô���������Ԫ�ػ�ȡ����
					},
					title:_this.prop('title')
				});
			}).attr('role','button');

		});
	}

	//���е�ajax form�ύ,���ڴ��ҵ���߼�����һ���ģ���ͳһ����
	var ajaxForm_list = $('form.J_ajaxForm');
	if( ajaxForm_list.length ) {
		Wind.use('dialog','ajaxForm',function() {

			if($.browser.msie) {
				//ie8�����£�����ֻ��һ���ɼ���input:textʱ��������ҳ�����ת�ύ
				ajaxForm_list.on('submit', function(e){
					//����ֻ��һ���ɼ���input:textʱ��enter�ύ��Ч
					e.preventDefault();
				});
			}

			$('button.J_ajax_submit_btn').on('click', function(e) {
				e.preventDefault();
				/*var btn = $(this).find('button.J_ajax_submit_btn'),
					form = $(this);*/
				var btn = $(this),
					form = btn.parents('form.J_ajaxForm');

				//�������� �ж�ѡ��
				if(btn.data('subcheck')) {
					btn.parent().find('span').remove();
					if(form.find('input.J_check:checked').length) {
						var msg = btn.data('msg');
						if(msg) {
							Wind.dialog({
								type : 'confirm',
								isMask	: false,
								message : btn.data('msg'),
								follow	: btn,
								onOk	: function() {
									btn.data('subcheck', false);
									btn.click();
								}
							});
						}else{
							btn.data('subcheck', false);
							btn.click();
						}

					}else{
						$( '<span class="tips_error">������ѡ��һ��</span>' ).appendTo(btn.parent()).fadeIn( 'fast' );
					}
					return false;
				}

				//ie����placeholder�ύ����
				if($.browser.msie) {
					form.find('[placeholder]').each(function() {
						var input = $(this);
						if(input.val() == input.attr('placeholder')) {
							input.val('');
						}
					});
				}

				form.ajaxSubmit({
					url : btn.data('action') ? btn.data('action') : form.attr('action'),			//��ť���Ƿ��Զ����ύ��ַ(�ఴť���)
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
									if(window.parent.Wind.dialog) {
										//iframe����ҳ
										window.parent.location.href = decodeURIComponent(data.referer);
									}else {
										window.location.href = decodeURIComponent(data.referer);
									}
								}else {
									if(window.parent.Wind.dialog) {
										reloadPage(window.parent);
									}else {
										reloadPage(window);
									}
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
	}

	//dialog�����ڵĹرշ���
	$('#J_dialog_close').on('click', function(e){
		e.preventDefault();
		if(window.parent.Wind.dialog) {
			window.parent.Wind.dialog.closeAll();
		}
	});

	//���е�ɾ��������ɾ�����ݺ�ˢ��ҳ��
	if( $('a.J_ajax_del').length ) {
		Wind.use('dialog',function() {

			$('.J_ajax_del').on('click',function(e) {
				e.preventDefault();
				var $this = $(this), href = $this.prop('href'), msg = $this.data('msg'), pdata = $this.data('pdata');
				var params = {
					message	: msg ? msg : 'ȷ��Ҫɾ����',
					type	: 'confirm',
					isMask	: false,
					follow	: $(this),//���津���¼���Ԫ����ʾ
					onOk	: function() {
						$.ajax({
							url: href,
							type : 'post',
							dataType: 'json',
							data: function(){
								if(pdata) {
									pdata = $.parseJSON(pdata.replace(/'/g, '"'));
									return pdata
								}
							}(),
							success: function(data){
								if(data.state === 'success') {
									if(data.referer) {
										location.href = decodeURIComponent(data.referer);
									}else {
										reloadPage(window);
									}
								}else if( data.state === 'fail' ) {
									Wind.dialog.alert(data.message);
								}
							}
						});
					}
				};
				Wind.dialog(params);
			});

		});
	}

	//���е�����ˢ�²���
	var ajax_refresh = $('a.J_ajax_refresh'),
		refresh_lock = false;
	if( ajax_refresh.length ) {
		ajax_refresh.on('click', function(e){
			e.preventDefault();
			if(refresh_lock) {
				return false;
			}
			refresh_lock = true;
			var pdata = $(this).data('pdata');

			$.ajax({
				url: this.href,
				type : 'post',
				dataType: 'json',
				data: function(){
					if(pdata) {
						pdata = $.parseJSON(pdata.replace(/'/g, '"'));
						return pdata
					}
				}(),
				success: function(data){
					refresh_lock = false;

					if(data.state === 'success') {
						if(data.referer) {
							location.href = decodeURIComponent(data.referer);
						}else {
							reloadPage(window);
						}
					}else if( data.state === 'fail' ) {
						Wind.dialog.alert(data.message);
					}
				}
			});

		});
	}

	//ʰɫ��
	var color_pick = $('.J_color_pick');
	if(color_pick.length) {
		Wind.use('colorPicker',function() {
			color_pick.each(function() {
				$(this).colorPicker({
					default_color : 'url("'+ GV.URL.IMAGE_RES +'/transparent.png")',		//д��
					callback:function(color) {
						var em = $(this).find('em'),
							input = $(this).next('.J_hidden_color');

						em.css('background',  color);
						input.val(color.length === 7 ? color : '');
					}
				});
			});
		});
	}

	//��������
	if($('.J_font_config').length) {
		Wind.use('colorPicker',function() {
			var elem = $('.color_pick');
			elem.each(function() {
				var panel = $(this).parent('.J_font_config');
				var bg_elem = $(this).find('.J_bg');
				$(this).colorPicker({
					default_color : 'url("'+ GV.URL.IMAGE_RES +'/transparent.png")',
					callback:function(color) {
						bg_elem.css('background',  color);
						panel.find('.case').css('color',color.length === 7 ? color : '');
						panel.find('.J_hidden_color').val(color.length === 7 ? color : '');
					}
				});
			});
		});
		//�Ӵ֡�б�塢�»��ߵĴ���
		$('.J_bold,.J_italic,.J_underline').on('click',function() {
			var panel = $(this).parents('.J_font_config');
			var c = $(this).data('class');
			if( $(this).prop('checked') ) {
				panel.find('.case').addClass(c);
			}else {
				panel.find('.case').removeClass(c);
			}
		});
	}

	/*��ѡ��ȫѡ(֧�ֶ�����ݺ�˫��ȫѡ)��
	 *ʵ�������༭-Ȩ����أ�˫�أ�����֤����-��֤���ԣ����أ�
	 *˵����
	 *	"J_check"��"data-xid"��Ӧ�����"J_check_all"��"data-checklist"��
	 *	"J_check"��"data-yid"��Ӧ���Ϸ�"J_check_all"��"data-checklist"��
	 *	ȫѡ���"data-direction"��������Ƶ�ȫѡ����(x��y)��
	 *	"J_check_wrap"ͬһ��ȫѡ��������ĸ���ǩclass��������ÿ���
	*/

	if($('.J_check_wrap').length) {
		var total_check_all = $('input.J_check_all');

		//��������ȫѡ��
		$.each(total_check_all, function(){
			var check_all = $(this), check_items;

			//������ݺ���
			var check_all_direction = check_all.data('direction');
				check_items = $('input.J_check[data-'+ check_all_direction +'id="'+ check_all.data('checklist') +'"]');

			//���ȫѡ��
			check_all.change(function (e) {
				var check_wrap = check_all.parents('.J_check_wrap'); //��ǰ�����������и�ѡ��ĸ���ǩ�����ÿ��ǣ�

				if ($(this).attr('checked')) {
					//ȫѡ״̬
					check_items.attr('checked', true);

					//�������ѡ��
					if( check_wrap.find('input.J_check').length === check_wrap.find('input.J_check:checked').length) {
						check_wrap.find(total_check_all).attr('checked', true);
					}

				} else {
					//��ȫѡ״̬
					check_items.removeAttr('checked');

					//��һ�����ȫѡ��ȡ��ȫѡ״̬
					var direction_invert = check_all_direction === 'x' ? 'y' : 'x';
					check_wrap.find($('input.J_check_all[data-direction="'+ direction_invert +'"]')).removeAttr('checked');
				}

			});

			//�����ȫѡʱ�ж��Ƿ�ȫ����ѡ
			check_items.change(function(){

				if($(this).attr('checked')) {

					if(check_items.filter(':checked').length === check_items.length) {
						//��ѡ���δѡ��ĸ�ѡ�������
						check_all.attr('checked', true);
					}

				}else{
					check_all.removeAttr('checked');
				}

			});


		});

	}

	/*li�б����&ɾ��(֧�ֶ��)��ʵ��(����֤����-�����֤���⡱�����������-��Ӹ������͡�)��
		<ul id="J_ul_list_verify" class="J_ul_list_public">
			<li><input type="text" value="111" ><a class="J_ul_list_remove" href="#">[ɾ��]</a></li>
			<li><input type="text" value="111" ><a class="J_ul_list_remove" href="#">[ɾ��]</a></li>
		</ul>
		<a data-related="verify" class="J_ul_list_add" href="#">�����֤</a>

		<ul id="J_ul_list_rule" class="J_ul_list_public">
			<li><input type="text" value="111" ><a class="J_ul_list_remove" href="#">[ɾ��]</a></li>
			<li><input type="text" value="111" ><a class="J_ul_list_remove" href="#">[ɾ��]</a></li>
		</ul>
		<a data-related="rule" class="J_ul_list_add" href="#">��ӹ���</a>
	*/
	var ul_list_add = $('a.J_ul_list_add');
	if(ul_list_add.length) {
		var new_key = 0;

		//���
		ul_list_add.click(function(e){
			e.preventDefault();
			new_key++;
			var $this = $(this);

			//"new_"�ַ�����Ψһ��keyֵ��_li_html ���о���ҳ�涨��
			var $li_html = $(_li_html.replace(/new_/g, 'new_'+new_key));

			$('#J_ul_list_'+ $this.data('related')).append($li_html);
			$li_html.find('input.input').first().focus();
		});

		//ɾ��
		$('ul.J_ul_list_public').on('click', 'a.J_ul_list_remove', function(e) {
			e.preventDefault();
			$(this).parents('li').remove();
		});
	}

	//����ѡ����
	var dateInput = $("input.J_date")
	if(dateInput.length) {
		Wind.use('datePicker',function() {
			dateInput.datePicker();
		});
	}

	//����+ʱ��ѡ����
	var dateTimeInput = $("input.J_datetime");
	if(dateTimeInput.length) {
		Wind.use('datePicker',function() {
			dateTimeInput.datePicker({time:true});
		});
	}

	//ͼƬ�ϴ�Ԥ��
	if($("input.J_upload_preview").length) {
		Wind.use('uploadPreview',function() {
			$("input.J_upload_preview").uploadPreview();
		});
	}

	//���븴��
	var copy_btn = $('a.J_copy_clipboard'); //���ư�ť
	if(copy_btn.length) {
		Wind.use('dialog', 'textCopy', function() {
			for(i=0, len=copy_btn.length; i<len; i++) {
				var item = $(copy_btn[i]);
				item.textCopy({
					content : $('#' + item.data('rel')).val()
				});
			}
		});
	}

	//tab
	var tabs_nav = $('ul.J_tabs_nav');
	if(tabs_nav.length) {
		Wind.use('tabs',function() {
			tabs_nav.tabs('.J_tabs_contents > div');
		});
	}

	//radio�л���ʾ��Ӧ����
	var radio_change = $('.J_radio_change');
	if(radio_change.length){

		var radio_c = radio_change.find('input:checked');
		if(radio_c.length) {
			radio_c.each(function(){
				var $this = $(this);
				//ҳ������
				change($this.data('arr'), $this.parents('.J_radio_change'));
			});
		}

		//�л�radio
		$('.J_radio_change input:radio').on('change', function(){
			change($(this).data('arr'), $(this).parents('.J_radio_change'));
		});

	}
	function change(str, radio_change) {
		var rel = $(radio_change.data('rel'));
		if(rel.length) {
			rel.hide();
		}else{
			$('.J_radio_tbody, .J_radio_change_items').hide();
		}

		if(str) {
			var arr= new Array();
			arr = str.split(",");


			$.each(arr, function(i, o){
				$('#'+ o).show();
			});
		}
	}

	/*
	 * Ĭ��ͷ��
	*/
	var avas = $('img.J_avatar');
	if(avas.length) {
		avatarError(avas);
	}


})();

//����ˢ��ҳ�棬ʹ��location.reload()�п��ܵ��������ύ
function reloadPage(win) {
	var location = win.location;
	location.href = location.pathname + location.search;
}

function getCookie(name) {
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
	}

	function setCookie(name,value,days,domain) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+days*24*60*60*1000);
			var expires = '; expires='+date.toGMTString();
		}else{
			var expires = '';
		}
		document.cookie = name+"="+value+expires+"; domain="+domain+"; path=/";
	}

//������ʾ_����
function resultTip(options) {

	var cls = (options.error ? 'warning' : 'success');
	var pop = $('<div style="left:50%;top:30%;" class="pop_showmsg_wrap"><span class="pop_showmsg"><span class="' + cls + '">' + options.msg + '</span></span></div>');

	pop.appendTo($('body')).fadeIn(function () {
		pop.css({
			marginLeft :  - pop.innerWidth() / 2
		}); //ˮƽ����
	}).delay(1500).fadeOut(function () {
		pop.remove();

		//�ص�
		if (options.callback) {
			options.callback();
		}
	});

}

//�������ж�λ ��ie6 fixed��λ
function popPos(wrap){
	var ie6 = false,
			pos = 'fixed',
			top,
			win_height = $(window).height(),
			wrap_height = wrap.outerHeight();

	if($.browser.msie && $.browser.version < 7) {
		ie6 = true;
		pos = 'absolute';
	}

	if(win_height < wrap_height) {
		top = 0;
	}else{
		top = ($(window).height() - wrap.outerHeight())/2;
	}

	wrap.css({
		position : pos,
		top : top + (ie6 ? $(document).scrollTop() : 0),
		left : ($(window).width() - wrap.innerWidth())/2
	}).show();
}


/*
 * ͷ��Ĵ�����
*/
function avatarError(avatars){
	avatars.each(function() {
		this.onerror = function() {
			this.onerror = null;
			this.src = GV.URL.IMAGE_RES + '/face/face_' + $(this).data('type') + '.jpg';//���ͷ��
			this.setAttribute('alt','Ĭ��ͷ��');

			//���ػָ�Ĭ��ͷ��
			$('#J_set_def').hide();
		}
		this.src = this.src;
	});
}

//������λ
Wind.Util.popPos = function(wrap){
	var ie6 = false,
			top,
			win_height = $(window).height(),
			wrap_height = wrap.outerHeight();

	if($.browser.msie && $.browser.version < 7) {
		ie6 = true;
	}

	if(win_height < wrap_height) {
		top = 0;
	}else{
		top = ($(window).height() - wrap.outerHeight())/2;
	}

	wrap.css({
		top : top + (ie6 ? $(document).scrollTop() : 0),
		left : ($(window).width() - wrap.innerWidth())/2,
		position : (ie6 ? 'absolute' : 'fixed')
	}).show();
}

$(function() {
	if(! $.support.leadingWhitespace ) { return; }//ie6-8��֧�ָ�������
	var textarea = $('#J_design_temp_tpl');
	if(!textarea.length) { return; }
	textarea.attr('id','');
	var	codemirror_path = GV.JS_ROOT + 'windeditor/plugins/codemirror/codemirror/';
	$('<link rel="stylesheet" href="' + codemirror_path + 'codemirror.css?v='+ GV.JS_VERSION +'"/>').appendTo('head');
	Wind.js(codemirror_path +'codemirror.js?v='+ GV.JS_VERSION,function() {
		if(!window.CodeMirror) {
			return;
		}
		var codeEditor = window.CodeMirror.fromTextArea(textarea[0], {
				mode: "text/html",
                tabMode: "indent",
                lineNumbers: true,
                lineWrapping:true,
                onChange:function(editor) {
                	//ͬ��textarea��ֵ��CodeMirror�󶨹�submitͬ����������û����submit
                	textarea.val(editor.getValue());
                }
			}
		);
		var dom = codeEditor.getWrapperElement();
		var height = textarea.outerHeight();
        dom.style.cssText = 'height:'+ height +'px;font-family:consolas,"Courier new",monospace;font-size:13px;';
        codeEditor.getScrollerElement().style.cssText = 'height:'+ height +'px';
        codeEditor.refresh();
	});
});



(function(){
	//iframe�ڴ����˵� ���admin/index_run.htm��ķ��� ��֧�ֿ���
	var tabframe_trigger = $('a.J_tabframe_trigger');
	if(tabframe_trigger.length) {
		try{
			var _SUBMENU_CONFIG = parent.window.SUBMENU_CONFIG;		//��������

			tabframe_trigger.on('click', function(e){
				e.preventDefault();
				var $this = $(this),
					id = $this.data('id'),						//id
					par = $this.data('parent'),					//������id
					level = parseInt($this.data('level'));		//��������������ʶ

				parent.window.eachSubmenu(_SUBMENU_CONFIG, id, par, level, this.href);
			});
		}catch(e){
			$.error(e);
		}
	}
})();

(function(){
	//���Ӵ���iframe����֧�ִ����˵� ��֧�ֿ���
	var linkframe_trigger = $('a.J_linkframe_trigger');
	if(linkframe_trigger.length) {
		try{
			linkframe_trigger.on('click', function(e){
				e.preventDefault();
				var $this = $(this);
				parent.window.iframeJudge({
					elem: $this,
					href: $this.attr('href')
				});
			});
		}catch(e){
			$.error(e);
		}
	}
})();
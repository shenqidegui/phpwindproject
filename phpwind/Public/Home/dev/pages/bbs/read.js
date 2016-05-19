/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-�Ķ�ҳ_���ý���
 * @Author	: linhao87@gmail.com, TID
 * @Depend	: jquery.js(1.7 or later), global.js
 * $Id$
 */

;
(function(){
	//ͼƬ������ʾ ɾ��
	$('span.J_attach_img_wrap').hover(function(){
		var $this = $(this);
		$this.find('.J_img_info').show().css({
			left : $this.offset().left,
			top : $this.find('img.J_post_img').offset().top
		});
	}, function(){
		$(this).find('.J_img_info').hide();
	});

	$('a.J_read_img_del').on('click', function(e){
		e.preventDefault();
		var $this = $(this);

		//glbal.js
		Wind.Util.ajaxConfirm({
			href : this.href,
			elem : $this,
			callback : function(){
				$this.parents('.J_attach_img_wrap').fadeOut(function(){
					$(this).remove();
				});
			}
		});
	});

})();

//��ʾϲ��������
(function(){
	$('a.J_like_user_btn').on('click', function(e){
		e.preventDefault();
		var $this = $(this),
			pid = $this.data('pid'),
			like_user_pop = $('#J_like_user_pop_'+ pid);

		//�Ƿ��Ѵ�������
		if(like_user_pop.length) {
			//�����Ƿ�ɼ�
			if($('#J_like_user_pop_'+ pid +':visible').length) {
				like_user_pop.hide();
			}else{
				like_user_pop.show();
			}

		}else{
			$.post($this.attr('href'), function(data){
				if(data.state === 'success') {
					var data = data.data,
						li_arr = [],
						template = $($('#J_like_user_ta').text()),
						this_offset_top = $this.offset().top,
						this_height = $this.innerHeight(),
						this_window_top = this_offset_top - $(document).scrollTop(),				//�����ڶ�������
						this_window_bottom = $(window).height() - this_window_top - this_height,	//�����ڵײ�����
						temp_top;

					$.each(data, function(i, o){
						li_arr.push('<li><a href="'+ GV.U_CENTER + o.uid +'"><img class="J_avatar" data-type="small" src="'+ o.avatar +'" width="30" height="30" />'+ o.username +'</a></li>');
					});

					template.appendTo('body').attr('id', 'J_like_user_pop_'+ pid).find('ul.J_like_user_list').html(li_arr.join(''));

					if (this_window_bottom < template.outerHeight()) {
						//�ײ��ռ䲻�㣬��ʾ������
						temp_top = this_offset_top - template.outerHeight();
					}else{
						temp_top = this_offset_top + this_height;
					}

					//д��λ��
					template.css({
						top : temp_top,
						left : $this.offset().left
					});

					Wind.Util.avatarError(template.find('img.J_avatar'));

					//�󶨹ر�
					$('a.J_like_user_close').on('click', function(e){
						e.preventDefault();
						template.hide();
					});

				}else if(data.state === 'fail'){
					//global.js
					Wind.Util.resultTip({
						error : true,
						msg : data.message
					});
				}
			}, 'json');
		}
	});

})();

//��������
(function(){
	Wind.Util.hoverToggle({
		elem : $('#J_read_post_btn'),			//hoverԪ��
		list : $('#J_read_post_types'),			//�����˵�
		callback : function(elem, list){
			list.css({
				left : elem.offset().left,
				top : elem.offset().top + elem.height()
			});
		}
	});

	//ֻ��¥��
	Wind.Util.hoverToggle({
		elem : $('#J_read_moredown'),			//hoverԪ��
		list : $('#J_read_moredown_list'),		//�����˵�
		callback : function(elem, list) {
			list.css({
				left : elem.offset().left + elem.width() - list.outerWidth(),
				top : elem.offset().top + elem.height()
			});
		}
	});

})();

//�Ķ��ظ�
(function(){
	Wind.use('localStorage',function() {
		Wind.Util.LocalStorage.remove('quickReply');
	});

	//���ش洢���ٻظ�
	function quickStorage($ele){
		Wind.use('localStorage',function() {
			var set = function() { 
				//��֧��placeholder�ݴ���
				var val = $ele.val();
				if(document.createElement('input').placeholder !== ''){
					if(val === $ele.attr("placeholder")){
						return;
					}
				}
				
				Wind.Util.LocalStorage.set('quickReply',val);
			};
			if($.browser.msie) {
				$ele[0].onpropertychange = function(event) {
				    set();
				}
			}else {
				$ele.on('input',set);
			}
		});
	}

	//��¥���ٻظ�
	var reply_quick_ta = $('#J_reply_quick_ta'),
		reply_quick_btn = $('#J_reply_quick_btn'),
		reply_ft = $('#J_reply_ft'),
		floor_reply = $('#floor_reply'); //�ظ���

	Wind.Util.buttonStatus(reply_quick_ta, reply_quick_btn);
	Wind.Util.ctrlEnterSub(reply_quick_ta, reply_quick_btn);

	//��¥�ظ�
	$('#J_readreply_main').on('click', function(e){
		e.preventDefault();
		location.hash = $(this).data('hash');
		reply_quick_ta.focus()
	});

	//�ظ���۽�
	reply_quick_ta.on('focus', function() {
		//��Ҫ��¼�û������룬�������߼�ģʽʱ��Ҫ
		quickStorage(reply_quick_ta);
	});
	
	//¥����ٻظ����Զ���������
	$(document).on('focus', '.J_at_user_textarea', function(){
		quickStorage($(this));
	})
	
	//�ύ�ظ�
	reply_quick_btn.on('click', function(e){
		e.preventDefault();
		//������ش洢
		if(Wind.Util.LocalStorage && Wind.Util.LocalStorage.get('quickReply') !== null){
			Wind.Util.LocalStorage.remove('quickReply');
		}
		//end
		var $this = $(this);
		//global.js
		Wind.Util.ajaxBtnDisable($this);

		$.post($(this).data('action'), {
			atc_content : reply_quick_ta.val(),
			tid : $(this).data('tid')
		}, function(data){
			//global.js
			Wind.Util.ajaxBtnEnable($this, 'disabled');
			if (Wind.Util.ajaxTempError(data, $this)) {
				if(data.indexOf('���') > 0) {
					reply_quick_ta.val('');
					$('#J_emotions_pop').hide();
				}
				return false;
			}

			if($('#J_need_reply').length) {
				//�ظ��ɼ�
				Wind.Util.reloadPage(window);
			}

			reply_quick_ta.val('');
			floor_reply.before(data);
			$('#J_emotions_pop').hide();
			//��������start
			var highlightFunc = function(){
				var nextFloor = floor_reply.prevAll('.J_read_floor').eq(0);
				var codes = $('pre[data-role="code"]', nextFloor);
				if(codes.length) {
					codes.each(function(){
						//console.log(this)
						HighLightFloor.addCopy(this);
					});
					HighLightFloor.render();
					$(".syntaxhighlighter").each(function(){
						HighLightFloor.adjust(this);
					});
				}
			};
			var nextFloor = floor_reply.prevAll('.J_read_floor').eq(0);
			//��֤��HighLightFloor���ڵ�ʱ��Ż���Ⱦ����ֹ���ļ������ԭ���±���
			if(typeof HighLightFloor !== 'undefined'){
				if(HighLightFloor.active === true){
					highlightFunc();
				}else{
					HighLightFloor.init(highlightFunc);
				}
			}
			//����end
			
			var new_floor = floor_reply.prev();

			//�ظ�¥��ϲ��
			Wind.js(GV.JS_ROOT+ 'pages/common/likePlus.js?v='+ GV.JS_VERSION, function () {
				likePlus(new_floor.find('a.J_like_btn'));
			});
			
			//ͷ��
			Wind.Util.avatarError(new_floor.find('img.J_avatar'));

			//������ʾ
			Wind.Util.creditReward();
			location.hash = new_floor.attr('id');
		});
	});


	//�鿴�ظ�
	var lock = false,
		posts_list = $('#J_posts_list');

	posts_list.on('click', 'a.J_read_reply', function(e){
		e.preventDefault();
		var $this = $(this),
			pid = $this.data('pid'),
			topped = $this.data('topped'),
			wrap = $('#J_reply_wrap_'+ pid + (topped ? '_topped' : ''));			//�б�����

		wrap.toggle();

		//���� �� ������
		if(lock || $this.data('load')) {
			wrap.find('.J_at_user_textarea').val('').focus();
			return false;
		}
		lock = true;

		$.post(this.href, function(data){
			//global.js
			lock = false;
			if(Wind.Util.ajaxTempError(data))	{
				return false;
			}

			wrap.html(data);
			$this.data('load', true); //�������ʶ

			replyFn(wrap);

			//ie6����չ�����۽�
			wrap.find('textarea').focus();

			Wind.Util.avatarError(wrap.find('img.J_avatar'));
			
		});
	});

	
	posts_list.on('click', 'a.J_insert_emotions' ,function(e){
		//����
		e.preventDefault();
		var $this = $(this);
		Wind.js(GV.JS_ROOT +'pages/common/insertEmotions.js?v='+ GV.JS_VERSION, function(){
			insertEmotions($this, $($this.data('emotiontarget')));
		});
	}).on('click', 'a.J_read_reply_single' ,function(e){
		//�ظ�����
		e.preventDefault();
		//var wrap = $(this).parents('div.J_reply_wrap'),
		var wrap = $(this).parents('.J_reply_wrap'),
				username = $(this).data('username'),
				textarea = wrap.find('textarea');

			textarea.focus().val('@'+ username +'��');
			if(!$.browser.msie) {
				//chrome ��궨λ���
				textarea[0].setSelectionRange(100,100);
			}
	}).on('click', 'button.J_reply_sub' ,function(e){
		//�ύ
		e.preventDefault();
		var $this = $(this),
			pid = $this.data('pid'),
			par = $this.parents('.J_reply_wrap'),
			textarea = par.find('textarea'),
			list = par.find('.J_reply_page_list ul');

		//global.js
		Wind.Util.ajaxBtnDisable($this);

		$.post($(this).data('action'), {
			atc_content : textarea.val(),
			tid : TID,
			pid : pid
		}, function(data){
			//global.js
			Wind.Util.ajaxBtnEnable($this, 'disabled');

			if(Wind.Util.ajaxTempError(data)) {
				/*textarea.val('');
				$this.addClass('disabled').prop('disabled', true);
				$('#J_emotions_pop').hide();*/
				if(data.indexOf('���') > 0) {
					textarea.val('');
					$('#J_emotions_pop').hide();
				}
				return false;
			}

			if($('#J_need_reply').length) {
				//�ظ��ɼ�
				location.reload();
			}

			list.prepend(data);
			textarea.val('');
			$('#J_emotions_pop').hide();

			//���ֽ���
			Wind.Util.creditReward();
			
		});
	}).on('click', 'div.J_pages_wrap a' ,function(e){
		//��ҳ
		e.preventDefault();
		var list = $(this).parents('.J_reply_page_list'),
				clone = list.clone();

		//��¥
		
		list.html('<div class="pop_loading"></div>');

		$.post(this.href, function(data){
			if(Wind.Util.ajaxTempError(data)) {
				//ʧ����ָ�ԭ����
				list.html(clone.html());
				return false;
			}

			list.html(data);
		})
	});


	//�ظ��б�������
	function replyFn(wrap){
		var btn = wrap.find('button.J_reply_sub'),
			ta = wrap.find('textarea');
		Wind.Util.buttonStatus(ta, btn);
		Wind.Util.ctrlEnterSub(ta, btn);
		ta.focus();
	}

})();

//�Ķ�ҳ����
(function(){
	var tag_temp_arrow = '<div class="arrow"><em></em><span></span></div>';
	var read_tag_item = $('a.J_read_tag_item');

	read_tag_item.each(function(){
		var $this = $(this);

		Wind.Util.hoverToggle({
			elem : $this,		//hoverԪ��
			list : $this.next('.J_tag_card'),
			callback : function(elem, list){
				//��λ
				list.css({
					left : elem.offset().left,
					top : elem.offset().top + elem.innerHeight() + 5
				});

				if(!elem.data('load')) {
					//δ��������
					elem.data('load', true);
					$.post(elem.data('url'), function(data){
						if(Wind.Util.ajaxTempError(data)) {
							elem.data('load', false);
							return;
						}

						list.html(tag_temp_arrow + data);

						//��ע&ȡ��
						var lock = false;
						list.find('a.J_read_tag_follow').on('click', function(e){
							e.preventDefault();
							var $this = $(this),
								id = $this.data('id'),
								type = $this.data('type'),
								anti_type = (type == 'add' ? 'del' : 'add'),					//������ ����
								anti_text = (type == 'add' ? 'ȡ����ע' : '��ע�û���'),		//������ �ı�
								anti_cls = (type == 'add' ? 'core_unfollow' : 'core_follow');	//������ class

							if(!GV.U_ID) {
								//δ��¼
								Wind.Util.quickLogin();
								return;
							}

							if(lock) {
								return;
							}
							lock = true;

							$.post(this.href, {
								id : id,
								type : type
							}, function(data){
								lock = false;
								if(data.state == 'success') {
									$this.text(anti_text).data('type', anti_type).removeClass('core_follow core_unfollow').addClass(anti_cls);
									Wind.Util.resultTip({
										elem : $this,
										follow : true,
										msg : data.message
									});
								}else if(data.state == 'fail') {
									Wind.Util.resultTip({
										error : true,
										elem : $this,
										follow : true,
										msg : data.message
									});
									list.hide();
								}
							}, 'json');
						});
					}, 'html')
				}

			}
		});
	});


	var read_tag_wrap = $('#J_read_tag_wrap'),
		read_tag_edit = $('#J_read_tag_edit');
	
	//�༭����
	$('#J_read_tag_edit_btn').on('click', function(e){
		e.preventDefault();
		var li_arr = [];

		$.each($('a.J_read_tag_item'), function(i, o){
			var text = $(this).text();
			li_arr.push('<li><a href="javascript:;"><span class="J_tag_name">'+ text +'</span><del class="J_user_tag_del" title="'+ text +'">��</del><input type="hidden" name="tagnames[]" value="'+ text +'"></a></li>');
			
			read_tag_edit.find('ul.J_user_tag_ul').html(li_arr.join(''));
			
		});
		read_tag_edit.show();
		read_tag_wrap.hide();

		Wind.use('ajaxForm');
	});

	//�༭�ύ
	var btn = $('#J_read_tag_sub');
	btn.on('click', function(e){
		e.preventDefault();
		var $this = $(this);

		setTimeout(function(){
			Wind.use('ajaxForm', function(){
				$('#J_read_tag_form').ajaxSubmit({
					dataType : 'json',
					beforeSubmit : function(){
						Wind.Util.ajaxBtnDisable(btn);
					},
					success : function(data){
						if(data.state === 'success') {
							btn.text(data.message)
							Wind.Util.reloadPage(window);
						}else if(data.state === 'fail'){
							Wind.Util.ajaxBtnEnable(btn);
							Wind.Util.resultTip({
								error : true,
								elem : $this,
								follow : true,
								msg : data.message
							});
						}
					}
				});
			});
			
		}, 100);
	});

})();

//¥�㿽��
(function(){
	var floor_copy = $('.J_floor_copy');

	if(!$.browser.msie && !Wind.Util.flashPluginTest(9)) {
		floor_copy.on('click', function(){
			if(confirm('�����������δ��װflash�����¥���ַ���Ʋ����ã����ȷ������')) {
				window.open('http://get.adobe.com/cn/flashplayer/');
			};
		});
		return;
	}

	Wind.use('textCopy', function() {
		//hover����flash
		floor_copy.on('mouseenter', function(){
			var item = $(this);

			if(item.siblings().length) {
				return;
			}
			var type = item.data('type'),
				tit = (type == 'main' ? $('#J_post_title').text()+'��' : ''), //��¥�����ӱ���
				hash = (type == 'main' ? '' : '#'+item.data('hash')), //¥���hash
				par = item.parent();

			item.textCopy({
				content : tit.replace(/\n/, '') + location.protocol + '//' + location.host + location.pathname + location.search + hash,
				mouseover :function(client){
					client['div'].setAttribute('title', '���ƴ�¥��ַ');
					$(client['div']).addClass('J_readclip_wrap');
				},
				appendelem : par[0],
				addedstyle : {
					top : item.offset().top - par.offset().top,
					left : item.offset().left - par.offset().left
				}
			});
		});

		//�뿪¥������
		$('.J_read_floor').on('mouseleave.clip', function(){
			$(this).find('.J_readclip_wrap').remove();
		});

	});

})();

//�Ķ�ҳ�Ĵ������
(function(){
	//����������ýӿ�
	window.HighLightFloor = {
		active: false,
		init: function(callback){
			var _this = this;
			var syntaxHihglighter_path = window.GV.JS_ROOT + 'windeditor/plugins/insertCode/syntaxHihglighter/';
			Wind.css(syntaxHihglighter_path + 'styles/shCoreDefault.css?v=' + GV.JS_VERSION);
			Wind.js(syntaxHihglighter_path +'scripts/shCore.js?v=' + GV.JS_VERSION,function() {
				_this.active = true;
				_this.render();
				callback && callback();
			});
		},
		render: function(){
			SyntaxHighlighter.highlight();
		},
		//��Ⱦ���ư�ť
		renderCopy: function(elem, text){
			//���ƴ���
			if(elem.data('textCopy')){
				return;
			}
			elem.data('textCopy', 'true');
			Wind.use('textCopy', function() {
				setTimeout(function(){
					elem.textCopy({
						content : text
					});
				});
			});
		},
		addCopy: function(elem){
			var  _self = this,
				html = elem.innerHTML;
			html = html.replace(/&amp;/g, '&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
			//ie��ʹ��innerHTML��ȥ�����пո�
			$(elem).text(html);
			var copyElement = $('<br/><a role="button" href="javascript:;" rel="nofollow">���ƴ���</a>');
			copyElement.insertBefore(elem);
			copyElement.on('mouseover', function(){
				_self.renderCopy(copyElement, html);
			});
		},
		adjust: function(elem){
			if(elem){
	            var tds = elem.getElementsByTagName('td');
	            for(var i=0,li,ri;li=tds[0].childNodes[i];i++){
	                ri = tds[1].firstChild.childNodes[i];
	                if(ri) {
	                    ri.style.height = li.style.height = ri.offsetHeight + 'px';
	                }
	            }
	        }
		}
	};
	//���������Ⱦ
	var codes = $('pre[data-role="code"]');
	if(codes.length) {
		codes.each(function(){
			HighLightFloor.addCopy(this);
		});
		HighLightFloor.init(function(){
			$(".syntaxhighlighter").each(function(){
				HighLightFloor.adjust(this);
			})
		});
	}
})();

//��Сͼ�л�
;(function() {
	var attach_pics_list = $('div.read_attach_pic'),
		$doc = $(document);
	if( attach_pics_list.length ) {
		attach_pics_list.each(function() {
			var container = $(this);
			$(this).find('a.J_small_images').on('click',function(e) {
				e.preventDefault();
				$(this).removeClass('current');
				container.find('a.J_big_images').addClass('current');
				container.find('ul.big_img').hide();
				container.find('ul.small_img').show();
			});
			$(this).find('a.J_big_images').on('click',function(e) {
				e.preventDefault();
				$(this).removeClass('current');
				container.find('a.J_small_images').addClass('current');
				container.find('ul.small_img').hide();
				container.find('ul.big_img').show();
				$doc.scrollTop($doc.scrollTop()+1);
			});
		});
	}
})();

//ǰ̨������־
(function(){
	var inside_logs = $('#J_inside_logs');
	if(inside_logs.length) {
		Wind.use('dialog', function(){
			
			inside_logs.on('click', function(e){
				e.preventDefault();
				Wind.Util.ajaxMaskShow();
				
				$.post(this.href, function(data){
					Wind.Util.ajaxMaskRemove();
					if(Wind.Util.ajaxTempError(data, inside_logs)) {
						return;
					}

					Wind.dialog.html(data, {
						id : 'read_log',
						title : '���Ӳ�����¼',
						isMask : false,
						isDrag : true,
						callback : function(){
							$('#J_log_close').on('click', function(e){
								e.preventDefault();
								Wind.dialog.closeAll();
							});
						}
					});
				});

			});
			
		});
	}
})();
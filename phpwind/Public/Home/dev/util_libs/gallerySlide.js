/*
 * PHPWind util Library
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-�õ�Ƭ
 * @Author	: linhao87@gmail.com
 * @Depend	: jquery.js(1.7 or later)
 * @Example	: ��ҳ����ͼ
 * $Id: jquery.slidePlayer.js 6032 2012-03-15 09:43:30Z hao.lin $
 */

;(function($, window, document, undefined) {
	var pluginName = 'gallerySlide',
		defaults = {},
		win = $(window),
		body = $('body'),
		body_height = body.height();

	var template = '<div id="J_gallery_mask" class="pImg_bg" style="height:' + body_height + 'px;"></div>\
<div id="J_gallery_pop" tabindex="0" class="pImg_wrap" style="display:none;"><table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td class="bcr1"></td><td class="pibg1"></td><td class="bcr2"></td></tr><tr><td class="pibg4"></td><td><div class="pImg tac">\
<div class="cc w" style="padding:0 5px;">\
  <div class="fl mr10" id="J_gallery_page">��<span id="J_gallery_count_now"></span>��/��<span id="J_gallery_count_total"></span>��</div><!--a href="javascript:;" class="fl mr20" onclick="readImg.viewAll()">ԭͼ</a-->\
  <a href="" class="pImg_close" id="J_gallery_close">�ر�</a>\
</div>\
<div id="J_gallery_wrap" class="imgLoading" style="margin:auto;">\
<div class="aPre" id="J_gallery_prev" title="��һ��"></div>\
<div class="aNext" id="J_gallery_next" title="��һ��"></div>\
</div>\
</div><img style="display:none;" id="J_gallery_clone" /></td><td class="pibg2"></td></tr><tr><td class="bcr4"></td><td class="pibg3"></td><td class="bcr3"></td></tr></tbody></table></div>';
	var imgReady = (function () {
		var list = [], intervalId = null,
	
		// ����ִ�ж���
		tick = function () {
			var i = 0;
			for (; i < list.length; i++) {
				list[i].end ? list.splice(i--, 1) : list[i]();
			};
			!list.length && stop();
		},
	
		// ֹͣ���ж�ʱ������
		stop = function () {
			clearInterval(intervalId);
			intervalId = null;
		};
	
		return function (url, ready, load, error) {
			var onready, width, height, newWidth, newHeight,
				img = new Image();
			
			img.src = url;
	
			// ���ͼƬ�����棬��ֱ�ӷ��ػ�������
			if (img.complete) {
				ready.call(img);
				load && load.call(img);
				return;
			};
			
			width = img.width;
			height = img.height;
			
			// ���ش������¼�
			img.onerror = function () {
				error && error.call(img);
				onready.end = true;
				img = img.onload = img.onerror = null;
			};
			
			// ͼƬ�ߴ����
			onready = function () {
				newWidth = img.width;
				newHeight = img.height;
				if (newWidth !== width || newHeight !== height ||
					// ���ͼƬ�Ѿ��������ط����ؿ�ʹ��������
					newWidth * newHeight > 1024
				) {
					ready.call(img);
					onready.end = true;
				}

			};
			onready();
			
			// ��ȫ������ϵ��¼�
			img.onload = function () {
				// onload�ڶ�ʱ��ʱ��Χ�ڿ��ܱ�onready��
				// ������м�鲢��֤onready����ִ��
				!onready.end && onready();
			
				load && load.call(img);
				
				// IE gif������ѭ��ִ��onload���ÿ�onload����
				img = img.onload = img.onerror = null;
			};
	
			// ��������ж���ִ��
			if (!onready.end) {
				list.push(onready);
				// ���ۺ�ʱֻ�������һ����ʱ��������������������
				if (intervalId === null) intervalId = setInterval(tick, 40);
			};
		};
	})();
	function Plugin(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);
		this.total = element.children('.J_gallery_items').length, this.init();
	}

	Plugin.prototype = {
		init: function() {
			var element = this.element,
				options = this.options,
				_this = this;

			//������
			element.on('click', 'a[data-big]', function(e) {
				e.preventDefault();
				var $this = $(this),
					index = $this.parent().index(),
					win_height = $(window).height();

				//ͼƬ������
				if ($this.children().attr('class') == 'J_error') {
					return;
				}

				body.append(template);

				var gallery_pop = $('#J_gallery_pop');

				//gallery_pop
				//���Ԥ��ͼ
				var preview = $('<img id="J_gallery_preview" src="' + $this.data('big') + '" align="absmiddle" data-index="' + index + '" />');
				preview.appendTo("#J_gallery_wrap");
				_this.sizeReset(preview);
				var gallery_prev = $('#J_gallery_prev'),
					//��һ��
					gallery_next = $('#J_gallery_next'),
					//��һ��
					gallery_page = $('#J_gallery_page'); //����
				//ֻ��һ��
				if (_this.total === 1) {
					gallery_prev.hide();
					gallery_next.hide();
					gallery_page.hide();
				} else {
					gallery_prev.show();
					gallery_next.show();
					gallery_page.show();
				}

				gallery_prev.on('click', function() {
					if (_this.total > 1) {
						_this.showSibling(preview, 'prev');
					}
				});

				gallery_next.on('click', function() {
					if (_this.total > 1) {
						_this.showSibling(preview, 'next');
					}
				});
				gallery_pop.on('keydown', function(e) {
					var key = e.keyCode;
					if (_this.open && key === 27) {
						_this.popHide(gallery_pop);
						return;
					}
					if (_this.open && key === 37) {
						gallery_prev.click();
					} else if (_this.open && key === 39) {
						gallery_next.click();
					} else {
						return;
					}
				});

				$('#J_gallery_count_now').text(index + 1);
				$('#J_gallery_count_total').text(_this.total);

				_this.popClose();

			});

			//���ڸı�
			win.resize(function() {
				_this.sizeReset($('#J_gallery_preview'));
			});
		},
		sizeReset: function(preview) {
			if (!preview.length) {
				return;
			}
			var gallery_wrap = $('#J_gallery_wrap'),
				win_height = win.height(),
				max_height = win.height() - 100,
				max_width = win.width() - 100,
				_this = this,
				imgUrl = preview.attr('src');
			//��ʼ��ͼƬ�ߴ�
			imgReady(imgUrl, function(){
				var w = this.width,
					h = this.height,
					ratio = w / h;

				if (h > max_height) {
					gallery_wrap.height(max_height);
					gallery_wrap.width(max_height * ratio);
				}else if (w > max_width) {
					gallery_wrap.width(max_width);
					gallery_wrap.height(max_width / ratio);
				}else{
					//���ò����������ж�ͼƬ�ĳߴ磬��ֹ�ܵ���һ��ͼƬӰ��
					gallery_wrap.width(w);
					gallery_wrap.height(h);
				}
				_this.imgpos();
			});
		},
		imgpos: function() {
			this.open = true;
			//��λ
			var ie6 = false,
				gallery_pop = $('#J_gallery_pop'),
				win_height = win.height(),
				wrap_height = gallery_pop.outerHeight();

			if ($.browser.msie && $.browser.version < 7) {
				ie6 = true;
			}

			var top = ($(window).height() - gallery_pop.outerHeight()) / 2;

			gallery_pop.css({
				top: top + (ie6 ? $(document).scrollTop() : 0),
				left: ($(window).width() - gallery_pop.innerWidth()) / 2
			}).show().focus();

			$('#J_gallery_mask').css('height', $(document).height());
		},
		showSibling: function(preview, type) {
			//ǰ��
			var index = preview.data('index'),
				_index, element = this.element,
				total = this.total,
				_this = this,
				item;

			if (type == 'next') {
				_index = ((index + 2) > total ? 0 : (index + 1));
			} else {
				_index = (index === 0 ? (total - 1) : (index - 1));
			}

			$('#J_gallery_count_now').text(_index + 1);
			item = element.children(':eq(' + _index + ')').find('a[data-big]');
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			preview.attr('src', item.data('big')).data('index', _index);
			_this.sizeReset(preview);
		},
		popClose: function() {
			//�ر�
			var gallery_pop = $('#J_gallery_pop'),
				mouse_in = false,
				_this = this;

			gallery_pop.hover(function() {
				mouse_in = true;
			}, function() {
				mouse_in = false;
				gallery_pop.focus();
			});

			//�õ�Ƭʧ�� ����
			gallery_pop.blur(function() {
				if (!mouse_in) {
					_this.popHide(gallery_pop);
				}
			});

			//��ر�
			$('#J_gallery_close').on('click', function(e) {
				e.preventDefault();
				_this.popHide(gallery_pop);
			});
		},
		popHide: function(pop) {
			this.open = false;
			pop.remove();
			$('#J_gallery_mask').remove();
			$('#J_gallery_clone').remove();
		}
	};

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Plugin($(this), options));
			}
		});
	}

})(jQuery, window, document);
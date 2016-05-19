/*!
 * PHPWind UI Library
 * @Copyright 	: Copyright 2011, phpwind.com
 * @Descript	: dialog �Ի������
 * @Author		: chaoren1641@gmail.com
 * @Depend		: core.js��jquery.js(1.7 or later)
 * $Id: dialog.js 23900 2013-01-17 03:48:52Z hao.lin $			:
 */
;(function ( $, window, undefined ) {
    var pluginName = 'dialog';
    var	empty = $.noop;
    var is_ie6 = ($.browser.msie && $.browser.version < 7) ? 1 : 0;
    var defaults = {
            id              : '',                           //id
            type            : 'alert',						// Ĭ�ϵ�������
			className		: 'wind_dialog core_pop_wrap',	//��������Ĭ��class
			position		: 'absolute',
            message			: '',							// ������ʾ������
            autoHide		: 0,							// �Ƿ��Զ��ر�
            zIndex			: 10, 							// ���ֵ
            width			: '',							// �������ݵĿ��
            height			: '',							// �߶�
            isDrag			: false,							// �Ƿ�������ק
			callback		: undefined,					//�ص�
            onShow			: undefined,					// ��ʾʱִ��
            onOk			: undefined,
            onCancel		: undefined, 					// ���ȡ��ʱִ��
            onClose			: undefined,					// �����iframe����html,����һ���رյĻص�
            left			: undefined,					// Ĭ�����м�
            top				: undefined,
            follow			: undefined,
            title			: '',							// ��ʾ����
            okText			: 'ȷ��',						// ȷ����ť����
            cancelText		: 'ȡ��',						// ȡ�����֣�ȷ��ʱ��
            closeText		: '�ر�',						// �ر�����
            isMask			: 1,							// �Ƿ���ʾ��������
            opacity			: 0.6,							// ���ֵ�͸����
            backgroundColor	: '#fff',						// ���ֵı���ɫ
            url				: '',							// ��������iframe url
            resize			: true							// �������ڱ仯
    };
    var template = '\
				<div class="core_pop">\
					<% if(type === "iframe" || type === "html") {%>\
						<div class="pop_top J_drag_handle" style="display:none;overflow:hidden;">\
							<a role="button" href="#" class="pop_close J_close" title="�رյ�������">�ر�</a>\
							<strong><%=title%></strong>\
						</div>\
					<% } %>\
					<% if(type === "iframe") { %>\
							<div class="pop_loading J_loading fl"></div>\
							<div class="J_dialog_iframe">\
                        		<iframe src="<%=url%>" frameborder="0" style="border:0;height:100%;width:100%;padding:0;margin:0;display:none;" scrolling="no"/>\
                        	</div>\
                    <% } else if(type === "confirm" || type === "alert"){ %>\
						<div class="pop_cont">\
	                    	<%=message%>\
						</div>\
						<div class="pop_bottom">\
							<% if(type === "confirm" || type === "alert") { %>\
								<button type="button" class="btn btn_submit mr10 J_btn_ok"><%=okText%></button>\
							<% } %>\
							<% if(type === "confirm") { %>\
								<button type="button" class="btn J_btn_cancel"><%=cancelText%></button>\
							<% } %>\
						</div>\
					<% } else if(type === "html") { %>\
						<%=message%>\
					<% } %>\
			</div>';

    function Plugin( options ) {
        //this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        this.elem = null;
        this.init();
    }

    Plugin.prototype.init = function () {
    	var options = this.options;
        var html = Wind.tmpl(template,options);//�滻ģ��
        if(options.type === 'confirm' && options.id === '') {
            options.id = 'wind_dialog_confirm';
        }
        var elem = (options.id ? $('#' + options.id) : '');     //TODO: idΪ��&����<input name="">ʱ��ie6�»ᱨ��
        var _this = this;
        if(elem.length) {
            //������id��ֻ����һ��
            elem.html(html).show();

            if(options.isDrag) {
                //ȥ��������Ĳ����Ϣ�����°�
                elem.removeData('plugin_draggable');
                elem.draggable( { handle : '.J_drag_handle'} );
            }
        }else {
            elem = $( '<div tabindex="0" id="'+ options.id +'" class="'+ options.className +'" aria-labelledby="alert_title" role="alertdialog" style="display:none"/>' ).appendTo( 'body' ).html(html);
        }
        this.elem = elem;
        var pop_top = elem.find('.pop_top'),//����
        	ok_btn = elem.find('.J_btn_ok'),//ȷ����ť
        	calcel_btn = elem.find('.J_btn_cancel'),//ȡ����ť
        	close_btn = elem.find('.J_close');//�رհ�ť

        if(options.isMask) {//����
    		var style = {
				width			: '100%',
				height			: $(window.document).height() + 'px',
				opacity			: options.opacity,
				backgroundColor	: options.backgroundColor,
				zIndex			: options.zIndex-1,
				position		: 'absolute',
				left			: '0px',
				top				: '0px'
			};
    		_this.mask = $('<div class="wind_dialog_mask"/>').css(style).appendTo('body');
            //ie6�����bgiframe���
            if (is_ie6) {
                Wind.use('bgiframe',function() {
                    _this.mask.bgiframe();
                });
            }
    	}
        //���
        if(options.width) {
            elem.css('width',options.width+'px');
        }
        if(options.height) {
            elem.css('height',options.height+'px');
        }
        //�߶�
        //options.autoHide
        if(options.autoHide) {
        	setTimeout(function() {
        		_this.close();
        	},autoHide);
        }


        //���ȷ��
        ok_btn.on('click',function(e) {
        	e.preventDefault();
			if(options.onOk) {
		        options.onOk();
		   }
		   _this.close();
        });

        //confirmȡ����ť���
        calcel_btn.on('click',function(e) {
        	e.preventDefault();
        	if(options.onCancel) {
                options.onCancel();
           	}
           _this.close();
        });

        if(options.type === 'iframe' || options.isDrag) {
        	Wind.use('draggable',function() {
        		elem.draggable( { handle : '.J_drag_handle'} );
        	});
        }

        //�رհ�ť
        close_btn.on('click',function(e) {
        	e.preventDefault();
        	if(options.onClose) {
                options.onClose();
           	}
           _this.close();
        });

        //��ESC�ر�
        $(document.body).on('keydown',function(e) {
            if(e.keyCode === 27) {
                if(options.onClose) {
                    options.onClose();
                }
               _this.close();
            }
        });
        //�����iframe�������onload����չʾ��ſ�
        if(options.type === 'iframe' && options.url) {
        	var iframe = elem.find('iframe')[0],
        		loading = elem.find('.J_loading');
        	try {
        		$(iframe).load( function() {
        			/*var body;
					if ( iframe.contentDocument ) { // FF
						body = iframe.contentDocument.getElementsByTagName('body')[0];
					} else if ( iframe.contentWindow ) { // IE
						body = iframe.contentWindow.document.getElementsByTagName('body')[0];
					}*/

					//firefox�£�iframe���ص������ȡ�����ĵ��ĸ߶�
					$(iframe).show();
					loading.hide();
					pop_top.show();
                    try{
    					var body = iframe.contentWindow.document.body;
        				var width = $(body).width(),
        					height = $(body).height();

        				//С��200֤��û��ȡ�����ȣ������Ҫ��ҳ���body�ж���
        				if(width < 200) {
        					width = 700;
        				}
        				if( height > 600 ) {
    	        			height = 600;
    	        			iframe.scrolling = 'yes';
    	        		}
                        //��chorme�£�iframe�߶�Ĭ��Ϊ150

                        /* ��ֹie6�Ŀ�ȹ���*/
                        elem.find('.J_drag_handle').css({width : Math.max(width,300) + 'px'});

                        elem.find('.J_dialog_iframe').css( {width : Math.max(width,300) + 'px', height : Math.max(height,150) + 'px' });

                    }catch(e) {
                        $(iframe).css( {width : '800px', height : '600px' });elem.find('.J_drag_handle').css( width, 435);
                        loading.hide();
                        pop_top.show();
                        iframe.scrolling = 'yes';
                        $(iframe).show();
                    }
        			show();
	        	});
        	} catch(e) {
                throw e;
        	}

        }
        if(options.type === 'html' && options.title) {
            var width = elem.width();
            elem.css('width',width + 'px')
            pop_top.show();
        }
        //ie6�����bgiframe���
        if (is_ie6) {
    		Wind.use('bgiframe',function() {
    			elem.bgiframe();
    		});
    	}

        function show() {
        	var follow_elem = options.follow,
	        	top,
	        	left,
	        	position = (is_ie6 ? 'absolute' : options.position),	//ie6 ���Զ�λ
	        	zIndex = options.zIndex;
        	if(options.follow) {
        		var follow_elem = typeof options.follow === 'string' ? $(options.follow) : options.follow,
        			follow_elem_offset = follow_elem.offset(),
	        		follow_elem_width = follow_elem.width(),
	        		follow_elem_height = follow_elem.height() ,
	        		win_width = $(window).width(),
					body_height = $(document.body).height(),
	        		win_height = $(window).height(),
        			pop_width = elem.outerWidth(true), //����߿�
        			pop_height = elem.outerHeight(true); //����߿�
        		//����Ǹ���ĳԪ����ʾ����ô����Ԫ�ص�λ�ã������ܳ�����ʾ���ڵ�����
        		if((follow_elem_offset.top + follow_elem_height + pop_height) > body_height) {
        			top = follow_elem_offset.top - pop_height;	//�߶ȳ���
        		} else {
        			top = follow_elem_offset.top + follow_elem_height;
        		}
        		if((follow_elem_offset.left + follow_elem_width + pop_width) > win_width) {
					left = win_width - pop_width - 1; //���1px IE����
        		} else {
        			left = follow_elem_offset.left + follow_elem_width;
        		}
        	} else {
                top = options.top ? options.top : ( $(window).height() - elem.height() ) / 2 + (position=='absolute' ? $(window).scrollTop() : 0);
                left = options.left ? options.left : ( $(window).width() - elem.width() ) / 2 + $(window).scrollLeft() ;
	    	}
	    	//��������λ��
	    	elem.css( {position:position, zIndex:zIndex, left:left + 'px', top:top + 'px'} ).show();
    	}

        //init event
        if(options.onShow) {
            options.onShow();
        }

    	//�����ȷ�Ͽ�����ȷ����ťȡ�ý���
        if(options.type === 'confirm') {
            if( is_ie6 ) {
                elem.css({width:'200px',height:'90px'});
            }
        	ok_btn.focus();
        }else{//��confirm�������ڱ仯�����¶�λ����λ��
            var resizeTimer;
            $(window).on('resize scroll',function() {
            	if(!options.resize) {
            		return;
            	}
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function() {
                    if(elem.is(':visible')) {
                        show();
                    }
                },100);
            });
        	elem.focus();//��ʾ�Ժ�����ȡ�ý���
        }

        show();

        //�����ص�
        if(options.callback) {
            options.callback();
        }

    };

	Plugin.prototype.close = function() {
		this.elem.remove();
		this.mask && this.mask.remove();
	};

    /*$.fn[pluginName] = Wind[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
            }
        });
    }*/
   	var Wind = window.Wind || {};
	var dialog = Wind[pluginName] = function(options) {
		return new Plugin( options );
	};

	dialog['alert'] = Wind['alert'] = function(message,callback) {//����api
		return new Plugin( { message:message, type:'alert', onOk:callback } );
	};
	dialog['confirm'] = Wind['confirm'] = function(message,okCallback,cancelCallback) {
		if(arguments.length === 1 && $.isPlainObject(arguments[0])) {
			return new Plugin( arguments[0] );
		}
		return new Plugin( { message:message, type:'confirm',onOk:okCallback ,onCancel:cancelCallback} );
	};
	dialog['open'] = Wind['showUrl'] = function(url,options) {
        options = options || {};
		options['type'] = 'iframe';
		options['url'] = url;
		return new Plugin( options );
	};
	dialog['html'] = Wind.showHTML = function(html,options) {
        options = options || {};
		options['type'] = 'html';
		options['message'] = html;
		return new Plugin( options );
	};
	dialog['closeAll'] = function() {
		$('.wind_dialog').remove();
		$('.wind_dialog_mask').remove();
	};
})( jQuery, window);

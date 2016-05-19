/*
 * PHPWind util Library
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ����ͼ���Զ����ֲ�
 * @Author	: linhao87@gmail.com
 * @Depend	: jquery.js(1.7 or later)
 * @Example	: ��ҳ����ͼ
 * $Id: slidePlayer.js 19415 2012-10-13 13:43:36Z hao.lin $
 */
 
;(function ( $, window, document, undefined ) {
    var pluginName = 'slidePlayer',
        defaults = {
            active_class	: 'current',		//��ǰ�����li����ʽ
            event			: 'click',			//�����¼���Ĭ��click
            //change			: $.noop,	//��ѡ���ʾʱ����,Ĭ��ʲôҲ����
            fx					: 0,				//��ʾʱ�Ķ�����֧��jQuery����
            //selected		: 0, 				//Ĭ����ʾ��(����ֵ)
			auto_play		: 0				//�Զ����ţ�Ĭ��Ϊ0��ʾ���Զ����ţ���λ����
        };
        
    function Plugin( element, content, nav, options ) {
        this.element = element;
        this.content = content;
		this.nav = nav;
        this.options = $.extend( {}, defaults, options) ;
        //this._defaults = defaults;
        //this._name = pluginName;
        this.init();
    }

    Plugin.prototype.init = function () {
    	var element = this.element,
    		content = this.content,
			contentList = $(content).children('li'),
			nav  = this.nav,
			navList = $(nav).children(),
            options = this.options,
			auto_play = parseInt(options.auto_play),
			timer;
          	
    	function show(index) {
    		var selected_element = navList.eq(index);
    		selected_element.addClass( options.active_class ).siblings().removeClass( options.active_class );
    		contentList.eq(index).show( options.fx ).siblings().hide( options.fx );
    	}

		element.on('mouseenter', function(){
			//�����������ʱ
			clearTimeout(timer);
		}).on('mouseleave', function(){
			if(auto_play) {
				//�뿪���¼�ʱ
				autoPlay();
			}
		});

    	//��ť���¼� event
    	navList.on(options.event, function(e) { 
    		e.preventDefault();
    		e.stopPropagation();
    		var index = $(this).index();
    		show(index);
    	});
		
		//��ť�۽��͵��
    	navList.children('a').on('focus click', function(e) {
    		e.stopPropagation();
    		e.preventDefault();
    		$(this).parent().trigger(options.event);
    	});

		//�Զ�����
		if(auto_play) {
		
			function autoPlay(){
				var current_index = navList.filter('.'+ options.active_class).index(),	//��ǰ����ֵ
					index;
						
				if(current_index >= navList.length -1) {
					//����󷵻ص�һ��
					index = 0;
				}else{
					index = current_index + 1;
				}
					
				timer = setTimeout(function(){
					show(index);
					autoPlay();
				}, auto_play);
			}
			
			autoPlay();
		}
    };

    $.fn[pluginName] = function (content, nav, options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin( $(this), content, nav ,options ));
            }
        });
    }

})( jQuery, window );

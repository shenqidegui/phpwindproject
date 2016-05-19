/**
 * PHPWind util Library
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ˮƽ������ͼƬ�����أ�����ѫ�¹���
 * @Author	: linhao87@gmail.com
 * @Depend	: jquery.js(1.7 or later)
 * $Id$:
 */
;(function ( $, window, document, undefined ) {
    var pluginName = 'lazySlide';
    var defaults = {
    		dis_cls_prev : 'pre_disabled',				//��һ�鰴ť ������״̬class
    		dis_cls_next : 'next_disabled',				//��һ�鰴ť ������״̬class
    		html_arr	: []
    };

    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        this.init();
    }
    
    Plugin.prototype = {
		init : function (){
			var element = this.element,
				options = this.options,
				prev = element.find('.J_lazyslide_prev'),										//��һ��
				next = element.find('.J_lazyslide_next'),										//��һ��
				list = element.find('.J_lazyslide_list'),										//�б�
				step_length = options.step_length,													//�ƶ�
				item_width = list.children().first().outerWidth(true),		//������Ԫ�ؿ��
				step_width = step_length * item_width,											//һ��������
				html_arr = options.html_arr,																//��������html����
				dis_cls_prev = options.dis_cls_prev,												//��һ�鰴ť ������״̬class
				dis_cls_next = options.dis_cls_next;												//��һ�鰴ť ������״̬class

			//�ض�Ĭ����ʾ�Ĳ���	
			html_arr.splice(0, step_length);
		
			if(!html_arr.length) {
				//��������
				next.addClass(dis_cls_next);
				return false;
			}else{
				next.removeClass(dis_cls_next);
			}
		
			//��һ��
			next.bind('click', function(e){
				e.preventDefault();
				slide('next', next);
			});
			
			//��һ��
			prev.bind('click', function(e){
				e.preventDefault();
				slide('prev', prev);
			});
			
			var lock;
			function slide(dir, btn){
				//�ƶ�����
				
				//���ɵ�
				if(btn.hasClass(dis_cls_prev) || btn.hasClass(dis_cls_next)) {
					return false; 
				}
				
				//�ظ��������
				if(lock) {
					return false;
				}
				lock = true;
				
				var left = Number(list.css('marginLeft').replace('px', '')),	//��ֵ
					move = 0;
					
				if(dir === 'next') {
					//�����һ��
					var _html_arr = html_arr.splice(0, step_length);	//��ȡ�������html��������
					

					if(_html_arr.length) {
						//��ȡ���飬д��html
						list.append(_html_arr.join(''));
						
						//�������
						//if(!html_arr.length){
							//next.addClass(dis_cls);
						//}
					}else{
						
					}

					
					var list_width = list.children().length * item_width;	//�ܿ��
					if(list_width + left - step_width >= step_width){
					
						//δ��ʾ�����ȴ��ڵ��ڿ���ʾ�����
						move = left - step_width;
						
					}else{
						//δ��ʾ������С�ڿ���ʾ�����
						move = -(list_width - step_width);
						
						//��һ�鰴ť���ɵ�
						
					}
					
					//��һ�鰴ť�ɵ�
					prev.removeClass(dis_cls_prev);
				}else{
					//�����һ��
					if(left < -step_width) {
						//������ݴ���һ��������
						move = left + step_width;
						
					}else{
					
						move = 0;
						
					}
					
					//��һ�鰴ť�ɵ�
					next.removeClass(dis_cls_next);
				}
				
				//ִ�й���
				list.animate({marginLeft : move}, 'slow', function(){
					
					//�����һ�飬���ƶ�λ��Ϊ0
					if(dir === 'prev' && move === 0) {
						prev.addClass(dis_cls_prev);
					}
					
					//�����һ�飬��html�����ѿգ������������
					if(dir === 'next' && !html_arr.length && step_width - Number(list.css('marginLeft').replace('px', '')) === list_width) {
						next.addClass(dis_cls_next);
					}
					
					lock = false;
				});

			}

		}
    };

    $.fn[pluginName] = Wind[pluginName]= function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin( $(this), options ));
            }
        });
    };

})( jQuery, window ,document );


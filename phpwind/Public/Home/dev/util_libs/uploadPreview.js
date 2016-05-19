/*
 * PHPWind util Library 
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ͼƬ�ϴ�Ԥ���������
 * @Author	: chaoren1641@gmail.com
 * @Depend	: jquery.js(1.7 or later)
 * $Id: uploadPreview.js 15186 2012-08-01 08:57:18Z hao.lin $		:
 */
;(function ( $, window, document, undefined ) {
    var pluginName = 'uploadPreview';
    var defaults = {
    		maxWidth		: 300,
    		maxHeight		: 500,
    		previewImg		: '.J_previewImg',//ҪԤ����ͼƬԪ�أ���������ڣ�����input�ϴ��ؼ�������һ��
    		maxSize			: 2048,//Ĭ���ļ����ƴ�С
    		message : '�ļ���С���ܳ���'
    };

    function Plugin( element, options ) {
    	if($.browser.msie) {
				return ;
			}
      this.element = element;
      this.options = $.extend( {}, defaults, options) ;
      this.init();
    }
	//ͼƬ��ʽ����
	var IMG_TYPE_PATTERN = /^image\/((png)|(gif)|(jpg)|(jpeg)|(bmp))/i;
	var BASE64_IMG_URL_PATTERN =/^data:image\/((png)|(gif)|(jpg)|(jpeg)|(bmp));base64/i;
	
    Plugin.prototype.init = function () {
    	var element = this.element,options = this.options,
			previewCustom = $( element.data('preview') ),
    		previewImg = previewCustom.length ? previewCustom : $( options.previewImg );

    	if( !previewImg.length ) { //�ظ�
    		previewImg = $('<img class="J_previewImg" style="display:none"/>').insertAfter(element.parent());
    	}else{
		
		}
		previewImg.css({
			'max-width'		: options.maxWidth + 'px',
			'max-height'	: options.maxheight + 'px'
		});

		//��ק֧��
		if (options.dragDrop && element.addEventListener) {
			element.addEventListener("dragover", function(e) { }, false);
			element.addEventListener("dragleave", function(e) {  }, false);
			element.addEventListener("drop", function(e) { }, false);
		}
		
		//�ļ�ѡ��ؼ�ѡ��
		element.on("change", function(e) { 
			var el = this;
			//not ie
			var file = el.files && el.files[0];
			var src, fileName = el.value;
			if(file) {
				if(!IMG_TYPE_PATTERN.test(file.type)) {
					alert('���ϴ��Ĳ���ͼƬ��ʽ���ļ���');
					el.value = '' ; return;
				}
				if(file.size/1024 > options.maxSize) {
					alert('�ļ���С���ܳ���' + options.maxSize/1024 + 'M');
					el.value = '' ; return;
				}
			}
			if ((file && file.getAsDataURL) && (src = file.getAsDataURL()) && (BASE64_IMG_URL_PATTERN.test(src))) {
				previewImg.prop('src', src);
				previewImg.show();
			}else if(file && FileReader) {
				var reader = new FileReader();
				reader.onload = function (e) {
                    previewImg.prop('src', e.target.result);
				};
                reader.readAsDataURL(file);
                previewImg.show();
			}else if(previewImg[0].filters) {//ie
				//el.select();
				//var src = document.selection.createRange().text;
				src = el.value;
				var img_box = previewImg.wrap('<div/>').parent();
				img_box[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader (src='"+ src +"', sizingMethod='scale')";
				//previewImg[0].src = src;
			}else {
				previewImg.prop('src', el.value);
				previewImg.show();
			}
			element.prev().html('����ѡ��');
		});	
    };

    $.fn[pluginName] = Wind[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
            	$.data(this, 'plugin_' + pluginName, new Plugin( $(this), options ));
            }
        });
    };

})( jQuery, window ,document );
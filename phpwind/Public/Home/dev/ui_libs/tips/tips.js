/*!
 * PHPWind UI Library 
 * Wind.tips �Ի������
 * Author: chaoren1641@gmail.com
 */
;(function ( $, window, document, undefined ) {
    var pluginName = 'tips';
    var	empty_fn = $.noop;
    var defaults = {
            id				: 'J_dialog',	// Ĭ�ϵ���id�����ÿ�ζ��岻ͬ��id������ҳ���Ͻ��������
            type			: 'warning',	// Ĭ�ϵ�������
            message			: ''			// ������ʾ������
    };

    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype.init = function () {
    	var element = this.element,options = this.options,dft = this._defaults;

    };

    $.fn[pluginName] = Wind[pluginName]= function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
            }
        });
    }

})( jQuery, window );
